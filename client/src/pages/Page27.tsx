import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Pagei() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      // Simulate data fetching
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([{ id: 1, name: 'Item 1' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Page i</h1>
      
      <Card className="p-6 mb-6">
        <p className="text-gray-600 mb-4">This is page i with data management functionality.</p>
        <Button onClick={handleAction} disabled={loading}>
          {loading ? 'Loading...' : 'Load Data'}
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item: any) => (
          <Card key={item.id} className="p-4">
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-sm text-gray-600">Item ID: {item.id}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
