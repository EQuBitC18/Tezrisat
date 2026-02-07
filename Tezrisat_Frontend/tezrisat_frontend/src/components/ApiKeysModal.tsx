"use client";

import { useEffect, useState, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type RequiredMissing = {
  openai: boolean;
  serpapi: boolean;
};

type ApiKeys = {
  openaiKey: string;
  serpapiKey: string;
  wolframKey: string;
};

interface ApiKeysModalProps {
  isOpen: boolean;
  requiredMissing: RequiredMissing;
  onSave: (keys: ApiKeys) => void;
  onClose?: () => void;
}

const ApiKeysModal: FC<ApiKeysModalProps> = ({
  isOpen,
  requiredMissing,
  onSave,
  onClose,
}) => {
  const [openaiKey, setOpenaiKey] = useState("");
  const [serpapiKey, setSerpapiKey] = useState("");
  const [wolframKey, setWolframKey] = useState("");

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") {
      return;
    }
    setOpenaiKey(window.localStorage.getItem("tezrisat.openai_key") || "");
    setSerpapiKey(window.localStorage.getItem("tezrisat.serpapi_key") || "");
    setWolframKey(window.localStorage.getItem("tezrisat.wolfram_key") || "");
  }, [isOpen]);

  const canSave = openaiKey.trim().length > 0 && serpapiKey.trim().length > 0;
  const allowClose = !requiredMissing.openai && !requiredMissing.serpapi;

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    onSave({
      openaiKey: openaiKey.trim(),
      serpapiKey: serpapiKey.trim(),
      wolframKey: wolframKey.trim(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-xl rounded-2xl bg-white/90 dark:bg-gray-800/90 p-6 shadow-2xl border border-white/20 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-teal-600/15 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add Your API Keys
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Keys are stored locally in your browser and sent with requests.
                  </p>
                </div>
              </div>
              {allowClose && onClose && (
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={onClose}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  OpenAI API Key
                </label>
                <Input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="mt-2 bg-white/70 dark:bg-gray-700/70"
                />
                {requiredMissing.openai && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Required to generate microcourses.
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  SerpAPI Key
                </label>
                <Input
                  type="password"
                  value={serpapiKey}
                  onChange={(e) => setSerpapiKey(e.target.value)}
                  placeholder="serpapi-..."
                  className="mt-2 bg-white/70 dark:bg-gray-700/70"
                />
                {requiredMissing.serpapi && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Required for web search enrichment.
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Wolfram Alpha App ID (optional)
                </label>
                <Input
                  type="password"
                  value={wolframKey}
                  onChange={(e) => setWolframKey(e.target.value)}
                  placeholder="wolfram-..."
                  className="mt-2 bg-white/70 dark:bg-gray-700/70"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <ShieldCheck className="h-4 w-4" />
                Keys are stored locally
              </div>
              <Button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="bg-teal-600 hover:bg-teal-700 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Save Keys
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApiKeysModal;
