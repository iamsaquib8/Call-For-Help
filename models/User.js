const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const UserSchema = new Schema({
    email: {
        type:String,
        unique:true,
        minlength:4,
        required:true
    },
    password:{
        type:String,
        minlength:8,
        required:true
    },
    name:{
        type:String,
        default:""
    },
    mobile: {
        type: Number
    },
    connection : [
        {
            name: String,
            mobile: Number
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('user', UserSchema);