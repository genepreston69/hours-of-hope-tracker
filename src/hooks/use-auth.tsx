import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signInWithAzure: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }

  async function signInWithAzure(): Promise<{ error: any }> {
    try {
      // Check if we're in an iframe (like Lovable preview)
      const isInIframe = window.self !== window.top;
      
      if (isInIframe) {
        // For iframe environments, open a popup window
        const currentOrigin = window.location.origin;
        const httpsOrigin = currentOrigin.replace(/^http:/, 'https:');
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'azure',
          options: {
            redirectTo: `${httpsOrigin}/`,
            skipBrowserRedirect: true, // Don't redirect, we'll handle it
          },
        });
        
        if (error) {
          return { error };
        }
        
        if (data?.url) {
          // Open popup window for Azure authentication
          const popup = window.open(
            data.url,
            'azure-auth',
            'width=500,height=600,scrollbars=yes,resizable=yes'
          );
          
          // Listen for the popup to close or complete
          return new Promise<{ error: any }>((resolve) => {
            const checkClosed = setInterval(() => {
              if (popup?.closed) {
                clearInterval(checkClosed);
                // Check if authentication was successful
                supabase.auth.getSession().then(({ data: { session } }) => {
                  if (session) {
                    resolve({ error: null });
                  } else {
                    resolve({ error: { message: 'Authentication was cancelled or failed' } });
                  }
                });
              }
            }, 1000);
          });
        }
      } else {
        // For non-iframe environments, use full page redirect
        const currentOrigin = window.location.origin;
        const httpsOrigin = currentOrigin.replace(/^http:/, 'https:');
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'azure',
          options: {
            redirectTo: `${httpsOrigin}/`,
            skipBrowserRedirect: false,
          },
        });
        
        if (data?.url) {
          window.location.href = data.url;
          return { error: null };
        }
        
        return { error };
      }
    } catch (error) {
      console.error('Azure sign-in error:', error);
      return { error };
    }
    
    return { error: { message: 'Unexpected error occurred' } };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function resetPassword(email: string) {
    // Ensure we use HTTPS for the redirect URL
    const currentOrigin = window.location.origin;
    const httpsOrigin = currentOrigin.replace(/^http:/, 'https:');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: httpsOrigin + '/auth?mode=update-password',
    });
    return { error };
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  }

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        session, 
        loading, 
        signIn, 
        signUp, 
        signInWithAzure,
        signOut,
        resetPassword,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
