import { createContext, useContext, useState, type ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

interface Confirm {
  message: string;
  resolve: (value: boolean) => void;
}

interface ToasterContextType {
  toasts: Toast[];
  toast: (message: string, type?: Toast["type"]) => void;
  confirm: (message: string) => Promise<boolean>;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

let toastId = 0;

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentConfirm, setCurrentConfirm] = useState<Confirm | null>(null);

  const toast = (message: string, type: Toast["type"] = "info") => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const confirm = (message: string) => {
    return new Promise<boolean>((resolve) => {
      setCurrentConfirm({ message, resolve });
    });
  };

  const handleConfirm = (value: boolean) => {
    if (currentConfirm) {
      currentConfirm.resolve(value);
      setCurrentConfirm(null);
    }
  };

  return (
    <ToasterContext.Provider value={{ toasts, toast, confirm }}>
      {children}

      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow text-white pointer-events-auto ${
              t.type === "success"
                ? "bg-green-500"
                : t.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {currentConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm pointer-events-auto"></div>
          <div className="bg-white p-6 rounded shadow-lg w-96 pointer-events-auto relative z-10">
            <p className="text-gray-800 mb-4">{currentConfirm.message}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => handleConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleConfirm(true)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ToasterContext.Provider>
  );
};

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }
  return context;
};
