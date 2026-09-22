const mongoose = require("mongoose");

const paymentschema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    course:{type:mongoose.Schema.Types.ObjectId, ref:"Course", required:true},
    amount:{type:Number, required:true},
    currency:{type:String, default:"INR"},
    razorpayorderId:{type:String, required:true,unique:true},
    razorpaymentId:{type:String, default:null},
    status:{type:String, enum:["created","paid","failed"], default:"created"},
},

{timestamps:true}
);

module.exports = mongoose.model("Payment",paymentschema);