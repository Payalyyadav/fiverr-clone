const Freelancer = require("../../Models/Freelancer.model");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { executeTransaction } = require("../../utils/trycatchhandler");
const customError = require("../../utils/error.handle");


const privateKey = 'abcdeuvwxyzfghijklmnopqrst';



const register = async (req, res) => {


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


        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }


    const { name, about, location, skills, email, password, category_id } = req.body;


    if (!mongoose.Types.ObjectId.isValid(category_id)) {

        throw new customError('Invalid Category ID', 400);
    }

    const exists = await Freelancer.findOne({ email });

    if (exists) {
        throw new customError('Email already exists', 400);
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

}




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


    const query = await Freelancer.findOne({ email });

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

    await Freelancer.updateOne({ email }, { $set: { token } });

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

    const freelnacer = await Freelancer.findOne({ email });

    if (!freelnacer) {
        throw new customError("Email does not exist", 404);
    }


    await Freelancer.updateOne({ email }, { $set: { token: null } });

    return res.status(200).json({ status: "001", message: "Logout successfully" });

};


const freelnacers = async (req, res) => {
    const freelnacers = await Freelancer.find({});
    return res.status(200).json({ status: '001', freelnacers });
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


        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }


    const { freelnacer_id, name, about, location, skills, email, password, category_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(freelnacer_id)) {

        throw new customError('Invalid Freelancer ID', 400);
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

    throw new customError("Freelancer not found", 404);

}



const freelancer = async (req, res) => {

    const idSchema = z.object({
        freelancer_id: z.string().min(1, { message: "Freelancer ID is required" })
    });


    const validationResult = idSchema.safeParse({ freelancer_id: req.params.id });

    if (!validationResult.success) {


        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const freelancer_id = req.params.id;

    const freelancer = await Freelancer.findById({ _id: freelancer_id });

    if (freelancer) {
        return res.send({ status: "001", freelancer });
    }

    else {
        throw new customError("freelancer not found", 404);
    }
};





executeTransaction(logout);
executeTransaction(login);
executeTransaction(register);
executeTransaction(freelancer);
executeTransaction(freelnacers);
executeTransaction(edit_details);



module.exports = { register, login, logout, freelnacers, edit_details, freelancer };


// profile 
