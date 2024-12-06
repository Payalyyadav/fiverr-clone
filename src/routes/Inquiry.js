const express = require('express');
const { inquiryCreate } = require('../Controllers/common/inquiry');
const inquiryRouter = express.Router();


inquiryRouter.post("/add", inquiryCreate)


module.exports = inquiryRouter;
