'use client';

import { X, AlertTriangle } from 'lucide-react';

export const AnnouncementCard = ({ title, message, type = 'info', onDismiss }) => {
  const styles = {
    warning: 'bg-orange-50 border-orange-100 text-orange-800',
    info: 'bg-blue-50 border-blue-100 text-blue-800',
    success: 'bg-green-50 border-green-100 text-green-800',
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type]} relative`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-white/50 backdrop-blur-sm`}>
            <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{title}</h4>
          <p className="text-xs opacity-90 leading-relaxed">{message}</p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-current opacity-50 hover:opacity-100">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
