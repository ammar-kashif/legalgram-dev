
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ConditionalForm from "@/components/ConditionalForm";
import ChildCareAuthForm from "@/components/ChildCareAuthForm";
import GeneralContractForm from "@/components/GeneralContractForm";
import IndependentContractorForm from "@/components/IndependentContractorForm";
import LivingWillForm from "@/components/LivingWillForm";
import TexasLivingWillForm from "@/components/TexasLivingWillForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, ShoppingCart, Briefcase, Heart, ArrowLeft } from "lucide-react";

const Documents = () => {
  const { id } = useParams();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(id || null);  const documentTypes = [
    {
      id: 'lease-agreement',
      title: 'Arkansas Lease Agreement',
      description: 'Generate a comprehensive lease agreement for rental properties in Arkansas',
      icon: FileText,
      component: ConditionalForm
    },
    {
      id: 'child-care-auth',
      title: 'Child Care Authorization Agreement',
      description: 'Create an authorization agreement for child care arrangements',
      icon: Users,
      component: ChildCareAuthForm
    },
    {
      id: 'general-contract',
      title: 'General Contract for Products',
      description: 'Create a comprehensive contract for the sale and purchase of products',
      icon: ShoppingCart,
      component: GeneralContractForm
    },
    {
      id: 'independent-contractor',
      title: 'Independent Contractor Agreement',
      description: 'Create a comprehensive independent contractor agreement defining work relationship',
      icon: Briefcase,
      component: IndependentContractorForm
    },    {
      id: 'living-will-california',
      title: 'California Living Will',
      description: 'Create a California Living Will to specify your health care directives and agent appointments',
      icon: Heart,
      component: LivingWillForm
    },
    {
      id: 'living-will-texas',
      title: 'Texas Living Will',
      description: 'Create a Texas Living Will to specify your health care directives and agent appointments',
      icon: Heart,
      component: TexasLivingWillForm
    }
  ];

  const selectedDocumentType = documentTypes.find(doc => doc.id === selectedDocument);

  if (selectedDocument && selectedDocumentType) {
    const DocumentComponent = selectedDocumentType.component;
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedDocument(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Document Selection
            </Button>
            <h1 className="text-3xl font-bold mb-2">{selectedDocumentType.title}</h1>
            <p className="text-muted-foreground">
              {selectedDocumentType.description}
            </p>
          </div>
          <DocumentComponent />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Legal Document Generator</h1>
          <p className="text-muted-foreground">
            Choose a document type to begin generating your legal documents
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {documentTypes.map((docType) => {
            const IconComponent = docType.icon;
            return (
              <Card 
                key={docType.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedDocument(docType.id)}
              >
                <CardHeader className="text-center">
                  <IconComponent className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">{docType.title}</CardTitle>
                  <CardDescription>{docType.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full">
                    Start Creating Document
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
