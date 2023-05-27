const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
    {
        image:String,
        email: {type:String}
    },
    {
        collection:"imageSchema"
    }
);

module.exports = mongoose.model("imageSchema", imageSchema);