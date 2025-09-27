import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthGuard } from '../../modules/shared/components/auth-guard';
import { AdminLayout } from '../../modules/shared/components/layouts/admin-layout';
import { NotFoundPage } from '../../modules/shared/components/not-found-page';
import { DashboardPage } from '../../modules/dashboard/components/dashboard-page';
import { CategoriesPage } from '../../modules/categories/components/categories-page';

export const ProtectedRoutes: React.FC = () => {
  return (
    <AuthGuard>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AdminLayout>
    </AuthGuard>
  );
};