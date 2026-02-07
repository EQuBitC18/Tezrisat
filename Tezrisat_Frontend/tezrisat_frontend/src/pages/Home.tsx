"use client";

// @ts-expect-error
import api from '../api';
import { useEffect, useState, FC } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import ScrollProgressBar from '../components/ScrollProgressBar';
import Background from '../components/Background';

/** Type definitions for course, card, and deck */
interface Course {
  id: number;
  title: string;
  content: string;
}

interface Card {
  id: number;
  title: string;
  content: string;
}

interface Deck {
  title: string;
  cards: Card[];
}

interface CardDeckProps {
  title: string;
  cards: Card[];
  onCardClick?: (card: Card) => void;
  onDelete?: (card: Card) => void;
}

/**
 * CardDeck Component
 *
 * Renders a deck (group) of cards with a title.
 */
const CardDeck: FC<CardDeckProps> = ({
  cards,
  onCardClick = () => {},
  onDelete = () => {},
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 dark:bg-gray-600 dark:hover:bg-gray-700 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8"
    >
      <div className="flex flex-wrap gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="group relative bg-white/30 dark:bg-gray-600 dark:hover:bg-gray-700 p-6 rounded-2xl cursor-pointer flex-1"
            onClick={() => onCardClick(card)}
          >
            <div className="flex items-center justify-center group-hover:justify-between w-full transition-all duration-300">
              <h3 className="text-2xl font-semibold">{card.title}</h3>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(card);
                  }}
                  className="text-gray-800 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                >
                  <Trash2 className="w-5 h-5" />
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
 */
const Dashboard: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [decks, setDecks] = useState<Deck[]>([]);
  const navigate = useNavigate();

  /**
   * Transforms raw course data into deck format.
   *
   * @param data Array of Course objects fetched from the API.
   * @returns An array of Deck objects.
   */
  const transformData = (data: Course[]): Deck[] => {
    return data.map((course) => ({
      title: course.title,
      cards: [{ id: course.id, title: course.title, content: course.content }],
    }));
  };

  // Fetch courses once when the component mounts.
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/microcourses/');
        const transformedDecks = transformData(response.data);
        setDecks(transformedDecks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCourses();
  }, []);


  /**
   * Navigates to the specific microcourse detail page.
   *
   * @param deck The deck whose card will be used to navigate.
   */
  const handleNavigateToMicrocourse = (deck: Deck) => {
    const courseId = deck.cards[0].id;
    navigate(`/microcourse/${courseId}`, { state: { id: courseId } });
  };

  /**
   * Deletes a microcourse and updates the UI state.
   *
   * @param deck The deck to be deleted.
   */
  const handleDeleteMicrocourse = async (deck: Deck) => {
    const microcourseId = deck.cards[0].id;
    try {
      await api.delete(`/api/delete_microcourse/${microcourseId}/`);
      setDecks((prevDecks) => prevDecks.filter((d) => d.cards[0].id !== microcourseId));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error deleting microcourse:", message);
    }
  };

  /**
   * Handler for creating a new microcourse.
   * Checks for the free plan limit before navigation.
   */
  const handleAddNewMicrocourse = () => {
    navigate('/mc-builder-welcome');
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {/* Progress Indicator & Background */}
      <ScrollProgressBar />
      <Background />

      <div className="relative z-10 flex flex-1">
        <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <motion.main
          className="flex-1 p-6 transition-all duration-300 ease-in-out"
          initial={false}
          animate={{ marginLeft: isSidebarOpen ? 256 : 80 }}
        >
          <Header />

          {/* Render Microcourse Decks */}
          <div className="flex flex-wrap gap-4">
            {decks.map((deck, index) => (
              <CardDeck
                key={index}
                title={deck.title}
                cards={deck.cards}
                onCardClick={() => handleNavigateToMicrocourse(deck)}
                onDelete={() => handleDeleteMicrocourse(deck)}
              />
            ))}
          </div>

          {/* "Add New Microcourse" Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-lg shadow-lg mb-8 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center h-40">
              <button
                type="button"
                onClick={handleAddNewMicrocourse}
                className="w-full bg-teal-600 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
              >
                <Plus className="w-12 h-12" />
                <h2 className="text-2xl font-semibold ml-4">Add New Microcourse</h2>
              </button>
            </div>
          </motion.div>
        </motion.main>
      </div>

      {/* Footer */}
      <Footer isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default Dashboard;
