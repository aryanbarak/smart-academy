import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const duration = toast.duration || 4000;
    const timer = setTimeout(() => onRemove(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const bgColor = 
    toast.type === 'success' ? 'bg-green-500' :
    toast.type === 'error' ? 'bg-red-500' :
    'bg-blue-500';

  const icon =
    toast.type === 'success' ? '✓' :
    toast.type === 'error' ? '✕' :
    'ℹ';

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in-up`}
    >
      <span className="font-bold text-lg flex-shrink-0">{icon}</span>
      <div className="flex-1">
        <p className="text-sm">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-lg font-bold hover:opacity-75 transition-opacity flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
