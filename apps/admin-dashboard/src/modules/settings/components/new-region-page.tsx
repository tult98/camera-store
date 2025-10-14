import React from 'react';
import { RegionForm } from './region-form';

export const NewRegionPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Region</h1>
        <p className="text-gray-600">
          Create a new region to manage currencies, countries, and payment providers.
        </p>
      </div>

      <RegionForm />
    </div>
  );
};
