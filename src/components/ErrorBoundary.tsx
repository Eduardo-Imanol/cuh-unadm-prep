import { Component, type ErrorInfo, type ReactNode } from 'react';
import { GraduationCap, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Ocurrió un error inesperado.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 dark:bg-navy-dark">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-navy-light shadow-xl shadow-navy/30 ring-1 ring-navy/10">
          <GraduationCap className="size-8 text-emerald" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-xl font-bold text-navy dark:text-slate-100">
          Algo salió mal
        </h1>
        <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Se produjo un error inesperado al cargar la aplicación. Puedes intentar recargar la
          página para continuar.
        </p>
        {this.state.message ? (
          <p className="mt-3 max-w-md rounded-xl bg-rose-50 px-4 py-2 text-center font-mono text-xs text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            {this.state.message}
          </p>
        ) : null}
        <button
          type="button"
          onClick={this.handleReload}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-emerald/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald/30 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Recargar página
        </button>
      </div>
    );
  }
}
