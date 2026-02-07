"use client";

import { useState, FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

export interface Question {
  id: number;
  text: string;
  options: string[] | string;
  correctAnswer: number | string | undefined;
}

export interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

const QuizModal: FC<QuizModalProps> = ({ isOpen, onClose, questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [answered, setAnswered] = useState<boolean>(false);

  /**
   * Safely converts the provided question's correctAnswer value into a 0-based index.
   */
  const getCorrectAnswerIndex = (q: Question): number => {
    const rawCorrect = q.correctAnswer;
    if (typeof rawCorrect === "number") {
      return rawCorrect;
    }
    if (typeof rawCorrect === "string") {
      const parsedNum = parseInt(rawCorrect, 10);
      if (!isNaN(parsedNum)) {
        return parsedNum;
      }
      if (rawCorrect.length === 1) {
        const letter = rawCorrect.toUpperCase();
        return letter.charCodeAt(0) - "A".charCodeAt(0);
      }
    }
    return 0;
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    setAnswered(true);
    const correctIndex = getCorrectAnswerIndex(questions[currentQuestion]);
    if (selectedAnswer === correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setAnswered(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
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

  // Calculate quiz progress as a percentage.
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Get the current question; use an empty object fallback.
  const currentQ = questions[currentQuestion];
  const correctIndex = currentQ ? getCorrectAnswerIndex(currentQ) : 0;

  /**
   * Safely parses the options of the current question.
   */
  const getOptions = (): string[] => {
    const rawOptions = currentQ?.options;
    if (Array.isArray(rawOptions)) return rawOptions;
    if (typeof rawOptions === "string") {
      try {
        const parsed = JSON.parse(rawOptions);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const optionsArray = getOptions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:text-gray-400">
        <DialogHeader>
          <DialogTitle>Quiz</DialogTitle>
          <DialogDescription>
            Test your knowledge with this quick quiz!
          </DialogDescription>
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
                value={selectedAnswer?.toString() || ""}
                onValueChange={(value: string) =>
                  setSelectedAnswer(parseInt(value, 10))
                }
              >
                {optionsArray.map((option: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 dark:text-gray-400 mb-2"
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                    {answered && index === correctIndex && (
                      <CheckCircle2 className="text-green-500 ml-2" size={20} />
                    )}
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
            <h3 className="text-lg font-medium mb-2 dark:text-gray-400">
              Quiz Results
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You scored {score} out of {questions.length} questions correctly.
            </p>
            <Progress
              value={(score / questions.length) * 100}
              className="w-full mb-4 dark:text-gray-400"
            />
            <Button onClick={handleRetry} className="w-full">
              Retry Quiz
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
