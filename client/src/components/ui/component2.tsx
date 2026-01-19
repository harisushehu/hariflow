import React from 'react';

interface Component2Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component2({ title, children }: Component2Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
