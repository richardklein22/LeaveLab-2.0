import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Log In | LeaveLab',
  description: 'Log in to your LeaveLab account',
};

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
        <LoginForm />
      </CardContent>
    </Card>
  );
}
