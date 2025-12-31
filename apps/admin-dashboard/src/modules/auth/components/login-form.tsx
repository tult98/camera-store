import { Form, TextInput, Button } from '@camera-store/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../apiCalls/login';
import { getCurrentUser } from '../apiCalls/user';
import { loginSchema, type LoginSchemaType } from '../types';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await queryClient.prefetchQuery({
        queryKey: ['current-user'],
        queryFn: getCurrentUser,
      });
      const returnTo = location.state?.from?.pathname || '/';
      navigate(returnTo);
    },
  });

  const handleFormSubmit = (data: LoginSchemaType) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2 text-sm">Sign in to access the admin panel</p>
          </div>

          <Form<LoginSchemaType>
            className="space-y-5"
            onSubmit={handleFormSubmit}
            resolver={zodResolver(loginSchema)}
            mode="onChange"
            defaultValues={{ email: '', password: '' }}
          >
            {loginMutation.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {loginMutation.error.message || 'Login failed. Please check your credentials and try again.'}
              </div>
            )}
            <TextInput name="email" type="email" label="Email" placeholder="Enter your email" autoComplete="email" />
            <TextInput
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <Button
              block
              intent="primary"
              disabled={loginMutation.isPending}
              text="Sign In"
              type="submit"
              loading={loginMutation.isPending}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};
