"use client";

import React, { useState, useEffect, useRef, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, MessageCircle, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ScrollProgressBar from "../components/ScrollProgressBar";
import Background from "../components/Background";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChapterTextField from "../components/ChapterTextField";
import ChatMessages from "../components/ChatMessages";
import QuizModal from "./QuizModal";
import RecallNotesModal from "./RecallNotesModal";
import GlossaryModal from "./GlossaryModal";

import Confetti from "react-confetti";
import "katex/dist/katex.min.css";
// @ts-expect-error
import api from "../api";

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

export interface RecallNote {
  id: string;
  content: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

export interface CodeExample {
  description: string;
  code: string;
  language?: string;
}

export interface MathExpression {
  description: string;
  expression: string;
}

type QuizOptionsMap = {
  A?: string;
  B?: string;
  C?: string;
  D?: string;
};

type RawQuizQuestion = {
  id: string | number;
  question?: string;
  options?: string[] | QuizOptionsMap | string | null;
  correct_answer?: number;
};

export interface MicrocourseSection {
  id: string;
  section_title?: string;
  content?: string;
  code_examples?: CodeExample[];
  math_expressions?: MathExpression[];
  glossary_terms?: GlossaryTerm[];
  quiz_questions?: RawQuizQuestion[];
  recall_notes?: RecallNote[];
}

export interface RawMicrocourseSection
  extends Omit<MicrocourseSection, "code_examples" | "math_expressions"> {
  code_examples?: CodeExample[] | string | null;
  math_expressions?: MathExpression[] | string | null;
}

export interface MicrocourseData {
  id: string;
  title: string;
  sections: RawMicrocourseSection[];
}

export interface ChatMessage {
  sender: "bot" | "user";
  text: string;
}

type ModalType = "Quiz" | "Recall Notes" | "Glossary" | "";

// For modal chapters on the sidebar.
interface ModalChapter {
  title: string;
  content: string;
}

const parseArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const isOptionsMap = (value: unknown): value is QuizOptionsMap =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseQuizOptions = (options: RawQuizQuestion["options"]): string[] => {
  if (Array.isArray(options)) {
    return options.map((opt) => String(opt));
  }

  if (isOptionsMap(options)) {
    return [
      options.A || "Option A",
      options.B || "Option B",
      options.C || "Option C",
      options.D || "Option D",
    ];
  }

  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options);
      if (Array.isArray(parsed)) {
        return parsed.map((opt) => String(opt));
      }
      if (isOptionsMap(parsed)) {
        return [
          parsed.A || "Option A",
          parsed.B || "Option B",
          parsed.C || "Option C",
          parsed.D || "Option D",
        ];
      }
    } catch {
      return [];
    }
  }

  return [];
};

// -----------------------------------------------------------------------------
// Main Component: Microcourse
// -----------------------------------------------------------------------------

