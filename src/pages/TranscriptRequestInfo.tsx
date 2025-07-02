import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, GraduationCap, Clock, CheckCircle, Users, Mail } from "lucide-react";
import Layout from "@/components/layout/Layout";

const TranscriptRequestInfo = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/documents">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documents
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Transcript Request</h1>
              <p className="text-muted-foreground">Official request for academic transcripts and degree documents</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                What is a Transcript Request?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                A Transcript Request is a formal letter used to request official academic transcripts, degree certificates, or other educational documents from an educational institution. This document is commonly needed for job applications, further education, visa applications, or professional licensing requirements.
              </p>
              <p>
                The request serves as an official communication to the registrar's office or academic records department, providing all necessary information to identify the student and facilitate the release of academic documents to authorized representatives when the student cannot collect them personally.
              </p>
            </CardContent>
          </Card>

          {/* Key Components */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Key Components of a Transcript Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Institution Details</h4>
                      <p className="text-sm text-muted-foreground">Name and address of the educational institution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Student Information</h4>
                      <p className="text-sm text-muted-foreground">Full name, registration and enrollment numbers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Academic Details</h4>
                      <p className="text-sm text-muted-foreground">Department, academic year, and course information</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Contact Information</h4>
                      <p className="text-sm text-muted-foreground">Phone number, email, and current address</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Authorization</h4>
                      <p className="text-sm text-muted-foreground">Representative details and collection authorization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Signature</h4>
                      <p className="text-sm text-muted-foreground">Official signature for document authenticity</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* When to Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                When to Use a Transcript Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Common Scenarios:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Job application requirements</li>
                    <li>• Higher education admissions</li>
                    <li>• Professional license applications</li>
                    <li>• Visa and immigration processes</li>
                    <li>• Professional certification programs</li>
                    <li>• Employment verification</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Document Types:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Official transcripts</li>
                    <li>• Degree certificates</li>
                    <li>• Academic records</li>
                    <li>• Course completion certificates</li>
                    <li>• Grade reports</li>
                    <li>• Enrollment verification</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Request Process Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-medium">Submit Request</h4>
                    <p className="text-sm text-muted-foreground">Submit completed transcript request form to registrar's office</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-medium">Verification (2-5 Days)</h4>
                    <p className="text-sm text-muted-foreground">Institution verifies student identity and academic records</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-medium">Processing (5-10 Days)</h4>
                    <p className="text-sm text-muted-foreground">Academic office prepares official documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">4</div>
                  <div>
                    <h4 className="font-medium">Collection/Delivery</h4>
                    <p className="text-sm text-muted-foreground">Documents ready for collection by authorized representative</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Required Information & Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Student Information:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Full name as recorded in institution</li>
                    <li>• Student registration number</li>
                    <li>• Enrollment number</li>
                    <li>• Department and course details</li>
                    <li>• Academic year(s) attended</li>
                    <li>• Current contact information</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Additional Requirements:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Photo identification copy</li>
                    <li>• Authorization letter (if applicable)</li>
                    <li>• Processing fees (if required)</li>
                    <li>• Representative identification</li>
                    <li>• Purpose of request documentation</li>
                    <li>• Delivery address confirmation</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Processing Note:</p>
                <p className="text-sm text-blue-700">
                  Processing times may vary by institution. Contact the registrar's office directly for specific 
                  requirements, fees, and estimated processing times for your request.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Create Your Transcript Request Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Use our guided form to create a professional transcript request that includes all necessary 
                information for efficient processing. Our template ensures proper formatting and completeness 
                for academic institutions.
              </p>
              <div className="flex gap-3">
                <Link to="/documents/transcript-request">
                  <Button>
                    Create Transcript Request Now
                  </Button>
                </Link>
                <Link to="/contact-lawyer">
                  <Button variant="outline">
                    Get Legal Assistance
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TranscriptRequestInfo;
