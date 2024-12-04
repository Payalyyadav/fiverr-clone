const express = require('express');
const { serviceDelete, serviceUpdate, fetchserviceByCategory_id, fetchservicebyGig, addService, allservices, servicesfetchbykeyword } = require('../Controllers/common/Service');


const serviceRouter = express.Router();

serviceRouter.delete("/deleteby/:id", serviceDelete)
serviceRouter.patch("/edit", serviceUpdate)
serviceRouter.get("/fetchbycategory/:id", fetchserviceByCategory_id )
serviceRouter.get("/fetchbygig/:id",fetchservicebyGig)
serviceRouter.post("/add",addService)
serviceRouter.get("/fetch",allservices)
serviceRouter.get("/fetchbykeyword",servicesfetchbykeyword)

module.exports = serviceRouter;
