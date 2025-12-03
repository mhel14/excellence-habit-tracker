import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, Trash2, Clock, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Habit, useHabits } from "@/lib/habits";
import { format } from "date-fns";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { toggleHabit, deleteHabit, openDrawer } = useHabits();
  
  // Check if completed today (or appropriate period)
  const isCompletedToday = habit.completedDates.includes(format(new Date(), 'yyyy-MM-dd'));

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
             // Optional: Allow tapping body to edit if user prefers, or keep it context-menu based
             // For now, keep it simple: button completes, long press/right click gives options
          }}
          className={cn(
            "group relative overflow-hidden rounded-2xl p-4 mb-3 transition-all duration-300 border select-none",
            isCompletedToday 
              ? "bg-primary/5 border-primary/20 shadow-sm" 
              : "bg-card border-border/50 shadow-sm hover:shadow-md hover:border-border"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openDrawer(habit)}>
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: habit.color }}
                />
                <h3 className={cn(
                  "font-semibold text-lg truncate transition-all",
                  isCompletedToday ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {habit.title}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="capitalize bg-muted px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide">
                  {habit.frequency}
                </span>
                
                {habit.reminderTime && (
                  <div className="flex items-center gap-1 text-muted-foreground/80">
                    <Clock size={12} />
                    <span>{habit.reminderTime}</span>
                  </div>
                )}

                {habit.streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-500 font-medium">
                    <Flame size={12} className="fill-orange-500" />
                    <span>{habit.streak}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleHabit(habit.id);
              }}
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 border-2 cursor-pointer",
                isCompletedToday
                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-transparent border-muted-foreground/20 text-transparent hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <AnimatePresence>
                {isCompletedToday && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                  >
                    <Check size={24} strokeWidth={4} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => openDrawer(habit)}>
          <Edit2 className="mr-2 h-4 w-4" /> Edit Habit
        </ContextMenuItem>
        <ContextMenuItem onClick={() => deleteHabit(habit.id)} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Delete Habit
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
