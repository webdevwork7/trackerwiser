import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isVisible = useRef(true);
  const hasInitialized = useRef(false);
  const lastUser = useRef<User | null>(null);
  const lastSession = useRef<Session | null>(null);

  useEffect(() => {
    // Set up page visibility listener
    const handleVisibilityChange = () => {
      isVisible.current = !document.hidden;
    };

    // Set initial state
    isVisible.current = !document.hidden;
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Only update auth state if tab is visible or this is the initial load
      if (isVisible.current || !hasInitialized.current) {
        // Prevent unnecessary state updates if user/session hasn't actually changed
        const userChanged = session?.user?.id !== lastUser.current?.id;
        const sessionChanged =
          session?.access_token !== lastSession.current?.access_token;

        if (userChanged || sessionChanged || !hasInitialized.current) {
          setSession(session);
          setUser(session?.user ?? null);
          lastUser.current = session?.user ?? null;
          lastSession.current = session;
          setLoading(false);
          hasInitialized.current = true;
        }
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      lastUser.current = session?.user ?? null;
      lastSession.current = session;
      setLoading(false);
      hasInitialized.current = true;
    });

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || "",
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
