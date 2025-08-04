import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/calendar" element={<DashboardLayout><Calendar /></DashboardLayout>} />
          <Route path="/appointments" element={<DashboardLayout><Appointments /></DashboardLayout>} />
          <Route path="/patients" element={<DashboardLayout><div className="p-6"><h1 className="text-2xl">Patients - Coming Soon</h1></div></DashboardLayout>} />
          <Route path="/slots" element={<DashboardLayout><div className="p-6"><h1 className="text-2xl">Available Slots - Coming Soon</h1></div></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><div className="p-6"><h1 className="text-2xl">Settings - Coming Soon</h1></div></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
