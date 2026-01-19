import React from 'react';

interface Component7Props {
  title?: string;
  children?: React.ReactNode;
}

export function Component7({ title, children }: Component7Props) {
  return (
    <div className="p-4 border rounded">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
