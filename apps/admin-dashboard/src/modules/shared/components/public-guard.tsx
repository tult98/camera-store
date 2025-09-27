import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingIcon } from './ui/loading-icon';
import { useCurrentUser } from '../hooks/use-current-user';

interface PublicGuardProps {
  children: React.ReactNode;
}

export const PublicGuard: React.FC<PublicGuardProps> = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIcon size="lg" />
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    const returnTo = location.state?.returnTo || '/';
    return <Navigate to={returnTo} replace />;
  }

  // User not authenticated, show public content
  return children;
};
