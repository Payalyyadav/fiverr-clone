const Freelancer = require("../../Models/Freelancer.model");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');


const privateKey = 'abcdeuvwxyzfghijklmnopqrst';



const register = async (req, res) => {

    try {

        const capitalizeAndValidateName = z.preprocess((name) => {
            if (typeof name === "string") {
                return name.toUpperCase();
            }
            return name;
        }, z.string()
            .min(3, { message: "Name is required" })
            .refine((name) => {
                return name === name.toUpperCase();
            }, {
                message: "Name must be in all uppercase letters",
            })
        );


        const validationSchema = z.object({

            name: capitalizeAndValidateName,
            email: z.string().email("Invalid email format"),
            password: z.string().min(4, "Password is required"),
            category_id: z.array(z.string().length(24, "Invalid CategoryId format").regex(/^[0-9a-fA-F]{24}$/, "Invalid CategoryId format")),
            about: z.string().min(25, "About is required"),
            location: z.string().min(6, "Location is required"),
            skills: z.array(z.string()).min(1, "Skill is required")

        });


        const validationResult = validationSchema.safeParse(req.body);

        if (!validationResult.success) {

            return res.status(400).json({
                status: "002",
                message: validationResult.error.errors.map(err => err.message).join(", ")
            });
        }


        const { name, about, location, skills, email, password, category_id } = req.body;


        if (!mongoose.Types.ObjectId.isValid(category_id)) {
            return res.status(400).json({ message: 'Invalid Category ID' });
        }

        const exists = await Freelancer.findOne({ email });

        if (exists) {
            return res.status(400).json({ status: "002", message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Freelancer.create({
            name,
            location,
            skills,
            about,
            password: hashedPassword,
            email,
            category_id
        });

        return res.status(201).json({ status: "001", msg: "Freelancer registered successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: 'Internal Server error' });
    }
}




const login = async (req, res) => {
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


        const query = await Freelancer.findOne({ email });

        if (!query) {
            return res.status(404).json({ status: "002", message: "Email does not exist" });
        }


        const isMatch = await bcrypt.compare(password, query.password);

        if (!isMatch) {
            return res.status(400).json({ status: "002", message: "Incorrect password" });
        }


        const payload = {
            id: query._id,
            email: query.email
        };

        const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });

        await Freelancer.updateOne({ email }, { $set: { token } });

        return res.status(200).json({ status: "001", message: "Login successfully", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: 'Internal Server Error' });
    }
};



const logout = async (req, res) => {
    try {

        const validationSchema = z.object({
            email: z.string().email("Invalid email format")
        });


        const validation = validationSchema.safeParse(req.body);

        if (!validation.success) {

            return res.status(400).json({ status: "002", message: validation.error.errors.map(err => err.message).join(", ") });
        }

        const { email } = req.body;

        const freelnacer = await Freelancer.findOne({ email });

        if (!freelnacer) {
            return res.status(404).json({ status: "002", message: "Email does not exist" });
        }


        await Freelancer.updateOne({ email }, { $set: { token: null } });

        return res.status(200).json({ status: "001", message: "Logout successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: 'Internal Server Error' });
    }
};


const freelnacers = async (req, res) => {
    try {
        const freelnacers = await Freelancer.find({});
        return res.status(200).json({ status: '001', freelnacers });

    } catch (error) {
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
            freelnacer_id: z.array(z.string().length(24, "Invalid Freelancer ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid Freelancer Id format")),
            name: capitalizeAndValidateName,
            email: z.string().email("Invalid email format"),
            password: z.string().min(4, "Password is required"),
            category_id: z.array(z.string().length(24, "Invalid CategoryId format").regex(/^[0-9a-fA-F]{24}$/, "Invalid CategoryId format")),
            about: z.string().min(25, "About is required"),
            location: z.string().min(6, "Location is required"),
            skills: z.array(z.string()).min(1, "Skill is required")


        });

        const validationResult = validationSchema.safeParse(req.body);

        if (!validationResult.success) {

            return res.status(400).json({
                status: "002",
                message: validationResult.error.errors.map(err => err.message).join(", ")
            });
        }

        
        const {freelnacer_id, name, about, location, skills, email, password, category_id } = req.body;

        if (!mongoose.Types.ObjectId.isValid(freelnacer_id)) {
            return res.status(400).json({ message: 'Invalid Freelancer ID' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await Freelancer.findByIdAndUpdate(freelnacer_id, {
            name,
            about,
            location,
            skills,
            category_id,
            password: hashedPassword,
            email
        }, { new: true });

        if (result) {
            return res.status(200).json({ status: "001", message: "Your information has been updated" });
        }

        return res.status(404).json({ status: "003", message: "Freelancer not found" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
}


const freelancer = async (req, res) => {

    try {

        const idSchema = z.object({
            freelancer_id: z.string().min(1, { message: "Freelancer ID is required" })
        });


        const validationResult = idSchema.safeParse({ freelancer_id: req.params.id });

        if (!validationResult.success) {

            return res.status(400).json({
                status: "002",
                message: validationResult.error.errors.map(err => err.message).join(", ")
            });
        }

        const freelancer_id = req.params.id;

        const freelancer = await Freelancer.findById({ _id: freelancer_id });

        if (freelancer) {
            return res.send({ status: "001", freelancer });
        }

        else {
            return res.status(404).send({ status: "false", message: "freelancer not found" });
        }

    } catch (error) {

        console.log(error);
        return res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
};


module.exports = { register, login ,logout, freelnacers, edit_details, freelancer};


// profile 
