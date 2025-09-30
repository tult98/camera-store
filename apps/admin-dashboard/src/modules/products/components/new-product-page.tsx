import React, { useState } from 'react';
import { RichTextEditor } from '@modules/shared/components/rich-text-editor';

export const NewProductPage: React.FC = () => {
  const [description, setDescription] = useState('');
  const [productName, setProductName] = useState('');

  const handleDescriptionChange = (html: string) => {
    setDescription(html);
  };

  const handleError = (error: string) => {
    console.error('Editor error:', error);
    // You could show a toast notification here
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Product</h1>
        <p className="text-gray-600">
          Create a new product for your camera store.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-2">
            Product Description
          </label>
          <RichTextEditor
            content={description}
            onChange={handleDescriptionChange}
            placeholder="Enter a detailed product description..."
            minHeight={200}
            maxHeight={500}
            onError={handleError}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150"
          >
            Save Product
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-150"
          >
            Cancel
          </button>
        </div>

        {description && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Generated HTML:</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">
              {description}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};