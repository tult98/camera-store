import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { setOnLogoutCallback } from '../api/core-api-client';

interface AuthCallbackProviderProps {
  children: React.ReactNode;
}

export const AuthCallbackProvider: React.FC<AuthCallbackProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setOnLogoutCallback(() => {
      queryClient.clear();
      navigate('/login');
    });
  }, [navigate, queryClient]);

  return <>{children}</>;
};
