import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Briefcase, AlertCircle, CheckCircle, Users, Calendar, DollarSign } from "lucide-react";
import Layout from "@/components/layout/Layout";

const ServicesContractInfo = () => {
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
              <h1 className="text-3xl font-bold">Services Contract</h1>
              <p className="text-muted-foreground">Professional service agreements for business relationships</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                What is a Contract for Services?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                A Contract for Services, also referred to as a Service Agreement, General Service Contract, or Service Provider Agreement, is a legally binding document used when one party agrees to provide services to another. Whether you're a service provider or hiring someone to perform services for your business, having a written agreement protects both parties and helps prevent misunderstandings.
              </p>
              <p>
                This agreement outlines the scope of work, payment terms, ownership of deliverables, contract duration, and legal responsibilities. It serves as a clear record of what's expected—so if one side fails to meet their obligations, the other party has documented proof of the terms.
              </p>
            </CardContent>
          </Card>

          {/* When to Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                When Should You Use a Contract for Services?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Use a Contract for Services when:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Your business is offering services to another company or individual</li>
                  <li>You are receiving services from a freelancer, contractor, or business</li>
                  <li>You want to set clear expectations, timelines, and pricing for any type of service arrangement</li>
                </ul>
                <p className="text-sm">
                  This agreement is ideal for nearly any type of service—from graphic design, consulting, and writing to landscaping, repair, maintenance, software development, and staff augmentation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Components */}
          <Card>
            <CardHeader>
              <CardTitle>What Should Be Included in a Contract for Services?</CardTitle>
              <CardDescription>A well-drafted Contract for Services should contain all the key terms that govern your business relationship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Parties to the Agreement</h4>
                      <p className="text-sm text-muted-foreground">Full legal names and contact details of both parties: the client (recipient) and the service provider (contractor or business)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Description of Services</h4>
                      <p className="text-sm text-muted-foreground">A clear, detailed explanation of the services to be delivered. If there are multiple service categories or steps, a separate exhibit may be referenced for specifics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Payment Terms</h4>
                      <p className="text-sm text-muted-foreground">The method, schedule, and amount of payment including hourly rates, flat fees, payment deadlines, and invoicing procedures</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Duration and Termination</h4>
                      <p className="text-sm text-muted-foreground">Start and end dates, termination clauses, including notice requirements and acceptable reasons for ending the contract early</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Ownership of Work Product</h4>
                      <p className="text-sm text-muted-foreground">This clause outlines who retains ownership of the work or deliverables created under the agreement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Confidentiality</h4>
                      <p className="text-sm text-muted-foreground">If proprietary or sensitive information is exchanged, a confidentiality clause ensures that both parties maintain discretion</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Dispute Resolution</h4>
                      <p className="text-sm text-muted-foreground">Describes how disagreements will be handled—through mediation, arbitration, or in court—and which state's laws will govern the contract</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Performance Standards</h4>
                      <p className="text-sm text-muted-foreground">Quality expectations, delivery timelines, and performance metrics for the services</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Elements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Essential Elements of a Valid Contract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">The 4 Elements of a Valid Contract:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <span className="font-medium">Offer</span> – One party makes a proposal to provide services
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <span className="font-medium">Acceptance</span> – The other party agrees to the terms
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <span className="font-medium">Intention</span> – Both parties intend to create a binding legal relationship
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <span className="font-medium">Consideration</span> – Something of value (usually money) is exchanged for the services
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Agreement vs. Employment Contract:</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    A Contract for Services is different from an employment agreement. It is used when the person or business providing services is not an employee, but rather an independent contractor or freelancer.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>No employment taxes are withheld</li>
                    <li>No benefits (such as health insurance or paid time off) are provided</li>
                    <li>The service provider is responsible for their own tax reporting and liabilities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Contract Creation Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Make the Document</h4>
                    <p className="text-sm text-muted-foreground">Answer guided questions, and our platform will generate a custom Contract for Services tailored to your situation.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Review the Document</h4>
                    <p className="text-sm text-muted-foreground">Make sure the final document reflects your intentions. You can edit it online or download it to make custom adjustments.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Sign the Agreement</h4>
                    <p className="text-sm text-muted-foreground">Both parties—the client and the service provider—must sign. You can use electronic signatures to sign and invite the other party to do the same.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Distribute Copies</h4>
                    <p className="text-sm text-muted-foreground">All parties should retain a copy of the signed document. Keep your copy in a safe place for future reference.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Considerations */}
          <Card>
            <CardHeader>
              <CardTitle>Special Considerations for Service Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Software Development Services:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Staff augmentation arrangements</li>
                    <li>Intellectual property ownership</li>
                    <li>Resource provision timelines</li>
                    <li>Performance evaluation periods</li>
                    <li>Technology and equipment requirements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Professional Services:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Consulting and advisory services</li>
                    <li>Project-based deliverables</li>
                    <li>Confidentiality and non-disclosure</li>
                    <li>Professional liability considerations</li>
                    <li>Quality assurance measures</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">Equipment and Maintenance Services</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      In some cases, a Service Agreement might refer to terms included in a warranty or maintenance contract, such as for appliances, electronics, or vehicles. This is also considered a Contract for Services.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Why Choose Legal Gram for Your Service Contracts?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Free Contract for Services drafting tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Built specifically for US-based businesses and freelancers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Customizable terms for all service types</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Secure e-signature options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Professionally reviewed templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Legal soundness assurance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What is the difference between a Contract for Services and a Service Provider Agreement?</h4>
                  <p className="text-sm text-muted-foreground">
                    They are often the same. A Service Provider Agreement is simply another name for a Contract for Services, especially in formal or commercial contexts. Both outline the terms under which services will be delivered and received.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Can I modify the contract after it's signed?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, but any modifications should be made in writing and agreed to by both parties. It's recommended to create an amendment or addendum to the original contract for any changes.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">What happens if one party breaches the contract?</h4>
                  <p className="text-sm text-muted-foreground">
                    The non-breaching party may be entitled to damages, specific performance, or other remedies as outlined in the contract. The dispute resolution clause will determine how such issues are handled.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Started */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Ready to Create Your Services Contract?</h3>
                <p className="text-muted-foreground">
                  Protect your business relationship with the right legal framework. Start your Contract for Services drafting for free with Legal Gram.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ServicesContractInfo;
