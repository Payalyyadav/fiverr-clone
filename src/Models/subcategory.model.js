const mongoose = require('mongoose');
                          
const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },

        description: {
            type: String,
            required: true
        },

        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories'
        }
    },

    { timestamps: true }
);


const subCategory = mongoose.model("sub-categories", subCategorySchema);

module.exports = subCategory;


