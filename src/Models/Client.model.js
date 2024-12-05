const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
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

        number: {
            type: Number
        },

        category_id:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'categories'
            }
        ],

        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'orders'
            }
        ],

        token : {
            type: String
        }
    },

    { timestamps: true }
);


const Client = mongoose.model("buyers", ClientSchema);

module.exports = Client;

