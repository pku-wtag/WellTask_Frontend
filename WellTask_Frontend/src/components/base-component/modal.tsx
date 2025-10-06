import React, { type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl shadow-xl w-full max-w-2xl sm:max-w-3xl
                   max-h-[90vh] flex flex-col overflow-hidden relative"
      >
        {onClose && (
          <Button
            type="custom"
            size="small"
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 z-10"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-600" />
          </Button>
        )}

        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};