const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
    {
        supportEmail: {
            type: String,
            required: true
        },

        currency: {
            type: String,
            required: true
        },

        maxServicePrice: {
            type: Number,
            required: true
        },

        systemFees: {
            type: Number,
            required: true
        }
    },

    { timestamps: true }
);


const Setting = mongoose.model("settings", SettingSchema);

module.exports = Setting;

