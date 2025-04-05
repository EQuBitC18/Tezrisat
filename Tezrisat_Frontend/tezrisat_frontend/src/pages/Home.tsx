"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import ScrollProgressBar from "../components/ScrollProgressBar.tsx";
import Background from "../components/Background.tsx";
import Navigation from "../components/Navigation.tsx";
import {useNavigate} from "react-router-dom";
// @ts-ignore
import api from "../api";
import { Trash2 } from "lucide-react"



// TODO Design the "Settings" Page 🟡
// TODO Design the "Profile" Page ✅
// TODO Add a payment page ✅
// TODO Improve the sidebar-main collapse ✅
// TODO Add user-specific greeting in the header ✅
// TODO Improve Dark Mode ✅


/**
 * CardDeck Component
 *
 * Renders a deck (group) of cards with a title.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.title - Title of the deck.
 * @param {Array} props.cards - Array of card objects.
 * @returns {JSX.Element} The rendered CardDeck component.
 */
// @ts-ignore
const CardDeck = ({
  //title,
  cards,
  onCardClick,
  //onEdit,
  onDelete,
}: {
  title: string;
  cards: Array<any>;
  // Parent can pass these callbacks
  onCardClick?: (card: any) => void;
  onEdit?: (card: any) => void;
  onDelete?: (card: any) => void;
}): JSX.Element => {
  // Provide default no-op callbacks if none are passed
  const handleCardClick = onCardClick || (() => {});
  //const handleEdit = onEdit || (() => {});
  const handleDelete = onDelete || (() => {});

  return (
      <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
          className="bg-white/10 dark:bg-gray-600 dark:hover:bg-gray-700 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8"
      >
        <div className="flex flex-wrap gap-4">
          {cards.map((card, index) => (
              <motion.div
                  key={index}
                  whileHover={{scale: 1.05}}
                  className="group relative bg-white/30 dark:bg-gray-600 dark:hover:bg-gray-700 p-6 rounded-2xl cursor-pointer flex-1"
                  onClick={() => handleCardClick(card)}
              >
                <div
                    className="flex items-center justify-center group-hover:justify-between w-full transition-all duration-300">
                  <h3 className="text-2xl font-semibold">{card.title}</h3>
                  <div
                      className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4">
                    <motion.button
                        whileHover={{scale: 1.2}}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(card);
                        }}
                        className="text-gray-800 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5"/>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
          ))}
        </div>
      </motion.div>
  );
};

/**
 * Dashboard Component
 *
 * Displays a list of microcourse decks retrieved from the API along with an option
 * to add a new microcourse deck.
 *
 * @returns {JSX.Element} The rendered Dashboard component.
 */
export default function Dashboard(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  //const [isDarkMode] = useState(false);
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  /**
   * Transforms fetched data into a deck structure.
   *
   * @param {any[]} data - The raw microcourse data.
   * @returns {Array} An array of deck objects.
   */
  const transformData = (
      data: React.SetStateAction<null> | { id: any; title: any; content: any }[]
  ) => {
    // @ts-ignore
    return data.map((course: { id: any; title: any; content: any }) => ({
      title: course.title,
      cards: [{id: course.id, title: course.title, content: course.content}],
    }));
  };

  // Fetch microcourse data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: { data: React.SetStateAction<null> } = await api.get(
            "/api/microcourses/"
        );
        const transformedDecks = transformData(response.data);
        setDecks(transformedDecks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Toggle dark mode class on document root
  //useEffect(() => {
  //  if (isDarkMode) {
  //    document.documentElement.classList.add("dark");
  //  } else {
  //    document.documentElement.classList.remove("dark");
  //  }
  //}, [isDarkMode]);

  /**
   * Navigates to the microcourse builder welcome page.
   */
  const navigate_to_microcourse_builder_welcome = () => {
    navigate("/mc-builder-welcome");
  };

  /**
   * Navigates to a specific microcourse based on the selected deck.
   *
   * @param {Object} deck - The deck object.
   */
  const navigate_to_microcourse = (deck: any) => {
    const id = deck.cards[0].id;
    navigate(`/microcourse/${id}`, { state: { id } });
  };

  const handleDeleteMicrocourse = async (deck: any) => {
    const microcourseId = deck.cards[0].id; // assuming the deck's card id is the microcourse id
    try {
      await api.delete(`/api/delete_microcourse/${microcourseId}/`);
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting microcourse:", error.message || error);
    }
  };

  return (
      <div className={`min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300`}>
        {/* Scroll Progress Bar */}
        <ScrollProgressBar/>

        {/* Animated Blob Background */}
        <Background/>

        {/* Main Content */}
        <div className="relative z-10 flex flex-1">
          {/* Sidebar Navigation */}
          <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>

          {/* Main Content Area */}
          <motion.main
              className="flex-1 p-6 transition-all duration-300 ease-in-out"
              initial={false}
              animate={{marginLeft: isSidebarOpen ? 256 : 80}}
          >
            <Header/>

            {/* Render Card Decks */}
            <div className="flex flex-wrap gap-4">
              {decks.map((deck, index) => (
                  <CardDeck
                      key={index}
                      //@ts-ignore
                      title={deck.title}
                      //@ts-ignore
                      cards={deck.cards}
                      //@ts-ignore
                      onCardClick={(card) => {
                        // Navigate to microcourse
                        navigate_to_microcourse(deck);
                      }}
                      onEdit={(card) => {
                        // Example edit logic
                        console.log("Edit card:", card);
                        // e.g. navigate("/microcourse-edit/" + card.id);
                      }}
                      onDelete={(card) => {
                        console.log("Delete card:", card);
                        handleDeleteMicrocourse(deck);
                      }}
                  />
              ))}
            </div>


            {/* "Add New Microcourse" Deck */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="bg-white/10 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-lg shadow-lg mb-8 cursor-pointer"
                whileHover={{scale: 1.02}}
            >
              <div className="flex items-center justify-center h-40">
                <button
                    onClick={navigate_to_microcourse_builder_welcome}
                    type="submit"
                    className="w-full bg-teal-600 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
                >
                  <Plus className="w-12 h-12"/>
                  <h2 className="text-2xl font-semibold ml-4">Add New Microcourse</h2>
                </button>
              </div>
            </motion.div>
          </motion.main>
        </div>

        {/* Footer */}
        <Footer isSidebarOpen={isSidebarOpen}/>
      </div>
  )
}