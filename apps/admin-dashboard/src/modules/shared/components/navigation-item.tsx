import { cn } from '@modules/shared/utils/cn';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem as NavigationItemType } from '../config/navigation-config';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
  depth?: number;
}

const NavigationItemComponent: React.FC<NavigationItemProps> = ({
  item,
  isActive,
  depth = 0,
}) => {
  const Icon = item.icon;
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;

  const isAnyChildActive = hasChildren && item.children?.some(
    (child) => child.path && (location.pathname === child.path || location.pathname.startsWith(child.path + '/'))
  );

  const [isExpanded, setIsExpanded] = useState(isAnyChildActive || false);

  useEffect(() => {
    if (isAnyChildActive) {
      setIsExpanded(true);
    }
  }, [isAnyChildActive]);

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const itemContent = (
    <div
      className={cn(
        'flex items-center px-3 py-2 rounded-md text-sm font-medium',
        'transition-colors duration-150',
        isActive || isAnyChildActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-100',
        hasChildren && 'cursor-pointer'
      )}
      style={{ paddingLeft: `${depth * 12 + 12}px` }}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
          {item.badge}
        </span>
      )}
      {hasChildren && (
        <span className="ml-auto">
          {isExpanded ? (
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-200" />
          ) : (
            <ChevronRightIcon className="w-4 h-4 transition-transform duration-200" />
          )}
        </span>
      )}
    </div>
  );

  return (
    <div>
      {hasChildren || !item.path ? (
        <div onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}>
          {itemContent}
        </div>
      ) : (
        <Link
          to={item.path}
          aria-current={isActive ? 'page' : undefined}
        >
          {itemContent}
        </Link>
      )}

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavigationItem
              key={child.id}
              item={child}
              isActive={child.path ? location.pathname === child.path : false}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const NavigationItem = React.memo(NavigationItemComponent);
