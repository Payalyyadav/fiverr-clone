const Ratting = require("../../Models/review.modal");
const { executeTransaction } = require("../../utils/trycatchhandler");
const mongoose = require("mongoose");
const { z } = require("zod");




const fetchReviewbyGig = async (req, res) => {


    const idSchema = z.object({
        id: z.string()
            .length(24, "Invalid service id format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid service id format"),
    });


    const validationResult = idSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const gig_id = req.params.id;

    const review = await Ratting.findById({ _id: gig_id });

    if (review) {
        return res.send({ status: "001", reviews: review.ratting });
    }

    else {
        throw new customError("service not found", 404);
    }
};




const fetchReviewbyUser = async (req, res) => {

    const idSchema = z.object({
        id: z.string()
            .length(24, "Invalid user id format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid user id format"),
    });


    const validationResult = idSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const userid = req.params.id;

    const review = await Ratting.findById({ _id: userid });

    if (review) {
        return res.send({ status: "001", reviews: review.ratting });
    }

    else {
        throw new customError("service not found", 404);
    }
};



const fetchReviewbyOrder = async (req, res) => {

    const idSchema = z.object({
        id: z.string()
            .length(24, "Invalid order id format")
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid order id format"),
    });


    const validationResult = idSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const orderid = req.params.id;

    const review = await Ratting.findById({ _id: orderid });

    if (review) {
        return res.send({ status: "001", reviews: review.ratting });
    }

    else {
        throw new customError("service not found", 404);
    }

};



const addReview = async (req, res) => {


    const validationSchema = z.object({

        userId: z.string().length(24, "Invalid CategoryId format").regex(/^[0-9a-fA-F]{24}$/, "Invalid CategoryId format"),

        gigId: z.string().length(24, "Invalid CategoryId format").regex(/^[0-9a-fA-F]{24}$/, "Invalid CategoryId format"),

        comment: z.string().min(5, "comment is required"),
        ratting: z.preprocess((val) => {
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        }, z.number().min(1, 'ratting is required and must be a number')),


    });



    const validationResult = validationSchema.safeParse(req.body);

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }


    const { gigId, comment, ratting, userId } = req.body;


    if (!mongoose.Types.ObjectId.isValid(gigId)) {
        throw new customError('Invalid gig ID', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new customError('Invalid user ID', 400);
    }



    await Ratting.create({
        gig_id: gigId,
        client_id: userId,
        comment,
        ratting
    });

    return res.status(201).json({ status: "001", msg: "Ratting  successfully" });

}


executeTransaction(fetchReviewbyUser)
executeTransaction(addReview)
executeTransaction(fetchReviewbyOrder)
executeTransaction(fetchReviewbyGig)


module.exports = { fetchReviewbyGig, fetchReviewbyOrder, fetchReviewbyUser, addReview };
