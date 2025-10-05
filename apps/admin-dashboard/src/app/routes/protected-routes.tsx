import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CategoriesPage } from '../../modules/categories/components/categories-page';
import { EditCategoryPage } from '../../modules/categories/components/edit-category-page';
import { NewCategoryPage } from '../../modules/categories/components/new-category-page';
import { DashboardPage } from '../../modules/dashboard/components/dashboard-page';
import { ProductsPage } from '../../modules/products/components/products-page';
import { NewProductPage } from '../../modules/products/components/new-product-page';
import { EditProductPage } from '../../modules/products/components/edit-product-page';
import { AuthGuard } from '../../modules/shared/components/auth-guard';
import { AdminLayout } from '../../modules/shared/components/layouts/admin-layout';
import { NotFoundPage } from '../../modules/shared/components/not-found-page';

export const ProtectedRoutes: React.FC = () => {
  return (
    <AuthGuard>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/categories/new" element={<NewCategoryPage />} />
          <Route path="/categories/:id/edit" element={<EditCategoryPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products/new" element={<NewProductPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AdminLayout>
    </AuthGuard>
  );
};
