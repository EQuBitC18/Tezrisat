"use client";

import { useEffect, useState, FC } from "react";
import {AnimatedBlob} from "../components/animated-blob";
import {FloatingShapes} from "../components/floating-shapes";

const LoadingPage: FC = () => {
  // State for loading text and progress percentage.
  const [loadingText, setLoadingText] = useState<string>("Loading");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Interval to simulate loading progress.
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    // Interval to animate the loading text dots.
    const textInterval = setInterval(() => {
      setLoadingText((prev) => (prev === "Loading..." ? "Loading" : prev + "."));
    }, 500);

    // Cleanup intervals on component unmount.
    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900 via-teal-700 to-teal-300 -z-10" />

      {/* Animated background elements */}
      <AnimatedBlob className="absolute top-20 left-10 opacity-30 -z-5" />
      <AnimatedBlob className="absolute bottom-40 right-10 opacity-20 -z-5" />
      <FloatingShapes className="absolute inset-0 -z-5" />

      {/* Main Container */}
      <div className="container relative px-4 py-24 mx-auto max-w-7xl flex flex-col items-center">
        {/* Logo with breathing animation */}
        <div className="relative mb-12 animate-breathe">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tezrisat_Logo_Transparent-eBbmTKwKMpEqNCP1Uh8v8bv3bp1nhp.png"
            alt="Tezrisat Logo"
            className="w-48 h-48 md:w-64 md:h-64 object-contain"
          />
          <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full -z-10"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">{loadingText}</h2>

        {/* Progress Bar */}
        <div className="w-full max-w-md bg-white/20 backdrop-blur-sm rounded-full h-4 mb-8 overflow-hidden">
          <div
            className="h-full bg-teal-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Additional Loading Message */}
        <p className="text-white/80 text-center max-w-md">
          Preparing your personalized learning experience...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
