
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface OnlineUser {
  id: string;
  presence_ref: string;
  lastSeen: Date;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

export function useUserPresence() {
  const { user, profile } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Connect to the realtime presence channel
    const channel = supabase.channel('online-users');

    const setupPresence = async () => {
      try {
        setLoading(true);

        // Track current user's presence
        const userStatus = {
          id: user.id,
          email: user.email,
          displayName: profile?.display_name || user.email?.split('@')[0],
          avatarUrl: profile?.avatar_url,
          lastSeen: new Date().toISOString()
        };

        // Subscribe to the channel and track presence
        channel
          .on('presence', { event: 'sync' }, () => {
            // Get the current state of all users
            const presenceState = channel.presenceState();
            const users = [];
            
            // Convert presence state to array of online users
            for (const presenceRef in presenceState) {
              if (Object.prototype.hasOwnProperty.call(presenceState, presenceRef)) {
                const presences = presenceState[presenceRef];
                users.push(...presences.map((presence: any) => ({
                  ...presence,
                  presence_ref: presenceRef
                })));
              }
            }
            
            setOnlineUsers(users);
          })
          .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            console.log('User joined:', key, newPresences);
          })
          .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            console.log('User left:', key, leftPresences);
          })
          .subscribe(async (status: string) => {
            if (status === 'SUBSCRIBED') {
              // Start tracking presence once subscribed
              await channel.track(userStatus);
            }
          });

      } catch (err) {
        console.error('Error setting up presence:', err);
        setError(err instanceof Error ? err.message : 'Unknown error setting up presence');
      } finally {
        setLoading(false);
      }
    };

    setupPresence();

    // Clean up when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  return { onlineUsers, loading, error };
}
