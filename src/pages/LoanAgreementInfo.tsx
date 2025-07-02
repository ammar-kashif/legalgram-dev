import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoanAgreementInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
  
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Understanding Loan Agreements
            </h1>
            <p className="text-lg text-gray-600">
              Essential information about creating and using loan agreements
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                What is a Loan Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                A loan agreement is a legally binding contract between a lender and a borrower that outlines the terms and conditions of a loan. This document specifies the loan amount, interest rate (if any), repayment schedule, and other important details that govern the lending relationship.
              </p>
              <p className="text-gray-700">
                Whether you're lending money to a family member, friend, or business associate, having a written loan agreement protects both parties and ensures clear expectations about repayment terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Key Components of a Loan Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mr-3 mt-0.5">1</span>
                  <div>
                    <strong>Parties Involved:</strong> Clear identification of the lender (person or entity providing the loan) and borrower (person or entity receiving the loan), including full names and addresses.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mr-3 mt-0.5">2</span>
                  <div>
                    <strong>Loan Amount:</strong> The exact amount of money being borrowed, stated clearly in both numbers and words to avoid confusion.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mr-3 mt-0.5">3</span>
                  <div>
                    <strong>Interest Rate:</strong> Whether the loan carries interest and, if so, the rate and how it's calculated (simple or compound interest).
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mr-3 mt-0.5">4</span>
                  <div>
                    <strong>Repayment Terms:</strong> The schedule for repayment, including due dates, installment amounts, and the final maturity date.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mr-3 mt-0.5">5</span>
                  <div>
                    <strong>Purpose of Loan:</strong> A description of what the borrowed money will be used for, which can be important for tax and legal purposes.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mr-3 mt-0.5">6</span>
                  <div>
                    <strong>Default Provisions:</strong> What happens if the borrower fails to make payments as agreed, including late fees and acceleration clauses.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                Important Legal Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">Usury Laws</h4>
                <p className="text-amber-700 text-sm">
                  Be aware of state usury laws that limit the maximum interest rate you can charge on a loan. These laws vary by state and type of loan.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Tax Implications</h4>
                <p className="text-blue-700 text-sm">
                  Interest earned on loans may be taxable income for the lender. Consult with a tax professional about reporting requirements.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Gift Tax Considerations</h4>
                <p className="text-red-700 text-sm">
                  Interest-free or below-market-rate loans between family members may have gift tax implications under IRS rules.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>When to Use a Loan Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <h4 className="font-semibold mb-2">Personal Loans:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Lending to family or friends</li>
                    <li>• Emergency financial assistance</li>
                    <li>• Major purchases (car, home improvements)</li>
                    <li>• Debt consolidation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Business Loans:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Startup capital</li>
                    <li>• Equipment purchases</li>
                    <li>• Working capital</li>
                    <li>• Bridge financing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Document Everything:</strong> Always put loan agreements in writing, even for small amounts or loans between family members.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Be Specific:</strong> Include exact amounts, dates, and terms to avoid misunderstandings later.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Keep Records:</strong> Maintain records of all payments made and received, including dates and amounts.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Consider Collateral:</strong> For larger loans, consider requiring collateral to secure the loan.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Witness Signatures:</strong> Having witnesses can strengthen the enforceability of the agreement.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-sm">
                  This information is provided for educational purposes only and does not constitute legal advice. 
                  Loan agreements can have significant legal and financial implications. For complex situations, 
                  large loan amounts, or business loans, it's recommended to consult with a qualified attorney 
                  or financial advisor to ensure your agreement complies with applicable laws and adequately 
                  protects your interests.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center py-8">
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanAgreementInfo;
