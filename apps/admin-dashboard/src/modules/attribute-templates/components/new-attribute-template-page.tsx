import React from 'react';
import { AttributeTemplateForm } from './attribute-template-form';

export const NewAttributeTemplatePage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          New Attribute Template
        </h1>
        <p className="text-gray-600">
          Create a new attribute template for your products.
        </p>
      </div>

      <AttributeTemplateForm />
    </div>
  );
};
