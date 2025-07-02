import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Briefcase, AlertCircle, CheckCircle, Users, Calendar, DollarSign, Scale } from "lucide-react";
import Layout from "@/components/layout/Layout";

const BusinessAgreementInfo = () => {
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
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Business Agreement</h1>
              <p className="text-muted-foreground">Comprehensive partnership agreements for business ventures</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                What is a Business Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                A Business Agreement is a legally binding contract between two or more parties that outlines the terms and conditions of their business relationship. This comprehensive document establishes the rights, responsibilities, and obligations of each party involved in a business venture, project, or ongoing commercial relationship.
              </p>
              <p>
                Business agreements serve as the foundation for successful partnerships by clearly defining roles, financial arrangements, operational procedures, and dispute resolution mechanisms. They protect all parties involved and provide a framework for conducting business activities in a structured and legally compliant manner.
              </p>
            </CardContent>
          </Card>

          {/* Key Components */}
          <Card>
            <CardHeader>
              <CardTitle>Essential Components of a Business Agreement</CardTitle>
              <CardDescription>A comprehensive business agreement should include all critical elements that govern the partnership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Party Information</h4>
                      <p className="text-sm text-muted-foreground">Complete identification and contact details of all parties entering into the agreement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Business Scope</h4>
                      <p className="text-sm text-muted-foreground">Detailed description of the business venture, project, or commercial activities covered by the agreement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Roles and Responsibilities</h4>
                      <p className="text-sm text-muted-foreground">Clear definition of each party's duties, obligations, and areas of responsibility</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Financial Arrangements</h4>
                      <p className="text-sm text-muted-foreground">Revenue sharing, commission structures, payment terms, and financial obligations</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Marketing and Sales Rights</h4>
                      <p className="text-sm text-muted-foreground">Exclusive or shared rights for marketing, sales, and business development activities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Term and Termination</h4>
                      <p className="text-sm text-muted-foreground">Duration of the agreement and conditions for termination or renewal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Compliance and Legal Requirements</h4>
                      <p className="text-sm text-muted-foreground">Adherence to applicable laws, regulations, and industry standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Dispute Resolution</h4>
                      <p className="text-sm text-muted-foreground">Mechanisms for resolving conflicts and disagreements between parties</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Types of Business Agreements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Types of Business Agreements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Project-Based Agreements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Real estate development partnerships</li>
                    <li>Construction and building projects</li>
                    <li>Marketing and sales collaborations</li>
                    <li>Joint venture agreements</li>
                    <li>Licensing and distribution arrangements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ongoing Business Relationships:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Supply and distribution agreements</li>
                    <li>Franchise agreements</li>
                    <li>Agency and representation contracts</li>
                    <li>Strategic partnership agreements</li>
                    <li>Management and operational contracts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Revenue Sharing Models:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Percentage-based commission structures</li>
                      <li>Fixed fee arrangements</li>
                      <li>Performance-based incentives</li>
                      <li>Tiered commission rates</li>
                      <li>Minimum guaranteed payments</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Financial Obligations:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Investment commitments</li>
                      <li>Operating expense responsibilities</li>
                      <li>Tax payment obligations</li>
                      <li>Insurance requirements</li>
                      <li>Penalty clauses for non-compliance</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">Banking and Transaction Requirements</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Most business agreements require all financial transactions to be conducted through official banking channels to ensure transparency, proper documentation, and compliance with financial regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Protections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Legal Protections and Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Liability Protection:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Clear allocation of responsibilities</li>
                      <li>Indemnification clauses</li>
                      <li>Insurance requirements</li>
                      <li>Limitation of liability provisions</li>
                      <li>Force majeure protections</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Termination Safeguards:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Notice requirements for termination</li>
                      <li>Completion of existing obligations</li>
                      <li>Financial settlements upon termination</li>
                      <li>Non-compete and confidentiality clauses</li>
                      <li>Transition and handover procedures</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Creating and Executing Your Business Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Define Agreement Terms</h4>
                    <p className="text-sm text-muted-foreground">Clearly outline all business terms, financial arrangements, and operational requirements using our guided form.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Review and Customize</h4>
                    <p className="text-sm text-muted-foreground">Carefully review the generated agreement and make any necessary adjustments to reflect your specific business needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Legal Review</h4>
                    <p className="text-sm text-muted-foreground">Consider having the agreement reviewed by qualified legal counsel, especially for complex or high-value business relationships.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Execute and Implement</h4>
                    <p className="text-sm text-muted-foreground">All parties sign the agreement in the presence of witnesses, and begin implementing the agreed-upon business arrangements.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Legal Gram for Business Agreements?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Comprehensive agreement templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Industry-specific customizations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Built-in legal protections</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Step-by-step guidance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Professional document formatting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Immediate PDF generation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Started */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Ready to Create Your Business Agreement?</h3>
                <p className="text-muted-foreground">
                  Establish a solid foundation for your business partnership with a comprehensive, legally sound agreement.
                </p>
                <Link to="/documents/business-agreement">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Create Business Agreement Now
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

export default BusinessAgreementInfo;
