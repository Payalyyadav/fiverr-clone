const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
    {
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'gigs',
            required: true
        },

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buyers',
            required: true
        },

        reason: {
            type: String,
            required: true
        }
    },

    { timestamps: true }
);


const Report = mongoose.model("reports", ReportSchema);

module.exports = Report;

