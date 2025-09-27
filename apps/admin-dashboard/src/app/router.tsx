import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginForm } from '../modules/auth/components/login-form';
import { AuthGuard } from '../modules/shared/components/auth-guard';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <div>Admin Dashboard Home</div>
          </AuthGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
