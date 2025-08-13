import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-background">
      <LoginForm onToggleMode={toggleMode} isSignUp={isSignUp} />
    </div>
  );
} 