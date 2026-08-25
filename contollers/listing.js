const Listing = require('../models/listing.js');

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
};

module.exports.renderNewListingForm = async (req, res) => {
    res.render('listings/new.ejs');
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findById(id).populate({ path: 'reviews',populate: 'author'}).populate('owner');
    if (!List) {
        req.flash('error', 'Listing you requested for does not exist !')
    }
    res.render('listings/show.ejs', { List });
};

module.exports.createListing = async (req, res, next) => {
    let { title, description, price, location, country } = req.body;
    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing({
        title,
        description,
        image: { url, filename },
        price,
        location,
        country
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'New listing created!');
    res.redirect('/listings');
};

module.exports.updateListingForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist !')
    }
    res.render('listings/edit.ejs', { listing })
};

module.exports.updateListing = async (req, res) => {
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
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
};


