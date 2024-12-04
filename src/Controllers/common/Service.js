const Service = require("../../Models/service_gig.modal");
const mongoose = require("mongoose");
const customError = require("../../utils/error.handle");
const { executeTransaction } = require("../../utils/trycatchhandler");
const {z} = require("zod");


const addService = async (req, res) => {
    const validationSchema = z.object({
        freelancer_id: z.string()
            .length(24, "Invalid freelancer_id format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid freelancer_id format"),
        name: z.string()
            .min(3, "Name is required and must be at least 3 characters"),
        category: z.string()
            .length(24, "Invalid category_id format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid category_id format"),
        sub_category: z.string()
            .length(24, "Invalid sub-category format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid sub-category format"),
        description: z.string()
            .min(10, "Description is required and must be at least 10 characters"),
        about: z.string()
            .min(10, "About field is required and must be at least 10 characters"),
        price: z.number()
            .positive("Price must be a positive number"),
        delivery_date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid delivery_date format"),
    });


    const validationResult = validationSchema.safeParse(req.body);

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }


    const {
        freelancer_id, name, category, sub_category, description, about, price, delivery_date
    } = req.body;


    if (!mongoose.Types.ObjectId.isValid(freelancer_id)) {

        throw new customError('Invalid freelancer ID', 400);
    }

    await Service.create({
        freelancer_id,
        name,
        category,
        sub_category,
        description,
        about,
        price,
        delivery_date,
    });

    return res.status(201).json({
        status: "001",
        message: "Service added successfully",
    });

};



const fetchservicebyGig = async (req, res) => {

    const idSchema = z.object({
        id: z.string()
            .length(24, "Invalid service_id format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid service_id format"),
    });


    const validationResult = idSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {



        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const gig_id = req.params.id;

    const service = await Service.findById({ _id: gig_id });

    if (service) {
        return res.send({ status: "001", service });

    }

    else {
        throw new customError("service not found", 404);
    }

};



const serviceUpdate = async (req, res) => {
    const validationSchema = z.object({
        freelancer_id: z.string()
            .length(24, "Invalid freelancer_id format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid freelancer_id format"),
        service_id: z.string()
            .length(24, "Invalid service_id format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid service_id format"),
        name: z.string()
            .min(3, "Name is required and must be at least 3 characters"),
        category: z.string()
            .length(24, "Invalid category_id format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid category_id format"),
        sub_category: z.string()
            .length(24, "Invalid sub-category format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid sub-category format"),
        description: z.string()
            .min(10, "Description is required and must be at least 10 characters"),
        about: z.string()
            .min(10, "About field is required and must be at least 10 characters"),
        price: z.number()
            .positive("Price must be a positive number"),
        delivery_date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid delivery_date format"),
    });

    const validationResult = validationSchema.safeParse(req.body);

    if (!validationResult.success) {
        throw new customError(
            validationResult.error.errors.map(err => err.message).join(", "),
            400
        );
    }


    const {
        service_id, freelancer_id, name, category, sub_category, description, about, price, delivery_date
    } = req.body;



    if (!mongoose.Types.ObjectId.isValid(service_id) || !mongoose.Types.ObjectId.isValid(freelancer_id)) {
        throw new customError('Invalid Service ID or Freelancer ID', 400);
    }

    const result = await Service.findByIdAndUpdate(
        service_id,
        {
            freelancer_id,
            name,
            category,
            sub_category,
            description,
            about,
            price,
            delivery_date,
        },
        { new: true }
    );

    if (result) {
        return res.status(200).json({
            status: "001",
            message: "Service  has been updated",
            data: result
        });
    }

    throw new customError("Service not found", 404);
};


const serviceDelete = async (req, res) => {
    const idSchema = z.object({
        service_id: z.string().length(24, "Invalid service ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid Client Id format")
    });


    const validationResult = idSchema.safeParse({ service_id: req.params.id });

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const service_id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(service_id)) {
        throw new customError('Invalid Service ID', 400);
    }

    const result = await Service.findByIdAndDelete(service_id);

    if (result) {
        return res.status(200).json({ status: "001", message: "Service permanent deleted" });
    } else {
        throw new customError("Service not deleted", 404);
    }

};




const allservices = async (req, res) => {

    const services = await Service.find({});


    return res.status(200).json({ status: '001', services });
};




const fetchserviceByCategory_id = async (req, res) => {

    const idSchema = z.object({
        category_id: z.string().length(24, "Invalid category ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid category Id format")
    });


    const validationResult = idSchema.safeParse({ category_id: req.params.id });

    if (!validationResult.success) {


        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const category_id = req.params.id;

    const service = await Service.findById({ _id: category_id });

    if (service) {
        return res.send({ status: "001", service });
    }

    else {

        throw new customError("service not found", 404);
    }
};



const servicesfetchbykeyword = async (req, res) => {
    const { ratting, sub_category, category, price, name } = req.query;
    const filter = {};

    if (name) {
        filter.name = { $regex: name, $options: "i" };
    }
    if (price) {
        filter.price = { $regex: price, $options: "i" };
    }
    if (category) {
        filter.category = { $regex: category, $options: "i" };
    }
    if (sub_category) {
        filter.sub_category = { $regex: sub_category, $options: "i" };
    }
    if (ratting) {
        filter.ratting = { $regex: ratting, $options: "i" };
    }

    const services = await Service.find(filter);


    return res.json({ status: "001", services });
};


executeTransaction(allservices)
executeTransaction(serviceDelete)
executeTransaction(serviceUpdate)
executeTransaction(fetchserviceByCategory_id)
executeTransaction(fetchservicebyGig)
executeTransaction(addService)
executeTransaction(servicesfetchbykeyword)





module.exports = { servicesfetchbykeyword, fetchserviceByCategory_id, allservices, serviceDelete, serviceUpdate, fetchservicebyGig, addService }

