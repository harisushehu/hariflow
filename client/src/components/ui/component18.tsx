import React from 'react';

interface Component18Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component18({ title, children }: Component18Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
