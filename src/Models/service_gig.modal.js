const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        about: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        price:{
            type: String,
            required: true
        },

        freelancer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sellers'
        },

        category: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'categories'
            }
        ],

        sub_category: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sub-categories'
            }
        ],
        
        ratting:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'reviews'
            }
        ],

        delivery_date: {
            type: Number,
            required: true
        }
    },

    { timestamps: true }
);


const Service = mongoose.model("gigs", GigSchema);

module.exports = Service;

