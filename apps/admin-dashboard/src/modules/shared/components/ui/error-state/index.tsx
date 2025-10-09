import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  code?: string | number;
  title?: string;
  message: string;
  actionLabel?: string;
  actionPath?: string;
}

const getDefaultTitle = (code?: string | number): string => {
  if (!code) return 'Error';

  const statusCode = typeof code === 'string' ? parseInt(code, 10) : code;

  switch (statusCode) {
    case 404:
      return 'Page Not Found';
    case 403:
      return 'Access Denied';
    case 401:
      return 'Unauthorized';
    case 500:
      return 'Server Error';
    case 503:
      return 'Service Unavailable';
    default:
      return 'Error';
  }
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  code,
  title,
  message,
  actionLabel = 'Go back home',
  actionPath = '/',
}) => {
  const displayTitle = title || getDefaultTitle(code);

  return (
    <div className="flex items-center justify-center px-4 flex-1">
      <div className="text-center max-w-md mx-auto">
        {code && (
          <div className="text-6xl font-bold text-blue-600 mb-6">{code}</div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {displayTitle}
        </h1>

        <p className="text-gray-600 text-lg mb-8">{message}</p>

        <Link
          to={actionPath}
          className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
};
