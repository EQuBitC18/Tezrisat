"use client"

import { useState, useEffect, useRef, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2, MessageCircle, X } from "lucide-react"
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
import ChatMessages from "../components/ChatMessages.tsx"
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
    // Parse the JSON string from the backend
    const quizObj = JSON.parse(quizString)
    const { question, options, correct_answer } = quizObj
    const letter = (correct_answer || "A").toUpperCase()
    const correctIndex = letter.charCodeAt(0) - "A".charCodeAt(0)
    const optionsArray = [
      options["A"] || "Option A",
      options["B"] || "Option B",
      options["C"] || "Option C",
      options["D"] || "Option D",
    ]
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
    const glossaryObj = JSON.parse(glossaryString)
    return Object.entries(glossaryObj).map(([key, value]) => ({
      id: uuidv4(),
      term: key,
      definition: typeof value === "string" ? value : String(value),
    }))
  } catch (error) {
    console.error("Error parsing glossary JSON:", error)
    return []
  }
}

export default function Microcourse() {
  const location = useLocation()
  const { id } = location.state || {}

  const [showConfetti, setShowConfetti] = useState(false)
  const [fadeConfetti, setFadeConfetti] = useState(false)
  const [confettiRun, setConfettiRun] = useState(true)

  // Microcourse-level data
  const [microcourseTitle, setMicrocourseTitle] = useState("Loading...")
  //@ts-ignore
  const [data, setData] = useState<any>(null)
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

  // State for chat
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! How can I assist you with the course?" }])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const contentRef = useRef(null)
  //@ts-ignore
  const [inDepthLoading, setInDepthLoading] = useState(false)

  // New state for token limit warning modal
  const [showTokenLimitModal, setShowTokenLimitModal] = useState(false)

  useEffect(() => {
    const hasShownConfetti = localStorage.getItem("hasShownConfettiForMicrocourse")
    if (!hasShownConfetti) {
      setShowConfetti(true)
      localStorage.setItem("hasShownConfettiForMicrocourse", "true")
      const stopAnimationTimeout = setTimeout(() => {
        setConfettiRun(false)
      }, 10000)
      const fadeTimeout = setTimeout(() => {
        setFadeConfetti(true)
      }, 10000)
      const hideTimeout = setTimeout(() => {
        setShowConfetti(false)
      }, 15000)
      return () => {
        clearTimeout(stopAnimationTimeout)
        clearTimeout(fadeTimeout)
        clearTimeout(hideTimeout)
      }
    }
  }, [])

  // ---------------------------
  // FETCH Microcourse on mount
  // ---------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/microcourses/${id}/`)
        const mcData = response.data
        console.log("Raw microcourse data from backend:", mcData)
        setMicrocourseTitle(mcData.title || "Untitled Microcourse")
        setData(mcData)
        const sectionsArray = mcData.sections.map((sec: any) => ({
          id: sec.id,
          title: sec.section_title || "Untitled Section",
          content: sec.content || "No content provided.",
          codeExamples: sec.code_examples ? JSON.parse(sec.code_examples) : [],
          mathExpressions: sec.math_expressions ? JSON.parse(sec.math_expressions) : [],
          glossary_terms: sec.glossary_terms || [],
          quiz_questions: sec.quiz_questions || [],
          recall_notes: sec.recall_notes || [],
        }))
        setChapters(sectionsArray)
        if (mcData.sections.length > 0) {
          let aggregatedGlossaryTerms: GlossaryTerm[] = []
          let aggregatedQuizQuestions: QuizQuestion[] = []
          let aggregatedRecallNotes: RecallNote[] = []
          mcData.sections.forEach((section: any) => {
            if (section.glossary_terms) {
              aggregatedGlossaryTerms = aggregatedGlossaryTerms.concat(section.glossary_terms)
            }
            if (section.quiz_questions) {
              const convertedQuizQuestions = section.quiz_questions.map((q: any) => {
                let opts = []
                if (Array.isArray(q.options)) {
                  opts = q.options
                } else if (typeof q.options === 'object' && q.options !== null) {
                  opts = [
                    q.options.A || "Option A",
                    q.options.B || "Option B",
                    q.options.C || "Option C",
                    q.options.D || "Option D",
                  ]
                } else if (typeof q.options === 'string') {
                  try {
                    const parsed = JSON.parse(q.options)
                    if (Array.isArray(parsed)) {
                      opts = parsed
                    } else if (typeof parsed === 'object' && parsed !== null) {
                      opts = [
                        parsed.A || "Option A",
                        parsed.B || "Option B",
                        parsed.C || "Option C",
                        parsed.D || "Option D",
                      ]
                    }
                  } catch (e) {
                    opts = []
                  }
                }
                return {
                  id: q.id,
                  text: q.question,
                  options: opts,
                  correctAnswer: q.correct_answer,
                }
              })
              aggregatedQuizQuestions = aggregatedQuizQuestions.concat(convertedQuizQuestions)
            }
            if (section.recall_notes) {
              aggregatedRecallNotes = aggregatedRecallNotes.concat(section.recall_notes)
            }
          })
          setGlossaryTerms(aggregatedGlossaryTerms)
          setQuizQuestions(aggregatedQuizQuestions)
          setRecallNotes(aggregatedRecallNotes)
        }
        setModalChapters([
          { title: "Glossary", content: JSON.stringify(mcData.sections[0]?.glossary_terms || []) },
          { title: "Quiz", content: JSON.stringify(mcData.sections[0]?.quiz_questions || []) },
          { title: "Recall Notes", content: JSON.stringify(mcData.sections[0]?.recall_notes || []) },
        ])
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
    if (question.trim() === "") return
    const currentQuestion = question
    setQuestion("")
    setMessages([...messages, { sender: "user", text: currentQuestion }])
    try {
      const response = await api.post("/api/agent_response/", { question: currentQuestion, id })
      const botResponse = response.data.answer
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botResponse }])
    } catch (error) {
      console.error("Error creating microcourse:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, something went wrong. Please try again." },
      ])
    }
  }

  const scrollToChapter = (index: number) => {
    //@ts-ignore
    const chapterElements = contentRef.current?.querySelectorAll("h3")
    if (chapterElements && chapterElements[index]) {
      (chapterElements[index] as HTMLElement).scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleGoInDepth = async (chapterIndex: number) => {
    try {
      // Get the chapter content to extend
      const chapterToExtendContent = chapters[chapterIndex].content
      // Call your API for generating the next section
      const response = await api.post('/api/generate_next_section/', { previousSection: chapterToExtendContent, microcourseId: id })
      const newSection = response.data
      console.log("newSection ", newSection)
      window.location.reload()
    } catch (error: any) {
      // Check if error response indicates token limit reached
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.includes("token limit")) {
        setShowTokenLimitModal(true)
      } else {
        console.error("Error generating next section:", error)
      }
    }
  }

  // @ts-ignore
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
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
            recycle={false}
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
                      {index === chapters.length - 1 && (
                        <button
                          className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 relative z-50"
                          onClick={() => handleGoInDepth(index)}
                          disabled={inDepthLoading}
                        >
                          {inDepthLoading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                          ) : (
                            "Go in-depth"
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 right-0 w-96 bg-white/10 dark:bg-gray-800/90 backdrop-blur-md rounded-tl-lg overflow-hidden z-30"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Course Assistant
                </h3>
                <button onClick={() => setIsChatOpen(false)}>
                  <X className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
              </div>
              <ChatMessages messages={messages} />
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full pr-10 bg-white/20 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isChatOpen && (
          <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-4 right-4 bg-teal-600 dark:bg-gray-600 hover:bg-teal-700 dark:hover:bg-gray-700 text-white p-3 rounded-full shadow-lg z-40"
        >
          <MessageCircle />
        </button>
      )}
      <Footer isSidebarOpen={isSidebarOpen} />

      {/* Modal Components */}
      {/* Quiz Modal */}
      {/* @ts-ignore */}
      <QuizModal isOpen={isModalOpen && modalType === 'Quiz'} onClose={() => setIsModalOpen(false)} questions={quizQuestions} />
      {/* Recall Notes Modal */}
      {/* @ts-ignore */}
      <RecallNotesModal isOpen={isModalOpen && modalType === 'Recall Notes'} onClose={() => setIsModalOpen(false)} sectionId={chapters.length > 0 ? chapters[chapters.length - 1].id : ""} notes={recallNotes} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} />
      {/* Glossary Modal */}
      {/* @ts-ignore */}
      <GlossaryModal isOpen={isModalOpen && modalType === 'Glossary'} onClose={() => setIsModalOpen(false)} terms={glossaryTerms} onAddTerm={handleAddTerm} onDeleteTerm={handleDeleteTerm} />

      {/* Token Limit Warning Modal */}
      {showTokenLimitModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Token Limit Reached
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Free plan users have a monthly limit of 2000 tokens for generating content. Please upgrade to generate more.
            </p>
            <button
              onClick={() => setShowTokenLimitModal(false)}
              className="w-full bg-teal-600 dark:bg-gray-600 text-white py-2 rounded hover:bg-teal-700 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
