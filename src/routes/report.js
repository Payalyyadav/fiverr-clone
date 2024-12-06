const express = require('express');
const { ReportCreate } = require('../Controllers/common/report');
const reportRouter = express.Router();


reportRouter.post("/add", ReportCreate)


module.exports = reportRouter;
