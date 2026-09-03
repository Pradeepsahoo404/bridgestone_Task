'use client';

import { useEffect } from'react';
import { AlertCircle, RefreshCw } from'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app boundary error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
      <AlertCircle className="w-12 h-12 text-rose-500 animate-bounce" />
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <p className="text-xs text-neutral-400 max-w-md">{error.message ||'An unexpected application error occurred.'}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-all flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Reset Application
      </button>
    </div>
  );
}
