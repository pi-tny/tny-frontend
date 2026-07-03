import { Route, Routes } from "react-router-dom";
import { Promocoes } from "../components/Promocoes";
import { Carrinho } from "../pages/Carrinho";
import { Checkout } from "../pages/Checkout";
import { Home } from "../pages/Home";
import { Institucional } from "../pages/Institucional";
import { Produto } from "../pages/Produto";
import { Revendedor } from "../pages/Revendedor";
import { Dashboard } from "../pages/admin/Dashboard";
import { CadastroProduto } from "../pages/admin/CadastroProduto";
import { GerenciarEstoque } from "../pages/admin/GerenciarEstoque";
import { LoginAdmin } from "../pages/admin/Login"; 

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/promocoes" element={<Promocoes />} />
      <Route path="/produto/:id" element={<Produto />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/institucional" element={<Institucional />} />
      <Route path="/revendedor" element={<Revendedor />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginAdmin />} /> {/* */}
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/cadastro-produto" element={<CadastroProduto />} />
      <Route path="/admin/gerenciar-estoque" element={<GerenciarEstoque />} />
    </Routes>
  );
}