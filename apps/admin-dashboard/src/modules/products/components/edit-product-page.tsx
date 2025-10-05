import { ProductWizardForm } from '@/modules/products/components/product-wizard-form';
import React from 'react';
import { useParams } from 'react-router-dom';

export const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Product</h1>
        <p className="text-gray-600">
          Update product information and settings.
        </p>
      </div>

      <ProductWizardForm isEditMode={true} productId={id} />
    </div>
  );
};
