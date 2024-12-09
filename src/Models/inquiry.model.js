const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
    {
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buyers',
            required: true
        },

        client_email: {
            type: String,
            // required: true
        },

        message: {
            type: String,
            required: true
        },

        status : {
            type: Boolean,
            default: false
        }
    },

    { timestamps: true }
);


const Inquiry = mongoose.model("inquiries", InquirySchema);

module.exports = Inquiry;

//  result 