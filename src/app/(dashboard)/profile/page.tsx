import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProfileForm } from '@/features/auth/components/ProfileForm';
import { AvatarUpload } from '@/features/auth/components/AvatarUpload';
import { User, Image } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profile Settings | LeaveLab',
  description: 'Manage your LeaveLab profile',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-xl text-gray-400">
            Manage your profile information and preferences
          </p>
        </div>

        {/* Avatar Section */}
        <Card className="glass border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Image className="w-6 h-6 text-brand-red" />
              Profile Picture
            </CardTitle>
            <CardDescription className="text-gray-400">
              Upload a photo to personalise your account
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <AvatarUpload />
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="glass border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-brand-accent" />
              Profile Information
            </CardTitle>
            <CardDescription className="text-gray-400">
              Update your personal details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <ProfileForm />
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="glass border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold text-white">Account</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Email address</p>
              <p className="text-sm text-gray-500">
                Manage your email in account settings
              </p>
            </div>
            <Separator className="bg-white/10" />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Password</p>
              <p className="text-sm text-gray-500">
                Change your password in account settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
