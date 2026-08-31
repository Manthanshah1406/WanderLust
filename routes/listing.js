const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListings } = require('../middleware.js');
const listingController = require('../contollers/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('image'), validateListings, wrapAsync(listingController.createListing))

// New Listing route
router.get('/new', isLoggedIn, wrapAsync(listingController.renderNewListingForm));

router.route('/:id')
    .get(wrapAsync(listingController.showListings))
    .put(isLoggedIn, isOwner, upload.single('image'), validateListings, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

// update Routes
//Edit
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.updateListingForm));


// Index Route
//  router.get('/', wrapAsync(listingController.index));

// create Route
// router.post('/', isLoggedIn, validateListings, wrapAsync(listingController.createListing));


// Update
// router.put('/:id', isLoggedIn, isOwner, validateListings, wrapAsync(listingController.updateListing));

// Show Route
// router.get('/:id', wrapAsync(listingController.showListings));

// Delete Route
// router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;