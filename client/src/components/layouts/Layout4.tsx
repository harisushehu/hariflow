import React from 'react';

interface LayoutiProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Layouti({ children, sidebar, header, footer }: LayoutiProps) {
  return (
    <div className="flex flex-col h-screen">
      {header && <header className="bg-white border-b p-4">{header}</header>}
      
      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <aside className="w-64 bg-gray-50 border-r p-4 overflow-y-auto">
            {sidebar}
          </aside>
        )}
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {footer && <footer className="bg-gray-50 border-t p-4">{footer}</footer>}
    </div>
  );
}

export default Layouti;
