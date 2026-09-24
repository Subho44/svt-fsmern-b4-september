import React, { useState } from "react";
import axios from "axios";


const Chatbot = () => {

  const [message, setMessage] =
    useState("");

  const [reply, setReply] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ===================================
  // SEND MESSAGE
  // ===================================

  const sendMessage = async (e) => {

    e.preventDefault();


    if (!message.trim()) {

      alert("Please enter message");

      return;

    }


    try {

      setLoading(true);

      setReply("");


      const token =
        localStorage.getItem("token");


      const res =
        await axios.post(

          "http://localhost:5500/api/chat",

          {
            message: message
          },

          {
            headers: {

              Authorization:
                `Bearer ${token}`

            }
          }

        );


      setReply(
        res.data.reply
      );


    } catch (error) {

      console.log(error);


      setReply(

        error.response
          ?.data
          ?.message ||

        "AI chatbot error"

      );

    }


    setLoading(false);

  };


  return (

    <div
      className="
      min-h-screen
      bg-slate-950
      flex
      items-center
      justify-center
      p-5
      "
    >

      <div
        className="
        w-full
        max-w-xl
        bg-slate-900
        border
        border-slate-700
        rounded-2xl
        shadow-xl
        p-6
        "
      >


        {/* TITLE */}

        <h1
          className="
          text-3xl
          font-bold
          text-white
          text-center
          "
        >

          🤖 EduLearn AI

        </h1>


        <p
          className="
          text-slate-400
          text-center
          mt-2
          "
        >

          Course Recommendation Assistant

        </p>


        {/* AI ANSWER */}

        <div
          className="
          min-h-[180px]
          bg-slate-800
          rounded-xl
          p-4
          mt-6
          text-slate-200
          "
        >

          {
            loading
              ? "AI is thinking..."
              : reply ||
                "Ask me about courses, technologies, career or projects."
          }

        </div>


        {/* FORM */}

        <form
          onSubmit={sendMessage}
          className="mt-5"
        >


          <input

            type="text"

            value={message}

            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }

            placeholder="Example: Which course is best for web development?"

            className="
            w-full
            bg-slate-800
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            text-white
            outline-none
            focus:border-blue-500
            "
          />


          <button

            type="submit"

            disabled={loading}

            className="
            w-full
            mt-4
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-bold
            transition
            "
          >

            {
              loading
                ? "Please Wait..."
                : "Send Message"
            }

          </button>


        </form>


      </div>

    </div>

  );

};


export default Chatbot;