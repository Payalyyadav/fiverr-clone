const { z } = require("zod");
const mongoose = require("mongoose");
const { executeTransaction } = require("../../utils/trycatchhandler");
const customError = require("../../utils/error.handle");
const Report = require("../../Models/reportGig.model");


const ReportCreate = async (req, res) => {



    const validationSchema = z.object({

        reason: z.string().min(10, 'reason is required'),
        serviceId: z.string().length(24, 'Invalid serviceId format').regex(/^[0-9a-fA-F]{24}$/, 'Invalid serviceId format'),
        reportedBy: z.string().length(24, 'Invalid client Id format').regex(/^[0-9a-fA-F]{24}$/, 'Invalid client Id format')
    });

    const validationResult = validationSchema.safeParse(req.body);

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { reason, reportedBy, serviceId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {

        throw new customError('Invalid service ID', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(reportedBy)) {

        throw new customError('Invalid client ID', 400);
    }



    await Report.create({
        serviceId,
        reason,
        reportedBy
    });



    return res.status(201).json({ status: '001', msg: 'Report added successfully' });

}


executeTransaction(ReportCreate);

module.exports = { ReportCreate };
