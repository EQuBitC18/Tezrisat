"use client";

import { useState, useMemo, FC, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
}
from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Book, Plus, Trash2 } from "lucide-react";
// @ts-expect-error
import api from "../api";
import { useLocation } from "react-router-dom";

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

export interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  terms: GlossaryTerm[];
  onAddTerm: (term: GlossaryTerm) => void;
  onDeleteTerm: (id: string) => void;
}

const GlossaryModal: FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  terms,
  onDeleteTerm,
}) => {
  // Local state for search term and new term inputs
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newTerm, setNewTerm] = useState<string>("");
  const [newDefinition, setNewDefinition] = useState<string>("");

  const location = useLocation();
  // Extract an ID from location state if needed.
  const { id } = location.state || {};

  // Memoized filtered terms based on search input.
  const filteredTerms = useMemo(() => {
    return terms.filter(
      (item) =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [terms, searchTerm]);

  /**
   * Handles adding a new glossary term.
   * If both term and definition inputs are provided, posts the data to the API.
   */
  const handleAddTerm = async () => {
    if (newTerm.trim() && newDefinition.trim()) {
      const termData = {
        term: newTerm.trim(),
        definition: newDefinition.trim(),
        microcourse_id: id,
      };
      try {
        await api.post(`/api/add_glossary_term/`, { termData });
        setNewTerm("");
        setNewDefinition("");
        // Optionally, trigger a state update callback:
        // onAddTerm({ id: "new-id", term: termData.term, definition: termData.definition });
        window.location.reload();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error adding glossary term:", message);
      }
    }
  };

  /**
   * Handles deleting a glossary term by its ID.
   * On success, calls the onDeleteTerm callback and reloads the page.
   */
  const handleDeleteTerm = async (termId: string) => {
    try {
      const response = await api.delete(`/api/delete_glossary_term/${termId}/`);
      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete glossary term.");
      }
      onDeleteTerm(termId);
      window.location.reload();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error deleting glossary term:", message);
    }
  };

  // Type-safe onChange handlers for inputs.
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const handleNewTermChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewTerm(e.target.value);
  const handleNewDefinitionChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewDefinition(e.target.value);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-gray-400">
            <Book className="h-6 w-6 dark:text-gray-400" />
            Glossary
          </DialogTitle>
        </DialogHeader>

        {/* Search Field */}
        <div className="relative mb-4 dark:text-gray-300">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>

        {/* New Term & Definition Inputs */}
        <div className="flex gap-2 mb-4 dark:text-gray-300">
          <Input
            placeholder="New term"
            value={newTerm}
            onChange={handleNewTermChange}
          />
          <Input
            placeholder="Definition"
            value={newDefinition}
            onChange={handleNewDefinitionChange}
          />
          <Button
            onClick={handleAddTerm}
            disabled={!newTerm.trim() || !newDefinition.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Glossary Terms List */}
        <ScrollArea className="flex-grow dark:text-gray-300">
          {filteredTerms.length > 0 ? (
            <div className="space-y-4">
              {filteredTerms.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold mb-2">{item.term}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTerm(item.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              No matching terms found.
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GlossaryModal;
