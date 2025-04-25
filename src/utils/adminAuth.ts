
// Admin authentication utility functions
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Admin credentials
const ADMIN_EMAIL = "admin@legalgram.com";
const ADMIN_PASSWORD = "legalgram.admin"; // Store password for auto-creation

// Functions to check if current user is admin
export const isAdmin = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  
  if (!data.session) return false;
  
  // Check if the logged-in user has the admin email
  return data.session.user.email === ADMIN_EMAIL;
};

// Function to ensure admin user exists using the edge function with better error handling
const ensureAdminExists = async (): Promise<boolean> => {
  try {
    console.log("Ensuring admin user exists...");
    // Use the edge function to create admin if needed
    const { data, error } = await supabase.functions.invoke('manage-user', {
      body: { 
        action: 'create-admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }
    });
    
    if (error) {
      console.error("Admin creation error:", error);
      toast.error(`Error connecting to server: ${error.message}`);
      return false;
    }
    
    if (data?.success) {
      console.log("Admin ensure success:", data.message);
      console.log("Admin user ID:", data.userId);
      return true;
    }
    
    toast.error("Failed to verify admin account");
    return false;
  } catch (error) {
    console.error("Admin user check/creation error:", error);
    toast.error("Connection error: Please try again later");
    return false;
  }
};

// Function to authenticate admin with better error handling
export const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
  if (email !== ADMIN_EMAIL) {
    toast.error("Invalid admin credentials");
    return false;
  }
  
  try {
    // First ensure the admin user exists
    console.log("Starting admin login process");
    const adminCreated = await ensureAdminExists();
    
    if (!adminCreated) {
      console.error("Failed to ensure admin exists");
      toast.error("Failed to verify admin account");
      return false;
    }
    
    // Then try to login
    console.log("Attempting to sign in with admin credentials");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Admin login error:", error.message);
      toast.error("Admin authentication failed: " + error.message);
      return false;
    }
    
    console.log("Admin login successful");
    toast.success("Admin login successful");
    return true;
  } catch (error) {
    console.error("Admin login error:", error);
    toast.error("An unexpected error occurred during admin login");
    return false;
  }
};

// Function to redirect if not admin
export const redirectIfNotAdmin = async (navigate: (path: string) => void): Promise<boolean> => {
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    toast.error("Admin access required");
    navigate("/admin-login");
    return false;
  }
  return true;
};
