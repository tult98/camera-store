import { HomeIcon, TagIcon } from '@heroicons/react/24/outline';
import React from 'react';

export interface BreadcrumbChild {
  path: string;
  label: string;
  dynamic?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
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
];
