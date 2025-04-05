"use client"

import { useState, useEffect, useRef, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {ArrowRight, MessageCircle, X} from "lucide-react"
// @ts-ignore
import { Button } from "@/components/ui/button"
// @ts-ignore
import { Input } from "@/components/ui/input"
import ScrollProgressBar from "../components/ScrollProgressBar"
import Background from "../components/Background"
import Navigation from "../components/Navigation"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useLocation } from "react-router-dom"
import "katex/dist/katex.min.css"
import { v4 as uuidv4 } from "uuid"
import QuizModal from "./QuizModal.tsx"
import RecallNotesModal from "./RecallNotesModal.tsx"
import GlossaryModal from "./GlossaryModal.tsx"
// @ts-ignore
import api from "../api"

import ChapterTextField from "../components/ChapterTextField.tsx"
import ChatMessages from "../components/ChatMessages.tsx";
import Confetti from "react-confetti"

// -----------------------------------------------------------------------------
// Parsing Helper Functions & Types
// -----------------------------------------------------------------------------

export interface RecallNote {
  id: string
  content: string
  timestamp: string
}

export interface QuizQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}

export interface GlossaryTerm {
  id: string
  term: string
  definition: string
}


/**
 * Parses a string of recall notes into an array of RecallNote objects.
 *
 * @param {string} recallNotesString - The raw recall notes string.
 * @returns {RecallNote[]} Parsed array of recall notes.
 */
export const parseRecallNotes = (recallNotesString: string): RecallNote[] => {
  try {
    const notesArray = JSON.parse(recallNotesString)
    if (Array.isArray(notesArray)) {
      return notesArray.map((note: any) => ({
        id: uuidv4(),
        content: typeof note === "string" ? note.trim() : JSON.stringify(note),
        timestamp: new Date().toLocaleString(),
      }))
    }
  } catch (error) {
    console.error("JSON parsing failed for recall notes, falling back to regex:", error)
  }

  // Fallback: parse bullet points (e.g. lines starting with "-" or similar)
  const bulletPoints = recallNotesString.match(/^-+\s*(.*)/gm)
  if (!bulletPoints) return []
  return bulletPoints.map((line) => {
    const contentMatch = line.match(/^-+\s*(.*)/)
    const content = contentMatch ? contentMatch[1].trim() : ""
    return {
      id: uuidv4(),
      content,
      timestamp: new Date().toLocaleString(),
    }
  })
}


/**
 * Parses a quiz string into an array of QuizQuestion objects.
 *
 * @param {string} quizString - The raw quiz string.
 * @returns {QuizQuestion[]} Parsed array of quiz questions.
 */
export const parseQuiz = (quizString: string): QuizQuestion[] => {
  try {
    // Parse the JSON string from the backend (like '{"question":"...","options":{"A":"...","B":"..."},"correct_answer":"A"}')
    const quizObj = JSON.parse(quizString)

    const { question, options, correct_answer } = quizObj

    // Convert the single-letter correct answer (e.g. "A") to an array index
    const letter = (correct_answer || "A").toUpperCase()
    const correctIndex = letter.charCodeAt(0) - "A".charCodeAt(0)

    // Convert the options object ({"A":"James","B":"Larry",...}) into an array
    // e.g. ["James Gosling", "Larry Ellison", "Bill Gates", "Steve Jobs"]
    const optionsArray = [
      options["A"] || "Option A",
      options["B"] || "Option B",
      options["C"] || "Option C",
      options["D"] || "Option D",
    ]

    // Return a single-element array with the quiz question
    return [
      {
        id: uuidv4(),
        text: question || "No question provided.",
        options: optionsArray,
        correctAnswer: correctIndex,
      },
    ]
  } catch (error) {
    console.error("Error parsing quiz JSON:", error)
    // If parsing fails, return an empty array or fallback
    return []
  }
}

/**
 * Parses a glossary string into an array of GlossaryTerm objects.
 *
 * @param {string} glossaryString - The raw glossary string.
 * @returns {GlossaryTerm[]} Parsed array of glossary terms.
 */
