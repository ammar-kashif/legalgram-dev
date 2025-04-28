import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ArrowLeft, CheckCircle } from "lucide-react";
import DocumentForm from "@/components/documents/DocumentForm";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Document {
  id: number;
  title: string;
  category: string;
  description: string;
  popular: boolean;
}

const documents = [
  {
    id: 1,
    title: "Last Will and Testament",
    category: "Estate Planning",
    description: "Create a legally binding will to distribute your assets and property.",
    popular: true,
  },
  {
    id: 2,
    title: "Non-Disclosure Agreement",
    category: "Business",
    description: "Protect confidential information when working with contractors or partners.",
    popular: true,
  },
  {
    id: 3,
    title: "LLC Operating Agreement",
    category: "Business",
    description: "Define the financial and working relationships between business owners.",
    popular: false,
  },
  {
    id: 4,
    title: "Power of Attorney",
    category: "Estate Planning",
    description: "Authorize someone to act on your behalf for legal, financial, or medical decisions.",
    popular: true,
  },
  {
    id: 5,
    title: "Residential Lease Agreement",
    category: "Real Estate",
    description: "Create a binding agreement between a landlord and tenant for property rental.",
    popular: true,
  },
  {
    id: 6,
    title: "Employment Contract",
    category: "Employment",
    description: "Establish clear terms and conditions for hiring employees.",
    popular: false,
  },
  {
    id: 7,
    title: "Trademark Application",
    category: "Intellectual Property",
    description: "File for protection of your brand names, logos, and slogans.",
    popular: false,
  },
  {
    id: 8,
    title: "Divorce Settlement",
    category: "Family",
    description: "Create a legal agreement to divide assets and resolve other matters during divorce.",
    popular: false,
  },
];

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [documentGenerated, setDocumentGenerated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedPdf, setGeneratedPdf] = useState<any>(null);
  const [documentFilename, setDocumentFilename] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          navigate("/login");
          return;
        }
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/login");
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/login");
          return;
        }
        setIsAuthenticated(true);
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const document = documents.find(doc => doc.id === Number(id));
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
        </div>
      </Layout>
    );
  }
  
  if (!document) {
    return (
      <Layout>
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-lg mb-4">Document Not Found</h1>
            <p className="text-lg text-rocket-gray-600 dark:text-rocket-gray-400 mb-6">
              The document you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/documents">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleDocumentComplete = (success: boolean, pdfDoc?: any) => {
    console.log("Document generation complete:", success, pdfDoc);
    if (success && pdfDoc) {
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `${document.title.replace(/\s+/g, "_").toLowerCase()}_${timestamp}.pdf`;
      
      setGeneratedPdf(pdfDoc);
      setDocumentFilename(filename);
      setDocumentGenerated(true);
      
      console.log("Downloading PDF automatically");
      pdfDoc.save(filename);
    }
  };

  const handleDownloadAgain = () => {
    console.log("Download again requested");
    if (generatedPdf) {
      const filename = documentFilename || `${document.title.replace(/\s+/g, "_").toLowerCase()}_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
      console.log("Re-downloading with filename:", filename);
      generatedPdf.save(filename);
    }
  };

  if (documentGenerated) {
    return (
      <Layout>
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <Link to="/documents" className="inline-flex items-center text-rocket-blue-500 hover:text-rocket-blue-600 mb-6">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to All Documents
            </Link>
            
            <Card className="bg-[#FDE1D3]">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full inline-block">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
                </div>
                <CardTitle className="text-2xl text-black">Document Generated Successfully</CardTitle>
                <CardDescription className="text-lg text-black">
                  Your {document.title} has been created and downloaded.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <p className="mb-4 text-black">
                  Thank you for using our service. Your document has been downloaded to your device.
                </p>
                <p className="mb-4 text-black">
                  For any legal questions related to this document, consider consulting with a qualified attorney.
                </p>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <Button 
                    onClick={handleDownloadAgain}
                    className="bg-[#F97316] hover:bg-[#D15316] text-white"
                  >
                    <Download className="mr-2 h-4 w-4 group-hover:text-white" /> Download Again
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setDocumentGenerated(false);
                    }}
                  >
                    Create Another Copy
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/documents")}
                  >
                    Back to All Templates
                  </Button>
                </div>
                
                <p className="text-sm text-center text-black">
                  Need help? <Link to="/contact" className="text-rocket-blue-500 hover:underline">Contact us</Link> for professional assistance.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <Link to="/documents" className="inline-flex items-center text-rocket-blue-500 hover:text-rocket-blue-600 mb-6">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to All Documents
          </Link>
          
          {showForm ? (
            <Card className="mb-8 bg-[#FDE1D3]">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="outline">{document.category}</Badge>
                  {document.popular && (
                    <Badge className="bg-yellow-500">Popular</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2 text-black">{document.title}</CardTitle>
                <CardDescription className="text-lg text-black">
                  Please fill out the form below to generate your document.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <DocumentForm 
                  documentTitle={document.title} 
                  onComplete={handleDocumentComplete} 
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8 bg-[#FDE1D3]">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="outline">{document.category}</Badge>
                  {document.popular && (
                    <Badge className="bg-yellow-500">Popular</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2 text-black">{document.title}</CardTitle>
                <CardDescription className="text-lg text-black">{document.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-rocket-gray-800/50 rounded-lg">
                    <FileText color="white" className="h-6 w-6 bg-[#F97316] rounded p-1 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1 text-black">Document Details</h3>
                      <p className="text-black">
                        This is a customizable legal template that complies with current laws and regulations.
                        Once completed, you'll receive a downloadable document in PDF format.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-medium text-black">What you'll need to complete this document:</h3>
                    <ul className="list-disc list-inside space-y-2 text-black">
                      <li>Personal identification information</li>
                      <li>Relevant dates and details specific to this document type</li>
                      <li>Any supporting documentation mentioned in the template</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex-col space-y-4">
                <Button 
                  onClick={() => setShowForm(true)} 
                  className="w-full md:w-auto bg-[#F97316] hover:bg-[#D15316] text-white group" 
                  size="lg"
                >
                  <FileText className="mr-2 h-5 w-5 text-white" /> Fill Document Form
                </Button>
                
                <p className="text-sm text-center text-black">
                  Need help? <Link to="/contact" className="text-rocket-blue-500 hover:underline">Contact us</Link> for professional assistance.
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DocumentDetail;
