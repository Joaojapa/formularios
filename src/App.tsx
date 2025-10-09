import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { FileText } from "lucide-react";

import Home from "./pages/Home";
import FormAP from "./pages/FormAP";
import FormAS from "./pages/FormAS";
import FormAV from "./pages/FormAV";
import FormAR from "./pages/FormAR";
import FormCC from "./pages/FormCC";
import FormBFF from "./pages/FormBFF";
import FormCD from "./pages/FormCD";
import FormPCS from "./pages/FormPCS";
import FormPCV from "./pages/FormPCV";
import FormBCB from "./pages/FormBCB";
import FormRPS from "./pages/FormRPS";
import NotFound from "./pages/NotFound";
import Login from "./pages/login";


const queryClient = new QueryClient();

function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/ap", label: "AP", icon: FileText },
    { path: "/as", label: "AS", icon: FileText },
    { path: "/av", label: "AV", icon: FileText },
    { path: "/ar", label: "AR", icon: FileText },
    { path: "/cc", label: "CC", icon: FileText },
    { path: "/bff", label: "BFF", icon: FileText },
    { path: "/cd", label: "CD", icon: FileText },
    { path: "/pcs", label: "PCS", icon: FileText },
    { path: "/pcv", label: "PCV", icon: FileText },
    { path: "/bcb", label: "BCB", icon: FileText },
    { path: "/rps", label: "RPS", icon: FileText },
  ];

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg rounded-b-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Nome do sistema */}
          <Link
            to="/"
            className="text-xl font-bold hover:opacity-80 transition-opacity"
          >
            SINPAF
          </Link>

          {/* Botão de login */}
          <Link
            to="/login"
            className="bg-white text-primary px-4 py-2 rounded-xl hover:bg-primary-foreground/20 transition font-medium"
          >
            Login
          </Link>

          {/* Menu de formulários */}
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    isActive(item.path)
                      ? "bg-primary-foreground text-primary"
                      : "hover:bg-primary-foreground/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ap" element={<FormAP />} />
          <Route path="/as" element={<FormAS />} />
          <Route path="/av" element={<FormAV />} />
          <Route path="/ar" element={<FormAR />} />
          <Route path="/cc" element={<FormCC />} />
          <Route path="/bff" element={<FormBFF />} />
          <Route path="/cd" element={<FormCD />} />
          <Route path="/pcs" element={<FormPCS />} />
          <Route path="/pcv" element={<FormPCV />} />
          <Route path="/bcb" element={<FormBCB />} />
          <Route path="/rps" element={<FormRPS />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
