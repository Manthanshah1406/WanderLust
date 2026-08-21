const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
    }

    //password with salting and username are already in PLM
    //also some static methods of PLM were added. We can use it. 
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);