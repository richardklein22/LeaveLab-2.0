import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Log In | LeaveLab',
  description: 'Log in to your LeaveLab account',
};

function LoginFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full bg-white/5" />
      <Skeleton className="h-12 w-full bg-white/5" />
      <Skeleton className="h-12 w-full bg-white/5" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Card className="w-full glass border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none" />
      <CardHeader className="space-y-3 relative z-10">
        <CardTitle className="text-4xl font-black text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-lg">
          Log in to continue your digital nomad journey
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
