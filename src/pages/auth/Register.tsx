import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validators';
import type { z } from 'zod';
import { Input } from '../../components/Form/Input';
import { PasswordInput } from '../../components/Form/PasswordInput';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';

type RegisterData = z.infer<typeof registerSchema>;

const roles = ['Backend Engineer', 'System Architect', 'DevOps Engineer', 'SRE', 'QA Lead'] as const;

function passwordStrength(pw: string) {
  let score = 0;
  if (!pw) return { score, label: 'Too weak' };
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const label = ['Very weak', 'Weak', 'Okay', 'Strong', 'Very strong'][Math.min(score, 4)];
  return { score, label };
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const pw = watch('password') || '';
  const strength = useMemo(() => passwordStrength(pw), [pw]);

  const onSubmit = async (data: RegisterData) => {
    try {
      await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        email: data.email,
        role: data.role,
        password: data.password,
      });
      alert('Account created. Please check your email to verify your account.');
      navigate('/login');
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold">Create your Pulsegate account</h2>
          <p className="text-sm text-gray-400 mt-1">Enterprise onboarding</p>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First name" {...register('firstName')} error={errors.firstName?.message as string | undefined} />
            <Input label="Last name" {...register('lastName')} error={errors.lastName?.message as string | undefined} />
            <Input label="Company name" {...register('company')} error={errors.company?.message as string | undefined} />
            <Input label="Company email" {...register('email')} error={errors.email?.message as string | undefined} />
            <div>
              <label className="block text-sm font-medium mb-1">Job role</label>
              <select {...register('role')} className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm">
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <PasswordInput label="Password" {...register('password')} error={errors.password?.message as string | undefined} />
              <div className="mt-2 text-xs text-gray-300">Strength: <span className="font-medium">{strength.label}</span></div>
              <div className="w-full bg-gray-800 h-2 rounded mt-2">
                <div className={`h-2 rounded bg-gradient-to-r from-indigo-500 to-pink-500`} style={{ width: `${(strength.score / 4) * 100}%` }} />
              </div>
            </div>

            <div>
              <PasswordInput label="Confirm password" {...register('confirmPassword')} error={errors.confirmPassword?.message as string | undefined} />
            </div>

            <div className="md:col-span-2 flex items-center">
              <input type="checkbox" className="mr-2" {...register('agree')} />
              <div className="text-sm text-gray-300">I agree to the <a className="text-indigo-400 hover:underline" href="#">Terms</a> and <a className="text-indigo-400 hover:underline" href="#">Privacy Policy</a></div>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" loading={isSubmitting} className="w-full">Create account</Button>
            </div>

            <p className="text-center text-sm text-gray-400 md:col-span-2">Already have an account? <Link to="/login" className="text-indigo-400">Sign in</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};
