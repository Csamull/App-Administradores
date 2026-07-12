import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Agencias from "./pages/Agencias";
import Usuarios from "./pages/Usuarios";
import Produtos from "./pages/Produtos";
import Parceiros from "./pages/Parceiros";
import Pedidos from "./pages/Pedidos";
import Contratos from "./pages/Contratos";
import Promocoes from "./pages/Promocoes";
import Servicos from "./pages/Servicos";
import RelatoriosParceiro from "./pages/RelatoriosParceiro";
import Cadastros from "./pages/Cadastros";
import Financeiro from "./pages/Financeiro";
import Suporte from "./pages/Suporte";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/agencias" element={<Agencias />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/parceiros" element={<Parceiros />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/promocoes" element={<Promocoes />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/relatorios-parceiro" element={<RelatoriosParceiro />} />
          <Route path="/cadastros" element={<Cadastros />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/suporte" element={<Suporte />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
