
import React from "react";
import Layout from "@/components/layout/Layout";
import EmailSignupForm from "@/components/auth/EmailSignupForm";

const Register = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <EmailSignupForm />
      </div>
    </Layout>
  );
};

export default Register;
