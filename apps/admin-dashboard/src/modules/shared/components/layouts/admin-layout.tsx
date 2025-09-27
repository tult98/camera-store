import { UserIcon } from '@heroicons/react/24/solid';
import { AdminUser } from '@medusajs/types';
import { useCurrentUser } from '@modules/shared/hooks/use-current-user';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { navigationItems } from '@modules/shared/config/navigation-config';
import { NavigationItem } from '../navigation-item';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const getFullName = (user: AdminUser) => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.first_name || 'Admin User';
};

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { data, isLoading } = useCurrentUser();
  const location = useLocation();

  const user = data?.user || ({} as AdminUser);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo Section */}
        <div className="h-16 border-b border-gray-200 flex items-center px-6">
          <img
            src="/logo.png"
            alt="PH Camera - Admin Dashboard"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  isActive={location.pathname === item.path}
                />
              ))}
            </div>
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {isLoading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              ) : user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.first_name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-6 h-6 text-gray-600" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              {isLoading ? (
                <>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-gray-900">
                    {getFullName(user)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email || 'Loading...'}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 min-h-full w-full">
          <div className="bg-white h-full rounded-lg shadow-sm border border-gray-200">{children}</div>
        </div>
      </div>
    </div>
  );
};
