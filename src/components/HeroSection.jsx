import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import heroAnimation from "../assets/images/heroAnimation.json";

const HeroSection = () => {
  return (
    <div className="flex lg:justify-center lg:items-center md:my-16 my-12 min-h-[80vh]">
      <div className="flex flex-col card bg-transparent lg:flex-row w-full max-w-7xl px-6">
        <div className="lg:w-[60%] flex flex-col justify-center pb-5 z-20">
          <h3 className="text-2xl md:text-3xl text-gray-900 dark:text-gray-300 font-bold mt-7 tracking-wide">
            TCP PRESENTS
          </h3>
          <h1 className="text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[var(--primary-c)] dark:from-blue-400 dark:to-cyan-400 font-extrabold md:mt-6 mt-4 leading-tight">
            MENTORSHIP
          </h1>
          <h1 className="text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[var(--primary-c)] dark:from-blue-400 dark:to-cyan-400 font-extrabold pb-4 leading-tight">
            PROGRAM 2026
          </h1>
          <div className="h-1 w-32 bg-[var(--primary-c)] my-4 rounded-full"></div>
          <p className="text-lg md:text-2xl text-zinc-700 dark:text-gray-300 font-medium md:max-w-xl">
            Empower Your Coding Journey with Expert Mentorship.
          </p>
          <p className="text-base md:text-lg text-zinc-600 dark:text-gray-400 mt-4 md:max-w-xl leading-relaxed">
            Elevate your skills in competitive programming, data structures,
            algorithms, and software development with our personalized
            mentorship program.
          </p>
        </div>
        <div className="lg:w-[40%] flex justify-center items-center mt-10 lg:mt-0">
          <Player src={heroAnimation} className="player w-full max-w-lg drop-shadow-2xl" loop autoplay />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
