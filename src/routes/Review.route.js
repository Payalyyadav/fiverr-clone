const express = require('express');
const { addReview, fetchReviewbyGig, fetchReviewbyOrder, fetchReviewbyUser } = require('../Controllers/common/review');

const reviewRouter = express.Router();

reviewRouter.post("/reviewadd", addReview)
reviewRouter.get("/gig/:id", fetchReviewbyGig)
reviewRouter.get("/order/:id", fetchReviewbyOrder )
reviewRouter.get("/user/:id",fetchReviewbyUser)

module.exports = reviewRouter;
