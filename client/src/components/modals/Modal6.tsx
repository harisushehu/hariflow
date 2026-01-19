import React from 'react';

interface ModaliProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

export function Modali({ isOpen, title, onClose, onConfirm, children }: ModaliProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {title && (
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}

        <div className="px-6 py-4">
          {children || <p>Modal content goes here</p>}
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Close
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modali;
