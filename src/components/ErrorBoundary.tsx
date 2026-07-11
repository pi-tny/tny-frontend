import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

/** Captura erros de renderização e exibe um fallback em vez de tela branca. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <p className="font-display text-6xl font-bold text-white/10">Ops</p>
          <h1 className="mt-4 text-2xl font-semibold text-ink">Algo deu errado</h1>
          <p className="mt-2 max-w-sm text-sm text-ink-muted">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button
            onClick={this.handleReload}
            className="mt-6 inline-flex rounded-pill bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-100 active:scale-95"
          >
            Voltar para a loja
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
