const express = require('express');
const { inquiryCreate, statusUpdate } = require('../Controllers/common/inquiry');
const inquiryRouter = express.Router();


inquiryRouter.post("/add", inquiryCreate)
inquiryRouter.put("/update_status", statusUpdate)


module.exports = inquiryRouter;
