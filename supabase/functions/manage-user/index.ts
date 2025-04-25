
// This edge function would require Supabase service role to work
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client with service role (needed for admin operations)
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Add CORS headers to all responses
    const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
    
    const { action, userId, email, password } = await req.json();
    console.log(`Received request with action: ${action}, userId: ${userId}`);
    
    // Only create a Supabase client if needed - check if environment variables are set
    let supabase;
    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
      console.log("Created Supabase client with service role key");
    } else {
      console.log("Missing environment variables for Supabase client");
    }
    
    // Handle different action types
    switch (action) {
      case 'create-admin':
        console.log("Creating admin user with email:", email);
        
        if (!supabase) {
          // Return mock response if Supabase client couldn't be created
          return new Response(JSON.stringify({ 
            success: true,
            exists: true,
            userId: "admin-user-id",
            message: 'Admin user exists (mock)'
          }), { headers, status: 200 });
        }
        
        // Check if admin exists by trying to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!signInError && signInData?.user) {
          console.log("Admin user already exists with ID:", signInData.user.id);
          // Admin exists - return success
          return new Response(JSON.stringify({ 
            success: true,
            exists: true,
            userId: signInData.user.id,
            message: 'Admin user already exists'
          }), { headers, status: 200 });
        }
        
        // Create admin user if doesn't exist
        console.log("Creating new admin user");
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Auto-confirm email
        });
        
        if (error) {
          console.error("Error creating admin:", error.message);
          return new Response(JSON.stringify({ 
            success: false,
            message: `Failed to create admin: ${error.message}`
          }), { headers, status: 500 });
        }
        
        console.log("Admin user created successfully with ID:", data.user.id);
        return new Response(JSON.stringify({ 
          success: true,
          userId: data.user.id,
          message: 'Admin user created successfully' 
        }), { headers, status: 200 });
        
      case 'ban':
        console.log(`Banning user with ID: ${userId}`);
        
        if (!supabase) {
          // Return mock response if Supabase client couldn't be created
          return new Response(JSON.stringify({ 
            success: true,
            message: `User banned successfully (mock)` 
          }), { headers, status: 200 });
        }
        
        try {
          // In a real implementation, we would call the Supabase admin API
          const { data, error } = await supabase.auth.admin.updateUserById(userId, {
            ban_duration: '87600h' // Ban for 10 years (effectively permanent)
          });
          
          if (error) {
            console.error("Error banning user:", error);
            return new Response(JSON.stringify({ 
              success: false, 
              message: `Error banning user: ${error.message}` 
            }), { headers, status: 500 });
          }
          
          console.log("User banned successfully:", data);
          return new Response(JSON.stringify({ 
            success: true,
            message: `User banned successfully`
          }), { headers, status: 200 });
        } catch (error) {
          console.error("Error in ban operation:", error);
          return new Response(JSON.stringify({ 
            success: false, 
            message: `Error in ban operation: ${error.message}` 
          }), { headers, status: 500 });
        }
        
      case 'unban':
        console.log(`Unbanning user with ID: ${userId}`);
        
        if (!supabase) {
          // Return mock response if Supabase client couldn't be created
          return new Response(JSON.stringify({ 
            success: true,
            message: `User unbanned successfully (mock)` 
          }), { headers, status: 200 });
        }
        
        try {
          // In a real implementation, we would call the Supabase admin API
          const { data, error } = await supabase.auth.admin.updateUserById(userId, {
            ban_duration: 'none' // Remove ban
          });
          
          if (error) {
            console.error("Error unbanning user:", error);
            return new Response(JSON.stringify({ 
              success: false, 
              message: `Error unbanning user: ${error.message}` 
            }), { headers, status: 500 });
          }
          
          console.log("User unbanned successfully:", data);
          return new Response(JSON.stringify({ 
            success: true,
            message: `User unbanned successfully`
          }), { headers, status: 200 });
        } catch (error) {
          console.error("Error in unban operation:", error);
          return new Response(JSON.stringify({ 
            success: false, 
            message: `Error in unban operation: ${error.message}` 
          }), { headers, status: 500 });
        }
        
      default:
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Invalid action specified' 
        }), { headers, status: 400 });
    }
  } catch (error) {
    console.error("Error in manage-user function:", error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 500 
    });
  }
})
