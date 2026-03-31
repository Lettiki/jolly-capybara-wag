import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import KnowledgeBase from "./pages/KnowledgeBase";
import NewEntry from "./pages/NewEntry";
import EditEntry from "./pages/EditEntry";
import EntryDetails from "./pages/EntryDetails";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/knowledge" element={<Layout><KnowledgeBase /></Layout>} />
            <Route path="/new" element={<Layout><NewEntry /></Layout>} />
            <Route path="/edit/:id" element={<Layout><EditEntry /></Layout>} />
            <Route path="/entry/:id" element={<Layout><EntryDetails /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;