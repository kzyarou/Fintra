import React, { useEffect, useState, createContext, useContext } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile } from
'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from 'sonner';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (
  email: string,
  pass: string,
  name: string,
  phone?: string)
  => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  isGuest: boolean;
  isDeveloper: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setIsGuest(false);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const signIn = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };
  const signUp = async (
  email: string,
  pass: string,
  name: string,
  phone?: string) =>
  {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      await updateProfile(userCredential.user, {
        displayName: name
      });
      // In a real app, you might save the phone number to a user document in Firestore here
      setUser({
        ...userCredential.user,
        displayName: name
      } as User);
      toast.success('Account created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIsGuest(false);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Failed to sign out');
    }
  };
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Signed in with Google');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    }
  };
  const signInAsGuest = () => {
    setIsGuest(true);
    toast.success('Continuing as guest');
  };
  const isDeveloper = user?.email === 'kzyaroudev@gmail.com';
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInAsGuest,
        isGuest,
        isDeveloper
      }}>
      
      {children}
    </AuthContext.Provider>);

}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}