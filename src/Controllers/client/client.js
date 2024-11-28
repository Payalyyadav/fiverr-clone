const Client = require("../../Models/Client.model");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { executeTransaction } = require("../../utils/trycatchhandler");



const privateKey = 'nopqrstuvwxyzabcdefghijklm';



const register = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session

    try {
        // Begin transaction
        session.startTransaction();

        const capitalizeAndValidateName = z.preprocess((name) => {
            if (typeof name === 'string') {
                return name.toUpperCase();
            }
            return name;
        }, z.string()
            .min(3, { message: 'Name is required' })
            .refine((name) => {
                return name === name.toUpperCase();
            }, {
                message: 'Name must be in all uppercase letters',
            })
        );

        const validationSchema = z.object({
            name: capitalizeAndValidateName,
            number: z.preprocess((val) => {
                const num = Number(val);
                return isNaN(num) ? undefined : num;
            }, z.number().min(10, 'Number is required and must be a number')),
            email: z.string().email('Invalid email format'),
            password: z.string().min(4, 'Password is required'),
            category_id: z.array(z.string().length(24, 'Invalid CategoryId format').regex(/^[0-9a-fA-F]{24}$/, 'Invalid CategoryId format'))
        });

        const validationResult = validationSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                status: '002',
                message: validationResult.error.errors.map((err) => err.message).join(', ')
            });
        }

        const { name, number, email, password, category_id } = req.body;

        if (!mongoose.Types.ObjectId.isValid(category_id)) {
            return res.status(400).json({ message: 'Invalid Category ID' });
        }

        const exists = await Client.findOne({ email }).session(session); // Add session to the query

        if (exists) {
            return res.status(400).json({ status: '002', message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Client.create([{
            name,
            number,
            password: hashedPassword,
            email,
            category_id
        }], { session }); // Pass session to the create operation

        // Commit transaction if all operations are successful
        await session.commitTransaction();
        return res.status(201).json({ status: '001', msg: 'Client registered successfully' });
    } catch (error) {
        // Rollback transaction in case of an error
        await session.abortTransaction();
        console.log(error);
        return res.status(500).json({ status: 'error', message: 'Internal Server error' });
    } finally {
        // End the session
        session.endSession();
    }
};



const login = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Start the transaction

    try {
        const schema = z.object({
            email: z.string().email("Invalid email format"),
            password: z.string().min(4, "Password cannot be empty")
        });

        const validationResult = schema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                status: "002",
                message: validationResult.error.errors.map(err => err.message).join(", ")
            });
        }

        const { email, password } = req.body;

        // Find the client within the transaction session
        const query = await Client.findOne({ email }).session(session);

        if (!query) {
            return res.status(404).json({ status: "002", message: "Email does not exist" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, query.password);

        if (!isMatch) {
            return res.status(400).json({ status: "002", message: "Incorrect password" });
        }

        // Create JWT payload
        const payload = {
            id: query._id,
            email: query.email
        };

        const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });

        // Update the client's token within the transaction session
        await Client.updateOne({ email }, { $set: { token } }).session(session);

        // Commit the transaction if all operations are successful
        await session.commitTransaction();

        return res.status(200).json({ status: "001", message: "Login successfully", token });

    } catch (error) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        console.error(error);
        return res.status(500).json({ status: "error", message: 'Internal Server Error' });
    } finally {
        // End the session
        session.endSession();
    }
};


const logout = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Validation schema
        const validationSchema = z.object({
            email: z.string().email("Invalid email format")
        });

        const validation = validationSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ status: "002", message: validation.error.errors.map(err => err.message).join(", ") });
        }

        const { email } = req.body;

        // Find the client in the database
        const client = await Client.findOne({ email }).session(session); // Pass session here

        if (!client) {
            return res.status(404).json({ status: "002", message: "Email does not exist" });
        }

        // Update the client's token to null inside the transaction
        await Client.updateOne({ email }, { $set: { token: null } }).session(session); // Pass session here

        // Commit the transaction if all is successful
        await session.commitTransaction();

        return res.status(200).json({ status: "001", message: "Logout successfully" });
    } catch (error) {
        // Abort transaction in case of any error
        await session.abortTransaction();
        console.error(error);
        return res.status(500).json({ status: "error", message: 'Internal Server Error' });
    } finally {
        // End the session
        session.endSession();
    }
};




const clients = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // Start the transaction

    try {
        // Perform your database operations in the transaction
        const clients = await Client.find({}, null, { session }); // Read operation with session

        // Example: You can add any write operation inside the transaction if needed
        // Example: Updating a client, assuming the body contains a client ID and data
        // const updatedClient = await Client.findOneAndUpdate({ _id: req.body.clientId }, req.body, { session });

        await session.commitTransaction(); // Commit the transaction if all operations succeed
        session.endSession(); // End the session

        return res.status(200).json({ status: '001', clients });
    } catch (error) {
        await session.abortTransaction(); // Abort the transaction if any operation fails
        session.endSession(); // End the session

        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


const edit_details = async (req, res) => {
    try {
        const capitalizeAndValidateName = z.preprocess((name) => {
            if (typeof name === "string") {
                return name.toUpperCase();
            }
            return name;
        }, z.string()
            .min(1, { message: "Name is required" })
            .refine((name) => {
                return name === name.toUpperCase();
            }, {
                message: "Name must be in all uppercase letters",
            })
        );

        const validationSchema = z.object({
            client_id: z.array(z.string().length(24, "Invalid Client ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid Client Id format")),
            name: capitalizeAndValidateName,

            number: z.preprocess((val) => {
                const num = Number(val);
                return isNaN(num) ? undefined : num;
            }, z.number().min(10, "Number is required and must be a number")),

            email: z.string().email("Invalid email format"),
            password: z.string().min(4, "Password is required"),
            category_id: z.array(z.string().length(24, "Invalid CategoryId format").regex(/^[0-9a-fA-F]{24}$/, "Invalid CategoryId format"))

        });

        const validationResult = validationSchema.safeParse(req.body);

        if (!validationResult.success) {

            return res.status(400).json({
                status: "002",
                message: validationResult.error.errors.map(err => err.message).join(", ")
            });
        }

        const { name, number, email, password, client_id } = req.body; 

        if (!mongoose.Types.ObjectId.isValid(client_id)) {
            return res.status(400).json({ message: 'Invalid Client ID' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await Client.findByIdAndUpdate(client_id, {
            name,
            number,
            password: hashedPassword,
            email
        }, { new: true });

        if (result) {
            return res.status(200).json({ status: "001", message: "Your information has been updated" });
        }

        return res.status(404).json({ status: "003", message: "Client not found" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
}



const client = async (req, res) => {

    try {

        const idSchema = z.object({
            id: z.string().min(1, { message: "Client ID is required" })
        });


        const validationResult = idSchema.safeParse({ id: req.params.id });

        if (!validationResult.success) {

            return res.status(400).json({
                status: "002",
                message: validationResult.error.errors.map(err => err.message).join(", ")
            });
        }

        const clientID = req.params.id;

        const client = await Client.findById({ _id: clientID });

        if (client) {
            return res.send({ status: "001", client });
        }

        else {
            return res.status(404).send({ status: "false", message: "client not found" });
        }

    } catch (error) {

        console.log(error);
        return res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
};



executeTransaction(client);


module.exports = { register, login, logout, clients, edit_details, client};


// const objectIdSchema = z.string().length(24, "Invalid OrderId format").regex(/^[0-9a-fA-F]{24}$/, "Invalid OrderId format");
// orders: z.array(objectIdSchema).optional()

