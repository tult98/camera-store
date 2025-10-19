import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CategoriesPage } from '../../modules/categories/components/categories-page';
import { EditCategoryPage } from '../../modules/categories/components/edit-category-page';
import { NewCategoryPage } from '../../modules/categories/components/new-category-page';
import { DashboardPage } from '../../modules/dashboard/components/dashboard-page';
import { ProductsPage } from '../../modules/products/components/products-page';
import { NewProductPage } from '../../modules/products/components/new-product-page';
import { EditProductPage } from '../../modules/products/components/edit-product-page';
import { BrandsPage } from '../../modules/brands/components/brands-page';
import { NewBrandPage } from '../../modules/brands/components/new-brand-page';
import { AttributeTemplatesPage } from '../../modules/attribute-templates/components/attribute-templates-page';
import { NewAttributeTemplatePage } from '../../modules/attribute-templates/components/new-attribute-template-page';
import { EditAttributeTemplatePage } from '../../modules/attribute-templates/components/edit-attribute-template-page';
import { BannerSettingsPage } from '../../modules/settings/components/banner-settings-page';
import { RegionsPage } from '../../modules/settings/components/regions-page';
import { NewRegionPage } from '../../modules/settings/components/new-region-page';
import { EditRegionPage } from '../../modules/settings/components/edit-region-page';
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
          <Route path="/brands/new" element={<NewBrandPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/products/new" element={<NewProductPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/attribute-templates/new" element={<NewAttributeTemplatePage />} />
          <Route path="/attribute-templates/:id/edit" element={<EditAttributeTemplatePage />} />
          <Route path="/attribute-templates" element={<AttributeTemplatesPage />} />
          <Route path="/settings/banner" element={<BannerSettingsPage />} />
          <Route path="/settings/regions/new" element={<NewRegionPage />} />
          <Route path="/settings/regions/:id/edit" element={<EditRegionPage />} />
          <Route path="/settings/regions" element={<RegionsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AdminLayout>
    </AuthGuard>
  );
};
