import React from "react";

const Coursecard = ({ course }) => {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg shadow-slate-950/20 transition duration-300 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 motion-safe:hover:-translate-y-2 motion-reduce:transition-none">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-500/10 blur-2xl transition duration-500 group-hover:bg-violet-500/20 motion-reduce:transition-none"
      />

      {/* Course icon */}
      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition duration-300 group-hover:bg-blue-500 group-hover:text-white motion-safe:group-hover:-rotate-6 motion-reduce:transition-none">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7v14m0-14C9 4.5 5.5 4 2 5v14c3.5-1 7-.5 10 2m0-14c3-2.5 6.5-3 10-2v14c-3.5-1-7-.5-10 2"
            />
          </svg>
        </div>

        <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
          Course
        </span>
      </div>

      {/* Course name */}
      <h3 className="relative mb-6 break-words text-xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-blue-300 motion-reduce:transition-none">
        {course.name}
      </h3>

      {/* Course price */}
      <div className="relative border-t border-slate-700/70 pt-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-400">
          Course price
        </p>

        <p className="break-words text-3xl font-bold tracking-tight text-white">
          <span className="mr-1 text-xl text-blue-400">₹</span>
          {course.price}
        </p>
      </div>

      {/* Animated bottom border */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-violet-500 transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
      />
    </article>
  );
};

export default Coursecard;