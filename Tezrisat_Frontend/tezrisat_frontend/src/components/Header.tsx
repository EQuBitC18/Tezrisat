import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
// @ts-ignore
import api from "../api";
import { useNavigate } from "react-router-dom";

/**
 * Header Component
 *
 * Displays a welcome message with the current user's name and a profile button.
 * The user's name is fetched from the API endpoint `/api/get_currentuser/`.
 *
 * @returns {JSX.Element} The rendered Header component.
 */
const Header: React.FC = () => {
  // @ts-ignore
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  /**
   * Navigates the user to the profile page.
   */
  // @ts-ignore
  const navigate_to_profile = () => {
    navigate(`/profile`);
  };

  useEffect(() => {
    /**
     * Fetches the current user's information from the API.
     */
    const fetchData = async () => {
      try {
        const response = await api.get("/api/get_currentuser/");
        // @ts-ignore
        setUser(response.data.username);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <header className="flex justify-between items-center mb-8 top-0 z-20 bg-white/10 backdrop-blur-md p-4 rounded-lg">
      <h1 className="text-3xl font-bold">Welcome, {user}!</h1>
      <div className="flex items-center space-x-2">
        <button onClick={navigate_to_profile} type="submit">
          <User className="w-8 h-8 bg-white/20 rounded-full p-1" />
        </button>
      </div>
    </header>
  );
};

export default Header;
