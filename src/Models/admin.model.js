const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
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

        number: {
            type: Number
        },

        location: {
            type: String,
            required: true
        },
     
        token : {
            type: String
        }
    },

    { timestamps: true }
);


const Admin = mongoose.model("admins", AdminSchema);

module.exports = Admin;