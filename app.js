const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/listing');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');

app.use(express.urlencoded({ extended: true }));
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
})

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
app.post('/listings', wrapAsync(async (req, res, next) => {
    let { title, description, image, price, location, country } = req.body;

    let result=listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400,req.error);
    }


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

app.put('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;

    let { title, description, image, price, location, country } = req.body;

    if (!(req.body.title | req.body.description | req.body.price | req.body.location | req.body.country)) {
        throw new ExpressError(400, "Send valid data for listings");
    };

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
    const List = await Listing.findById(id);
    res.render('listings/show.ejs', { List });
}));

// Delete Route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
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
    res.render('error.ejs', { message })
});


app.listen(8080, () => {
    console.log('http://localhost:8080');
});