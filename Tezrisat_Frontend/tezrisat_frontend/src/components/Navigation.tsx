"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Home,
  LogOut,
  Moon,
  RefreshCw,
  Sun,
} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import { useDarkModeContext } from "./DarkModeContext.tsx";

/**
 * NavItem Component
 *
 * Renders a navigation item with an icon and label. The label is animated
 * based on the sidebar state.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.icon - The icon to display.
 * @param {string} props.label - The label text.
 * @param {() => void} props.onClick - The click handler.
 * @param {boolean} props.isOpen - Whether the sidebar is open.
 * @returns {JSX.Element} The rendered NavItem component.
 */
// @ts-ignore
const NavItem = ({ icon, label, onClick, isOpen }: { icon: React.ReactNode; label: string; onClick: () => void; isOpen: boolean; }): JSX.Element => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700 cursor-pointer"
    onClick={onClick}
  >
    {icon}
    <AnimatePresence>
      {isOpen && (
        <motion.span
          className="nav-text"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
  </motion.div>
);

/**
 * Navigation Component
 *
 * Renders a sidebar navigation menu with animated items and a dark mode toggle.
 * The sidebar width adjusts based on its open/closed state.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isSidebarOpen - Whether the sidebar is open.
 * @param {(open: boolean) => void} props.setIsSidebarOpen - Function to update sidebar state.
 * @returns {JSX.Element} The rendered Navigation component.
 */
// @ts-ignore
const Navigation = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean; setIsSidebarOpen: (open: boolean) => void; }): JSX.Element => {
  //const [isDarkMode, setIsDarkMode] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkModeContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <motion.nav
      className="h-screen bg-white/10 dark:bg-gray-800/90 backdrop-blur-md p-6 space-y-4 fixed left-0 top-0 bottom-0 transition-all duration-300 ease-in-out overflow-hidden"
      initial={false}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <AnimatePresence>
          {isSidebarOpen && (
              <motion.h2
                  className="text-2xl font-bold"
                  initial={{opacity: 0, x: -20}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: -20}}
                  transition={{duration: 0.2}}
              >
                <button
                    onClick={() => navigate("/home")}
                    className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-gray-700">
                    <img src="../../public/Tezrisat_Logo_Transparent.png" alt="Tezrisat Logo" className="h-13"/>
                </button>
              </motion.h2>
          )}
        </AnimatePresence>
        <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-gray-700"
        >
          {/*<Menu className="w-6 h-6" />*/}
        </button>
      </div>

      {/* Navigation Items */}
      <Link to="/home">
        <NavItem
          icon={<Home className="w-5 h-5" />}
          label="Home"
          onClick={() => {}}
          isOpen={isSidebarOpen}
        />
      </Link>

      <Link to="/plans">
        <NavItem
          icon={<CreditCard className="w-5 h-5" />}
          label="Upgrade"
          onClick={() => {}}
          isOpen={isSidebarOpen}
        />
      </Link>

      <Link to="/billing">
        <NavItem
          icon={<RefreshCw className="w-5 h-5" />}
          label="Billing"
          onClick={() => {}}
          isOpen={isSidebarOpen}
        />
      </Link>

      <Link to="">
        <NavItem
          icon={isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          label={isDarkMode ? "Light Mode" : "Dark Mode"}
          onClick={toggleDarkMode}
          isOpen={isSidebarOpen}
        />
      </Link>

      <Link to="/logout">
        <NavItem
          icon={<LogOut className="w-5 h-5" />}
          label="Logout"
          onClick={() => {}}
          isOpen={isSidebarOpen}
        />
      </Link>
    </motion.nav>
  );
};

export default Navigation;
