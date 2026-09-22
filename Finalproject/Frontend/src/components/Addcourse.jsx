import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Addcourse = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const navigate = useNavigate();

  async function add(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5500/api/courses",
        {
          name: name.trim(),
          price: Number(price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("course added successfully");
      navigate("/view");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Could not add course");
    }
  }

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 sm:px-6">
      {/* Animated background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl motion-safe:animate-pulse" />

        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl motion-safe:animate-pulse [animation-delay:1s]" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/70" />
      </div>

      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-xl font-bold text-white shadow-lg shadow-blue-500/20">
            E
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Edu<span className="text-blue-400">Learn</span>
          </span>
        </div>

        {/* Gradient border */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-400/50 via-white/10 to-violet-400/40 p-px shadow-2xl shadow-blue-950/50">
          <form
            onSubmit={add}
            className="rounded-3xl bg-slate-900/95 p-6 backdrop-blur-xl sm:p-10"
          >
            <div className="mb-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-300">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                COURSE MANAGEMENT
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Add a new course
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Start with a name and price to grow your course catalog.
              </p>
            </div>

            {/* Course name */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Course name
              </label>

              <input
                type="text"
                id="name"
                placeholder="e.g. React Development"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3.5 text-base text-white outline-none transition duration-300 placeholder:text-slate-500 hover:border-slate-500 focus:border-blue-400 focus:bg-slate-950 focus:ring-4 focus:ring-blue-400/10 motion-reduce:transition-none"
              />
            </div>

            {/* Course price */}
            <div className="mb-8">
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Course price
              </label>

              <input
                type="number"
                id="price"
                placeholder="e.g. 1499.00"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                aria-describedby="price-help"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3.5 text-base text-white outline-none transition duration-300 placeholder:text-slate-500 hover:border-slate-500 focus:border-blue-400 focus:bg-slate-950 focus:ring-4 focus:ring-blue-400/10 motion-reduce:transition-none"
              />

              <p
                id="price-help"
                className="mt-2 text-xs leading-5 text-slate-400"
              >
                Enter 0 to offer this course for free.
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/50 motion-safe:hover:-translate-y-1 motion-safe:active:scale-[0.98] motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 motion-safe:group-hover:translate-x-full motion-reduce:hidden"
              />

              <span className="relative">Add Course</span>

              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="relative h-5 w-5 transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-reduce:transition-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-6-6 6 6-6 6"
                />
              </svg>
            </button>

            <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-800 pt-5 text-xs text-slate-400">
              <span>Build skills. Inspire learning.</span>
              <span className="font-semibold text-slate-300">
                EduLearn
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Addcourse;