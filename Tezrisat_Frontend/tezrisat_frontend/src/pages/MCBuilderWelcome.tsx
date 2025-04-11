"use client";

import { useState, FC } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollProgressBar from "../components/ScrollProgressBar";
import Background from "../components/Background";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MicrocourseBuilderWelcome: FC = () => {
  // Sidebar visibility state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  /**
   * Navigates to the Microcourse Builder Basis page
   * when the user clicks the start button.
   */
  const handleClick = (): void => {
    navigate("/mc-builder-basis");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {/* Progress Indicator and Background */}
      <ScrollProgressBar />
      <Background />

      {/* Main Content */}
      <div className="relative z-10 flex flex-1">
        <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <motion.main
          className="flex-1 p-6 transition-all duration-300 ease-in-out"
          initial={false}
          animate={{ marginLeft: isSidebarOpen ? 256 : 80 }}
        >
          <Header />

          {/* Welcome Message & Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md p-12 rounded-lg shadow-lg mb-8 text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Welcome to Microcourse Builder!</h2>
            <p className="text-xl mb-8">Let's set up your microcourse step-by-step.</p>
            <button
              onClick={handleClick}
              type="button"
              className="w-full bg-teal-600 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
            >
              Start
              <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
            </button>
          </motion.div>
        </motion.main>
      </div>

      {/* Footer */}
      <Footer isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default MicrocourseBuilderWelcome;
