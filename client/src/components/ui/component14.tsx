import React from 'react';

interface Component14Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component14({ title, children }: Component14Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
