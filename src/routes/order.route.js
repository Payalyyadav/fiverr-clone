const express = require('express');
const { addOrder, orderByClientid, orderByOrderid, fetchByServiceId, orderDelete, statusUpdate } = require('../Controllers/common/order');


const orderRouter = express.Router();

orderRouter.post("/add", addOrder)
orderRouter.get("/fetchbyclient/:id", orderByClientid)
orderRouter.get("/fetchbyservice/:id", fetchByServiceId)
orderRouter.put("/update_status/:id", statusUpdate)
orderRouter.delete("/deleteBy/:id", orderDelete)
orderRouter.get("/fetchbyorder/:id", orderByOrderid)

module.exports = orderRouter;
