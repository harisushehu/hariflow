import React from 'react';

interface Component20Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component20({ title, children }: Component20Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
