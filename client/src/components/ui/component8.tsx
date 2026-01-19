import React from 'react';

interface Component8Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component8({ title, children }: Component8Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
