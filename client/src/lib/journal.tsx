import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (content: string) => void;
  updateEntry: (id: string, content: string) => void;
  deleteEntry: (id: string) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    content: 'Started using this new habit tracker today. Feeling motivated to drink more water!',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    content: 'Reflecting on the week. I need to focus more on my sleep schedule. 6 hours isn\'t cutting it.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('journal_entries');
    return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
  });

  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (content: string) => {
    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
    toast.success('Entry saved');
  };

  const updateEntry = (id: string, content: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, content, updatedAt: new Date().toISOString() }
          : entry
      )
    );
    toast.success('Entry updated');
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast('Entry deleted');
  };

  return (
    <JournalContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
      {children}
    </JournalContext.Provider>
  );
}

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) throw new Error('useJournal must be used within a JournalProvider');
  return context;
};
