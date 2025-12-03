import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDays, format, isSameDay, isSameWeek, isSameMonth, parseISO, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';

export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  title: string;
  frequency: Frequency;
  streak: number;
  completedDates: string[]; // ISO date strings
  color: string;
  reminderTime?: string; // HH:mm
  createdAt: string;
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'createdAt'>) => void;
  editHabit: (id: string, updates: Partial<Habit>) => void;
  toggleHabit: (id: string, date?: Date) => void;
  deleteHabit: (id: string) => void;
  getHabitsByFrequency: (freq: Frequency) => Habit[];
  
  // Drawer State
  isDrawerOpen: boolean;
  openDrawer: (habit?: Habit) => void;
  closeDrawer: () => void;
  editingHabit: Habit | undefined;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

// Mock initial data
const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Drink 3L Water',
    frequency: 'daily',
    streak: 5,
    completedDates: [format(addDays(new Date(), -1), 'yyyy-MM-dd')],
    color: 'hsl(160, 50%, 45%)', // Primary Green
    reminderTime: '09:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Read 30 mins',
    frequency: 'daily',
    streak: 12,
    completedDates: [],
    color: 'hsl(260, 60%, 65%)', // Lavender
    reminderTime: '21:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Gym Workout',
    frequency: 'weekly',
    streak: 2,
    completedDates: [],
    color: 'hsl(200, 60%, 60%)', // Blue
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Budget Review',
    frequency: 'monthly',
    streak: 1,
    completedDates: [],
    color: 'hsl(40, 70%, 60%)', // Orange
    reminderTime: '10:00',
    createdAt: new Date().toISOString(),
  },
];

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  // Load from localStorage or use initial
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const openDrawer = (habit?: Habit) => {
    setEditingHabit(habit);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingHabit(undefined);
  };

  const addHabit = (newHabit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'createdAt'>) => {
    const habit: Habit = {
      ...newHabit,
      id: Math.random().toString(36).substr(2, 9),
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, habit]);
    toast.success('New habit created!');
  };

  const editHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    toast.success('Habit updated');
  };

  const toggleHabit = (id: string, date: Date = new Date()) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;

        const dateStr = format(date, 'yyyy-MM-dd');
        const isCompleted = habit.completedDates.includes(dateStr);
        
        let newCompletedDates;
        let newStreak = habit.streak;

        if (isCompleted) {
          newCompletedDates = habit.completedDates.filter((d) => d !== dateStr);
          // Very basic streak recalculation - in a real app we'd traverse backwards
          newStreak = Math.max(0, newStreak - 1); 
        } else {
          newCompletedDates = [...habit.completedDates, dateStr];
          newStreak += 1; 
          toast.success('Habit completed! Keep it up!');
        }

        return {
          ...habit,
          completedDates: newCompletedDates,
          streak: newStreak,
        };
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    toast('Habit deleted');
  };

  const getHabitsByFrequency = (freq: Frequency) => {
    return habits.filter((h) => h.frequency === freq);
  };

  return (
    <HabitsContext.Provider value={{ 
      habits, 
      addHabit, 
      editHabit,
      toggleHabit, 
      deleteHabit, 
      getHabitsByFrequency,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      editingHabit
    }}>
      {children}
    </HabitsContext.Provider>
  );
}

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) throw new Error('useHabits must be used within a HabitsProvider');
  return context;
};
