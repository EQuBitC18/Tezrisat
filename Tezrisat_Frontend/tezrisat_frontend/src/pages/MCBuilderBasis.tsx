"use client";

import React, { useState, FC } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollProgressBar from "../components/ScrollProgressBar";
import Background from "../components/Background";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
//import api from "../api";

/** Interface for the new microcourse data */
interface NewMicrocourse {
  title: string;
  topic: string;
  complexity: string;
  targetAudience: string;
  openaiKey: string;
}

const MicrocourseSetup: FC = () => {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Form input states
  const [title, setTitle] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [complexity, setComplexity] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [openaiKey, setOpenaiKey] = useState<string>("");
  const [keyError, setKeyError] = useState<string>("");

  const navigate = useNavigate();

  /**
   * Handles form submission by building a new microcourse object
   * and navigating to the next step with the new microcourse data.
   *
   * @param e - React form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const keyPattern = /^sk-[A-Za-z0-9]{32,}$/;
    if (!keyPattern.test(openaiKey)) {
      setKeyError("Please enter a valid OpenAI API key");
      return;
    }
    setKeyError("");

    const newMicrocourse: NewMicrocourse = {
      title,
      topic,
      complexity,
      targetAudience,
      openaiKey,
    };

    try {
      // Optionally post the new microcourse data to an API endpoint:
      // const response = await api.post('/api/add_microcourse/', newMicrocourse);
      // console.log("API response:", response.data);

      // Navigate to the next step, passing new microcourse data in state
      navigate("/mc-builder-basis-two", { state: { newMicrocourse } });
    } catch (error) {
      console.error("Error creating microcourse:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {/* Progress Indicator and Background */}
      <ScrollProgressBar />
      <Background />

      <div className="relative z-10 flex flex-1">
        {/* Sidebar Navigation */}
        <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 ml-64">
          {/* Page Header */}
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
                  placeholder="e.g., Functional Components and Hooks"
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
                <label htmlFor="targetAudience" className="block text-sm font-medium mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  id="targetAudience"
                  name="targetAudience"
                  required
                  placeholder="e.g., Junior developers, UX designers"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {/* OpenAI API Key */}
              <div>
                <label htmlFor="openaiKey" className="block text-sm font-medium mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="text"
                  id="openaiKey"
                  name="openaiKey"
                  required
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {keyError && (
                  <p className="text-red-500 text-sm mt-1">{keyError}</p>
                )}
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
};

export default MicrocourseSetup;
