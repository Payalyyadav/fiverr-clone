const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        ratting: {
            type: Number,
            max: 5
        },

        gig_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'gigs'
        },

        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buyers'
        }
    },

    { timestamps: true }
);


const Ratting = mongoose.model("reviews", ReviewSchema);

module.exports = Ratting;

