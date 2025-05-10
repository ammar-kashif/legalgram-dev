
import React from "react";
import Layout from "@/components/layout/Layout";
import ConditionalForm from "@/components/ConditionalForm";

const Documents = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-black">Arkansas Lease Agreement</h1>
          <p className="text-black">
            Complete the form step by step to generate a customized lease agreement.
          </p>
        </div>
        <ConditionalForm />
      </div>
    </Layout>
  );
};

export default Documents;
