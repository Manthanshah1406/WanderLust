const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/listing');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));

MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust1';

main().then(res => console.log('Connected to db')).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL)
}

// Index Route
app.get('/listings', async (req, res) => {
    let allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
})

// New Listing route
app.get('/listings/new', async (req, res) => {
    res.render('listings/new.ejs');
})

//create Route
app.post('/listings', async (req, res) => {
    let { title, description, image, price, location, country } = req.body;
    let newListing = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country,
    })

    await newListing.save();

    // Most Easy way
    // let newListing=new Listing(req.body.listing) 
    // then save it
    // in form u need to write name as this style: listing["title"] just like find value in object

    res.redirect('/listings');
})

// update Routes
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing })
})

app.put('/listings/:id', async (req, res) => {
    let { id } = req.params;
    let List = await Listing.findByIdAndUpdate(id, req.body);
    res.redirect(`/listings/${id}`);
});

// Show Route
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findById(id);
    res.render('listings/show.ejs', { List })
})

// Delete Route
app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})



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

app.listen(8080, () => {
    console.log('http://localhost:8080');
});