import React from 'react';

interface Component17Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component17({ title, children }: Component17Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
