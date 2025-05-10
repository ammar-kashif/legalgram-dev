
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConditionalForm from "@/components/ConditionalForm";

const MakeDocument = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  
  const handleSelectTemplate = () => {
    setShowForm(true);
  };
  
  const handleBack = () => {
    setShowForm(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Make Documents</h1>
      <p className="text-muted-foreground mb-6">
        Create legal documents from our professionally-drafted templates.
      </p>
      
      {!showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Residential Lease Agreement
              </CardTitle>
              <CardDescription>Real Estate</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              Create a customized Arkansas Lease Agreement for residential rental properties.
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleSelectTemplate}
              >
                Select Template
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="mb-4"
            >
              ← Back to templates
            </Button>
            <h2 className="text-xl font-semibold">Residential Lease Agreement</h2>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Enter Document Details</CardTitle>
              <CardDescription>Fill in the required information to generate your document</CardDescription>
            </CardHeader>
            <CardContent>
              <ConditionalForm />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MakeDocument;
