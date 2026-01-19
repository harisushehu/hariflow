import React from 'react';

interface Component19Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component19({ title, children }: Component19Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
