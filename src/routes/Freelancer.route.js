const express = require('express');
const { register, login, freelnacers, logout, edit_details, freelancer } = require('../Controllers/freelancer/freelancer');
const verification = require('../middleware/Freelancer.auth');

const freelancerRouter = express.Router();

freelancerRouter.post("/register", register)
freelancerRouter.post("/login", login)
freelancerRouter.get("/fetch", verification, freelnacers)
freelancerRouter.get("/fetch/by/:id", verification, freelancer)
freelancerRouter.post("/logout", verification, logout)
freelancerRouter.post("/edit-detail", verification, edit_details)


module.exports = freelancerRouter;
