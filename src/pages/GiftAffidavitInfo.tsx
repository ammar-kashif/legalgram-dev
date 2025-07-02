import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GiftAffidavitInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/forms')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Understanding Gift Affidavits
            </h1>
            <p className="text-lg text-gray-600">
              Essential information about creating and using gift affidavits
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                What is a Gift Affidavit?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                A Gift Affidavit is a sworn legal document that formally declares that a transfer of money, property, or other valuable items from one person to another is a gift with no expectation of repayment. This document serves as official proof that the transfer was made freely and voluntarily, without any conditions, agreements, or obligations for future repayment.
              </p>
              <p className="text-gray-700">
                Gift affidavits are commonly required by banks, mortgage lenders, and other financial institutions when large sums of money are transferred between individuals, particularly during real estate transactions or major purchases.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                When is a Gift Affidavit Required?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Home Purchases:</strong> When receiving money from family for a down payment or closing costs</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Large Deposits:</strong> When depositing significant amounts of cash into bank accounts</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Vehicle Purchases:</strong> When receiving funds to buy a car or other expensive items</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Business Investments:</strong> When receiving startup capital or business funding from family</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Debt Payments:</strong> When someone else pays off your debts as a gift</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Education Expenses:</strong> When receiving money for tuition or educational costs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                Key Elements of a Gift Affidavit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Gift Giver Information</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Full legal name</li>
                      <li>• Complete address</li>
                      <li>• Phone number</li>
                      <li>• Relationship to recipient</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Gift Recipient Information</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Full legal name</li>
                      <li>• Complete address</li>
                      <li>• Relationship to giver</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Gift Details</h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• Specific description of the gift</li>
                      <li>• Exact amount or value</li>
                      <li>• Date of transfer</li>
                      <li>• Purpose of the gift</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">Legal Declarations</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• No repayment expected</li>
                      <li>• No side agreements</li>
                      <li>• Voluntary transfer</li>
                      <li>• No conditions attached</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                Important Legal and Tax Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Federal Gift Tax</h4>
                <p className="text-red-700 text-sm">
                  For 2024, gifts over $18,000 to any individual may require the giver to file a gift tax return (Form 709). 
                  However, most people won't owe gift tax due to the lifetime exemption amount.
                </p>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">Annual Exclusion</h4>
                <p className="text-amber-700 text-sm">
                  Each person can give up to $18,000 per year (2024 limit) to any number of individuals without 
                  triggering gift tax reporting requirements.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Documentation Requirements</h4>
                <p className="text-blue-700 text-sm">
                  Keep copies of the affidavit, bank records showing the transfer, and any supporting documentation. 
                  This helps prove the gift's legitimacy if questioned by lenders or tax authorities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Situations Requiring Gift Affidavits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Real Estate Transactions</h4>
                  <p className="text-gray-700 text-sm">
                    Mortgage lenders require gift affidavits when borrowers receive funds from family members for 
                    down payments, closing costs, or to pay off debts before closing.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Business Formation</h4>
                  <p className="text-gray-700 text-sm">
                    When starting a business with family funding, a gift affidavit clarifies that the money is not 
                    a loan that needs to be repaid, which affects the business's debt-to-equity ratio.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Financial Aid Applications</h4>
                  <p className="text-gray-700 text-sm">
                    Students may need gift affidavits when family members provide funds for education expenses, 
                    especially if these transactions might affect financial aid eligibility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Practices for Gift Affidavits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Be Specific:</strong> Include exact amounts, dates, and detailed descriptions of what is being given.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Notarize the Document:</strong> Have the affidavit signed in front of a notary public to increase its legal validity.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Keep Bank Records:</strong> Maintain records of the actual transfer, including bank statements and transaction receipts.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>File Promptly:</strong> Complete the affidavit close to the time of the gift transfer for accuracy.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Consult Professionals:</strong> For large gifts or complex situations, consult with tax professionals or attorneys.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Do I need a gift affidavit for small amounts?</h4>
                  <p className="text-gray-700">
                    While not always required by law, lenders and institutions may request gift affidavits for any amount that appears unusual in your financial pattern, regardless of size.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Can I use a gift affidavit for property transfers?</h4>
                  <p className="text-gray-700">
                    Yes, gift affidavits can be used for real estate, vehicles, or other property. However, additional documentation like property deeds may also be required.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">What happens if I don't have a gift affidavit?</h4>
                  <p className="text-gray-700">
                    Without proper documentation, lenders may not approve loans, or tax authorities might question the nature of large transfers during audits.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Can a gift affidavit be contested?</h4>
                  <p className="text-gray-700">
                    A properly executed and notarized gift affidavit is strong legal evidence, but like any document, it can be challenged if there's evidence of fraud or coercion.
                  </p>
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
                  This information is provided for educational purposes only and does not constitute legal or tax advice. 
                  Gift affidavits can have significant legal and tax implications. For complex situations, large amounts, 
                  or questions about tax consequences, it's recommended to consult with a qualified attorney or tax 
                  professional to ensure your affidavit complies with applicable laws and adequately protects your interests.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default GiftAffidavitInfo;
