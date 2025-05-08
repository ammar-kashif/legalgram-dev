
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const SSOCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        
        // Parse the URL
        const url = window.location.href;
        console.log("Processing auth callback, URL:", url);
        
        // Check if this is a password recovery callback
        if (url.includes('type=recovery')) {
          console.log("Processing password recovery callback");
          navigate('/reset-password', { replace: true });
          return;
        }
        
        // For OAuth logins, exchange the code for a session
        if (url.includes('code=')) {
          console.log("Processing OAuth callback");
          
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(url);
          
          if (exchangeError) {
            console.error("Code exchange error:", exchangeError);
            setError(`Authentication failed: ${exchangeError.message}`);
            toast.error("Authentication failed. Please try logging in again.");
            setTimeout(() => navigate("/login", { replace: true }), 2000);
            return;
          }
          
          if (data?.session) {
            // Successfully authenticated
            console.log("Authentication successful, session obtained");
            toast.success("Authentication successful!");
            navigate("/user-dashboard", { replace: true });  // Redirect to user dashboard
            return;
          } else {
            console.error("No session returned after code exchange");
            setError("Authentication completed but no session was created. Please try logging in.");
            setTimeout(() => navigate("/login", { replace: true }), 2000);
            return;
          }
        }
        
        // Check if we already have a session (fallback)
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          console.log("Session already exists");
          toast.success("Authentication successful!");
          navigate("/user-dashboard", { replace: true });  // Redirect to user dashboard
          return;
        }
        
        // If we get here, the authentication wasn't successful
        console.error("No authentication method worked");
        setError("Authentication failed. Please try logging in again.");
        toast.error("Authentication failed");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      } catch (err) {
        console.error("Authentication callback error:", err);
        setError("An unexpected error occurred. Please try logging in again.");
        toast.error("Authentication error");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-rocket-blue-950">
      <div className="glass-card rounded-xl shadow-xl border border-rocket-blue-50/20 p-8 backdrop-blur-lg bg-white/5 max-w-md w-full mx-4">
        {isProcessing ? (
          <div className="text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-rocket-blue-300 border-t-rocket-blue-600 mx-auto"></div>
            <p className="mt-6 text-white text-lg font-medium">Processing authentication...</p>
            <p className="mt-2 text-rocket-gray-400 text-sm">Please wait while we complete the process</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-red-900/30 p-3 rounded-full">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            <p className="text-red-400 text-lg font-medium mt-4">{error}</p>
            <p className="text-rocket-gray-400 mt-2 text-sm">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-green-900/30 p-3 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <p className="text-green-400 text-lg font-medium mt-4">Authentication successful!</p>
            <p className="text-rocket-gray-400 mt-2 text-sm">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SSOCallback;
