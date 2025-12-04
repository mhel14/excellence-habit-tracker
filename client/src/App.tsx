import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
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
  // Get the base path from Vite's environment and remove trailing slash
  // to prevent double slashes when wouter concatenates base + route path
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";

  // Add this to your app temporarily to debug:
  useEffect(() => {
    // Check manifest
    fetch('/excellence-habit-tracker/manifest.json')
      .then(r => r.json())
      .then(data => console.log('Manifest:', data))
      .catch(e => console.error('Manifest error:', e));

    // Check SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration()
        .then(reg => console.log('SW Registration:', reg))
        .catch(e => console.error('SW error:', e));
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('Install prompt available!', e);
    });
  }, []);

  return (
    <WouterRouter base={base}>
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
    </WouterRouter>
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
