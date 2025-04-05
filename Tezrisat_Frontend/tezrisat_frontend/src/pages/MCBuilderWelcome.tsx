"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollProgressBar from "../components/ScrollProgressBar.tsx";
import Background from "../components/Background.tsx";
import Navigation from "../components/Navigation.tsx";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

/**
 * MicrocourseBuilder Component
 *
 * Renders the welcome screen for the Microcourse Builder. It displays a header,
 * animated background, a welcome message, and a button to proceed to the next step.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function MicrocourseBuilder() {
  // State to track if the sidebar is open
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  /**
   * Handles click events to navigate to the microcourse builder basis page.
   */
  const handleClick = () => {
    navigate("/mc-builder-basis");
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
        <motion.main
          className="flex-1 p-6 transition-all duration-300 ease-in-out"
          initial={false}
          animate={{ marginLeft: isSidebarOpen ? 256 : 80 }}
        >
          {/* Header */}
          <Header />

          {/* Welcome Message and Proceed Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md p-12 rounded-lg shadow-lg mb-8 text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Welcome to Microcourse Builder!</h2>
            <p className="text-xl mb-8">Let's set up your microcourse step-by-step.</p>
            <div>
              <button
                onClick={handleClick}
                type="submit"
                className="w-full bg-teal-600 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
              >
                Start
                <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.main>
      </div>

      {/* Footer */}
      <Footer isSidebarOpen={isSidebarOpen} />
    </div>
  );
}
