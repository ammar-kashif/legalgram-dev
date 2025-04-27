
import React from "react";
import Layout from "@/components/layout/Layout";
import MakeDocument from "@/components/dashboard/MakeDocument";

const Documents = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <MakeDocument />
      </div>
    </Layout>
  );
};

export default Documents;
