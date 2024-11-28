const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
    {
        feedback: {
            type: String,
            required: true
        },

        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buyers'
        },

        freelancer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sellers'
        }
    },

    { timestamps: true }
);


const Feedback = mongoose.model("feedbacks", FeedbackSchema);

module.exports = Feedback;


