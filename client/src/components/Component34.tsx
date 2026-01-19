import React from 'react';

interface ComponentiProps {
  title?: string;
  data?: any;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function Componenti({ title, data, onAction, children }: ComponentiProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          {title}
        </h3>
      )}
      
      {data && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex gap-2">
        {onAction && (
          <button
            onClick={onAction}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Action
          </button>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default Componenti;
