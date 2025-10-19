import React from 'react';
import { BrandForm } from './brand-form';

export const NewBrandPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Brand</h1>
        <p className="text-gray-600">
          Create a new brand to organize your products.
        </p>
      </div>

      <BrandForm />
    </div>
  );
};
