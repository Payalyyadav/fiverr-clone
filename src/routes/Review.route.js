const express = require('express');
const { addReview, fetchReviewbyGig, fetchReviewbyOrder, fetchReviewbyUser } = require('../Controllers/common/review');

const reviewRouter = express.Router();

reviewRouter.post("/add", addReview)
reviewRouter.get("/fetch-gig/:id", fetchReviewbyGig)
reviewRouter.get("/fetchbyorder/:id", fetchReviewbyOrder )
reviewRouter.get("/fetch_user/:id",fetchReviewbyUser)

module.exports = reviewRouter;
