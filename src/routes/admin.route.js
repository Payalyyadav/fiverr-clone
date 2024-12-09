const express = require('express');
const { allfindFetch, serviceRejectorApprove, register, statusUser, resolveOrder, totalRevenue } = require('../Controllers/admin/admin');


const adminRouter = express.Router();


adminRouter.get("/fetch", allfindFetch)
adminRouter.post("/add", register)
adminRouter.put("/servicestatus", serviceRejectorApprove)
adminRouter.patch("/statusUser", statusUser)
adminRouter.post("/orderresolve", resolveOrder)
adminRouter.get("/totalrevenuefetch", totalRevenue)

module.exports = adminRouter;