'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle2, XCircle } from 'lucide-react';

interface Provider {
  id: string;
  provider: string;
  email?: string;
  created_at: string;
}

interface ConnectedAccountsData {
  providers: Provider[];
  hasPassword: boolean;
}

export function ConnectedAccounts() {
  const [data, setData] = useState<ConnectedAccountsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlinking, setUnlinking] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/account/providers');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch connected accounts');
      }

      setData(result);
    } catch (err) {
      console.error('Error fetching providers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load connected accounts');
    } finally {
      setLoading(false);
    }
  };

  const unlinkProvider = async (providerId: string, providerName: string) => {
    if (
      !confirm(
        `Are you sure you want to disconnect ${providerName}? Make sure you have another way to log in.`
      )
    ) {
      return;
    }

    try {
      setUnlinking(providerId);
      setError(null);

      const response = await fetch('/api/v1/account/providers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider_id: providerId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to unlink account');
      }

      // Refresh providers list
      await fetchProviders();
    } catch (err) {
      console.error('Error unlinking provider:', err);
      setError(err instanceof Error ? err.message : 'Failed to unlink account');
    } finally {
      setUnlinking(null);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'google':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        );
      case 'email':
        return <Mail className="h-5 w-5" />;
      default:
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  const getProviderName = (provider: string) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading connected accounts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  const canUnlink = data.providers.length > 1 || data.hasPassword;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Connected Accounts</h3>
        <p className="text-sm text-muted-foreground">
          Manage how you sign in to your LeaveLab account.
        </p>
      </div>

      <div className="space-y-4">
        {/* Email/Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">Email & Password</CardTitle>
                  <CardDescription className="mt-1">
                    {data.hasPassword ? 'Set up' : 'Not set up'}
                  </CardDescription>
                </div>
              </div>
              <div>
                {data.hasPassword ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* OAuth Providers */}
        {data.providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getProviderIcon(provider.provider)}
                  <div>
                    <CardTitle className="text-base">{getProviderName(provider.provider)}</CardTitle>
                    <CardDescription className="mt-1">
                      {provider.email && <div>{provider.email}</div>}
                      <div className="text-xs">Connected {formatDate(provider.created_at)}</div>
                    </CardDescription>
                  </div>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => unlinkProvider(provider.id, getProviderName(provider.provider))}
                    disabled={!canUnlink || unlinking === provider.id}
                    className="tap-target"
                  >
                    {unlinking === provider.id ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      'Disconnect'
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {!canUnlink && (
        <Alert>
          <AlertDescription>
            You must have at least one way to log in. Add another sign-in method before disconnecting
            this one.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
