"use client";

import { useState, ChangeEvent, KeyboardEvent, FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
}
// @ts-ignore
from "@/components/ui/dialog";
// @ts-ignore
import { Button } from "@/components/ui/button";
// @ts-ignore
import { ScrollArea } from "@/components/ui/scroll-area";
// @ts-ignore
import { Input } from "@/components/ui/input";
import { Search, Plus, X } from "lucide-react";
// @ts-ignore
import api from "../api";

export interface RecallNote {
  id: string;
  content: string;
  timestamp: string;
}

interface RecallNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  notes: RecallNote[];
  onAddNote: (note: RecallNote) => void;
  onDeleteNote: (id: string) => void;
}

const RecallNotesModal: FC<RecallNotesModalProps> = ({
  isOpen,
  onClose,
  sectionId,
  notes,
  onDeleteNote,
}) => {
  // State for search input and new note text.
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newNote, setNewNote] = useState<string>("");

  // Filter notes based on the search term.
  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handles adding a new note.
   * Trims input and, if not empty, posts new note data via the API.
   */
  const handleAddNote = async () => {
    if (newNote.trim()) {
      const noteData = {
        content: newNote.trim(),
        section_id: sectionId,
      };
      try {
        await api.post(`/api/add_note/`, { noteData });
        setNewNote("");
        // Optionally, update parent state via callback:
        // onAddNote({ id: "newly-created-id", content: noteData.content, timestamp: new Date().toLocaleString() });
        window.location.reload();
      } catch (error: any) {
        console.error("Error adding recall note:", error.message || error);
      }
    }
  };

  /**
   * Handles deletion of a note.
   * Calls the API to delete the note and then updates the UI via parent callback.
   */
  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await api.delete(`/api/delete_note/${noteId}/`);
      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to delete note."
        );
      }
      onDeleteNote(noteId);
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting note:", error.message || error);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handleNewNoteChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewNote(e.target.value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddNote();
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
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear
            </Button>
          </div>

          {/* Add New Note */}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add a new note..."
              value={newNote}
              onChange={handleNewNoteChange}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddNote}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Display Notes */}
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start justify-between space-x-2 mb-4"
                >
                  <div>
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {note.timestamp}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No notes found.
              </p>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecallNotesModal;