export const parseGlossary = (glossaryString: string): GlossaryTerm[] => {
  try {
    // Parse the glossary JSON string from the backend
    const glossaryObj = JSON.parse(glossaryString)
    // Convert each key/value into a GlossaryTerm object
    return Object.entries(glossaryObj).map(([key, value]) => ({
      id: uuidv4(),
      term: key,
      // If value is a string, use it directly; otherwise convert to string
      definition: typeof value === "string" ? value : String(value),
    }))
  } catch (error) {
    console.error("Error parsing glossary JSON:", error)
    // If parsing fails, return an empty array or fallback
    return []
  }
}





export default function Microcourse() {
  const location = useLocation()
  const { id } = location.state || {}

  const [showConfetti, setShowConfetti] = useState(false);
  const [fadeConfetti, setFadeConfetti] = useState(false);
  const [confettiRun, setConfettiRun] = useState(true);

  // Microcourse-level data
  const [microcourseTitle, setMicrocourseTitle] = useState("Loading...")
  //@ts-ignore
  const [data, setData] = useState<any>(null)

  // This will hold an array of "sections" for the microcourse
  // each "section" object can have fields: { section_title, content, code_examples, math_expressions, ... }
  const [chapters, setChapters] = useState<any[]>([])

  // Modal states (vocabulary, quiz, recall notes)
  const [modalChapters, setModalChapters] = useState<any[]>([])
  const [glossaryTerms, setGlossaryTerms] = useState<any[]>([])
  const [quizQuestions, setQuizQuestions] = useState<any[]>([])
  const [recallNotes, setRecallNotes] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("")
  //@ts-ignore
  const [modalContent, setModalContent] = useState({ title: "", content: "" })

  // Other states for chat, etc.
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! How can I assist you with the course?" }])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  //const [activeChapter, setActiveChapter] = useState(0)
  const contentRef = useRef(null)

  useEffect(() => {
    const hasShownConfetti = localStorage.getItem("hasShownConfettiForMicrocourse");
    if (!hasShownConfetti) {
      setShowConfetti(true);
      localStorage.setItem("hasShownConfettiForMicrocourse", "true");

      // After 10 seconds, stop the confetti animation (stop generating new pieces)
      const stopAnimationTimeout = setTimeout(() => {
        setConfettiRun(false); // Stop the animation
      }, 10000);

      // After 10 seconds, start fade out of container over 5 seconds
      const fadeTimeout = setTimeout(() => {
        setFadeConfetti(true);
      }, 10000);

      // After 15 seconds total, unmount the confetti component
      const hideTimeout = setTimeout(() => {
        setShowConfetti(false);
      }, 15000);

      return () => {
        clearTimeout(stopAnimationTimeout);
        clearTimeout(fadeTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, []);

  // ---------------------------
  // FETCH Microcourse on mount
  // ---------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/microcourses/${id}/`)
        const mcData = response.data
        console.log("Raw microcourse data from backend:", mcData)

        // Top-level info
        setMicrocourseTitle(mcData.title || "Untitled Microcourse")
        setData(mcData)

        // Map sections, now including nested arrays from related models:
        const sectionsArray = mcData.sections.map((sec: any) => ({
          id: sec.id,
          title: sec.section_title || "Untitled Section",
          content: sec.content || "No content provided.",
          // These fields are still stored as text and parsed as before:
          codeExamples: sec.code_examples ? JSON.parse(sec.code_examples) : [],
          mathExpressions: sec.math_expressions ? JSON.parse(sec.math_expressions) : [],
          // New normalized fields: use the nested arrays returned by the serializer
          glossary_terms: sec.glossary_terms || [],
          quiz_questions: sec.quiz_questions || [],
          recall_notes: sec.recall_notes || [],
        }));

        setChapters(sectionsArray);

        // Aggregate glossary, quiz, and recall notes from all sections
        if (mcData.sections.length > 0) {
          let aggregatedGlossaryTerms: GlossaryTerm[] = [];
          let aggregatedQuizQuestions: QuizQuestion[] = [];
          let aggregatedRecallNotes: RecallNote[] = [];

          mcData.sections.forEach((section: any) => {
            if (section.glossary_terms) {
              aggregatedGlossaryTerms = aggregatedGlossaryTerms.concat(section.glossary_terms);
            }
            if (section.quiz_questions) {
              const convertedQuizQuestions = section.quiz_questions.map((q: any) => {
                let opts = [];
                // If options is already an array, use it.
                if (Array.isArray(q.options)) {
                  opts = q.options;
                } else if (typeof q.options === 'object' && q.options !== null) {
                  // If it's an object, assume keys "A", "B", "C", "D"
                  opts = [
                    q.options.A || "Option A",
                    q.options.B || "Option B",
                    q.options.C || "Option C",
                    q.options.D || "Option D",
                  ];
                } else if (typeof q.options === 'string') {
                  try {
                    const parsed = JSON.parse(q.options);
                    if (Array.isArray(parsed)) {
                      opts = parsed;
                    } else if (typeof parsed === 'object' && parsed !== null) {
                      opts = [
                        parsed.A || "Option A",
                        parsed.B || "Option B",
                        parsed.C || "Option C",
                        parsed.D || "Option D",
                      ];
                    }
                  } catch (e) {
                    opts = [];
                  }
                }
                return {
                  id: q.id,
                  text: q.question, // renaming "question" to "text"
                  options: opts,
                  correctAnswer: q.correct_answer, // renaming to correctAnswer
                };
              });
              aggregatedQuizQuestions = aggregatedQuizQuestions.concat(convertedQuizQuestions);
            }
            if (section.recall_notes) {
              aggregatedRecallNotes = aggregatedRecallNotes.concat(section.recall_notes);
            }
          });

          setGlossaryTerms(aggregatedGlossaryTerms);
          setQuizQuestions(aggregatedQuizQuestions);
          setRecallNotes(aggregatedRecallNotes);
        }


        // For modalChapters, use the first section's nested arrays (stringify them)
        setModalChapters([
          { title: "Glossary", content: JSON.stringify(mcData.sections[0]?.glossary_terms || []) },
          { title: "Quiz", content: JSON.stringify(mcData.sections[0]?.quiz_questions || []) },
          { title: "Recall Notes", content: JSON.stringify(mcData.sections[0]?.recall_notes || []) },
        ]);

      } catch (error) {
        console.error("Error fetching microcourse data:", error)
      }
    }
    fetchData()
  }, [id])


  const handleAddNote = (content: string) => {
    const newNote = {
      id: uuidv4(),
      content,
      timestamp: new Date().toLocaleString(),
    }
    setRecallNotes([...recallNotes, newNote])
  }

  const handleDeleteNote = (id: string) => {
    setRecallNotes(recallNotes.filter((note) => note.id !== id))
  }

  const handleAddTerm = (newTerm: GlossaryTerm) => {
    setGlossaryTerms([...glossaryTerms, newTerm])
  }

  const handleDeleteTerm = (id: string) => {
    setGlossaryTerms(glossaryTerms.filter((term) => term.id !== id))
  }

  const openModal = (type: string, title = "", content = "") => {
    setModalType(type)
    setModalContent({ title, content })
    setIsModalOpen(true)
  }

  const sendText = async () => {
    if (question.trim() === "") return;
    const currentQuestion = question;
    setQuestion(""); // Clear the input immediately
    setMessages([...messages, { sender: "user", text: currentQuestion }]);
    try {
      const response = await api.post("/api/agent_response/", { question: currentQuestion, id });
      const botResponse = response.data.answer;
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Error creating microcourse:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    }
  }

  const scrollToChapter = (index: number) => {
    // e.g. scroll to a heading
    //@ts-ignore
    const chapterElements = contentRef.current?.querySelectorAll("h3")
    if (chapterElements && chapterElements[index]) {
      ;(chapterElements[index] as HTMLElement).scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleGoInDepth = async (chapterIndex: number) => {
    try {
      // Get the chapter you want to extend
      const chapterToExtendContent = chapters[chapterIndex].content

      // Call your API to generate the next section; adjust the endpoint and payload as needed
      const response = await api.post('/api/generate_next_section/', { previousSection: chapterToExtendContent, microcourseId: id })
      // Assume the API returns a new section object with keys: section_title, content, codeExamples, mathExpressions, etc.
      const newSection = response.data
      console.log("newSection ", newSection)
      // Append the new section to the chapters list
      //setChapters((prevChapters) => [...prevChapters, newSection])

      window.location.reload();
    } catch (error) {
      console.error("Error generating next section:", error)
    }
  }

  // @ts-ignore
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {/* 4) Conditionally render confetti */}
      {showConfetti && (
        <div
          style={{
            opacity: fadeConfetti ? 0 : 1,
            transition: "opacity 5s ease",
          }}
        >
          <Confetti
            numberOfPieces={500}
            run={confettiRun}
            recycle={false} // Disable recycling so no new pieces are added once run is false
          />
        </div>
      )}
      <ScrollProgressBar />
      <Background />
      <div className="flex flex-1 overflow-hidden">
        <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <motion.main
          className="flex-1 p-6 transition-all duration-300 ease-in-out"
          initial={false}
          animate={{ marginLeft: isSidebarOpen ? 256 : 80 }}
        >
          <Header />
          <div className="flex-1 flex overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
                  {microcourseTitle}
                </h2>
                <div ref={contentRef} className="space-y-8">
                  {chapters.map((chapter, index) => (
                    <div key={index} className="mb-8">
                      <ChapterTextField
                        chapter={chapter.title}
                        content={chapter.content}
                        codeExamples={chapter.codeExamples}
                        mathExpressions={chapter.mathExpressions}
                      />
                      {/* Only render the "Go in-depth" button if this is the LAST chapter */}
                      {index === chapters.length - 1 && (
                        <button
                          className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 relative z-50"
                          onClick={() => handleGoInDepth(index)}
                        >
                          Go in-depth
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-64 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md p-4 overflow-y-auto">
              <div className="space-y-4">
                {modalChapters.map((chapter, index) => (
                  <Button
                    key={index}
                    onClick={() => openModal(chapter.title, chapter.content)}
                    className="w-full bg-teal-600 dark:bg-gray-600 hover:bg-teal-700 dark:hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    {chapter.title}
                  </Button>
                ))}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Chapters</h3>
                  <ul className="space-y-2">
                    {chapters.map((chapter, index) => (
                      <li key={index}>
                        <button
                          onClick={() => scrollToChapter(index)}
                          className="text-left w-full p-2 rounded-md transition-colors hover:bg-white/10 dark:hover:bg-gray-700/30 text-gray-800 dark:text-white"
                        >
                          {chapter.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.main>
      </div>
      {/* Chatbot Interface */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 right-0 w-96 bg-white/10 dark:bg-gray-800/90
                       backdrop-blur-md rounded-tl-lg overflow-hidden z-30"
          >
            <div className="p-4">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Course Assistant
                </h3>
                <button onClick={() => setIsChatOpen(false)}>
                  <X className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
              </div>

              {/* -- Use the ChatMessages component -- */}
              <ChatMessages messages={messages} />

              {/* Input + Arrow Button */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full pr-10 bg-white/20 dark:bg-gray-700/50
                             focus:outline-none focus:ring-2 focus:ring-teal-500
                             text-gray-800 dark:text-white placeholder-gray-500
                             dark:placeholder-gray-400"
                  value={question}
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setQuestion(e.target.value)}
                  onKeyDown={(e: { key: string; preventDefault: () => void }) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendText();
                    }
                  }}
                />
                <button
                  onClick={sendText}
                  className="absolute right-2 top-1/2 -translate-y-1/2
                             text-gray-600 hover:text-gray-800 dark:text-gray-300
                             dark:hover:text-gray-100"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Chat Toggle Button */}
      {!isChatOpen && (
          <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-4 right-4 bg-teal-600 dark:bg-gray-600 hover:bg-teal-700
                     dark:hover:bg-gray-700 text-white p-3 rounded-full shadow-lg z-40"
        >
          <MessageCircle />
        </button>
      )}
      <Footer isSidebarOpen={isSidebarOpen} />
      {/* Modal Components */}
      {/* @ts-ignore */}
      <QuizModal isOpen={isModalOpen && modalType === 'Quiz'} onClose={() => setIsModalOpen(false)} questions={quizQuestions} />
      {/* @ts-ignore */}
      <RecallNotesModal isOpen={isModalOpen && modalType === 'Recall Notes'} onClose={() => setIsModalOpen(false)} sectionId={chapters.length > 0 ? chapters[chapters.length - 1].id : ""} notes={recallNotes} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} />
      {/* @ts-ignore */}
      <GlossaryModal isOpen={isModalOpen && modalType === 'Glossary'} onClose={() => setIsModalOpen(false)} terms={glossaryTerms} onAddTerm={handleAddTerm} onDeleteTerm={handleDeleteTerm} />
    </div>
  )
}
