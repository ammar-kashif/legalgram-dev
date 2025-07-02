import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const EmailSignupForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePhoneNumber = (phone: string) => {
    // Basic phone validation - can be customized based on requirements
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setErrorMessage("");

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
      setErrorMessage("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("Please agree to the Terms and Conditions");
      toast.error("Please agree to the Terms and Conditions");
      setIsSubmitting(false);
      return;
    }

    // Phone validation
    if (!validatePhoneNumber(formData.phone)) {
      setErrorMessage("Please enter a valid phone number");
      toast.error("Please enter a valid phone number");
      setIsSubmitting(false);
      return;
    }

    try {
      const [firstName, ...lastNameArr] = formData.fullName.split(" ");
      const lastName = lastNameArr.join(" ");
      
      // Sign up the user (no email verification)
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: formData.phone,
            full_name: formData.fullName
          }
        }
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError.message);
        setErrorMessage("Error creating account: " + signUpError.message);
        toast.error("Account creation failed");
        setIsSubmitting(false);
        return;
      }
      
      // Store the email for login page to pre-fill
      localStorage.setItem("lastLoginEmail", formData.email);
      
      // Redirect to login page after successful signup
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
      
    } catch (error) {
      console.error("Exception during signup:", error);
      toast.error("An unexpected error occurred");
      setErrorMessage("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      {errorMessage && (
        <div className="p-3 bg-red-50/30 border border-red-200/30 text-red-400 text-sm rounded-md animate-slide-in">
          {errorMessage}
        </div>
      )}

      <div className="animate-slide-in" style={{ animationDelay: "0.1s" }}>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="mt-1 futuristic-input"
          required
        />
      </div>

      <div className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="mt-1 futuristic-input"
          required
        />
      </div>

      <div className="animate-slide-in" style={{ animationDelay: "0.25s" }}>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="mt-1 futuristic-input"
          required
        />
        <p className="text-xs text-rocket-gray-500 mt-1">
          Format: +1234567890 or 1234567890
        </p>
      </div>

      <div className="animate-slide-in" style={{ animationDelay: "0.3s" }}>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            className="mt-1 pr-10 futuristic-input"
            required
            minLength={8}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rocket-gray-500 hover:text-rocket-blue-500 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-xs text-rocket-gray-500 mt-1">
          Password must be at least 8 characters
        </p>
      </div>

      <div className="animate-slide-in" style={{ animationDelay: "0.4s" }}>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="mt-1 pr-10 futuristic-input"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rocket-gray-500 hover:text-rocket-blue-500 transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex items-start space-x-3 pt-2 animate-slide-in" style={{ animationDelay: "0.5s" }}>
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
          className="mt-1"
        />
        <Label htmlFor="terms" className="text-sm cursor-pointer">
          I agree to the{" "}
          <Link to="/terms" className="text-rocket-blue-500 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-rocket-blue-500 hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-rocket-blue hover:bg-rocket-blue-600 mt-3 transition-all duration-300 animate-slide-in"
        style={{ animationDelay: "0.6s" }}
        disabled={isSubmitting}
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
  );
};

export default EmailSignupForm;
