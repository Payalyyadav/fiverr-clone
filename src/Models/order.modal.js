const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        status: { type: String, enum: ['pending', 'completed', 'disputed', "in progress"], default: "in progress" },

        disputeDetails: { type: String },

        adminAction: { type: String },

        amount: { type: Number, required: true },

        gig_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'gigs'
        },

        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buyers'
        },

        quantity: {
            type: Number,
            required: true
        },

        delivery_date:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'gigs'
            }
        ]
    },

    { timestamps: true }
);


const Order = mongoose.model("orders", OrderSchema);

module.exports = Order;

