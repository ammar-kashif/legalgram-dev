import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, Users, Clock, Shield, Home, Scale } from "lucide-react";

const AffidavitOfResidenceInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          <div className="text-center mb-8">
            <Home className="w-16 h-16 text-bright-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">What Is an Affidavit of Residence?</h1>
            <p className="text-xl text-gray-600">Complete guide to understanding and creating your Affidavit of Residence</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              An Affidavit of Residence, also referred to as a Residency Affidavit or Proof of Residency Letter, is a formal legal document used to confirm an individual's current residential address or that of a deceased individual. It can also verify the residency of people living with the affiant (the person making the statement). This document is commonly required by schools, courts, financial institutions, government agencies, or other entities seeking official proof of residence.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Special Cases:</h3>
              <p className="text-blue-800">
                In cases involving a deceased person, a Residency Affidavit can verify the decedent's last known address, typically used in probate proceedings or for the release of funds. When applicable, a death certificate may need to accompany this affidavit.
              </p>
            </div>
          </section>

          {/* When to Use Section */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-bright-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">When to Use an Affidavit of Residence</h2>
            </div>
            <p className="text-gray-700 mb-4">You may need this legal document if:</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-gray-700 space-y-2">
                  <li>• You're changing your child's school district and must verify residency</li>
                  <li>• A business or court has requested proof of your address for verification</li>
                  <li>• You are managing the estate of a deceased individual and need to confirm their last residence to release funds or access benefits</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Key Information Section */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-bright-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Key Information in an Affidavit of Residence</h2>
            </div>
            <p className="text-gray-700 mb-6">A valid Affidavit of Residence for the US must include the following details:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-bright-orange-600">1. State and County Information</h3>
                <p className="text-gray-700">The affiant must specify the county and state where the affidavit is being executed. This ensures proper jurisdiction and legal format, especially for notarization.</p>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-bright-orange-600">2. Affiant's Identity</h3>
                <p className="text-gray-700">The full legal name and permanent address of the affiant must be clearly listed. For identification purposes, it's best to use the name as it appears on official documents, such as a driver's license or government-issued ID.</p>
              </div>
              
              <div className="border rounded-lg p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-3 text-bright-orange-600">3. Information About a Deceased Person (if applicable)</h3>
                <p className="text-gray-700 mb-2">When the affidavit is being used to verify the residency of a deceased individual, it must include:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Full name of the deceased</li>
                  <li>• Address at the time of death</li>
                  <li>• Number of years lived in the stated location</li>
                  <li>• Date of death</li>
                </ul>
                <p className="text-gray-700 mt-2">The affiant should also confirm that they are a disinterested party in the estate, meaning they do not stand to inherit or benefit directly.</p>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-bright-orange-600">4. Residence and Household Details</h3>
                <p className="text-gray-700 mb-2">The affiant should declare:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Their own residence (address, county, state)</li>
                  <li>• Duration of residence</li>
                  <li>• Names of any individuals currently living with them</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-bright-orange-600">5. Signing Location</h3>
                <p className="text-gray-700">The county and state where the affidavit will be signed should be mentioned. This is crucial for ensuring proper notarization.</p>
              </div>
            </div>
          </section>

          {/* Statement Under Oath Section */}
          <section>
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-bright-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Statement Under Oath</h2>
            </div>
            <p className="text-gray-700 mb-4">As part of this legal affidavit, the affiant affirms under oath that:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">General Affirmations:</h3>
                <ul className="text-green-800 space-y-1">
                  <li>• They reside at the listed address</li>
                  <li>• The individuals named are current co-residents (if applicable)</li>
                  <li>• The affidavit is not being filed for any unlawful or deceptive purpose</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">For Deceased Person Cases:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• They are over 18 years old and mentally competent</li>
                  <li>• They are not a beneficiary of the deceased's estate</li>
                  <li>• The deceased lived solely in the specified residence at the time of death</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-4">
              <p className="text-red-800 font-medium">
                ⚠️ All statements must be accurate, as the affiant may be held legally responsible for perjury if any part is false.
              </p>
            </div>
          </section>

          {/* How to Write Section */}
          <section>
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-bright-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">How to Write an Affidavit of Residence</h2>
            </div>
            <p className="text-gray-700 mb-6">To prepare a custom Affidavit of Residence:</p>
            
            <div className="bg-gradient-to-r from-bright-orange-50 to-bright-orange-100 p-6 rounded-lg">
              <ol className="text-gray-700 space-y-3">
                <li className="flex items-start">
                  <span className="bg-bright-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  <span>Provide personal details such as the affiant's full name, residence, and duration of stay.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-bright-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  <span>If verifying someone else's residence (alive or deceased), include their full name and related residency details.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-bright-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  <span>Specify who currently lives with the affiant (if applicable).</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-bright-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                  <span>Clearly state where the document will be signed and notarized.</span>
                </li>
              </ol>
            </div>
          </section>

          {/* Signatures and Notarization Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Signatures and Notarization</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
              <p className="text-yellow-800 mb-4 font-medium">
                This document must be signed in front of a notary public to be considered a sworn legal statement. Without notarization, the affidavit is not legally enforceable or admissible in court.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Who signs?</h3>
                  <p className="text-yellow-800">The affiant must sign the document.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Where to file?</h3>
                  <p className="text-yellow-800">Submit the original affidavit to the Clerk of Court or the requesting institution. The affiant should keep a signed copy for their records.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Glossary Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Glossary of Key Terms</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Term</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Definition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Affiant</td>
                    <td className="border border-gray-300 px-4 py-2">The individual making the affidavit and affirming the truth of its contents.</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">Notary Public</td>
                    <td className="border border-gray-300 px-4 py-2">A certified official authorized to witness signatures and confirm identity to prevent fraud.</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Residence</td>
                    <td className="border border-gray-300 px-4 py-2">A legal term referring to where a person physically lives, including address, city, state, and country.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-bright-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">FAQs about Affidavit of Residence</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <h3 className="font-semibold text-green-900 mb-2">Who needs this document?</h3>
                <p className="text-green-800">Any adult or guardian who must provide proof of residency—for school enrollment, DMV registration, estate matters, or in-state tuition—may need to submit this affidavit.</p>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Can I write an Affidavit of Residence online?</h3>
                <p className="text-blue-800">Yes, you can easily generate a free Affidavit of Residence at Legal Gram by answering a few guided questions. You can save, download, or print your document at any stage.</p>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
                <h3 className="font-semibold text-purple-900 mb-2">What if I don't have all the required details right away?</h3>
                <p className="text-purple-800">You can skip questions during the online process and return later to complete your custom Proof of Residency Letter.</p>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                <h3 className="font-semibold text-orange-900 mb-2">How do I get the affidavit notarized?</h3>
                <p className="text-orange-800">Once the document is complete, take it to a licensed notary public—either locally or through online notary services. They will verify your identity and witness your signature.</p>
              </div>
            </div>
          </section>

          {/* Final Checklist Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Final Checklist to Make it Legal</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="text-gray-700 space-y-3">
                <li className="flex items-start">
                  <span className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  <span><strong>Create the Affidavit</strong> – Answer guided questions and generate your personalized form on Legal Gram.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  <span><strong>Review the Document</strong> – Ensure that all information is accurate and reflects your intent.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  <span><strong>Sign Before a Notary</strong> – Sign the affidavit in the presence of a notary public for it to be legally binding.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                  <span><strong>Distribute Copies</strong> – File the original with the court or requesting organization. Retain a personal copy for your records.</span>
                </li>
              </ol>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-gradient-to-r from-bright-orange-500 to-bright-orange-600 text-white p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4">Create Your Affidavit of Residence Now</h2>
            <p className="text-xl mb-6">With Legal Gram, creating a legally valid Affidavit of Residence for US purposes is simple, secure, and cost-effective. Whether you're managing your own affairs or handling matters for a deceased loved one, our platform helps you document residency clearly and confidently.</p>
            <Button 
              size="lg" 
              onClick={() => navigate('/documents/affidavit-of-residence')}
              className="bg-white text-bright-orange-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              Start Your Affidavit of Residence Today
            </Button>
            <p className="text-bright-orange-100 mt-4">Secure, legally compliant, and ready for any official requirement.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default AffidavitOfResidenceInfo;