const Microcourse: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get microcourse id from the router state (ensure it exists)
  const microcourseId =
    (location.state as { id?: number } | null | undefined)?.id ?? null;

  // ---------------------------------------------------------------------------
  // Local UI State
  // ---------------------------------------------------------------------------
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [fadeConfetti, setFadeConfetti] = useState<boolean>(false);
  const [confettiRun, setConfettiRun] = useState<boolean>(true);

  const [microcourseTitle, setMicrocourseTitle] = useState<string>("Loading...");
  const [chapters, setChapters] = useState<MicrocourseSection[]>([]);

  // Modal and aggregated content states
  const [modalChapters, setModalChapters] = useState<ModalChapter[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [recallNotes, setRecallNotes] = useState<RecallNote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>("");
  const [, setModalContent] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });

  // Chat-related state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "Hello! How can I assist you with the course?" },
  ]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [inDepthLoading, setInDepthLoading] = useState<boolean>(false);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Ref for scrolling to chapters
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!microcourseId) {
      console.error("No microcourse id provided in location state.");
      navigate("/home");
    }
  }, [microcourseId, navigate]);

  // ---------------------------------------------------------------------------
  // Confetti Effect (only once per microcourse per browser session)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const hasShownConfetti = localStorage.getItem("hasShownConfettiForMicrocourse");
    if (!hasShownConfetti) {
      setShowConfetti(true);
      localStorage.setItem("hasShownConfettiForMicrocourse", "true");
      const stopAnimationTimeout = setTimeout(() => setConfettiRun(false), 10000);
      const fadeTimeout = setTimeout(() => setFadeConfetti(true), 10000);
      const hideTimeout = setTimeout(() => setShowConfetti(false), 15000);
      return () => {
        clearTimeout(stopAnimationTimeout);
        clearTimeout(fadeTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Data Fetch: Load Microcourse Data on Mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!microcourseId) {
        return;
      }
      try {
        const response = await api.get(`/api/microcourses/${microcourseId}/`);
        const mcData: MicrocourseData = response.data;
        console.log("Raw microcourse data from backend:", mcData);
        setMicrocourseTitle(mcData.title || "Untitled Microcourse");

        // Convert sections into chapters
        const sectionsArray = mcData.sections.map((sec) => ({
          id: sec.id,
          section_title: sec.section_title || "Untitled Section",
          content: sec.content || "No content provided.",
          code_examples: parseArray<CodeExample>(sec.code_examples),
          math_expressions: parseArray<MathExpression>(sec.math_expressions),
          glossary_terms: sec.glossary_terms || [],
          quiz_questions: sec.quiz_questions || [],
          recall_notes: sec.recall_notes || [],
        }));
        setChapters(sectionsArray);

        // Aggregate glossary, quiz questions, and recall notes from all sections
        let aggregatedGlossaryTerms: GlossaryTerm[] = [];
        let aggregatedQuizQuestions: QuizQuestion[] = [];
        let aggregatedRecallNotes: RecallNote[] = [];
        mcData.sections.forEach((section) => {
          if (section.glossary_terms) {
            aggregatedGlossaryTerms = aggregatedGlossaryTerms.concat(section.glossary_terms);
          }
          if (section.quiz_questions) {
            const convertedQuizQuestions = section.quiz_questions.map((q) => {
              const opts = parseQuizOptions(q.options);
              return {
                id: String(q.id),
                text: q.question || "No question provided.",
                options: opts,
                correctAnswer: typeof q.correct_answer === "number" ? q.correct_answer : 0,
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

        // Prepare modal chapters data (using the first section as a reference)
        setModalChapters([
          { title: "Glossary", content: JSON.stringify(mcData.sections[0]?.glossary_terms || []) },
          { title: "Quiz", content: JSON.stringify(mcData.sections[0]?.quiz_questions || []) },
          { title: "Recall Notes", content: JSON.stringify(mcData.sections[0]?.recall_notes || []) },
        ]);
      } catch (error) {
        console.error("Error fetching microcourse data:", error);
      }
    };
    fetchData();
  }, [microcourseId]);

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------
  const handleAddNote = (content: string) => {
    const newNote: RecallNote = {
      id: uuidv4(),
      content,
      timestamp: new Date().toLocaleString(),
    };
    setRecallNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const handleDeleteNote = (noteId: string) => {
    setRecallNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  const handleAddTerm = (newTerm: GlossaryTerm) => {
    setGlossaryTerms((prevTerms) => [...prevTerms, newTerm]);
  };

  const handleDeleteTerm = (termId: string) => {
    setGlossaryTerms((prevTerms) => prevTerms.filter((term) => term.id !== termId));
  };

  const openModal = (type: ModalType, title = "", content = "") => {
    setModalType(type);
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const sendText = async () => {
    if (question.trim() === "") return;
    if (!microcourseId) return;
    const currentQuestion = question;
    setQuestion("");
    setMessages((prev) => [...prev, { sender: "user", text: currentQuestion }]);
    try {
      const response = await api.post("/api/agent_response/", { question: currentQuestion, id: microcourseId });
      const botResponse = response.data.answer;
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Error creating microcourse:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    }
  };

  const scrollToChapter = (index: number) => {
    const chapterElements = contentRef.current?.querySelectorAll("h3");
    if (chapterElements && chapterElements[index]) {
      (chapterElements[index] as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGoInDepth = async (chapterIndex: number) => {
    try {
      if (!microcourseId) return;
      const chapterContent = chapters[chapterIndex].content;
      setInDepthLoading(true);
      const response = await api.post("/api/generate_next_section/", {
        previousSection: chapterContent,
        microcourseId: microcourseId,
      });
      console.log("newSection ", response.data);
      window.location.reload();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error generating next section:", message);
    } finally {
      setInDepthLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {showConfetti && (
        <div
          style={{
            opacity: fadeConfetti ? 0 : 1,
            transition: "opacity 5s ease",
          }}
        >
          <Confetti numberOfPieces={500} run={confettiRun} recycle={false} />
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
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
                  {microcourseTitle}
                </h2>
                <div ref={contentRef} className="space-y-8">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="mb-8">
                      {/* @ts-expect-error */}
                      <ChapterTextField chapter={chapter.section_title || "Untitled Section"} content={chapter.content || ""} code_examples={chapter.code_examples}  math_expressions={chapter.math_expressions}/>
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
            {/* Sidebar: Modal Chapters & Chapter Navigation */}
            <div className="w-64 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md p-4 overflow-y-auto">
              <div className="space-y-4">
                {modalChapters.map((chap, index) => (
                  <Button
                    key={index}
                    onClick={() => openModal(chap.title as ModalType, chap.title, chap.content)}
                    className="w-full bg-teal-600 dark:bg-gray-600 hover:bg-teal-700 dark:hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    {chap.title}
                  </Button>
                ))}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Chapters</h3>
                  <ul className="space-y-2">
                    {chapters.map((chapter, index) => (
                      <li key={chapter.id}>
                        <button
                          onClick={() => scrollToChapter(index)}
                          className="text-left w-full p-2 rounded-md transition-colors hover:bg-white/10 dark:hover:bg-gray-700/30 text-gray-800 dark:text-white"
                        >
                          {chapter.section_title || "Untitled Section"}
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

      {/* Chat Panel */}
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
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Course Assistant</h3>
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
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setQuestion(e.target.value)}
                  onKeyDown={(e: { key: string; preventDefault: () => void; }) => {
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
      {/* @ts-expect-error */}
      <QuizModal isOpen={isModalOpen && modalType === 'Quiz'} onClose={() => setIsModalOpen(false)} questions={quizQuestions} />
      {/* Recall Notes Modal */}
      {/* @ts-expect-error */}
      <RecallNotesModal isOpen={isModalOpen && modalType === 'Recall Notes'} onClose={() => setIsModalOpen(false)} sectionId={chapters.length > 0 ? chapters[chapters.length - 1].id : ""} notes={recallNotes} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} />
      {/* Glossary Modal */}
      {/* @ts-expect-error */}
      <GlossaryModal isOpen={isModalOpen && modalType === 'Glossary'} onClose={() => setIsModalOpen(false)} terms={glossaryTerms} onAddTerm={handleAddTerm} onDeleteTerm={handleDeleteTerm} />
    </div>
  );
};

export default Microcourse;
