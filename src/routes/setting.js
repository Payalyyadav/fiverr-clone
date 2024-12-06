const express = require('express');
const { add, settings } = require('../Controllers/common/Setting');
const settingRouter = express.Router();


settingRouter.post("/add", add)
settingRouter.get("/fetch", settings)


module.exports = settingRouter;
