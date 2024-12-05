const Order = require("../../Models/order.modal");
const mongoose = require('mongoose');
const { z } = require('zod');
const { executeTransaction } = require("../../utils/trycatchhandler");
const customError = require("../../utils/error.handle");



const addOrder = async (req, res) => {


    const validationSchema = z.object({

        quantity: z.preprocess((val) => {
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        }, z.number().min(1, 'Quantity is required and must be a number')),

        client_id: z.string().length(24, 'Invalid order Id format').regex(/^[0-9a-fA-F]{24}$/, 'Invalid order Id format'),
        gig_id: z.string().length(24, 'Invalid gig Id format').regex(/^[0-9a-fA-F]{24}$/, 'Invalid gig Id format')
    });

    const validationResult = validationSchema.safeParse(req.body);

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { quantity, client_id, gig_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(client_id)) {

        throw new customError('Invalid order ID', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(gig_id)) {

        throw new customError('Invalid gig ID', 400);
    }




    await Order.create({

        quantity,
        gig_id,
        client_id
    });


    return res.status(201).json({ status: '001', msg: 'Order registered successfully' });
};



const orderByOrderid = async (req, res) => {

    const idSchema = z.object({
        order_id: z.string().length(24, "Invalid order ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid order Id format")
    });


    const validationResult = idSchema.safeParse({ order_id: req.params.id });

    if (!validationResult.success) {


        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const order_id = req.params.id;

    const order = await Order.findById({ _id: order_id });

    if (order) {
        return res.send({ status: "001", order });
    }

    else {

        throw new customError("order not found", 404);
    }
};


const orderByClientid = async (req, res) => {

    const idSchema = z.object({
        client_id: z.string().length(24, "Invalid client ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid client Id format")
    });


    const validationResult = idSchema.safeParse({ client_id: req.params.id });

    if (!validationResult.success) {


        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const client_id = req.params.id;

    const order = await Order.find({ client_id: client_id });

    if (order) {
        return res.send({ status: "001", order });
    }

    else {

        throw new customError("order not found", 404);
    }
};


const orderDelete = async (req, res) => {
    const idSchema = z.object({
        order_id: z.string().length(24, "Invalid order ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid order Id format")
    });


    const validationResult = idSchema.safeParse({ order_id: req.params.id });

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const order_id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(order_id)) {
        throw new customError('Invalid order ID', 400);
    }

    const result = await Order.findByIdAndDelete(order_id);

    if (result) {
        return res.status(200).json({ status: "001", message: "Order permanent deleted" });
    } else {
        throw new customError("Order not deleted", 404);
    }

};


const fetchByServiceId = async (req, res) => {

    const idSchema = z.object({
        service_id: z.string().length(24, "Invalid service ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid service Id format")
    });


    const validationResult = idSchema.safeParse({ service_id: req.params.id });

    if (!validationResult.success) {


        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const service_id = req.params.id;

    const order = await Order.find({ gig_id: service_id });

    if (order) {
        return res.send({ status: "001", order });
    }

    else {

        throw new customError("order not found", 404);
    }
};



const statusUpdate = async (req, res) => {
    const idSchema = z.object({
        order_id: z.string().length(24, "Invalid Order ID format").regex(/^[0-9a-fA-F]{24}$/, "Invalid Order Id format")
    });


    const validationResult = idSchema.safeParse({ order_id: req.params.id });

    if (!validationResult.success) {
        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const order_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(order_id)) {
        throw new customError('Invalid Order ID', 400);
    }

    const result = await Order.findByIdAndUpdate(order_id, {
        status: "completed"
    });

    if (result) {
        return res.status(200).json({ status: "001", message: "Order status updated successfully" });
    } else {
        throw new customError("Order status not updated", 404);
    }

};




executeTransaction(orderByOrderid);
executeTransaction(statusUpdate);
executeTransaction(orderDelete);
executeTransaction(orderByClientid);
executeTransaction(addOrder);
executeTransaction(fetchByServiceId);

module.exports = { addOrder, orderByOrderid, orderByClientid, orderDelete, fetchByServiceId, statusUpdate };
