const Inquiry = require("../../Models/inquiry.model");
const { z } = require("zod");
const mongoose = require("mongoose");
const { executeTransaction } = require("../../utils/trycatchhandler");
const customError = require("../../utils/error.handle");


const inquiryCreate = async (req, res) => {



    const validationSchema = z.object({

        message: z.string().min(10, 'Message is required'),
        client_id: z.string().length(24, 'Invalid client_id format').regex(/^[0-9a-fA-F]{24}$/, 'Invalid client_id format')
    });

    const validationResult = validationSchema.safeParse(req.body);

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { message, client_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(client_id)) {

        throw new customError('Invalid client ID', 400);
    }




    const inq = await Inquiry.create({
        message,

        client_id
    });

    const client_email = await Inquiry.find().populate('client_id', 'email');


    inq.client_email = client_email[0].client_id.email
    await inq.save();

    return res.status(201).json({ status: '001', msg: 'Inquiry added successfully' });

}

const statusUpdate = async (req, res) => {

    const { status, inquiryId } = req.body;

    const inquiry = await Inquiry.findById(inquiryId);

    if (inquiry) {
        inquiry.status = status;
        inquiry.save();
        return res.json({
            message: `Inquiry  status updated successfully`,
            status: inquiry.status,
        });
    } else {

        throw new customError("Inquiry not found", 400);
    }
}


executeTransaction(inquiryCreate);
executeTransaction(statusUpdate);

module.exports = { inquiryCreate, statusUpdate };
