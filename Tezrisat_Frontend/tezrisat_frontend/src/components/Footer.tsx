import { motion } from "framer-motion";

/**
 * Footer Component
 *
 * Renders a responsive footer with navigation links and copyright information.
 * The footer's left margin adjusts based on the sidebar state.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isSidebarOpen - Determines whether the sidebar is open.
 * @returns {JSX.Element} The rendered Footer component.
 */
const Footer = ({ isSidebarOpen }: { isSidebarOpen: boolean; }): JSX.Element => {
  return (
    <motion.footer
      className="bg-white/10 dark:bg-gray-800/90 backdrop-blur-md py-6 px-6 mt-auto transition-all duration-300 ease-in-out"
      initial={false}
      animate={{ marginLeft: isSidebarOpen ? 256 : 80 }} // Adjust margin based on sidebar state
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-4">
        </div>
        <div className="text-sm mt-4 md:mt-0">

        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
