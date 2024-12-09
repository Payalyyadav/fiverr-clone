const { z } = require("zod");
const bcrypt = require('bcrypt');
const Admin = require("../../Models/admin.model");
const customError = require("../../utils/error.handle");
const Client = require("../../Models/Client.model");
const Freelancer = require("../../Models/Freelancer.model");
const { executeTransaction } = require("../../utils/trycatchhandler");
const Service = require("../../Models/service_gig.modal");
const Order = require("../../Models/order.modal");



const allfindFetch = async (req, res) => {
    const users = await Client.find({});
    const freelancers = await Freelancer.find({});
    const admins = await Admin.find({});


    return res.status(200).json({
        status: '001',
        users, freelancers, admins
    });
};


const serviceRejectorApprove = async (req, res) => {

    const { serviceId, action } = req.body;


    const service = Service.findById(serviceId);

    if (!service) {

        throw new customError('Service not found', 404);
    }

    if (action === 'approve') {
        service.status = 'approved';
    } else if (action === 'reject') {
        service.status = 'rejected';
    } else {

        throw new customError('Invalid action', 400);
    }


    return res.status(200).json({ status: "001", message: 'Service status updated' });
}



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
        location: z.string().min(4, 'location is required')

    });

    const validationResult = validationSchema.safeParse(req.body);

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { name, number, email, password, location } = req.body;



    const exists = await Admin.findOne({ email });

    if (exists) {
        throw new customError('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
        name,
        number,
        password: hashedPassword,
        email,
        location
    });


    return res.status(201).json({ status: '001', msg: 'admin registered successfully' });
};


const statusUser = async (req, res) => {

    const { status, user_id } = req.body;

    const user = await Client.findById(user_id);
    if (!user) {

        throw new customError('User not found', 404);
    }


    if (status) user.status = status;

    await user.save();

    return res.status(200).json({ status: "001", message: 'User status updated successfully' });
}


const resolveOrder = async (req, res) => {

    const { order_id, adminAction, status, disputeDetails } = req.body;

    const order = await Order.findOne({ _id: order_id });
    if (!order) {
        throw new customError('Order not found', 404);
    }


    if (disputeDetails) order.disputeDetails = disputeDetails;
    if (status) order.status = status;
    if (adminAction) order.adminAction = adminAction;

    await order.save();

    return res.status(200).json({ status: "001", message: 'Order dispute resolved successfully' });
}



const totalRevenue = async (req, res) => {


    const totalRevenue = await Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);


    const activeUsers = await Client.countDocuments({ status: 'active' });


    const topServices = await Order.aggregate([
        { $group: { _id: '$service', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
    ]);

    return res.status(200).json({
        totalRevenue: totalRevenue[0]?.totalRevenue || 0,
        activeUsers,
        topServices: topServices.map(service => ({
            service: service._id,
            count: service.count,
        })),
    });
}


executeTransaction(allfindFetch)
executeTransaction(serviceRejectorApprove)
executeTransaction(register)
executeTransaction(resolveOrder)
executeTransaction(statusUser)
executeTransaction(totalRevenue)


module.exports = { allfindFetch, register, serviceRejectorApprove, statusUser, resolveOrder, totalRevenue }