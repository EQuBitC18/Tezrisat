"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollProgressBar from "../components/ScrollProgressBar.tsx";
import Background from "../components/Background.tsx";
import Navigation from "../components/Navigation.tsx";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
// @ts-ignore
import api from "../api";

/**
 * NavItem Component
 *
 * Renders a navigation item with an icon and label.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.icon - The icon component.
 * @param {string} props.label - The label text.
 */

/**
 * MicrocourseSetup Component
 *
 * Provides a form for users to enter basic microcourse information.
 * Upon submission, the new microcourse data is passed to the next step in the builder.
 *
 * @returns {JSX.Element} The rendered MicrocourseSetup component.
 */
export default function MicrocourseSetup() {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Form input states
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [complexity, setComplexity] = useState("");
  const [target_audience, setTargetAudience] = useState("");
  const navigate = useNavigate();

  /**
   * Handles form submission by building a new microcourse object
   * and navigating to the next step with the new microcourse data.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMicrocourse = {
      title,
      topic,
      complexity,
      target_audience,
    };
    try {
      // Optionally, you can send the data to an API endpoint here
      // const response = await api.post('/api/add_microcourse/', newMicrocourse);
      // console.log(response.data);
      navigate("/mc-builder-basis-two", { state: { newMicrocourse } });
    } catch (error) {
      console.error("Error creating microcourse:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Animated Blob Background */}
      <Background />

      {/* Main Content */}
      <div className="relative z-10 flex flex-1">
        {/* Sidebar Navigation */}
        <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 ml-64">
          {/* Header */}
          <Header />

          {/* Microcourse Setup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Building Your Microcourse</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Microcourse Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Microcourse Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="e.g., Introduction to React Hooks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {/* Microcourse Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium mb-2">
                  Microcourse Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  required
                  placeholder="e.g., Introduction to React Hooks"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {/* Complexity Level */}
              <div>
                <label htmlFor="complexity" className="block text-sm font-medium mb-2">
                  Complexity Level
                </label>
                <input
                  type="text"
                  id="complexity"
                  name="complexity"
                  required
                  placeholder="e.g., Beginner, Intermediate, Advanced"
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {/* Target Audience */}
              <div>
                <label htmlFor="target_audience" className="block text-sm font-medium mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  id="target_audience"
                  name="target_audience"
                  required
                  placeholder="e.g., Junior developers, UX designers"
                  value={target_audience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-teal-600 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
                >
                  Next
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <Footer isSidebarOpen={isSidebarOpen} />
    </div>
  );
}
