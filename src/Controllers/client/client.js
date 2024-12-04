const Client = require("../../Models/Client.model");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { executeTransaction } = require("../../utils/trycatchhandler");
const customError = require("../../utils/error.handle");



const privateKey = 'nopqrstuvwxyzabcdefghijklm';



const register = async (req, res) => {
  
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

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { name, number, email, password, category_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(category_id)) {

        throw new customError('Invalid Category ID', 400);
    }

    const exists = await Client.findOne({ email });

    if (exists) {
        throw new customError('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Client.create({
        name,
        number,
        password: hashedPassword,
        email,
        category_id
    }); 

   
    return res.status(201).json({ status: '001', msg: 'Client registered successfully' });
};



const login = async (req, res) => {
    const schema = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(4, "Password cannot be empty")
    });

    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { email, password } = req.body;

   
    const query = await Client.findOne({ email })

    if (!query) {
        throw new customError("Email does not exist", 404);
    }

    
    const isMatch = await bcrypt.compare(password, query.password);

    if (!isMatch) {
        throw new customError("Incorrect password", 400);
    }

    
    const payload = {
        id: query._id,
        email: query.email
    };

    const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });

    await Client.updateOne({ email }, { $set: { token } });

   

    return res.status(200).json({ status: "001", message: "Login successfully", token });

};


const logout = async (req, res) => {
  
    const validationSchema = z.object({
        email: z.string().email("Invalid email format")
    });

    const validation = validationSchema.safeParse(req.body);

    if (!validation.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { email } = req.body;

    
    const client = await Client.findOne({ email })

    if (!client) {
        throw new customError("Email does not exist", 404);
    }

    
    await Client.updateOne({ email }, { $set: { token: null } })

   

    return res.status(200).json({ status: "001", message: "Logout successfully" });
};




const clients = async (req, res) => {
  
    const clients = await Client.find({}); 


    return res.status(200).json({ status: '001', clients });
};



const edit_details = async (req, res) => {
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


        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { name, number, email, password, client_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(client_id)) {

        throw new customError('Invalid Client ID', 400);
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

    throw new customError("Client not found", 404);
}



const resetPassword = async (req, res) => {

    const validationSchema = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required")
    });


    const validation = validationSchema.safeParse(req.body);

    if (!validation.success) {


        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await Client.findOneAndUpdate({ email }, {

        password: hashedPassword,

    }, { new: true });

    if (result) {
        return res.status(200).json({ status: "001", message: "Your password has been updated" });
    }

    throw new customError("Client not found", 404);
}



const changePassword = async (req, res) => {

    const validationSchema = z.object({
        email: z.string().email("Invalid email format"),
        newPassword: z.string().min(1, "New Password is required"),
        currentPassword: z.string().min(1, "Current Password is required")
    });


    const validation = validationSchema.safeParse(req.body);

    if (!validation.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { email, newPassword, currentPassword } = req.body;
    const query = await Client.findOne({ email })
    const isMatch = await bcrypt.compare(currentPassword, query.password);
    if (!isMatch) {

        throw new customError("Incorrect current-password", 400);
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await Client.findOneAndUpdate({ email }, {

        password: hashedPassword,

    }, { new: true });

    if (result) {
        return res.status(200).json({ status: "001", message: "Your  Password has been updated" });
    }

    throw new customError("Client not found", 404);
}




const client = async (req, res) => {

    const idSchema = z.object({
        clientID:  z.string().length(24, "Invalid Client ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid Client Id format")
    });


    const validationResult = idSchema.safeParse({ clientID: req.params.id });

    if (!validationResult.success) {


        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const clientID = req.params.id;

    const client = await Client.findById({ _id: clientID });

    if (client) {
        return res.send({ status: "001", client });
    }

    else {

        throw new customError("client not found", 404);
    }
};


const clientDelete = async (req, res) => {
    const idSchema = z.object({
        client_id: z.string().length(24, "Invalid Client ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid Client Id format")
    });


    const validationResult = idSchema.safeParse({ client_id: req.params.id });

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const client_id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(client_id)) {
        throw new customError('Invalid Client ID', 400);
    }

    const result = await Client.findByIdAndDelete(client_id);

    if (result) {
        return res.status(200).json({ status: "001", message: "Client permanent deleted" });
    } else {
        throw new customError("Client not deleted", 404);
    }

};



executeTransaction(client);
executeTransaction(login);
executeTransaction(logout);
executeTransaction(register);
executeTransaction(clients);
executeTransaction(resetPassword);
executeTransaction(changePassword);
executeTransaction(clientDelete);
executeTransaction(edit_details);


module.exports = { register, changePassword, login, logout, clients, edit_details, client, clientDelete, resetPassword };


