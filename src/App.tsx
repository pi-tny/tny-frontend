import { useContext } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Toast } from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import { ToastProvider, ToastContext } from "./context/ToastContext";
import { AppRoutes } from "./routes/AppRoutes";

function AppContent() {
  const toastContext = useContext(ToastContext);
  const { pathname } = useLocation();
  // O painel administrativo não usa a vitrine (header/footer da loja).
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-bg text-ink">
      {!isAdmin && <Header />}

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>

      {!isAdmin && <Footer />}

      {toastContext && (
        <Toast
          message={toastContext.message}
          type={toastContext.type}
          isVisible={toastContext.isVisible}
          onClose={toastContext.hideToast}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CarrinhoProvider>
            <AppContent />
          </CarrinhoProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}