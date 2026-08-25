const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../contollers/review.js');


// Reviews
// Post Route
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete route
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;