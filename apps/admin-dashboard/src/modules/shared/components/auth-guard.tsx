import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/use-current-user';
import { LoadingIcon } from './ui/loading-icon';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIcon size="lg" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
