import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Verifyotp = () => {
  const navigate = useNavigate();

  const sendemail = localStorage.getItem("verifyEmail");

  const [email, setEmail] = useState(sendemail || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const votp = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5500/api/auth/verify-otp",
        {
          email: email,
          otp: otp,
        }
      );

      setMessage(res.data.message);
      localStorage.removeItem("verifyEmail");

      alert("Email verified successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.message ||
          "OTP verification failed. Please enter the correct OTP."
      );
    }
  };

  const resendotp = async () => {
    setMessage("");

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5500/api/auth/resend-otp",
        {
          email: email,
        }
      );

      setMessage(res.data.message);
      alert("A new OTP has been sent to your Gmail.");
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.message ||
          "OTP could not be sent. Please try again."
      );
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-10">
      
      {/* Animated background */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-cyan-500/30 blur-3xl"></div>

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>

      {/* OTP verification card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
        
        {/* Heading */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 text-3xl shadow-lg shadow-blue-500/30 transition duration-500 hover:rotate-6 hover:scale-110">
            ✉️
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Verify Your Email
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Enter the six-digit OTP sent to your registered Gmail address.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-center text-sm text-cyan-100">
            {message}
          </div>
        )}

        <form onSubmit={votp} className="space-y-5">
          
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-slate-400 hover:border-cyan-400/50 focus:border-cyan-400 focus:bg-white/15 focus:ring-4 focus:ring-cyan-400/10"
            />
          </div>

          {/* OTP */}
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Verification Code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter your 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const onlynumbers = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);

                setOtp(onlynumbers);
              }}
              maxLength={6}
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-xl font-bold tracking-[0.5em] text-white outline-none transition duration-300 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 hover:border-cyan-400/50 focus:border-cyan-400 focus:bg-white/15 focus:ring-4 focus:ring-cyan-400/10"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Numbers only</span>
              <span>{otp.length}/6</span>
            </div>
          </div>

          {/* Verify button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/30 transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40 active:translate-y-0 active:scale-95"
          >
            Verify OTP
          </button>

          {/* Resend button */}
          <button
            type="button"
            onClick={resendotp}
            className="w-full rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 font-semibold text-cyan-300 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-400/20 hover:text-white active:translate-y-0 active:scale-95"
          >
            Resend OTP
          </button>
        </form>

        {/* Login link */}
        <p className="mt-7 text-center text-sm text-slate-300">
          Already verified?{" "}
          <Link
            to="/login"
            className="font-bold text-cyan-400 transition duration-300 hover:text-cyan-300 hover:underline"
          >
            Go to Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Verifyotp;