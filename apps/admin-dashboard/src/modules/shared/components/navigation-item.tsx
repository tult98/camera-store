import { cn } from '@modules/shared/utils/cn';
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItem as NavigationItemType } from '../config/navigation-config';

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
}

const NavigationItemComponent: React.FC<NavigationItemProps> = ({
  item,
  isActive,
}) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center px-3 py-2 rounded-md text-sm font-medium',
        'transition-colors duration-150',
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

export const NavigationItem = React.memo(NavigationItemComponent);
