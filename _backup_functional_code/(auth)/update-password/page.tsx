import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdatePasswordForm } from '@/features/auth/components/UpdatePasswordForm';

export const metadata: Metadata = {
  title: 'Update Password | LeaveLab',
  description: 'Set your new password',
};

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center">
              Set new password
            </CardTitle>
            <CardDescription className="text-center">
              Choose a strong password for your LeaveLab account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
