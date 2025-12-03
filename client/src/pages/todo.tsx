import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTodos } from "@/lib/todos";
import { Input } from "@/components/ui/input";
import { Check, Trash2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function TodoPage() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue("");
    }
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="space-y-8 pt-4 max-w-md mx-auto">
      <header className="flex items-baseline justify-between">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold"
        >
          Tasks
        </motion.h1>
        <span className="text-muted-foreground text-sm font-medium">
          {activeTodos.length} remaining
        </span>
      </header>

      <form onSubmit={handleSubmit} className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="h-14 pl-4 pr-12 text-lg bg-card border-border/50 rounded-xl shadow-sm focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
        />
        <button 
          type="submit"
          disabled={!inputValue.trim()}
          className="absolute right-2 top-2 bottom-2 w-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </form>

      <div className="space-y-6">
        {/* Active Tasks */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {activeTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
            ))}
            {activeTodos.length === 0 && todos.length > 0 && completedTodos.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground text-sm italic"
              >
                All caught up! 🎉
              </motion.div>
            )}
             {todos.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                <p>No tasks yet.</p>
                <p className="text-sm opacity-70">Add one above to get started.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Completed Tasks */}
        {completedTodos.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completed</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCompleted}
                className="h-6 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2"
              >
                Clear
              </Button>
            </div>
            <AnimatePresence mode="popLayout">
              {completedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function TodoItem({ todo, toggleTodo, deleteTodo }: { todo: any, toggleTodo: (id: string) => void, deleteTodo: (id: string) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="group flex items-center gap-3 p-3 bg-card rounded-xl border border-border/40 hover:border-border/80 transition-all shadow-sm"
    >
      <button
        onClick={() => toggleTodo(todo.id)}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
          todo.completed
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary/50"
        )}
      >
        {todo.completed && <Check size={14} strokeWidth={3} />}
      </button>
      
      <span 
        className={cn(
          "flex-1 text-base transition-all duration-300 cursor-pointer select-none",
          todo.completed ? "text-muted-foreground line-through decoration-border decoration-2" : "text-foreground"
        )}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.text}
      </span>

      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-2 -mr-2"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}
