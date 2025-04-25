
import { Link } from "react-router-dom";
import React from "react";

interface SignupLayoutProps {
  children: React.ReactNode;
}

const SignupLayout = ({ children }: SignupLayoutProps) => {
  return (
    <div className="container-custom py-16 md:py-20 min-h-[80vh] flex items-center relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-rocket-blue-950 to-rocket-blue-900 z-0"></div>
      
      {/* Enhanced background elements */}
      <div className="absolute -top-40 -left-40 w-[100vh] h-[100vh] bg-rocket-blue-200/10 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute top-0 right-0 w-[80vh] h-[80vh] bg-rocket-blue-300/10 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-0 left-1/3 w-[70vh] h-[70vh] bg-rocket-blue-400/10 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-gradient">Create Your Account</h1>
          <p className="text-rocket-gray-300 font-medium">
            Join us to access legal documents, advice, and more.
          </p>
        </div>

        <div className="glass-card rounded-xl shadow-xl border border-rocket-blue-50/20 p-8 animate-scale-in backdrop-blur-lg bg-white/5">
          {children}

          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-rocket-blue-300 hover:text-rocket-blue-200 transition-colors hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupLayout;
