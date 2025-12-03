import { useHabits } from "@/lib/habits";
import { HabitCard } from "@/components/habit-card";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { habits, getHabitsByFrequency } = useHabits();
  const today = new Date();

  // Group habits for the "Overview" logic
  // For simplicity, we'll just use tabs for Daily, Weekly, Monthly
  
  return (
    <div className="space-y-8">
      <header className="space-y-1 pt-4">
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground font-medium uppercase tracking-wider text-xs"
        >
          {format(today, "EEEE, MMMM do")}
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-display font-bold text-foreground"
        >
          Hello, User
        </motion.h1>
      </header>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full bg-muted/50 p-1 rounded-xl mb-6 h-12">
          <TabsTrigger value="daily" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-2 min-h-[50vh] outline-none">
          <HabitList habits={getHabitsByFrequency("daily")} emptyMessage="No daily habits yet. Start small!" />
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-2 min-h-[50vh] outline-none">
          <HabitList habits={getHabitsByFrequency("weekly")} emptyMessage="No weekly goals set." />
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-2 min-h-[50vh] outline-none">
          <HabitList habits={getHabitsByFrequency("monthly")} emptyMessage="No monthly targets." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HabitList({ habits, emptyMessage }: { habits: any[], emptyMessage: string }) {
  if (habits.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center space-y-4"
      >
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center opacity-20">
          <span className="text-4xl">🌱</span>
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="pb-20">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
}
