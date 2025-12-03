import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { HabitsProvider } from "@/lib/habits";
import { TodosProvider } from "@/lib/todos";
import { JournalProvider } from "@/lib/journal";
import { ThemeProvider } from "@/components/theme-provider";
import { LoadingSpinner } from "@/components/loading-spinner";

// Lazy load routes for code splitting
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Stats = lazy(() => import("@/pages/stats"));
const TodoPage = lazy(() => import("@/pages/todo"));
const JournalPage = lazy(() => import("@/pages/journal"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/todo" component={TodoPage} />
          <Route path="/journal" component={JournalPage} />
          <Route path="/stats" component={Stats} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="habit-flow-theme">
      <HabitsProvider>
        <TodosProvider>
          <JournalProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </JournalProvider>
        </TodosProvider>
      </HabitsProvider>
    </ThemeProvider>
  );
}

export default App;
