const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },

        email: {
            type: String,
            unique: true,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        profile: {
            type: String,
            // required: true
        },

        about: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        skills: {
            type: Array,
            required: true
        },

        income_total: {
            type: Number
        },

        category: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'categories'
            }
        ],

        status: {
            type: String,
            default: "available"
        },

        token: {
            type: String
        }
    },

    { timestamps: true }
);


const Freelancer = mongoose.model("sellers", FreelancerSchema);

module.exports = Freelancer;

