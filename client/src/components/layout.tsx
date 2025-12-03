import { Link, useLocation } from "wouter";
import { Home, BarChart2, Plus, Moon, Sun, CheckSquare, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddHabitDrawer } from "./add-habit-drawer";
import { useHabits } from "@/lib/habits";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isDrawerOpen, openDrawer, closeDrawer } = useHabits();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden transition-colors duration-500">
      {/* Background texture */}
      <div className="fixed inset-0 z-[-1] opacity-50 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 blur-3xl dark:from-primary/10 dark:via-accent/10 dark:to-secondary/10 transition-colors duration-500" />
      </div>

      {/* Header with Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full hover:bg-muted/50 transition-colors"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 p-6 scrollbar-hide">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-background/80 backdrop-blur-lg border-t border-border/40 max-w-md mx-auto z-50 transition-colors duration-500">
        <div className="flex justify-around items-center">
          <Link href="/">
            <span className={cn("p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 cursor-pointer", location === "/" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary/60")}>
              <Home size={24} strokeWidth={location === "/" ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Habits</span>
            </span>
          </Link>

          <Link href="/todo">
            <span className={cn("p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 cursor-pointer", location === "/todo" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary/60")}>
              <CheckSquare size={24} strokeWidth={location === "/todo" ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Tasks</span>
            </span>
          </Link>
          
          <button 
            onClick={() => openDrawer()}
            className="p-4 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all -mt-8 border-4 border-background dark:border-background cursor-pointer relative z-10"
          >
            <Plus size={28} strokeWidth={3} />
          </button>

          <Link href="/journal">
            <span className={cn("p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 cursor-pointer", location === "/journal" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary/60")}>
              <Book size={24} strokeWidth={location === "/journal" ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Journal</span>
            </span>
          </Link>

          <Link href="/stats">
            <span className={cn("p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 cursor-pointer", location === "/stats" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary/60")}>
              <BarChart2 size={24} strokeWidth={location === "/stats" ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Stats</span>
            </span>
          </Link>
        </div>
      </nav>

      <AddHabitDrawer open={isDrawerOpen} onOpenChange={(open: boolean) => open ? openDrawer() : closeDrawer()} />
    </div>
  );
}
