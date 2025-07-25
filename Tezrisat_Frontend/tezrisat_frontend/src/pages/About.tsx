"use client";

import { useEffect, useState, FC } from "react";
import { Link, useNavigate } from "react-router-dom";
// @ts-ignore
import { Button } from "@/components/ui/button";
// @ts-ignore
import { Card, CardContent } from "@/components/ui/card";
import {AnimatedBlob} from "../components/animated-blob";
import {FloatingShapes} from "../components/floating-shapes";
import { motion } from "framer-motion";

const AboutPage: FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const navigate = useNavigate();

  // Update state when page is scrolled for sticky header styling.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateToSignup = () => {
    navigate("/register");
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900 via-teal-700 to-teal-300 -z-10" />

      {/* Animated Background Elements */}
      <AnimatedBlob className="absolute top-20 left-10 opacity-30 -z-5" />
      <AnimatedBlob className="absolute bottom-40 right-10 opacity-20 -z-5" />
      <FloatingShapes className="absolute inset-0 -z-5" />

      <div className="container relative px-4 py-24 mx-auto max-w-7xl">
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
              {/* Additional navigation links can be added here */}
            </nav>
            <div className="flex gap-4">
              <Button className="bg-teal-200 text-teal-900 hover:bg-teal-100" onClick={navigateToSignup}>
                Get Started
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-6">
            Transforming Learning Through AI
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            We're on a mission to make knowledge accessible, personalized, and engaging through AI-powered microcourses that adapt to your learning style.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-1 gap-12 items-center mb-32">
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl border border-teal-200/50 shadow-xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-teal-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-teal-800">
              <p>
                Founded in 2022, our journey began when a team of educators, technologists, and AI researchers came together with a shared vision: to revolutionize how people learn in the digital age.
              </p>
              <p>
                We noticed that traditional learning methods weren't adapting to the fast-paced, information-rich world we live in. People needed a way to quickly acquire specific knowledge without wading through hours of content or generic courses.
              </p>
              <p>
                That's when we created our AI-powered microcourse generator—a platform that combines cutting-edge language models with educational best practices to create personalized, bite-sized learning experiences on any topic.
              </p>
              <p>
                Today, we're proud to serve thousands of learners worldwide, from students and professionals to lifelong learners and organizations seeking to upskill their teams efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission & Vision</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We're building the future of personalized learning, one microcourse at a time.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
              <CardContent className="p-8 md:p-10">
                <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-teal-900 mb-4">Our Mission</h3>
                <p className="text-teal-800 mb-4">
                  To democratize knowledge by making high-quality, personalized learning accessible to everyone, regardless of their background, location, or resources.
                </p>
                <p className="text-teal-800">
                  We believe that by harnessing the power of AI, we can break down traditional barriers to education and create learning experiences that adapt to individual needs, learning styles, and goals.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
              <CardContent className="p-8 md:p-10">
                <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M12 20v-6M6 20V10M18 20V4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-teal-900 mb-4">Our Vision</h3>
                <p className="text-teal-800 mb-4">
                  A world where anyone can learn anything, anytime, in a way that's perfectly tailored to their needs.
                </p>
                <p className="text-teal-800">
                  We envision a future where AI-powered learning is the norm, not the exception—where personalized microcourses enable continuous learning throughout life, helping people adapt to an ever-changing world and unlock their full potential.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Values</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              These core principles guide everything we do, from product development to customer interactions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Accessibility First",
                description:
                  "We believe knowledge should be accessible to everyone. We design our platform and content to be inclusive, affordable, and available across different devices and learning contexts.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" />
                    <path d="M12 13v8" />
                    <path d="M5 13v6a2 2 0 0 0 2 2h8" />
                  </svg>
                ),
              },
              {
                title: "Educational Excellence",
                description:
                  "We're committed to creating learning experiences that are not just convenient, but truly effective. Every feature and content piece is designed with sound educational principles in mind.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 18v-6" />
                    <path d="M8 18v-1" />
                    <path d="M16 18v-3" />
                  </svg>
                ),
              },
              {
                title: "Ethical AI",
                description:
                  "We develop and use AI responsibly, with transparency about its capabilities and limitations. We prioritize user privacy, data security, and fairness in our algorithms and content generation.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M12 22s8-4 8-10S17.523 2 12 2 4 6.477 4 12s8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                ),
              },
              {
                title: "Continuous Innovation",
                description:
                  "We're never satisfied with the status quo. We constantly push the boundaries of what's possible in AI-powered learning, experimenting with new approaches and technologies to better serve our users.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                title: "User-Centered Design",
                description:
                  "Our users are at the heart of everything we build. We actively seek feedback, conduct user research, and iterate based on real-world usage to create experiences that truly meet learners' needs.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                title: "Quality & Accuracy",
                description:
                  "We're committed to delivering content that's not just engaging but accurate and reliable. We continuously refine our AI models and implement rigorous quality control processes to ensure excellence.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M12 22s8-4 8-10S17.523 2 12 2 4 6.477 4 12s8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                    <path d="m7 16 2 2 6-6" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-teal-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-teal-800">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
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
                    Get Started for Free
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
                <p className="text-teal-700 text-sm">
                  Conquer the unknown!
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-teal-900 mb-4">Platform</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="#how-it-works"
                      className="text-teal-700 hover:text-teal-500 transition-colors"
                    >
                      How It Works
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-teal-900 mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/about"
                      className="text-teal-700 hover:text-teal-500 transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-teal-900 mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="#"
                      className="text-teal-700 hover:text-teal-500 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-teal-700 hover:text-teal-500 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-teal-700 hover:text-teal-500 transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-teal-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-teal-700">
                © {new Date().getFullYear()} Tezrisat. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link to="#" className="text-teal-700 hover:text-teal-500 transition-colors">
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
    </div>
  );
};

export default AboutPage;
