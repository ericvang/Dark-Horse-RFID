import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // NOW WE CAN HAVE CONDITIONAL RENDERING AFTER ALL HOOKS ARE CALLED
  
  // Show loading skeleton while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8" role="status" aria-live="polite" aria-label="Loading authentication">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" aria-hidden="true" />
            <Skeleton className="h-10 w-32" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-32" aria-hidden="true" />
            <Skeleton className="h-32" aria-hidden="true" />
            <Skeleton className="h-32" aria-hidden="true" />
            <Skeleton className="h-32" aria-hidden="true" />
          </div>
          <Skeleton className="h-96" aria-hidden="true" />
        </div>
        <span className="sr-only">Loading, please wait...</span>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user) {
    return null;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}