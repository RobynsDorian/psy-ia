
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import PatientFile from "./pages/PatientFile";
import { PatientAnalysis } from "./pages/PatientAnalysis"; // Changed from default to named import
import NotFound from "./pages/NotFound";
import { MainSidebarWrapper } from "./components/layout/MainSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainSidebarWrapper>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/patient/:id" element={<PatientFile />} />
              <Route path="/patient/:id/analysis" element={<PatientAnalysis />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </MainSidebarWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
