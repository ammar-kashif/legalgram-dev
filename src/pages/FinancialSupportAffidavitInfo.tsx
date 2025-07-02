import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, DollarSign, AlertCircle, CheckCircle, Users, Calendar } from "lucide-react";
import Layout from "@/components/layout/Layout";

const FinancialSupportAffidavitInfo = () => {
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
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Affidavit of Financial Support</h1>
              <p className="text-muted-foreground">Legal document declaring financial capability and support commitment</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                What is an Affidavit of Financial Support?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                An Affidavit of Financial Support is a sworn legal document in which a person (the affiant) declares their financial condition and ability to provide financial support to another party. This document is commonly required in immigration proceedings, visa applications, educational institutions, and other situations where proof of financial capability is necessary.
              </p>
              <p>
                The affidavit provides a comprehensive overview of the affiant's income, expenses, assets, and debts, establishing their financial stability and capacity to fulfill support obligations. It serves as a legal commitment and is signed under oath before a notary public.
              </p>
            </CardContent>
          </Card>

          {/* When to Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                When Do You Need This Document?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Immigration Purposes:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Sponsoring family members for visas</li>
                    <li>Supporting visa applications</li>
                    <li>Green card petitions</li>
                    <li>Student visa financial support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Educational & Personal:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>College financial aid applications</li>
                    <li>Court proceedings involving support</li>
                    <li>Custody arrangements</li>
                    <li>Elder care commitments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Components */}
          <Card>
            <CardHeader>
              <CardTitle>Key Components of the Affidavit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Personal Information</h4>
                      <p className="text-sm text-muted-foreground">Full name, employment status, and contact details of the affiant</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Income Sources</h4>
                      <p className="text-sm text-muted-foreground">Detailed breakdown of all monthly income from employment, business, investments, etc.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Monthly Deductions</h4>
                      <p className="text-sm text-muted-foreground">Taxes, insurance, retirement contributions, and other mandatory deductions</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Monthly Expenses</h4>
                      <p className="text-sm text-muted-foreground">Housing, utilities, food, transportation, and other regular household expenses</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Debts & Liabilities</h4>
                      <p className="text-sm text-muted-foreground">Outstanding loans, credit card debts, and monthly payment obligations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Assets</h4>
                      <p className="text-sm text-muted-foreground">Real estate, vehicles, bank accounts, investments, and other valuable assets</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Legal Requirements & Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Notarization Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Must be signed before a notary public</li>
                    <li>Affiant must provide valid photo identification</li>
                    <li>Notary must verify the identity of the signer</li>
                    <li>Document becomes legally binding upon notarization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Accuracy & Honesty:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>All information must be truthful and accurate</li>
                    <li>False statements constitute perjury</li>
                    <li>Supporting documentation may be required</li>
                    <li>Updates needed if financial situation changes</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800">Important Legal Notice</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      This affidavit creates a legal obligation and sworn statement under penalty of perjury. Ensure all financial information is current, accurate, and complete. Consider consulting with an attorney for complex financial situations or significant support obligations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                How to Complete Your Affidavit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Gather Financial Information</h4>
                    <p className="text-sm text-muted-foreground">Collect recent pay stubs, tax returns, bank statements, and documentation of all income sources, expenses, and assets.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Complete the Affidavit Form</h4>
                    <p className="text-sm text-muted-foreground">Fill out all sections accurately, including personal information, income details, expenses, debts, and assets.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Review and Verify</h4>
                    <p className="text-sm text-muted-foreground">Carefully review all information for accuracy and completeness before proceeding to notarization.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Notarize the Document</h4>
                    <p className="text-sm text-muted-foreground">Sign the affidavit in the presence of a notary public with valid identification. The notary will complete their section.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium">Submit and Store</h4>
                    <p className="text-sm text-muted-foreground">Submit the original to the requesting party and keep certified copies for your records.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supporting Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Commonly Required Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Income Verification:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Recent pay stubs (2-3 months)</li>
                    <li>Tax returns (last 1-2 years)</li>
                    <li>Employment verification letter</li>
                    <li>Business income statements</li>
                    <li>Social Security benefits statement</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Assets Documentation:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Bank statements (3-6 months)</li>
                    <li>Investment account statements</li>
                    <li>Property deeds or appraisals</li>
                    <li>Vehicle titles or valuations</li>
                    <li>Retirement account statements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Debts & Obligations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Mortgage statements</li>
                    <li>Credit card statements</li>
                    <li>Loan documentation</li>
                    <li>Child support orders</li>
                    <li>Alimony agreements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Started */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Ready to Create Your Affidavit of Financial Support?</h3>
                <p className="text-muted-foreground">
                  Our guided form will help you create a comprehensive and legally compliant affidavit with step-by-step assistance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default FinancialSupportAffidavitInfo;
