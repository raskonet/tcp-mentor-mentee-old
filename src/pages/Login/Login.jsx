import React, { useState, useLayoutEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Mentorimg from "../../assets/images/Mentorimg.jpg";
import Menteeimg from "../../assets/images/Menteeimg.jpg";
import Menteeform from "./Menteeform";
import Mentorform from "./Mentorform";

const Login = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [usertype, setusertype] = useState("Mentee");

  return (
    <div className="flex h-screen flex-col justify-center bg-gray-50 dark:bg-gray-900">
      <ToastContainer />
      <div className="w-full h-full flex flex-col md:flex-row shadow-2xl overflow-hidden">
        
        {/* Left Side (Form) */}
        <div className="w-full md:w-[50%] p-8 md:p-12 dark:bg-gray-800 bg-white flex flex-col justify-center items-center transition-colors duration-300">
          
          <div className="w-full max-w-md">
            <h2 className="text-center font-extrabold text-3xl md:text-4xl mb-2 text-gray-800 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
              Please enter your details to sign in.
            </p>

            {/* Toggle Switch */}
            <div className="flex justify-center mb-8 bg-gray-200 dark:bg-gray-700 p-1 rounded-xl">
               <button
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    usertype === "Mentee" 
                    ? "bg-white dark:bg-gray-600 text-[var(--primary-c)] shadow-sm" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                  }`}
                  onClick={() => setusertype("Mentee")}
               >
                 Mentee
               </button>
               <button
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    usertype === "Mentor" 
                    ? "bg-white dark:bg-gray-600 text-[var(--primary-c)] shadow-sm" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                  }`}
                  onClick={() => setusertype("Mentor")}
               >
                 Mentor
               </button>
            </div>

            {/* Form Component */}
            <div className="animate-fade-in-up">
               {usertype === "Mentee" ? <Menteeform /> : <Mentorform />}
            </div>

            {/* Footer */}
            {usertype === "Mentee" && (
              <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[var(--primary-c)] font-bold hover:underline">
                  Sign up now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side (Banner) */}
        <div className="hidden md:flex w-[50%] bg-gradient-to-br from-blue-600 to-[var(--primary-c)] items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div> {/* Optional: Add a texture pattern class */}
          <div className="z-10 text-center px-10">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              TCP Mentorship<br/>Program 2026
            </h1>
            <p className="text-blue-100 text-xl max-w-md mx-auto">
              Connect, Learn, and Grow with the best mentors in the industry.
            </p>
          </div>
          {/* Decorative Circles */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-20 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-2xl"></div>
        </div>

      </div>
    </div>
  );
};

export default Login;
