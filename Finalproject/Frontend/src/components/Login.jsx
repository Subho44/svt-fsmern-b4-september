import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const loginuser = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5500/api/auth/login",
        {
          email: email,
          password: password,
        }
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert(`${res.data.user.role === "admin" ? "Admin" : "User"} login successful!`);
      navigate("/home");
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-10">
      
      {/* Animated background circles */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-cyan-500/30 blur-3xl"></div>

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>

      {/* Login card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
        
        {/* Heading */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 text-3xl shadow-lg shadow-blue-500/30 transition duration-500 hover:rotate-6 hover:scale-110">
            🔐
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Login to continue to your account
          </p>
        </div>

        {/* Error message */}
        {message && (
          <div className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-200">
            {message}
          </div>
        )}

        <form onSubmit={loginuser} className="space-y-5">
          
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-slate-400 hover:border-cyan-400/50 focus:border-cyan-400 focus:bg-white/15 focus:ring-4 focus:ring-cyan-400/10"
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/30 transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40 active:translate-y-0 active:scale-95"
          >
            Login
          </button>
        </form>

        {/* Register link */}
        <p className="mt-7 text-center text-sm text-slate-300">
          New user?{" "}
          <Link
            to="/"
            className="font-bold text-cyan-400 transition duration-300 hover:text-cyan-300 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;