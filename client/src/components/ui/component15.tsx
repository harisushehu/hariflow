import React from 'react';

interface Component15Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component15({ title, children }: Component15Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
