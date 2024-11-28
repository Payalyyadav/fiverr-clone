const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buyers'
        },

        freelancer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sellers'
        },

        client_msg: {
            type: String,
            required: true
        },

        freelancer_msg: {
            type: String,
            required: true
        }
    },

    { timestamps: true }
);


const Message = mongoose.model("communications", MessageSchema);

module.exports = Message;


