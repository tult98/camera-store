import React from 'react';
import { useParams } from 'react-router-dom';

export const EditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-600 mt-1">
          Editing category with ID: {id}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">
          Edit form implementation will be added here.
        </p>
      </div>
    </div>
  );
};