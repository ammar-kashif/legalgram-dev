
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, ShoppingCart, Briefcase, Heart } from "lucide-react";
import ConditionalForm from "@/components/ConditionalForm";
import ChildCareAuthForm from "@/components/ChildCareAuthForm";
import GeneralContractForm from "@/components/GeneralContractForm";
import IndependentContractorForm from "@/components/IndependentContractorForm";
import LivingWillForm from "@/components/LivingWillForm";
import TexasLivingWillForm from "@/components/TexasLivingWillForm";

const MakeDocument = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);    const documentTypes = [
    {
      id: 'lease-agreement',
      title: 'Residential Lease Agreement',
      description: 'Real Estate',
      content: 'Create a customized Arkansas Lease Agreement for residential rental properties.',
      icon: FileText,
      component: ConditionalForm
    },
    {
      id: 'child-care-auth',
      title: 'Child Care Authorization Agreement',
      description: 'Family Law',
      content: 'Create an authorization agreement for child care arrangements.',
      icon: Users,
      component: ChildCareAuthForm
    },
    {
      id: 'general-contract',
      title: 'General Contract for Products',
      description: 'Business & Commercial',
      content: 'Create a comprehensive contract for the sale and purchase of products.',
      icon: ShoppingCart,
      component: GeneralContractForm
    },
    {
      id: 'independent-contractor',
      title: 'Independent Contractor Agreement',
      description: 'Employment & Contractor',
      content: 'Create a comprehensive independent contractor agreement defining work relationship.',
      icon: Briefcase,
      component: IndependentContractorForm
    },    {
      id: 'living-will-california',
      title: 'California Living Will',
      description: 'Health Care & Estate Planning',
      content: 'Create a California Living Will to specify your health care directives and agent appointments.',
      icon: Heart,
      component: LivingWillForm
    },
    {
      id: 'living-will-texas',
      title: 'Texas Living Will',
      description: 'Health Care & Estate Planning',
      content: 'Create a Texas Living Will to specify your health care directives and agent appointments.',
      icon: Heart,
      component: TexasLivingWillForm
    }
  ];
  
  const handleSelectTemplate = (documentId: string) => {
    setSelectedDocument(documentId);
  };
  
  const handleBack = () => {
    setSelectedDocument(null);
  };

  const selectedDocumentType = documentTypes.find(doc => doc.id === selectedDocument);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Make Documents</h1>
      <p className="text-muted-foreground mb-6">
        Create legal documents from our professionally-drafted templates.
      </p>
      
      {!selectedDocument ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentTypes.map((docType) => {
            const IconComponent = docType.icon;
            return (
              <Card key={docType.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    {docType.title}
                  </CardTitle>
                  <CardDescription>{docType.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  {docType.content}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleSelectTemplate(docType.id)}
                  >
                    Select Template
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
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
            <h2 className="text-xl font-semibold">{selectedDocumentType?.title}</h2>
          </div>
          
          {selectedDocumentType && React.createElement(selectedDocumentType.component)}
        </div>
      )}
    </div>
  );
};

export default MakeDocument;
