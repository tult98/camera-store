'use client';

import React, { useState } from 'react';
import { ConfirmationModal } from './index';

export const ConfirmationModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState<'danger' | 'warning' | 'info'>('danger');

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setIsOpen(false);
    alert('Action confirmed!');
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Confirmation Modal Demo</h2>
      
      <div className="space-y-4">
        <div className="space-x-4">
          <button
            onClick={() => {
              setVariant('danger');
              setIsOpen(true);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Open Danger Modal
          </button>
          
          <button
            onClick={() => {
              setVariant('warning');
              setIsOpen(true);
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Open Warning Modal
          </button>
          
          <button
            onClick={() => {
              setVariant('info');
              setIsOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Open Info Modal
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title={
          variant === 'danger' 
            ? 'Deactivate account'
            : variant === 'warning'
            ? 'Warning: This action requires attention'
            : 'Information'
        }
        description={
          variant === 'danger'
            ? 'Are you sure you want to deactivate your account? All of your data will be permanently removed from our servers forever. This action cannot be undone.'
            : variant === 'warning'
            ? 'This action may have consequences. Please review carefully before proceeding.'
            : 'This is an informational message. Please review the details before proceeding.'
        }
        confirmText={variant === 'danger' ? 'Deactivate' : 'Confirm'}
        cancelText="Cancel"
        variant={variant}
        loading={loading}
      />
    </div>
  );
};