const Ratting = require("../../Models/review.modal");

const fetchReviewbyGig = async (req, res) => {

    try {

        const idSchema = z.object({
            id: z.string().min(1, { message: "service ID is required" })
        });


        const validationResult = idSchema.safeParse({ id: req.params.id });

        if (!validationResult.success) {

            return res.status(400).json({
                status: "002",
                message: validationResult.error.errors.map(err => err.message).join(", ")
            });
        }

        const gig_id = req.params.id;

        const review = await Ratting.findById({ _id: gig_id });

        if (review) {
            return res.send({ status: "001", reviews: review.ratting });
        }

        else {
            return res.status(404).send({ status: "false", message: "service not found" });
        }

    } catch (error) {

        console.log(error);
        return res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
};




const fetchReviewbyUser = async (req, res) => {

    try {

        const idSchema = z.object({
            id: z.string().min(1, { message: "user ID is required" })
        });


        const validationResult = idSchema.safeParse({ id: req.params.id });

        if (!validationResult.success) {

            return res.status(400).json({
                status: "002",
                message: validationResult.error.errors.map(err => err.message).join(", ")
            });
        }

        const userid = req.params.id;

        const review = await Ratting.findById({ _id: userid });

        if (review) {
            return res.send({ status: "001", reviews: review.ratting });
        }

        else {
            return res.status(404).send({ status: "false", message: "service not found" });
        }

    } catch (error) {

        console.log(error);
        return res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
};



const fetchReviewbyOrder = async (req, res) => {

    try {

        const idSchema = z.object({
            id: z.string().min(1, { message: "Order ID is required" })
        });


        const validationResult = idSchema.safeParse({ id: req.params.id });

        if (!validationResult.success) {

            return res.status(400).json({
                status: "002",
                message: validationResult.error.errors.map(err => err.message).join(", ")
            });
        }

        const orderid = req.params.id;

        const review = await Ratting.findById({ _id: orderid });

        if (review) {
            return res.send({ status: "001", reviews: review.ratting });
        }

        else {
            return res.status(404).send({ status: "false", message: "service not found" });
        }

    } catch (error) {

        console.log(error);
        return res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
};



const addReview = async (req, res) => {

    try {



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

            return res.status(400).json({
                status: "002",
                message: validationResult.error.errors.map(err => err.message).join(", ")
            });
        }


        const { gigId, comment, ratting, userId } = req.body;


        if (!mongoose.Types.ObjectId.isValid(gigId)) {
            return res.status(400).json({ message: 'Invalid gig ID' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }



        await Ratting.create({
            gig_id: gigId,
            client_id: userId,
            comment,
            ratting
        });

        return res.status(201).json({ status: "001", msg: "Ratting  successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: 'Internal Server error' });
    }
}





module.exports = { fetchReviewbyGig, fetchReviewbyOrder, fetchReviewbyUser, addReview };
