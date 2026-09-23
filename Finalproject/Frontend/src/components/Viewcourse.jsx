import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import Coursecard
  from "./Coursecard";


const Viewcourse = () => {

  const [courses, setCourses] =
    useState([]);


  // ========================================
  // GET ALL COURSES
  // ========================================

  useEffect(() => {

    const getCourses =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );


          const res =
            await axios.get(

              "http://localhost:5500/api/courses",

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`

                }

              }

            );


          setCourses(
            res.data
          );


        } catch (error) {

          console.log(error);

        }

      };


    getCourses();

  }, []);


  return (

    <section
      className="
      min-h-screen
      bg-slate-950
      px-4
      py-16
      sm:px-6
      lg:px-8
      "
    >

      <div
        className="
        mx-auto
        max-w-7xl
        "
      >


        {/* Heading */}

        <div
          className="
          mb-12
          text-center
          "
        >

          <p
            className="
            mb-3
            text-sm
            font-bold
            uppercase
            tracking-widest
            text-blue-400
            "
          >

            EduLearn Courses

          </p>


          <h1
            className="
            text-4xl
            font-bold
            text-white
            "
          >

            Explore Our Courses

          </h1>


          <p
            className="
            mt-3
            text-slate-400
            "
          >

            Choose your course and
            start learning today.

          </p>

        </div>


        {/* Course Grid */}

        <div
          className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          lg:grid-cols-3
          "
        >

          {
            courses.map(
              (course) => (

                <Coursecard

                  key={
                    course._id
                  }

                  course={
                    course
                  }

                />

              )
            )
          }

        </div>


        {/* No Course */}

        {
          courses.length === 0 && (

            <p
              className="
              text-center
              text-slate-400
              "
            >

              No courses available.

            </p>

          )
        }

      </div>

    </section>

  );

};


export default Viewcourse;