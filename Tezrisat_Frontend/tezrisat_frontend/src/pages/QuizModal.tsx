"use client";

import { useState } from "react";
// @ts-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// @ts-ignore
import { Button } from "@/components/ui/button";
// @ts-ignore
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// @ts-ignore
import { Label } from "@/components/ui/label";
// @ts-ignore
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: string[] | string;
  correctAnswer: number | string | undefined; // can be undefined
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

export default function QuizModal({ isOpen, onClose, questions = [] }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Safely convert correctAnswer to a 0-based index
  function getCorrectAnswerIndex(q: Question) {
    if (!q) return 0; // fallback if question is missing
    const rawCorrect = q.correctAnswer;

    // If correctAnswer is already a number, just use it
    if (typeof rawCorrect === "number") {
      return rawCorrect;
    }

    // If it's a string that can parse to an integer, parse it
    if (typeof rawCorrect === "string") {
      // Could be a digit like "1" or a letter like "B"
      const parsedNum = parseInt(rawCorrect, 10);
      if (!isNaN(parsedNum)) {
        return parsedNum;
      }
      // If it's a single letter, e.g. "A", "B", "C", "D"
      if (rawCorrect.length === 1) {
        const letter = rawCorrect.toUpperCase();
        return letter.charCodeAt(0) - "A".charCodeAt(0);
      }
    }

    // Otherwise fallback to 0 if everything else fails
    return 0;
  }

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    setAnswered(true);

    const correctIndex = getCorrectAnswerIndex(questions[currentQuestion]);
    if (selectedAnswer === correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setAnswered(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Current question object
  const currentQ = questions[currentQuestion];
  const correctIndex = getCorrectAnswerIndex(currentQ || {});

  // Safely parse the options
  function getOptions() {
    const rawOptions = currentQ?.options;
    if (Array.isArray(rawOptions)) return rawOptions;
    if (typeof rawOptions === "string") {
      try {
        const parsed = JSON.parse(rawOptions);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  const optionsArray = getOptions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:text-gray-400">
        <DialogHeader>
          <DialogTitle>Quiz</DialogTitle>
          <DialogDescription>Test your knowledge with this quick quiz!</DialogDescription>
        </DialogHeader>

        {!showResult ? (
          <>
            <Progress value={progress} className="w-full" />
            <div className="py-4">
              <h3 className="text-lg font-medium mb-2 dark:text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {currentQ?.text}
              </p>

              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value: string) => setSelectedAnswer(parseInt(value))}
              >
                {optionsArray.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 dark:text-gray-400 mb-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                    {/* Show correct indicator if answered and index matches correct answer */}
                    {answered && index === correctIndex && (
                      <CheckCircle2 className="text-green-500 ml-2" size={20} />
                    )}
                    {/* Show incorrect indicator if answered, user selected this, but it's not correct */}
                    {answered && index === selectedAnswer && index !== correctIndex && (
                      <XCircle className="text-red-500 ml-2" size={20} />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>

            <DialogFooter>
              {!answered ? (
                <Button onClick={handleAnswer} disabled={selectedAnswer === null}>
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-2 dark:text-gray-400">Quiz Results</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You scored {score} out of {questions.length} questions correctly.
            </p>
            <Progress value={(score / questions.length) * 100} className="w-full mb-4 dark:text-gray-400" />
            <Button onClick={handleRetry} className="w-full">
              Retry Quiz
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
