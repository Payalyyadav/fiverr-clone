const Category = require("../../Models/categorys.modal");
const customError = require("../../utils/error.handle");
const {z} = require("zod");
const { executeTransaction } = require("../../utils/trycatchhandler");


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
        
        description: z.string().min(5, 'description is required'),
       
    });

    const validationResult = validationSchema.safeParse(req.body);

    if (!validationResult.success) {

        throw new customError(validationResult.error.errors.map(err => err.message).join(", "), 400);
    }

    const { name, description} = req.body;

   

    const exists = await Category.findOne({ name });

    if (exists) {
        throw new customError('Category already exists', 400);
    }

    await Category.create({
        name,
        description
       
    }); 

   
    return res.status(201).json({ status: '001', message: 'Category added successfully' });
};


const categories = async (req, res) => {
  
    const categories = await Category.find({}); 


    return res.status(200).json({ status: '001', categories });
};

executeTransaction(add)
executeTransaction(categories)


module.exports = {add, categories}