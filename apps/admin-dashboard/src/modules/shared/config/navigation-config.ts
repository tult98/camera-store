import {
  Cog6ToothIcon,
  CubeIcon,
  GlobeAmericasIcon,
  HomeIcon,
  PhotoIcon,
  RectangleStackIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

export interface BreadcrumbChild {
  path: string;
  label: string;
  dynamic?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  children?: NavigationItem[];
  breadcrumbConfig?: {
    showInBreadcrumb?: boolean;
    children?: BreadcrumbChild[];
  };
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: HomeIcon,
    breadcrumbConfig: {
      showInBreadcrumb: false,
    },
  },
  {
    id: 'products',
    label: 'Products',
    path: '/products',
    icon: CubeIcon,
    breadcrumbConfig: {
      children: [
        { path: '/products/new', label: 'New Product' },
        { path: '/products/:id/edit', label: 'Edit Product', dynamic: true },
      ],
    },
  },
  {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: TagIcon,
    breadcrumbConfig: {
      children: [
        { path: '/categories/new', label: 'New Category' },
        { path: '/categories/:id/edit', label: 'Edit Category', dynamic: true },
      ],
    },
  },
  {
    id: 'attribute-templates',
    label: 'Attribute Templates',
    path: '/attribute-templates',
    icon: RectangleStackIcon,
    breadcrumbConfig: {
      children: [
        { path: '/attribute-templates/new', label: 'New Template' },
        {
          path: '/attribute-templates/:id/edit',
          label: 'Edit Template',
          dynamic: true,
        },
      ],
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: Cog6ToothIcon,
    breadcrumbConfig: {
      children: [
        { path: '/settings/banner', label: 'Banner' },
        { path: '/settings/regions', label: 'Regions' },
      ],
    },
    children: [
      {
        id: 'banner',
        label: 'Banner',
        path: '/settings/banner',
        icon: PhotoIcon,
      },
      {
        id: 'regions',
        label: 'Regions',
        path: '/settings/regions',
        icon: GlobeAmericasIcon,
      },
    ],
  },
];
