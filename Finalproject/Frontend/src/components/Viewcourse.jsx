import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Coursecard from "./Coursecard";

const Viewcourse = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function getcourse() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5500/api/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    getcourse();
  }, []);

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl motion-safe:animate-pulse" />

        <div className="absolute -right-32 top-80 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl motion-safe:animate-pulse [animation-delay:1s]" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold tracking-widest text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400 motion-safe:animate-pulse" />
            THE EDULEARN COLLECTION
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find your next
                <span className="mt-2 block bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  learning opportunity.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                Explore our courses, build your knowledge, and take
                the next step in your learning journey.
              </p>
            </div>

            {/* Course count */}
            <div className="flex shrink-0 items-center gap-4 self-start rounded-2xl border border-slate-700/70 bg-slate-900/80 px-5 py-4 sm:self-auto">
              <span className="text-3xl font-bold text-white">
                {courses.length}
              </span>

              <span className="text-sm leading-5 text-slate-400">
                Courses
                <br />
                in the catalog
              </span>
            </div>
          </div>
        </header>

        {/* Section divider */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="shrink-0 text-lg font-semibold text-white">
            Explore courses
          </h2>

          <div
            aria-hidden="true"
            className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"
          />

          <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Learn & grow
          </span>
        </div>

        {/* Responsive course grid */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((x) => (
            <Coursecard key={x._id} course={x} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-400">
            A new skill starts with a single step.
          </p>

          <p className="mt-2 text-sm font-semibold text-blue-400">
            EduLearn
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Viewcourse;