import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Toast } from "@/components/Toast";

const ToastCtx = createContext(
  /** @type {{ showToast: (msg: string, variant?: 'success'|'error'|'info') => void }} */ (
    null
  ),
);

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(
    /** @type {{ message: string; variant: 'success'|'error'|'info' } | null} */ (
      null
    ),
  );

  const showToast = useCallback((message, variant = "info") => {
    setToast({ message, variant });
    window.setTimeout(() => setToast(null), 4200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {toast ? (
        <Toast message={toast.message} variant={toast.variant} />
      ) : null}
    </ToastCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with lightweight provider
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
