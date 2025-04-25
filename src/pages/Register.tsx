import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, InfoIcon } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register = () => {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    // Validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (!agreeToTerms) {
      setErrorMessage("You must agree to the Terms of Service and Privacy Policy");
      toast.error("You must agree to the Terms of Service and Privacy Policy");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create a new account without email verification
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) {
        console.error("Registration error:", error.message);
        setErrorMessage(error.message);
        toast.error("Registration failed");
        setIsSubmitting(false);
        return;
      }
      
      // Store email for login page
      localStorage.setItem("lastLoginEmail", email);

      // Redirect to login page
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
      
    } catch (error) {
      console.error("Exception during registration:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container-custom py-16 md:py-20 min-h-[80vh] flex items-center relative overflow-hidden">
        <div className="fixed inset-0 bg-rocket-blue-950 z-0"></div>
        <div className="absolute -top-40 -left-40 w-[100vh] h-[100vh] bg-rocket-blue-200/10 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-[80vh] h-[80vh] bg-rocket-blue-300/10 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-[70vh] h-[70vh] bg-rocket-blue-400/10 rounded-full opacity-20 blur-3xl"></div>
        

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-white mb-1">First Name</label>
                  <Input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="mt-1 bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-white mb-1">Last Name</label>
                  <Input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="mt-1 bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 bg-white/10 border-white/20 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="mt-1 pr-10 bg-white/10 border-white/20 text-white"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rocket-gray-300 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-white mb-1">Confirm Password</label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="mt-1 pr-10 bg-white/10 border-white/20 text-white"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rocket-gray-300 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agree-terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                  className="border-white/30 data-[state=checked]:bg-rocket-blue-500"
                />
                <label htmlFor="agree-terms" className="text-sm cursor-pointer text-white">
                  I agree to the{" "}
                  <Link to="/terms" className="text-rocket-blue-300 hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-rocket-blue-300 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-rocket-blue-500 hover:bg-rocket-blue-600 text-white animate-fade-in"
                style={{ animationDelay: "0.5s" }}
                disabled={isSubmitting || !agreeToTerms}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <p className="text-rocket-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-rocket-blue-300 hover:underline hover:text-rocket-blue-200 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
