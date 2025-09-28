// src/hooks/useCurrentUser.js
import { useState, useEffect } from "react";
import { db } from "../db/db"; // your Supabase client

export const CurrentUser = () => {
  const [user, setUser] = useState(null); // full user object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        // Get auth session
        const {
          data: { session },
          error: sessionError,
        } = await db.auth.getSession();

        if (sessionError || !session?.user) {
          setUser(null);
          return;
        }

        const authUser = session.user;

        // Get full user details from user_details table
        const { data: userDetails, error } = await db
          .from("user_details")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (error) throw error;

        setUser(userDetails);
      } catch (err) {
        console.error("Error fetching current user:", err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Optional: subscribe to auth changes
    const { data: listener } = db.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
