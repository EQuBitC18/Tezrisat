"use client";

import { SetStateAction, useState } from 'react';
// @ts-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// @ts-ignore
import { Button } from "@/components/ui/button";
// @ts-ignore
import { ScrollArea } from "@/components/ui/scroll-area";
// @ts-ignore
import { Input } from "@/components/ui/input";
import { Search, Plus, X } from 'lucide-react';
// @ts-ignore
import api from "../api"

export interface RecallNote {
  id: string;
  content: string;
  timestamp: string;
}

interface RecallNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string; // new prop for current microcourse section id
  notes: RecallNote[];
  onAddNote: (note: RecallNote) => void;
  onDeleteNote: (id: string) => void;
}

/**
 * RecallNotesModal Component
 *
 * Displays a modal dialog for viewing, searching, adding, and deleting recall notes.
 *
 * @param {RecallNotesModalProps} props - Component props.
 */
export default function RecallNotesModal({
  isOpen,
  onClose,
  sectionId,
  notes,
  onDeleteNote
}: RecallNotesModalProps) {
  // State for search input and new note text.
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState('');

  // Filter notes based on the search term.
  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handles adding a new note.
   * Trims the input and calls the onAddNote callback if the input is not empty.
   */
  const handleAddNote = async () => {
    if (newNote.trim()) {
      const noteData = {
        content: newNote.trim(),
        section_id: sectionId,
      };
      try {
        await api.post(`/api/add_note/`, {
          noteData
        });
        setNewNote('');
        window.location.reload();
      } catch (error: any) {
        console.error('Error adding recall note:', error.message || error);
      }
    }
  };

  const handleDeleteTerm = async (note_id: string) => {
    try {
      const response = await api.delete(`/api/delete_note/${note_id}/`);
      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete glossary term.');
      }
      // On success, update the UI using the parent callback.
      onDeleteNote(note_id);
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting glossary term:', error.message || error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] dark:text-gray-400">
        <DialogHeader>
          <DialogTitle>Recall Notes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Notes */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Clear
            </Button>
          </div>

          {/* Add New Note */}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add a new note..."
              value={newNote}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setNewNote(e.target.value)}
              onKeyPress={(e: { key: string }) => {
                if (e.key === 'Enter') {
                  handleAddNote();
                }
              }}
            />
            <Button onClick={handleAddNote}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Display Notes */}
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div key={note.id} className="flex items-start justify-between space-x-2 mb-4">
                  <div>
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-muted-foreground">{note.timestamp}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTerm(note.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No notes found.</p>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}