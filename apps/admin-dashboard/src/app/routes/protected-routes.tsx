import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthGuard } from '../../modules/shared/components/auth-guard';
import { AdminLayout } from '../../modules/shared/components/layouts/admin-layout';

export const ProtectedRoutes: React.FC = () => {
  return (
    <AuthGuard>
      <AdminLayout>
        <Routes>
          {/* Only dashboard for now */}
          <Route path="/" element={<div>Admin Dashboard Home</div>} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </AdminLayout>
    </AuthGuard>
  );
};