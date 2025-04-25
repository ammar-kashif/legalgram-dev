
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      console.log("Fetching notifications...");
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        console.log("No active session found");
        setLoading(false);
        return;
      }
      
      const currentUserId = session.session.user.id;
      console.log(`Current user ID: ${currentUserId}`);
      setUserId(currentUserId);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      
      console.log(`Fetched ${data?.length || 0} notifications:`, data);
      setNotifications(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNotifications = () => {
    if (!userId) {
      console.log("Cannot subscribe to notifications: No user ID available");
      return () => {};
    }

    console.log(`Setting up subscription for user ${userId}`);
    
    // Enable PostgreSQL replication
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          const newNotification = payload.new as Notification;
          setNotifications(current => [newNotification, ...current]);
          toast.info(newNotification.title, {
            description: newNotification.message
          });
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status: ${status}`);
      });

    return () => {
      console.log("Unsubscribing from notifications channel");
      supabase.removeChannel(channel);
    };
  };
  
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) {
        console.error('Error marking notification as read:', error);
        toast.error('Failed to update notification');
        return;
      }
      
      setNotifications(currentNotifications =>
        currentNotifications.map(notification =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting notification:', error);
        toast.error('Failed to delete notification');
        return;
      }
      
      setNotifications(currentNotifications =>
        currentNotifications.filter(notification => notification.id !== id)
      );
      
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (userId) {
      const unsubscribe = subscribeToNotifications();
      return unsubscribe;
    }
  }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
      
      {loading ? (
        <Card>
          <CardContent className="p-6 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <p className="text-muted-foreground">
              You don't have any notifications at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.is_read ? "bg-background" : "bg-muted/20 border-primary/30"}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{notification.title}</h3>
                      {!notification.is_read && (
                        <Badge variant="outline" className="bg-primary/10 text-primary text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.created_at)}</p>
                  </div>
                  <div className="flex gap-1">
                    {!notification.is_read && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-100"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-4">
        <Button variant="outline" onClick={fetchNotifications}>
          Refresh Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
