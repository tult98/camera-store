import { ProductWizardForm } from '@/modules/products/components/product-wizard-form';
import React from 'react';

export const NewProductPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Product</h1>
        <p className="text-gray-600">
          Create a new product for your camera store.
        </p>
      </div>

      <ProductWizardForm />
    </div>
  );
};
