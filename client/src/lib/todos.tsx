import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TodosContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
}

const TodosContext = createContext<TodosContextType | undefined>(undefined);

const INITIAL_TODOS: Todo[] = [
  {
    id: '1',
    text: 'Buy groceries',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    text: 'Call mom',
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast('Task deleted');
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
    toast('Completed tasks cleared');
  };

  return (
    <TodosContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, clearCompleted }}>
      {children}
    </TodosContext.Provider>
  );
}

export const useTodos = () => {
  const context = useContext(TodosContext);
  if (!context) throw new Error('useTodos must be used within a TodosProvider');
  return context;
};
