const { z } = require("zod");
const mongoose = require("mongoose");
const { executeTransaction } = require("../../utils/trycatchhandler");
const customError = require("../../utils/error.handle");
const Setting = require("../../Models/setting.model");


const add = async (req, res) => {



    const validationSchema = z.object({

        supportEmail: z.string().email('Invalid email format'),
        systemFees: z.preprocess((val) => {
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        }, z.number().min(2, 'systemFees is required and must be a number')),
        currency: z.string().min(3, 'currency is required'),
        maxServicePrice: z.preprocess((val) => {
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        }, z.number().min(2, 'maxServicePrice is required and must be a number'))
    });

    const validationResult = validationSchema.safeParse(req.body);

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { maxServicePrice, currency, supportEmail, systemFees } = req.body;



    await Setting.create({
        systemFees,
        currency,
        supportEmail,
        maxServicePrice
    });



    return res.status(201).json({ status: '001', msg: 'default Setting added successfully' });

}



const settings = async (req, res) => {

    const settings = await Setting.find({});


    return res.status(200).json({ status: '001', settings });
};



executeTransaction(add);
executeTransaction(settings);

module.exports = { add, settings };
