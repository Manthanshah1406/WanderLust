const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');
const { reviewSchema } = require('./schema.js');
const Review = require('./models/review.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust1';

main().then(res => console.log('Connected to db')).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL)
}


// Home Route
app.get('/', (req, res) => {
    res.send('Hi,I am Mr.Shah');
});

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

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};

// Index Route
app.get('/listings', wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}));

// New Listing route
app.get('/listings/new', wrapAsync(async (req, res) => {
    res.render('listings/new.ejs');
}));

//create Route
app.post('/listings', validateListings, wrapAsync(async (req, res, next) => {
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

    res.redirect('/listings');
}));

// update Routes
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing })
}));

app.put('/listings/:id', validateListings, wrapAsync(async (req, res) => {
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

    res.redirect(`/listings/${id}`);
}));

// Show Route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findById(id).populate('reviews');
    res.render('listings/show.ejs', { List });
}));

// Delete Route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// Reviews
// Post Route
app.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}))

// Delete route
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

// other routes
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
});


// Testing
// app.get('/testListing', async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     })

//     await sampleListing.save();
//     // console.log(res);
//     res.send('Successful Testing');
// })


app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong !!" } = err;
    res.status(status).render('error.ejs', { message })
});


app.listen(8080, () => {
    console.log('http://localhost:8080');
});