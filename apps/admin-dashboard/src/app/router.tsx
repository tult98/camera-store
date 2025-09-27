import { Route, Routes } from 'react-router-dom';
import { PUBLIC_ROUTES } from './routes/constants';
import { getPublicPageComponent } from './routes/page-mapper';
import { ProtectedRoutes } from './routes/protected-routes';
import { PublicGuard } from '../modules/shared/components/public-guard';
import { PublicLayout } from '../modules/shared/components/layouts/public-layout';

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes mapped from constants */}
      {PUBLIC_ROUTES.map(path => (
        <Route 
          key={path} 
          path={path} 
          element={
            <PublicGuard>
              <PublicLayout>
                {getPublicPageComponent(path)}
              </PublicLayout>
            </PublicGuard>
          } 
        />
      ))}
      
      {/* Everything else is protected */}
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}
