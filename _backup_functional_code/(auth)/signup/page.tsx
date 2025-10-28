import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Create Account | LeaveLab',
  description: 'Create your LeaveLab account to start your digital nomad journey',
};

export default function SignupPage() {
  return (
    <Card className="w-full glass border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none" />
      <CardHeader className="space-y-3 relative z-10">
        <div className="flex justify-center mb-2">
          <div className="inline-flex items-center gap-2 glass-red px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-brand-red animate-pulse" />
            <span className="text-sm font-bold text-brand-red-200">Start Free</span>
          </div>
        </div>
        <CardTitle className="text-4xl font-black text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Join LeaveLab
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-lg">
          Create your account and break free from location
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <SignupForm />
      </CardContent>
    </Card>
  );
}
