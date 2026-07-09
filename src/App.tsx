import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // 1. Adicione esta importação
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Toast } from "./components/Toast";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import { ToastProvider, ToastContext } from "./context/ToastContext";
import { AppRoutes } from "./routes/AppRoutes";

function AppContent() {
  const toastContext = useContext(ToastContext);

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AppRoutes />
      </main>

      <Footer />

      {toastContext && (
        <Toast
          message={toastContext.message}
          isVisible={toastContext.isVisible}
          onClose={toastContext.hideToast}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider> {/* 2. Envolva tudo aqui */}
      <BrowserRouter>
        <ToastProvider>
          <CarrinhoProvider>
            <AppContent />
          </CarrinhoProvider>
        </ToastProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}