import React from "react";

/**
 * Header Component
 *
 * Displays a welcome message.
 *
 * @returns {JSX.Element} The rendered Header component.
 */
const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center mb-8 top-0 z-20 bg-white/10 backdrop-blur-md p-4 rounded-lg">
      <h1 className="text-3xl font-bold">Welcome!</h1>
    </header>
  );
};

export default Header;
