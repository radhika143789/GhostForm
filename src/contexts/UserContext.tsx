
import React, { createContext, useState, useContext, useEffect } from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  display_name?: string;
  created_at: string;
}

export type User = SupabaseUser;

export type UserContextType = {
  currentUser: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        console.log("Profile fetched successfully:", data);
        setProfile(data);
      } else {
        console.log("No profile found for user");
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  const refreshUser = async () => {
    try {
      console.log("Refreshing user session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        setSession(null);
        setCurrentUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      console.log("Session refreshed:", session ? "User logged in" : "No session");
      setSession(session);
      setCurrentUser(session?.user || null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error refreshing user:", error);
      setSession(null);
      setCurrentUser(null);
      setProfile(null);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user...");
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSession(null);
      setProfile(null);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener...");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        if (event === 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );

    // Initial session check
    refreshUser();

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    session,
    profile,
    isLoading,
    refreshUser,
    signOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
