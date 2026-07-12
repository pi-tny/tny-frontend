import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Promocoes } from "../components/Promocoes";
import { Carrinho } from "../pages/Carrinho";
import { Checkout } from "../pages/Checkout";
import { Home } from "../pages/Home";
import { Faq } from "../pages/Faq";
import { Institucional } from "../pages/Institucional";
import { NotFound } from "../pages/NotFound";
import { PedidoConfirmado } from "../pages/PedidoConfirmado";
import { Produto } from "../pages/Produto";
import { Produtos } from "../pages/Produtos";
import { Revendedor } from "../pages/Revendedor";
import { Dashboard } from "../pages/admin/Dashboard";
import { CadastroProduto } from "../pages/admin/CadastroProduto";
import { GerenciarEstoque } from "../pages/admin/GerenciarEstoque";
import { LoginAdmin } from "../pages/admin/Login";
import { Pedidos } from "../pages/admin/Pedidos";
import { PedidoDetalhe } from "../pages/admin/PedidoDetalhe";
import { Categorias } from "../pages/admin/Categorias";
import { Leads } from "../pages/admin/Leads";
import { Admins } from "../pages/admin/Admins";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/promocoes" element={<Promocoes />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/produto/:id" element={<Produto />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
      <Route path="/institucional" element={<Institucional />} />
      <Route path="/revendedor" element={<Revendedor />} />

      {/* admin */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cadastro-produto"
        element={
          <ProtectedRoute>
            <CadastroProduto />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/produtos/:id/editar"
        element={
          <ProtectedRoute>
            <CadastroProduto />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/gerenciar-estoque"
        element={
          <ProtectedRoute>
            <GerenciarEstoque />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pedidos"
        element={
          <ProtectedRoute>
            <Pedidos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pedidos/:id"
        element={
          <ProtectedRoute>
            <PedidoDetalhe />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <ProtectedRoute>
            <Categorias />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leads"
        element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/admins"
        element={
          <ProtectedRoute>
            <Admins />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}