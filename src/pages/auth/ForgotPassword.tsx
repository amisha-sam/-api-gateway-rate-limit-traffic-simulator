import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../utils/validators';
import type { z } from 'zod';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';

type FormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.forgotPassword(data.email);
      alert('If that email exists in our system a reset link has been sent.');
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Request failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <div className="p-6 max-w-md w-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Forgot your password?</h2>
          <p className="text-sm text-gray-400">Enter your company email and we'll send a reset link.</p>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Company email" {...register('email')} error={errors.email?.message as string | undefined} />
            <Button type="submit" loading={isSubmitting} className="w-full">Send reset link</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
