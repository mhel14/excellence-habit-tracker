import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJournal, JournalEntry } from "@/lib/journal";
import { format } from "date-fns";
import { Plus, X, Edit2, Trash2, ChevronLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

export default function JournalPage() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournal();
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content.trim()) return;

    if (editingEntry) {
      updateEntry(editingEntry.id, content);
    } else {
      addEntry(content);
    }
    closeEditor();
  };

  const openEditor = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setContent(entry.content);
    } else {
      setEditingEntry(null);
      setContent("");
    }
    setIsWriting(true);
  };

  const closeEditor = () => {
    setIsWriting(false);
    setEditingEntry(null);
    setContent("");
  };

  // Sort entries by date desc
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6 pt-4 max-w-md mx-auto min-h-[80vh] relative">
      <AnimatePresence mode="wait">
        {!isWriting ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <header className="flex items-baseline justify-between">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-display font-bold"
              >
                Journal
              </motion.h1>
              <Button
                onClick={() => openEditor()}
                size="sm"
                className="rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                <Plus className="w-4 h-4 mr-1" /> New
              </Button>
            </header>

            <div className="space-y-4 pb-20">
              {sortedEntries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No entries yet.</p>
                  <p className="text-sm opacity-70">Write down your first thought.</p>
                </div>
              ) : (
                sortedEntries.map((entry) => (
                  <JournalCard
                    key={entry.id}
                    entry={entry}
                    onEdit={() => openEditor(entry)}
                    onDelete={() => deleteEntry(entry.id)}
                  />
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-[75vh]"
          >
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={closeEditor} className="-ml-2">
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <span className="font-display font-bold text-lg">
                {editingEntry ? "Edit Entry" : "New Entry"}
              </span>
              <Button
                onClick={handleSave}
                disabled={!content.trim()}
                size="sm"
                className="rounded-full"
              >
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-1 resize-none text-lg leading-relaxed p-4 bg-card/50 border-none focus:ring-0 rounded-2xl shadow-inner"
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-right mt-2">
              {format(new Date(), "MMMM do, yyyy • h:mm a")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function JournalCard({ entry, onEdit, onDelete }: { entry: JournalEntry, onEdit: () => void, onDelete: () => void }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          layout
          onClick={onEdit}
          className="bg-card p-5 rounded-2xl border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all cursor-pointer group mb-2"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-medium text-primary/80 uppercase tracking-wider bg-primary/5 px-2 py-1 rounded-md">
              {format(new Date(entry.createdAt), "MMM do")}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {format(new Date(entry.createdAt), "h:mm a")}
            </span>
          </div>
          <p className="text-foreground/90 line-clamp-3 leading-relaxed whitespace-pre-wrap">
            {entry.content}
          </p>
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onEdit}>
          <Edit2 className="mr-2 h-4 w-4" /> Edit
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
