import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 number in blue/purple */}
        <div className="text-6xl font-bold text-blue-600 mb-6">404</div>

        {/* Main heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page not found
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>

        {/* Go back home button */}
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};
