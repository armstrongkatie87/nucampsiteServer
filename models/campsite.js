const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

//2: Modify commentSchema's author field for type of ObjectId and ref of User
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {//updated here
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const campsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {//add img field
        type: String,//contains path to img
        required: true
    },//add elevation field
    elevation: {
        type: Number,
        required: true
    },//add cost field
    cost: {
        type: Currency,
        required: true,
        min: 0
    },//add featured field
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const Campsite = mongoose.model('Campsite', campsiteSchema);//this creates model named Campsites & 1st arg should be cap singular version of the name of the collection want use for model; 2nd arg schema want use for collection; mongoose.model returns a constructor f(x); this model will be used to instantiate docs for mongodb

module.exports = Campsite;