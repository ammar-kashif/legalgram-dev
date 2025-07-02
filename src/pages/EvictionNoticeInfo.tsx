import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Home, AlertTriangle, Clock, Scale, CheckCircle, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";

const EvictionNoticeInfo = () => {
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
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Eviction Notice</h1>
              <p className="text-muted-foreground">Formal notice for lease violations and tenant compliance</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                What is an Eviction Notice?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                An Eviction Notice is a formal legal document that landlords use to notify tenants of lease violations and provide them with an opportunity to correct the issues before legal action is taken. This notice serves as the first step in the eviction process and is required by law in most jurisdictions before proceeding with formal eviction proceedings.
              </p>
              <p>
                The notice provides tenants with specific information about the violations, what actions are required to remedy the situation, and the timeframe within which compliance must be achieved. It serves to protect both landlords' property rights and tenants' due process rights.
              </p>
            </CardContent>
          </Card>

          {/* Key Components */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Key Components of an Eviction Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Notice Details</h4>
                      <p className="text-sm text-muted-foreground">Date of notice, tenant information, and property address</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Lease Information</h4>
                      <p className="text-sm text-muted-foreground">Original lease date and specific violations cited</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Corrective Actions</h4>
                      <p className="text-sm text-muted-foreground">Specific steps tenant must take to remedy violations</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Compliance Timeframe</h4>
                      <p className="text-sm text-muted-foreground">30-day deadline for addressing violations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Legal Consequences</h4>
                      <p className="text-sm text-muted-foreground">Potential eviction proceedings and termination warnings</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-medium">Signatures</h4>
                      <p className="text-sm text-muted-foreground">Landlord and tenant acknowledgment sections</p>
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
                <AlertTriangle className="w-5 h-5" />
                When to Use an Eviction Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Common Lease Violations:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Non-payment of rent</li>
                    <li>• Unauthorized pets or occupants</li>
                    <li>• Property damage beyond normal wear</li>
                    <li>• Noise complaints and disturbances</li>
                    <li>• Violation of lease terms</li>
                    <li>• Illegal activities on premises</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Legal Requirements:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Must be served before eviction proceedings</li>
                    <li>• Requires specific timeframe for compliance</li>
                    <li>• Must detail exact violations and remedies</li>
                    <li>• Subject to state and local laws</li>
                    <li>• Proper service and documentation required</li>
                    <li>• May require witness or notarization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Eviction Notice Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-medium">Notice Service (Day 1)</h4>
                    <p className="text-sm text-muted-foreground">Properly serve the eviction notice to tenant according to state law requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-medium">Compliance Period (30 Days)</h4>
                    <p className="text-sm text-muted-foreground">Tenant has 30 days to correct violations or respond to the notice</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-medium">Evaluation (Day 31)</h4>
                    <p className="text-sm text-muted-foreground">Landlord assesses compliance and determines next steps</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">4</div>
                  <div>
                    <h4 className="font-medium">Legal Action (If Necessary)</h4>
                    <p className="text-sm text-muted-foreground">If violations persist, landlord may proceed with formal eviction proceedings</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Considerations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Legal Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Landlord Responsibilities:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Follow state-specific notice requirements</li>
                    <li>• Provide reasonable time for compliance</li>
                    <li>• Document all violations properly</li>
                    <li>• Serve notice according to legal methods</li>
                    <li>• Maintain records of all communications</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tenant Rights:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Right to receive proper notice</li>
                    <li>• Opportunity to cure violations</li>
                    <li>• Right to legal representation</li>
                    <li>• Protection from discriminatory actions</li>
                    <li>• Right to challenge improper notices</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-1">Important Notice:</p>
                <p className="text-sm text-amber-700">
                  Eviction laws vary significantly by state and locality. Always consult with a qualified attorney or housing authority 
                  to ensure compliance with local requirements and proper legal procedures.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Create Your Eviction Notice Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Use our guided form to create a comprehensive eviction notice that meets legal requirements 
                and protects your rights as a landlord. Our template ensures all necessary information is included 
                and properly formatted.
              </p>
              <div className="flex gap-3">
                <Link to="/documents/eviction-notice">
                  <Button>
                    Create Eviction Notice Now
                  </Button>
                </Link>
                <Link to="/contact-lawyer">
                  <Button variant="outline">
                    Consult a Lawyer
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

export default EvictionNoticeInfo;
