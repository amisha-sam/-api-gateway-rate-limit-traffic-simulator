import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../../utils/validators';
import type { z } from 'zod';
import { PasswordInput } from '../../components/Form/PasswordInput';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';

type FormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { token } as any });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.resetPassword(data.token, data.password);
      alert('Password reset. You may now sign in.');
      navigate('/login');
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <div className="p-6 max-w-md w-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Reset password</h2>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('token')} />
            <PasswordInput label="New password" {...register('password')} error={errors.password?.message as string | undefined} />
            <PasswordInput label="Confirm password" {...register('confirmPassword')} error={errors.confirmPassword?.message as string | undefined} />
            <Button type="submit" loading={isSubmitting} className="w-full">Reset password</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
