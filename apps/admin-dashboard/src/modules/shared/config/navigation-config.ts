import { HomeIcon, TagIcon } from '@heroicons/react/24/outline';
import React from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: HomeIcon },
  { id: 'categories', label: 'Categories', path: '/categories', icon: TagIcon },
];
