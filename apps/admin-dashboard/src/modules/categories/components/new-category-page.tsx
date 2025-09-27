import React from 'react';
import { CategoryForm } from './category-form';

export const NewCategoryPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Category</h1>
        <p className="text-gray-600">
          Create a new category for organizing products.
        </p>
      </div>

      <CategoryForm />
    </div>
  );
};
