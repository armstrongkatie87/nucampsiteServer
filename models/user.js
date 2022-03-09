//create mongoose user schema and model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({//holds structure of user doc w/in obj props
    username: {//1st field
        type: String,
        required: true,
        unique: true
    },
    password: {//2nd field
        type: String,
        required: true
    },
    admin: {//3rd field
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);
