import React, { useState } from 'react';

interface FormiData {
  [key: string]: any;
}

interface FormiProps {
  onSubmit?: (data: FormiData) => void;
  onCancel?: () => void;
}

export function Formi({ onSubmit, onCancel }: FormiProps) {
  const [formData, setFormData] = useState<FormiData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Field 1</label>
        <input
          type="text"
          name="field1"
          value={formData.field1 || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter value"
        />
        {errors.field1 && <p className="text-red-500 text-sm">{errors.field1}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Field 2</label>
        <textarea
          name="field2"
          value={formData.field2 || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter description"
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default Formi;
