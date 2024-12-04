const express = require('express');
const { add, categories } = require('../Controllers/common/category');
const categoryRouter = express.Router();

categoryRouter.get("/fetch", categories)
categoryRouter.post("/add", add)


module.exports = categoryRouter;
