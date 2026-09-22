const mongoose = require("mongoose");

const courseschema = new mongoose.Schema({
    name:{type:String, required:true},
    price:{type:Number, required:true},
});

module.exports = mongoose.model("course",courseschema);