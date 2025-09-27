import { Navigate } from 'react-router-dom';
import { LoginForm } from '../../modules/auth/components/login-form';

export const getPublicPageComponent = (path: string) => {
  switch (path) {
    case '/login':
      return <LoginForm />;
    default:
      return <Navigate to="/login" replace />;
  }
};
