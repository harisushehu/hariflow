import React from 'react';

interface Component16Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component16({ title, children }: Component16Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
