const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

const Course = require("../models/Course");
const Payment = require("../models/Payments");


const { auth, userOnly } = require("../middleware/auth");

//razorpay object create

const getrazorpay = ()=>{
    if(
        !process.env.RAZORPAY_KEY_ID ||
        !process.env.RAZORPAY_KEY_SECRET
    ) {
        return null;
    }
    return new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET
    });
};

//create order
router.post('/create-order', auth,userOnly, async(req,res)=>{
    try {
        const {courseId} = req.body;
        const course = await Course.findById(courseId);
        const alreadypurchased = await Payment.findOne({
            user:req.user.id,
            course:course._id,
            status:"paid"
        });
        const razorpay = getrazorpay();
        const amountpaise = Math.round(Number(course.price)*100);

        const options = {
            amount:amountpaise,
            currency:"INR",
            receipt:"course_" + Date.now(),
            notes:{
                courseId:course._id.toString(),
                userId:req.user.id,
                courseName:course.name
            }
        };
        const order = await razorpay.orders.create(options);
        await Payment.create({
            user:req.user.id,
            course:course._id,
            amount:course.price,
            currency:"INR",
            razorpayorderId:order.id,
            status:"created"
        });
        res.json({
            key:process.env.RAZORPAY_KEY_ID,
            orderId:order.id,
            amount:order.amount,
            currency:order.currency,
            courseName:course.name
        });
    } catch(err){
        console.log(err)
    }
})


//verify payment
router.post('/verify-payment', auth,userOnly, async(req,res)=>{
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
        const savedpayment = await Payment.findOne({
            razorpayorderId:razorpay_order_id,
            user:req.user.id
        }).populate("course");

        const genaratesignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(savedpayment.razorpayorderId+ "|" +razorpay_payment_id).digest("hex");
        const razorpay = getrazorpay();
        const paymentinfo = await razorpay.payments.fetch(razorpay_payment_id);
        const exceptamount = Math.round(savedpayment.amount *100);
        savedpayment.razorpaymentId = razorpay_payment_id;
        savedpayment.status = "paid";
        await savedpayment.save();
        res.json({message:"payment successfull"});
    } catch(err){
        console.log(err)
    }
})


module.exports = router;