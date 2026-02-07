"use client";

import { useEffect, useState, ReactNode } from "react";
import ApiKeysModal from "./ApiKeysModal";
// @ts-expect-error
import api from "../api";

type RequiredMissing = {
  openai: boolean;
  serpapi: boolean;
};

type ApiKeys = {
  openaiKey: string;
  serpapiKey: string;
  wolframKey: string;
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [isKeysModalOpen, setIsKeysModalOpen] = useState(false);
  const [requiredMissing, setRequiredMissing] = useState<RequiredMissing>({
    openai: false,
    serpapi: false,
  });

  useEffect(() => {
    const fetchKeysStatus = async () => {
      try {
        const response = await api.get("/api/config/keys-status/");
        const configured = response.data?.configured || {};
        const localOpenai = window.localStorage.getItem("tezrisat.openai_key");
        const localSerpapi = window.localStorage.getItem("tezrisat.serpapi_key");

        const openaiMissing = !configured.openai && !localOpenai;
        const serpapiMissing = !configured.serpapi && !localSerpapi;
        if (openaiMissing || serpapiMissing) {
          setRequiredMissing({ openai: openaiMissing, serpapi: serpapiMissing });
          setIsKeysModalOpen(true);
        }
      } catch (error) {
        console.error("Error checking API key status:", error);
      }
    };

    if (typeof window !== "undefined") {
      fetchKeysStatus();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleOpen = () => {
      setIsKeysModalOpen(true);
    };
    window.addEventListener("tezrisat:open-api-keys", handleOpen);
    return () => window.removeEventListener("tezrisat:open-api-keys", handleOpen);
  }, []);

  const handleSaveKeys = (keys: ApiKeys) => {
    window.localStorage.setItem("tezrisat.openai_key", keys.openaiKey);
    window.localStorage.setItem("tezrisat.serpapi_key", keys.serpapiKey);
    if (keys.wolframKey) {
      window.localStorage.setItem("tezrisat.wolfram_key", keys.wolframKey);
    } else {
      window.localStorage.removeItem("tezrisat.wolfram_key");
    }
    setRequiredMissing({ openai: false, serpapi: false });
    setIsKeysModalOpen(false);
  };

  return (
    <>
      <ApiKeysModal
        isOpen={isKeysModalOpen}
        requiredMissing={requiredMissing}
        onSave={handleSaveKeys}
        onClose={() => setIsKeysModalOpen(false)}
      />
      {children}
    </>
  );
};

export default AppLayout;
