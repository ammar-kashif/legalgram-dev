
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hashPresent, setHashPresent] = useState(false);
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);

  useEffect(() => {
    const processRecoveryToken = async () => {
      // Check if the URL contains a hash which includes the access_token
      const hasRecoveryHash = window.location.hash && window.location.hash.includes('access_token');
      console.log("URL hash check:", { hash: window.location.hash, hasToken: hasRecoveryHash });
      
      setHashPresent(hasRecoveryHash);
      
      if (hasRecoveryHash) {
        try {
          // The supabase client will automatically process the hash
          const { data, error } = await supabase.auth.getSession();
          console.log("Session check result:", { hasSession: !!data.session, error });
          
          if (error) {
            console.error("Recovery token processing error:", error);
            setError("Invalid or expired password reset link");
            toast.error("Invalid or expired password reset link");
            setIsTokenProcessed(false);
          } else if (data.session) {
            console.log("Recovery token processed successfully");
            setIsTokenProcessed(true);
          } else {
            console.error("No session found after processing recovery token");
            setError("Invalid or expired password reset link");
            toast.error("Invalid or expired password reset link");
            setIsTokenProcessed(false);
          }
        } catch (err) {
          console.error("Error processing recovery token:", err);
          setError("Failed to process recovery token");
          setIsTokenProcessed(false);
        }
      } else {
        console.log("No recovery hash found in URL");
        setError("Invalid or expired password reset link");
        toast.error("Invalid or expired password reset link");
        setIsTokenProcessed(false);
      }
    };

    processRecoveryToken();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error("Password update error:", error);
        setError(error.message);
        toast.error(error.message || "Failed to reset password");
      } else {
        toast.success("Password updated successfully");
        // Short delay before redirecting to allow the toast to be seen
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/lovable-uploads/067c7b04-b1a2-4236-97eb-2b7cf8b24291.png"
            alt="Background"
            className="w-full h-full object-cover filter brightness-50"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>

        <div className="w-full max-w-md px-4 relative z-10">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2 text-white">Set New Password</h1>
            <p className="text-white/90 font-medium">
              Create a new secure password for your account
            </p>
          </div>

          <div className="glass-card rounded-xl shadow-xl border border-white/10 p-8 animate-scale-in backdrop-blur-lg bg-white/10">
            {!hashPresent || error ? (
              <div className="space-y-4">
                <Alert className="bg-red-500/20 border-red-300/30">
                  <AlertDescription className="text-white">
                    {error || "Invalid or expired password reset link. Please request a new password reset."}
                  </AlertDescription>
                </Alert>
                <div className="flex justify-center mt-4">
                  <Link to="/forgot-password">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Request New Reset Link
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-1">New Password</label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pl-10 bg-white/10 border-black/20 text-white placeholder:text-white/60 placeholder:font-medium focus:border-black/40 focus:ring-black/20 hover:bg-white/20 transition-all duration-300"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white/70 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">Confirm Password</label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pl-10 bg-white/10 border-black/20 text-white placeholder:text-white/60 placeholder:font-medium focus:border-black/40 focus:ring-black/20 hover:bg-white/20 transition-all duration-300"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white/70 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-300/50 animate-fade-in"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
