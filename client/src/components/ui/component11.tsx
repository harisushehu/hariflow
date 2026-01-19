import React from 'react';

interface Component11Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component11({ title, children }: Component11Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
