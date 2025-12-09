"use client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen, Layers, Lightbulb } from "lucide-react";
// @ts-ignore
import { Button } from "@/components/ui/button";
import {ScrollProgressBar} from "../components/scroll-progress-bar";
import {FloatingShapes} from "../components/floating-shapes";
import {AnimatedBlob} from "../components/animated-blob";
import {FeatureCard} from "../components/feature-card";

const Home: React.FC = () => {
  // Hook for scroll progress used for parallax effect
  const { scrollYProgress } = useScroll();
  // State for sticky header
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  // React Router navigation hook
  const navigate = useNavigate();

  // Update 'isScrolled' based on window scroll value
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax transformation: maps scroll progress to a vertical translation percentage
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  // Navigate to signup/register page
  const navigateToSignup = () => {
    navigate("/register");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-teal-900 via-teal-700 to-teal-400">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <AnimatedBlob />
      </div>
      <div className="fixed inset-0 -z-10 opacity-20">
        <FloatingShapes />
      </div>

      {/* Scroll Progress Bar */}
      <ScrollProgressBar scrollYProgress={scrollYProgress} />

      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-teal-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/Tezrisat_Logo_Transparent.png"
              alt="Tezrisat Platform Interface"
              style={{ width: "6%", height: "5%", objectFit: "contain" }}
              className="hidden md:block"
            />
            <span className="text-xl font-bold text-white">Tezrisat</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {/* Additional nav items can be added here */}
          </nav>
          <div className="flex gap-4">
            <Button
              className="bg-teal-200 text-teal-900 hover:bg-teal-100"
              onClick={navigateToSignup}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-4"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
                Learn Faster with <span className="text-teal-200">Customized</span> Microcourses
              </h1>
              <p className="max-w-[600px] text-teal-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Generate personalized learning experiences tailored to your needs. Master new skills in minutes, not hours.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  onClick={navigateToSignup}
                  className="bg-teal-200 text-teal-900 hover:bg-teal-100 h-12 px-6"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/*
                <a href="#how-it-works">
                  <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 h-12 px-6">
                    How It Works
                  </Button>
                </a>*/}
              </div>
            </motion.div>
            <motion.div
              style={{ y }}
              className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-200/20 to-teal-400/20 rounded-2xl border border-teal-200/30"></div>
              <img
                src="/Tezrisat_Logo_White_Background.png"
                alt="Tezrisat Platform Interface"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                className="rounded-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-teal-400 to-teal-300">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-teal-900">
              Why Choose Tezrisat?
            </h2>
            <p className="mt-4 text-teal-800 md:text-xl/relaxed max-w-3xl mx-auto">
              Our platform is designed to make learning efficient, effective, and tailored to your specific needs.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Lightbulb className="h-10 w-10 text-teal-500" />}
              title="Customization"
              description="Customize your microcourse as you wish so that our AI can generate personalized learning experiences."
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-teal-500" />}
              title="Bite-sized Learning"
              description="Concise, focused content designed to be consumed in minutes, not hours."
            />
            <FeatureCard
              icon={<Layers className="h-10 w-10 text-teal-500" />}
              title="Diverse Content Formats"
              description="Learn through text and quizzes based on your preferences."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-b from-teal-300 to-teal-200">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-teal-900">
              How It Works
            </h2>
            <p className="mt-4 text-teal-700 md:text-xl/relaxed max-w-3xl mx-auto">
              Three simple steps to start your personalized learning journey.
            </p>
          </motion.div>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Define Your Goal",
                description:
                  "Provide your learning objective along with any relevant URLs or PDFs to tailor your microcourse.",
              },
              {
                step: "02",
                title: "Get Your Microcourse",
                description:
                  "Our AI generates a customized learning path with bite-sized content.",
              },
              {
                step: "03",
                title: "Learn & Master",
                description: "Complete your microcourse at your own pace.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 h-full shadow-lg">
                  <div className="text-5xl font-bold text-teal-200 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-teal-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-teal-700">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-To-Action (CTA) Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-teal-200 to-teal-100">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 to-teal-700 p-8 md:p-12 shadow-xl"
          >
            <div className="absolute inset-0 bg-teal-500 opacity-10">
              <div className="absolute inset-0 bg-grid-white/10"></div>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Transform Your Learning Experience?
              </h2>
              <div className="mt-8">
                <Button
                  className="bg-white text-teal-600 hover:bg-teal-50 h-12 px-8"
                  onClick={navigateToSignup}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-teal-200/30 bg-teal-100/90 backdrop-blur-sm py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/Tezrisat_Logo_Transparent.png"
                  alt="Tezrisat Platform Interface"
                  style={{ width: "18%", height: "18%", objectFit: "contain" }}
                  className="hidden md:block"
                />
                <span className="text-xl font-bold text-teal-900">
                  Tezrisat
                </span>
              </div>
              <p className="text-teal-700 text-sm">Conquer the unknown!</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-teal-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-teal-700">

            </p>
            <div className="flex gap-4">
              <Link
                to="https://www.linkedin.com/in/emre-%C3%A7amkerten-5bb7aa27b/"
                className="text-teal-700 hover:text-teal-500 transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
