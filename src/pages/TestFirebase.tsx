import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function TestFirebase() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Firebase Test Page</h1>
        <p className="text-muted-foreground">
          If you can see this, the basic React setup is working.
        </p>
        
        <div className="mt-4 p-4 bg-card rounded-lg border space-y-2">
          <p className="text-sm">
            Firebase Config Status: {import.meta.env.DEV ? 'Development' : 'Production'}
          </p>
          <p className="text-sm">
            Auth Loading: {loading ? 'Yes' : 'No'}
          </p>
          <p className="text-sm">
            User Status: {user ? `Logged in as ${user.email}` : 'Not logged in'}
          </p>
        </div>

        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>
            Refresh Test
          </Button>
        </div>
      </div>
    </div>
  );
}