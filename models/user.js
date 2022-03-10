const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');//req passport-local-mongoose
const Schema = mongoose.Schema;

//removed username and password from the schema
const userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

//added passport-local-mongoose plugin to user schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
