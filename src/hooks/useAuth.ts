import { useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(result.user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      displayName,
      email,
      createdAt: new Date(),
      preferences: {
        notifications: true,
        theme: 'system',
        language: 'en',
      },
    });

    return result.user;
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        displayName: result.user.displayName,
        email: result.user.email,
        createdAt: new Date(),
        preferences: {
          notifications: true,
          theme: 'system',
          language: 'en',
        },
      });
    }

    return result.user;
  };

  // Sign out
  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  // Update user profile
  const updateUserProfile = async (displayName: string): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    await updateProfile(user, { displayName });
    
    // Update user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      displayName,
      updatedAt: new Date(),
    }, { merge: true });
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserProfile,
  };
};