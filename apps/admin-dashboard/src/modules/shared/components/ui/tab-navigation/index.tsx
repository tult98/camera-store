import { cn } from '@modules/shared/utils/cn';
import React from 'react';

interface TabItem {
  label: string;
  disabled?: boolean;
}

interface TabNavigationProps {
  currentTab: number;
  totalTabs: number;
  tabs: TabItem[];
  onTabClick?: (tab: number) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  currentTab,
  totalTabs,
  tabs,
  onTabClick,
  className = '',
}) => {
  const handleTabClick = (tabNumber: number) => {
    const tab = tabs[tabNumber - 1];
    if (onTabClick && !tab?.disabled) {
      onTabClick(tabNumber);
    }
  };

  return (
    <div className={cn('w-full', className)} role="tablist">
      <div className="flex border-b border-gray-200">
        {Array.from({ length: totalTabs }, (_, index) => {
          const tabNumber = index + 1;
          const tab = tabs[index];
          const isActive = tabNumber === currentTab;
          const isDisabled = tab?.disabled || false;

          return (
            <button
              key={tabNumber}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDisabled}
              onClick={() => handleTabClick(tabNumber)}
              disabled={isDisabled}
              className={cn(
                'flex-1 px-6 py-3 text-sm font-medium transition-colors',
                'border-b-2 focus:outline-none',
                {
                  'border-blue-600 text-blue-600': isActive && !isDisabled,
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                    !isActive && !isDisabled,
                  'border-transparent text-gray-300 cursor-not-allowed':
                    isDisabled,
                  'cursor-pointer': !isDisabled,
                }
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <span
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    {
                      'bg-blue-600 text-white': isActive && !isDisabled,
                      'bg-gray-200 text-gray-600': !isActive && !isDisabled,
                      'bg-gray-100 text-gray-300': isDisabled,
                    }
                  )}
                >
                  {tabNumber}
                </span>
                <span>{tab?.label || `Tab ${tabNumber}`}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
