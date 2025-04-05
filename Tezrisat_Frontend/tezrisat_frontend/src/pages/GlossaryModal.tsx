"use client";

import { useState, useMemo, SetStateAction } from 'react';
// @ts-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// @ts-ignore
import { Input } from "@/components/ui/input";
// @ts-ignore
import { Button } from "@/components/ui/button";
// @ts-ignore
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Book, Plus, Trash2 } from 'lucide-react';
// @ts-ignore
import api from "../api"
import {useLocation} from "react-router-dom";

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

/**
 * GlossaryModal Component
 *
 * Displays a modal for managing glossary terms. Users can search for existing terms,
 * add a new term with its definition, and delete terms.
 *
 * @param {GlossaryModalProps} props - Component properties.
 * @returns {JSX.Element} The rendered GlossaryModal component.
 */
// @ts-ignore
export default function GlossaryModal({ isOpen, onClose, sectionId, terms, onAddTerm, onDeleteTerm }: GlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');

  const location = useLocation()
  const { id } = location.state || {}

  /**
   * Filters glossary terms based on the search term.
   */
  const filteredTerms = useMemo(() => {
    return terms.filter(
      item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [terms, searchTerm]);

  /**
   * Handles adding a new term if both term and definition are provided.
   */
  const handleAddTerm = async () => {
    if (newTerm.trim() && newDefinition.trim()) {
      const termData = {
        term: newTerm.trim(),
        definition: newDefinition.trim(),
        microcourse_id: id,
      };
      try {
        await api.post(`/api/add_glossary_term/`, {
          termData
        });
        setNewTerm('');
        setNewDefinition('');
        window.location.reload();
      } catch (error: any) {
        console.error('Error adding glossary term:', error.message || error);
      }
    }
  };

  const handleDeleteTerm = async (term_id: string) => {
    try {
      const response = await api.delete(`/api/delete_glossary_term/${term_id}/`);
      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete glossary term.');
      }
      // On success, update the UI using the parent callback.
      onDeleteTerm(id);
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting glossary term:', error.message || error);
    }
  };

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
            onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* New Term & Definition Inputs */}
        <div className="flex gap-2 mb-4 dark:text-gray-300">
          <Input
            placeholder="New term"
            value={newTerm}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setNewTerm(e.target.value)}
          />
          <Input
            placeholder="Definition"
            value={newDefinition}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setNewDefinition(e.target.value)}
          />
          <Button onClick={handleAddTerm} disabled={!newTerm.trim() || !newDefinition.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Glossary Terms List */}
        <ScrollArea className="flex-grow dark:text-gray-300">
          {filteredTerms.length > 0 ? (
            <div className="space-y-4">
              {filteredTerms.map((item) => (
                <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.definition}</p>
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
}