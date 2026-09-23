import React, { useState } from "react";
import axios from "axios";

const Coursecard = ({ course }) => {

  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);


  // ==========================================
  // GET LOGGED IN USER
  // ==========================================

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );


  // Buy Now only normal user
  const isUser = user?.role === "user";


  // ==========================================
  // LOAD RAZORPAY SCRIPT
  // ==========================================

  const loadRazorpayScript = () => {

    return new Promise((resolve) => {

      // Razorpay already loaded
      if (window.Razorpay) {

        resolve(true);

        return;
      }


      const script =
        document.createElement("script");


      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";


      script.async = true;


      // Script loaded successfully
      script.onload = () => {

        resolve(true);

      };


      // Script failed
      script.onerror = () => {

        resolve(false);

      };


      document.body.appendChild(script);

    });

  };


  // ==========================================
  // BUY NOW FUNCTION
  // ==========================================

  const buyNow = async () => {

    try {

      setLoading(true);


      // ========================================
      // STEP 1
      // CHECK LOGIN TOKEN
      // ========================================

      const token =
        localStorage.getItem("token");


      if (!token) {

        alert("Please login first");

        setLoading(false);

        return;

      }


      // ========================================
      // STEP 2
      // LOAD RAZORPAY CHECKOUT
      // ========================================

      const loaded =
        await loadRazorpayScript();


      if (!loaded) {

        alert(
          "Razorpay could not load. Check internet connection."
        );

        setLoading(false);

        return;

      }


      // ========================================
      // STEP 3
      // CREATE ORDER FROM BACKEND
      // ========================================

      const orderRes =
        await axios.post(

          "http://localhost:5500/api/payment/create-order",

          {
            courseId: course._id
          },

          {
            headers: {

              Authorization:
                `Bearer ${token}`

            }
          }

        );


      console.log(
        "Razorpay Order:",
        orderRes.data
      );


      // ========================================
      // STEP 4
      // RAZORPAY OPTIONS
      // ========================================

      const options = {

        // Public Razorpay Key
        key:
          orderRes.data.key,


        // Amount generated from backend
        amount:
          orderRes.data.amount,


        currency:
          orderRes.data.currency,


        name:
          "EduLearn",


        description:
          course.name,


        // IMPORTANT
        // Order created by backend
        order_id:
          orderRes.data.orderId,


        // ======================================
        // PAYMENT SUCCESS
        // ======================================

        handler:
          async function (response) {

            console.log(
              "Razorpay response:",
              response
            );


            try {

              // =================================
              // SEND PAYMENT DETAILS TO BACKEND
              // =================================

              const verifyRes =
                await axios.post(

                  "http://localhost:5500/api/payment/verify-payment",

                  {

                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature

                  },

                  {

                    headers: {

                      Authorization:
                        `Bearer ${token}`

                    }

                  }

                );


              console.log(
                "Verify Response:",
                verifyRes.data
              );


              // =================================
              // SUCCESS
              // =================================

              setPaid(true);


              alert(

                "Payment Successful!\n\n" +

                "Course: " +
                course.name +

                "\nPayment ID: " +
                verifyRes.data.paymentId

              );


            } catch (error) {

              console.log(
                "Verification Error:",
                error
              );


              alert(

                error.response
                  ?.data
                  ?.message ||

                "Payment verification failed"

              );

            }


            setLoading(false);

          },


        // ======================================
        // CUSTOMER DETAILS
        // ======================================

        prefill: {

          name:
            user?.name || "",

          email:
            user?.email || ""

        },


        // ======================================
        // ADDITIONAL DATA
        // ======================================

        notes: {

          courseId:
            course._id,

          courseName:
            course.name

        },


        // ======================================
        // PAYMENT POPUP DESIGN
        // ======================================

        theme: {

          color:
            "#2563eb"

        },


        // ======================================
        // USER CLOSE PAYMENT WINDOW
        // ======================================

        modal: {

          ondismiss:
            function () {

              console.log(
                "Payment popup closed"
              );

              setLoading(false);

            }

        }

      };


      // ========================================
      // STEP 5
      // CREATE RAZORPAY OBJECT
      // ========================================

      const razorpay =
        new window.Razorpay(
          options
        );


      // ========================================
      // PAYMENT FAILED EVENT
      // ========================================

      razorpay.on(

        "payment.failed",

        function (response) {

          console.log(
            "Payment failed:",
            response.error
          );


          alert(

            response.error
              ?.description ||

            "Payment failed"

          );


          setLoading(false);

        }

      );


      // ========================================
      // STEP 6
      // OPEN PAYMENT POPUP
      // ========================================

      razorpay.open();


    } catch (error) {

      console.log(
        "Payment Start Error:",
        error
      );


      alert(

        error.response
          ?.data
          ?.message ||

        "Payment could not start"

      );


      setLoading(false);

    }

  };


  // ==========================================
  // COURSE CARD DESIGN
  // ==========================================

  return (

    <article
      className="
      group
      relative
      h-full
      overflow-hidden
      rounded-2xl
      border
      border-slate-700
      bg-slate-900
      p-6
      shadow-lg
      transition
      duration-300
      hover:-translate-y-2
      hover:border-blue-400/50
      hover:shadow-xl
      "
    >


      {/* Decorative Background */}

      <div
        className="
        pointer-events-none
        absolute
        -right-10
        -top-10
        h-36
        w-36
        rounded-full
        bg-blue-500/10
        blur-2xl
        "
      />


      {/* Course Icon */}

      <div
        className="
        relative
        mb-6
        flex
        items-center
        justify-between
        "
      >

        <div
          className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-blue-500/10
          text-3xl
          "
        >

          📚

        </div>


        <span
          className="
          rounded-full
          border
          border-slate-700
          bg-slate-800
          px-3
          py-1
          text-xs
          text-slate-300
          "
        >

          Course

        </span>

      </div>


      {/* Course Name */}

      <h3
        className="
        relative
        mb-6
        text-xl
        font-bold
        text-white
        "
      >

        {course.name}

      </h3>


      {/* Price Section */}

      <div
        className="
        relative
        border-t
        border-slate-700
        pt-5
        "
      >

        <p
          className="
          mb-1
          text-xs
          uppercase
          tracking-widest
          text-slate-400
          "
        >

          Course Price

        </p>


        <p
          className="
          text-3xl
          font-bold
          text-white
          "
        >

          <span
            className="
            mr-1
            text-xl
            text-blue-400
            "
          >

            ₹

          </span>

          {course.price}

        </p>


        {/* ================================= */}
        {/* BUY NOW BUTTON - USER ONLY */}
        {/* ================================= */}

        {isUser && (

          <button

            type="button"

            onClick={buyNow}

            disabled={
              loading ||
              paid
            }

            className={`
            mt-5
            w-full
            rounded-xl
            px-5
            py-3
            font-bold
            text-white
            shadow-lg
            transition
            duration-300

            ${
              paid

                ? "cursor-not-allowed bg-green-600"

                : "bg-gradient-to-r from-blue-500 to-violet-600 hover:-translate-y-1 hover:shadow-xl"
            }

            disabled:opacity-70
            `}

          >

            {
              paid

                ? "Purchased ✓"

                : loading

                ? "Opening Payment..."

                : "Buy Now"
            }

          </button>

        )}

      </div>

    </article>

  );

};


export default Coursecard;