const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListings } = require('../middleware.js');


// Index Route
router.get('/', wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}));

// New Listing route
router.get('/new', isLoggedIn, wrapAsync(async (req, res) => {
    res.render('listings/new.ejs');
}));

//create Route
router.post('/', isLoggedIn, validateListings, wrapAsync(async (req, res, next) => {
    let { title, description, image, price, location, country } = req.body;

    let newListing = new Listing({
        title,
        description,
        image: {
            filename: "listingimage",
            url: image
        },
        price,
        location,
        country
    });
    newListing.owner = req.user._id;
    await newListing.save();
    // Most Easy way
    // let newListing=new Listing(req.body.listing) 
    // then save it
    // in form u need to write name as this style: listing["title"] just like find value in object
    req.flash('success', 'New listing created!');
    res.redirect('/listings');
}));

// update Routes
//Edit
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist !')
    }
    res.render('listings/edit.ejs', { listing })
}));

//Update
router.put('/:id', isLoggedIn, isOwner, validateListings, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(
        id,
        {
            title,
            description,
            image: {
                filename: "listingimage",
                url: image
            },
            price,
            location,
            country
        },
        { runValidators: true }
    );
    req.flash('success', 'Listing updated!');

    res.redirect(`/listings/${id}`);
}));

// Show Route
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findById(id).populate({ path: 'reviews',populate: 'author'}).populate('owner');
    if (!List) {
        req.flash('error', 'Listing you requested for does not exist !')
    }
    res.render('listings/show.ejs', { List });
}));

// Delete Route
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
}));


module.exports = router;