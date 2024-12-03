const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        ratting: {
            type: Number,
            max: 5
        },

        comment: {
            type: String,
            required: true
        },

        gig_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'gigs'
        },

        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buyers'
        },

        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'orders'
        }
    },

    { timestamps: true }
);


const Ratting = mongoose.model("reviews", ReviewSchema);

module.exports = Ratting;

