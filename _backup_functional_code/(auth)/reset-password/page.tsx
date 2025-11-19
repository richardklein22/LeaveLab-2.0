import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reset Password | LeaveLab',
  description: 'Reset your password',
};

export default function ResetPasswordPage() {
  return (
    <Card className="w-full glass border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none" />
      <CardHeader className="space-y-3 relative z-10">
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 rounded-xl glass-red flex items-center justify-center">
            <Shield className="w-8 h-8 text-brand-red" />
          </div>
        </div>
        <CardTitle className="text-4xl font-black text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-base">
          Enter your email and we&apos;ll send you instructions to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
