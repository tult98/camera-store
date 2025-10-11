import { useStores } from '@/modules/shared/hooks/use-stores';
import { UserIcon } from '@heroicons/react/24/solid';
import { AdminUser } from '@medusajs/types';
import { navigationItems } from '@modules/shared/config/navigation-config';
import { useCurrentUser } from '@modules/shared/hooks/use-current-user';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumb } from '../breadcrumb';
import { NavigationItem } from '../navigation-item';
import { UserProfileDropdown } from '../user-profile-dropdown';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useStores();

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
              {navigationItems.map((item) => {
                const isExactMatch = item.path && location.pathname === item.path;
                const isChildActive = item.children?.some(
                  (child) =>
                    child.path && (location.pathname === child.path ||
                    location.pathname.startsWith(child.path + '/'))
                );
                return (
                  <NavigationItem
                    key={item.id}
                    item={item}
                    isActive={Boolean(isExactMatch || isChildActive)}
                  />
                );
              })}
            </div>
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            {/* Avatar */}
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {isLoading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              ) : user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.first_name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-full h-full text-gray-600" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-left">
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
          </button>

          {/* Dropdown Menu */}
          <UserProfileDropdown
            isOpen={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 min-h-full w-full flex flex-col">
          <div className="bg-white flex-1 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <div className="p-6 h-full flex-1 flex flex-col">
              <Breadcrumb />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
