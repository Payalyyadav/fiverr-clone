const express = require('express');
const { register, login, freelnacers, logout, edit_details, freelancer } = require('../Controllers/freelancer/freelancer');
const verification = require('../middleware/Freelancer.auth');

const freelancerRouter = express.Router();

freelancerRouter.post("/register", register)
freelancerRouter.post("/login", login)
freelancerRouter.get("/fetch",  freelnacers)
freelancerRouter.get("/fetchby/:id", verification, freelancer)
freelancerRouter.post("/logout", verification, logout)
freelancerRouter.patch("/edit-detail", verification, edit_details)


module.exports = freelancerRouter;
