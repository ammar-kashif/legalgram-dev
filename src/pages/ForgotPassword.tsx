
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the current domain to use for the redirect
      const siteUrl = window.location.origin;
      console.log("Using site URL for password reset:", siteUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });

      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success("Password reset instructions sent to your email");
        console.log("Password reset email sent successfully to:", email);
      }
    } catch (error) {
      console.error("Password reset error:", error);
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
            <h1 className="text-3xl font-bold mb-2 text-white">Reset Password</h1>
            <p className="text-white/90 font-medium">
              Enter your email to receive password reset instructions.
            </p>
          </div>

          <div className="glass-card rounded-xl shadow-xl border border-white/10 p-8 animate-scale-in backdrop-blur-lg bg-white/10">
            {isSuccess ? (
              <div className="text-center py-6">
                <Alert className="mb-6 bg-green-500/20 border-green-300/30">
                  <AlertDescription className="text-white">
                    Password reset instructions have been sent to your email.
                    Please check your inbox and follow the instructions to reset your password.
                  </AlertDescription>
                </Alert>
                <Link to="/login">
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                    Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email</label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="pl-10 bg-white/10 border-black/20 text-white placeholder:text-white/60 placeholder:font-medium focus:border-black/40 focus:ring-black/20 hover:bg-white/20 transition-all duration-300"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
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
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>

                <div className="text-center">
                  <Link to="/login" className="text-white hover:text-white/70 transition-colors hover:underline text-sm">
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
