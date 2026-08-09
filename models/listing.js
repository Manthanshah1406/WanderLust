const mongoose = require('mongoose');
// const schema=mongoose.Schema;

const listingSchema = new mongoose.Schema({
    'title': {
        type: String,
        required: true,
    },
    'description': {
        type: String,
    },
    'image': {
        filename: String,
        url: {
            type: String,
            set: (v) => v === "" ? "https://unsplash.com/photos/silhouette-of-palm-tree-near-body-of-water-during-sunset-CXyz3qljaH8" : v,
            default: "https://unsplash.com/photos/silhouette-of-palm-tree-near-body-of-water-during-sunset-CXyz3qljaH8"
        }
    },
    'price': {
        type: Number,
    },
    'location': {
        type: String,
    },
    'country': {
        type: String,
    },
})

const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;