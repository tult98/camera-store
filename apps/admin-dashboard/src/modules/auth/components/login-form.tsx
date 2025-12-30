import { Button } from '@camera-store/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormInput } from '../../shared/components/ui/form-input';
import { loginUser } from '../apiCalls/login';
import { getCurrentUser } from '../apiCalls/user';
import { loginSchema, type LoginSchemaType } from '../types';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

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

  const isFormLoading = loginMutation.isPending || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2 text-sm">Sign in to access the admin panel</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)}>
            {loginMutation.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {loginMutation.error.message || 'Login failed. Please check your credentials and try again.'}
              </div>
            )}
            <FormInput
              name="email"
              control={control}
              type="email"
              label="Email"
              placeholder="Enter your email"
              disabled={isFormLoading}
              inputClassName="!px-4 !py-3"
            />

            <FormInput
              name="password"
              control={control}
              type="password"
              label="Password"
              placeholder="Enter your password"
              disabled={isFormLoading}
              inputClassName="!px-4 !py-3"
            />

            <div className="pt-2">
              <Button intent="primary" disabled={isFormLoading} text="Sign In" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
