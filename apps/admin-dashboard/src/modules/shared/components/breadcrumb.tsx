import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { Link } from 'react-router-dom';
import { useBreadcrumb } from '../hooks/use-breadcrumb';

export const Breadcrumb: React.FC = () => {
  const { breadcrumbs } = useBreadcrumb();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {breadcrumbs.map((item, index) => (
          <li key={index} className={index === 0 ? "inline-flex items-center" : ""}>
            {index === 0 ? (
              // First item (Home) with home icon
              item.path ? (
                <Link
                  to={item.path}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <HomeIcon className="w-3 h-3 me-2.5" aria-hidden="true" />
                  {item.label}
                </Link>
              ) : (
                <span className="inline-flex items-center text-sm font-medium text-gray-500">
                  <HomeIcon className="w-3 h-3 me-2.5" aria-hidden="true" />
                  {item.label}
                </span>
              )
            ) : (
              // Subsequent items with chevron separator
              <div className="flex items-center">
                <ChevronRightIcon
                  className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                />
                {item.path ? (
                  <Link
                    to={item.path}
                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="ms-1 text-sm font-medium text-gray-500 md:ms-2"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
