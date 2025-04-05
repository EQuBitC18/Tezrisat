import React, { useEffect, useState } from "react";

/**
 * ScrollProgressBar Component
 *
 * Renders a fixed progress bar at the top of the page that visually indicates
 * the user's current scroll progress as a percentage of the total scrollable height.
 *
 * @returns {JSX.Element} A progress bar element.
 */
const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    /**
     * Updates the scroll progress state based on the current scroll position.
     */
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.pageYOffset;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-white z-50"
      style={{ width: `${scrollProgress}%` }}
    />
  );
};

export default ScrollProgressBar;
