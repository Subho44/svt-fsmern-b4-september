import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navStyle = ({ isActive }) =>
    `relative font-semibold tracking-wide transition-all duration-300
    ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}
    after:absolute after:left-0 after:-bottom-2 after:h-[2px]
    after:bg-blue-600 after:transition-all after:duration-300
    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to={token ? "/home" : "/"} className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-6 group-hover:shadow-lg">
              E
            </div>

            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-blue-600">Edu</span>
              <span className="text-gray-900">Learn</span>
            </div>
          </Link>

          {token && user ? (
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/home" className={navStyle}>
                Home
              </NavLink>

              <NavLink to="/about" className={navStyle}>
                About
              </NavLink>
              <NavLink to="/chatbot" className={navStyle}>
                AI CHAT
              </NavLink>

              <NavLink to="/view" className={navStyle}>
                Courses
              </NavLink>

              {isAdmin && (
                <>
                  <NavLink to="/add" className={navStyle}>
                    Add Course
                  </NavLink>

                  <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700">
                    Admin
                  </span>
                </>
              )}

              {!isAdmin && (
                <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                  User
                </span>
              )}

              <button
                onClick={logout}
                className="rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <NavLink
                to="/login"
                className="rounded-xl border border-blue-600 px-5 py-2.5 font-semibold text-blue-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md"
              >
                Login
              </NavLink>

              <NavLink
                to="/"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
