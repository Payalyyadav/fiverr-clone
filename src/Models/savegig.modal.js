const mongoose = require('mongoose');

const SaveGigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true
        },

        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buyers'
        },

        gig_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'gigs'
        }
    }
);


const Collection = mongoose.model("favorite_gig", SaveGigSchema);

module.exports = Collection;

