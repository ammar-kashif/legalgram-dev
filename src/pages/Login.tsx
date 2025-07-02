import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, InfoIcon, Mail, Lock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get redirect parameters from URL
  const urlParams = new URLSearchParams(location.search);
  const redirectTo = urlParams.get('redirect');
  const redirectStep = urlParams.get('step');

  const getRedirectPath = () => {
    if (redirectTo === 'ask-legal-advice' && redirectStep) {
      return `/ask-legal-advice?step=${redirectStep}`;
    }
    return "/user-dashboard";
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking existing session...");
        const { data, error } = await supabase.auth.getSession();
        console.log("Session check result:", { data, error });
        if (data.session) {
          navigate(getRedirectPath());
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };
    checkSession();

    const savedEmail = localStorage.getItem("lastLoginEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    console.log("Attempting login with:", { 
      email, 
      supabaseUrl: "https://abxrphctohxctpmaozvc.supabase.co",
      timestamp: new Date().toISOString()
    });

    if (rememberMe) {
      localStorage.setItem("lastLoginEmail", email);
    } else {
      localStorage.removeItem("lastLoginEmail");
    }

    try {
      console.log("Calling supabase.auth.signInWithPassword...");
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      console.log("Login response:", { data, error });
      
      if (error) {
        console.error("Login error details:", {
          message: error.message,
          status: error.status || 'No status',
          name: error.name || 'Unknown error type'
        });
        setErrorMessage(error.message);
        toast.error("Login failed");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Login successful, redirecting...");
      toast.success("Welcome back!");
      navigate(getRedirectPath());
    } catch (error) {
      console.error("Login exception:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setErrorMessage("Network error - please check your connection and try again.");
      toast.error("Network error occurred");
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
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
            <p className="text-white/90 font-medium">
              Sign in to access your legal documents and advice history.
            </p>
          </div>

          <div className="glass-card rounded-xl shadow-xl border border-white/10 p-8 animate-scale-in backdrop-blur-lg bg-white/10">
            <Alert className="mb-6 bg-black/20 border-amber-300/30 animate-slide-in" style={{ animationDelay: "0.025s" }}>
              <InfoIcon className="h-4 w-4 !text-white" />
              <AlertDescription className="text-xs text-white font-medium">
                Sign in to access your account. Your information is securely stored in Supabase.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleLogin} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-500/20 border border-red-400 text-white text-sm rounded-md animate-shake">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email</label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-white/10 border-black/20 text-white placeholder:text-white/60 placeholder:font-medium focus:border-black/40 focus:ring-black/20 hover:bg-white/20 transition-all duration-300"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="border-white/50 data-[state=checked]:bg-white"
                  />
                  <label htmlFor="remember-me" className="text-sm cursor-pointer text-white hover:text-white/70 transition-colors">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-white text-sm hover:text-white/70 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-300/50 animate-fade-in"
                style={{ animationDelay: "0.5s" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
              </div>
            </form>

            <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <p className="text-white">
                Don't have an account? {" "}
                <Link to={`/signup${location.search}`} className="text-white hover:text-white/70 transition-colors hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
