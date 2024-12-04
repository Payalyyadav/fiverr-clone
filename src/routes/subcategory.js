const express = require('express');
const { sub_categories, add } = require('../Controllers/common/subcategory');
const subcategoryRouter = express.Router();

subcategoryRouter.get("/fetch", sub_categories)
subcategoryRouter.post("/add", add)


module.exports = subcategoryRouter;
