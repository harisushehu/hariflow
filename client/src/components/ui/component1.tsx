import React from 'react';

interface Component1Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component1({ title, children }: Component1Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
