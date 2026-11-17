'use client';

import { ReactNode, useState } from 'react';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { wagmiConfig } from '@/lib/wagmi';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-900">
      <div className="w-full max-w-md p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-center">
        <h3 className="text-xl font-bold text-red-400 mb-2">Ошибка подключения кошелька</h3>
        <p className="text-sm text-red-200/80 mb-6 break-words">{message}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
          >
            Попробовать ещё раз
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-5 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
          >
            На главную
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 transition"
          >
            Перезагрузить
          </button>
        </div>
      </div>
    </div>
  );
};

const handleWalletError = (error: unknown, info: { componentStack?: string | null }) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('[Web3Provider] Wallet error caught:', message);
  if (info.componentStack) {
    console.debug('[Web3Provider] Component stack:', info.componentStack);
  }
};

const customTheme = darkTheme({
  accentColor: 'blue',
  accentColorForeground: '#FFFFFF',
});

const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleWalletError}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={customTheme} modalSize="compact">
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
};

export default Web3Provider;
