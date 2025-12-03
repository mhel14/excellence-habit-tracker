import { useHabits } from "@/lib/habits";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";

export default function Stats() {
  const { habits } = useHabits();

  // Calculate stats
  const totalHabits = habits.length;
  const totalStreaks = habits.reduce((acc, h) => acc + h.streak, 0);
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  // Calculate completion rate (simple version: total completed dates / (habits * days tracked approx))
  // Let's do a simpler metric: Today's completion rate
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const habitsDueToday = habits.filter(h => {
      if (h.frequency === 'daily') return true;
      // Simple check for others
      return true; 
  });
  const completedToday = habitsDueToday.filter(h => h.completedDates.includes(todayStr)).length;
  const completionRate = habitsDueToday.length > 0 
    ? Math.round((completedToday / habitsDueToday.length) * 100) 
    : 0;


  // Calculate Weekly Activity Chart Data
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

  const chartData = weekDays.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const completedCount = habits.reduce((count, habit) => {
      return count + (habit.completedDates.includes(dateStr) ? 1 : 0);
    }, 0);

    return {
      name: format(day, 'EEE'), // Mon, Tue, etc.
      completed: completedCount,
      fullDate: dateStr
    };
  });

  return (
    <div className="space-y-6 pt-4">
       <header className="space-y-1">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold"
        >
          Your Progress
        </motion.h1>
        <p className="text-muted-foreground">Keep the momentum going!</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Streaks" value={totalStreaks} icon="🔥" color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
        <StatCard title="Best Streak" value={bestStreak} icon="🏆" color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" />
        <StatCard title="Active Habits" value={totalHabits} icon="📝" color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatCard title="Today's Rate" value={`${completionRate}%`} icon="📈" color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: 'hsl(var(--popover))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Bar 
                  dataKey="completed" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="bg-primary/5 rounded-2xl p-6 space-y-2 border border-primary/10">
        <h3 className="font-semibold text-primary">Quote of the day</h3>
        <p className="text-muted-foreground italic">"We are what we repeatedly do. Excellence, then, is not an act, but a habit."</p>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-2">— Aristotle</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-card p-4 rounded-2xl shadow-sm border border-border/50 space-y-2"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</div>
      </div>
    </motion.div>
  )
}
