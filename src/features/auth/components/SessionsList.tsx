'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Monitor, Smartphone, Tablet, Globe } from 'lucide-react';

interface Session {
  id: string;
  created_at: string;
  last_active: string;
  ip_address: string;
  user_agent: string;
  is_current: boolean;
}

export function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/account/sessions');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sessions');
      }

      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const revokeAllOtherSessions = async () => {
    if (!confirm('Are you sure you want to log out from all other devices?')) {
      return;
    }

    try {
      setRevoking(true);
      setError(null);

      const response = await fetch('/api/v1/account/sessions', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to revoke sessions');
      }

      // Refresh sessions list
      await fetchSessions();

      alert('Successfully logged out from all other devices');
    } catch (err) {
      console.error('Error revoking sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to revoke sessions');
    } finally {
      setRevoking(false);
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="h-5 w-5 text-muted-foreground" />;
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className="h-5 w-5 text-muted-foreground" />;
    }
    return <Monitor className="h-5 w-5 text-muted-foreground" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading sessions...</span>
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Active Sessions</h3>
        <p className="text-sm text-muted-foreground">
          Manage where you're logged in and sign out from other devices.
        </p>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No active sessions found.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getDeviceIcon(session.user_agent)}
                      <div>
                        <CardTitle className="text-base">
                          {session.user_agent.split('/')[0] || 'Unknown Browser'}
                          {session.is_current && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Current session
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1 space-y-1">
                          <div className="flex items-center text-xs">
                            <Globe className="mr-1 h-3 w-3" />
                            {session.ip_address}
                          </div>
                          <div className="text-xs">Last active: {formatDate(session.last_active)}</div>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {sessions.length > 1 && (
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={revokeAllOtherSessions}
                disabled={revoking}
                className="tap-target"
              >
                {revoking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log out from all other devices
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
