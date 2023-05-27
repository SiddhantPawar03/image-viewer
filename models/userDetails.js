const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fname: String,
        lname: String,
        email: {type:String,unique:true},
        password:String
    },
    {
        collection:"userSchema"
    }
);

module.exports = mongoose.model("userSchema", userSchema);