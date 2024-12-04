const customError = require("../../utils/error.handle");
const {z} = require("zod");
const { executeTransaction } = require("../../utils/trycatchhandler");
const subCategory = require("../../Models/subcategory.model");
const mongoose = require("mongoose");


const add = async (req, res) => {
  
    const capitalizeAndValidateName = z.preprocess((name) => {
        if (typeof name === 'string') {
            return name.toUpperCase();
        }
        return name;
    }, z.string()
        .min(3, { message: 'Name is required' })
        .refine((name) => {
            return name === name.toUpperCase();
        }, {
            message: 'Name must be in all uppercase letters',
        })
    );

    
    const validationSchema = z.object({
        name: capitalizeAndValidateName,
        category_id: z.array(z.string().length(24, 'Invalid CategoryId format').regex(/^[0-9a-fA-F]{24}$/, 'Invalid CategoryId format')),
        description: z.string().min(5, 'description is required'),
       
    });

    const validationResult = validationSchema.safeParse(req.body);

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { name, description, category_id} = req.body;

    if (!mongoose.Types.ObjectId.isValid(category_id)) {

        throw new customError('Invalid Category ID', 400);
    }

    const exists = await subCategory.findOne({ name });

    if (exists) {
        throw new customError('subCategory already exists', 400);
    }

    await subCategory.create({
        name,
        description,
        category_id
       
    }); 

   
    return res.status(201).json({ status: '001', message: 'subCategory added successfully' });
};



const sub_categories = async (req, res) => {
  
    const sub_categories = await subCategory.find({}); 


    return res.status(200).json({ status: '001', sub_categories });
};



executeTransaction(add)
executeTransaction(sub_categories)


module.exports = {add, sub_categories}