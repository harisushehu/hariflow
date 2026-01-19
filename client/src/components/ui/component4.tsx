import React from 'react';

interface Component4Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component4({ title, children }: Component4Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
