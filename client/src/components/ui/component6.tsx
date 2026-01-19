import React from 'react';

interface Component6Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component6({ title, children }: Component6Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
