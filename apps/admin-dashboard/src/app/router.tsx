import { Routes, Route, Navigate } from 'react-router-dom';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<div>Admin Dashboard Home</div>} />
      <Route path="/products" element={<div>Products</div>} />
      <Route path="/orders" element={<div>Orders</div>} />
      <Route path="/customers" element={<div>Customers</div>} />
      <Route path="/categories" element={<div>Categories</div>} />
      <Route path="/attributes" element={<div>Attributes</div>} />
      <Route path="/settings" element={<div>Settings</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}