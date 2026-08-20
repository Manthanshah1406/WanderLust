const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');


const validateListings = (req, res, next) => {
    console.log("req.body =>", req.body);  // <-- temp debug log
    let { error } = listingSchema.validate(req.body);
    // console.log(result);
    if (error) {
        throw new ExpressError(400, error.message);
    }
    else {
        next();
    }
};

// Index Route
router.get('/', wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}));

// New Listing route
router.get('/new', wrapAsync(async (req, res) => {
    res.render('listings/new.ejs');
}));

//create Route
router.post('/', validateListings, wrapAsync(async (req, res, next) => {
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

    await newListing.save();
    // Most Easy way
    // let newListing=new Listing(req.body.listing) 
    // then save it
    // in form u need to write name as this style: listing["title"] just like find value in object
    req.flash('success', 'New listing created!');
    res.redirect('/listings');
}));

// update Routes
router.get('/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist !')
    }
    res.render('listings/edit.ejs', { listing })
}));

router.put('/:id', validateListings, wrapAsync(async (req, res) => {
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
    const List = await Listing.findById(id).populate('reviews');
    if (!List) {
        req.flash('error', 'Listing you requested for does not exist !')
    }
    res.render('listings/show.ejs', { List });
}));

// Delete Route
router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
}));

module.exports = router;