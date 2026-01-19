import React from 'react';

interface Component3Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component3({ title, children }: Component3Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
