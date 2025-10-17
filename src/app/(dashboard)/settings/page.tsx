import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';
import { SessionsList } from '@/features/auth/components/SessionsList';
import { ConnectedAccounts } from '@/features/auth/components/ConnectedAccounts';
import { AccountDeletion } from '@/features/auth/components/AccountDeletion';

export const metadata: Metadata = {
  title: 'Account Settings | LeaveLab',
  description: 'Manage your LeaveLab account settings and security',
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 md:p-8 page-transition safe-area-top safe-area-bottom">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account security and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 overflow-x-auto">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
            <TabsTrigger value="data">Data & Privacy</TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <SessionsList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connected Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <ConnectedAccounts />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data & Privacy Tab */}
          <TabsContent value="data" className="space-y-6">
            <AccountDeletion />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
