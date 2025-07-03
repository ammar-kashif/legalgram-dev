import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, Users, Clock, Shield, Home, DollarSign } from "lucide-react";

const LeaseAgreementInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8">
      
          <div className="text-center mb-8">
            <Home className="w-16 h-16 text-bright-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Lease Agreement Guide</h1>
            <p className="text-xl text-gray-600">Complete guide to understanding and creating your Lease Agreement</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Is a Lease Agreement?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Lease Agreement is a legally binding contract between a property owner (the "lessor") and a tenant (the "lessee") that outlines the terms and responsibilities of renting property. Whether you're renting out a full residential unit, a single room, or commercial property, a well-written Lease Agreement protects both parties and prevents legal conflicts.
            </p>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Benefits of Using Legal Gram:</h3>
              <ul className="text-green-800 space-y-1">
                <li>• Draft lease agreements for free</li>
                <li>• Fast, compliant, and hassle-free process</li>
                <li>• Professional documents that comply with state laws</li>
                <li>• Comprehensive protection for both landlords and tenants</li>
              </ul>
            </div>
          </section>

          {/* When to Use Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Clock className="w-6 h-6 text-orange-500 mr-2" />
              When Should You Use a Lease Agreement?
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              If you fall into any of the following categories, it's time to create a Lease Agreement:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Home className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Property Owners</h4>
                    <p className="text-gray-600 text-sm">You're a landlord leasing out residential or commercial property.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Room Rental</h4>
                    <p className="text-gray-600 text-sm">You want to rent out a room in your personal home.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Tenant Protection</h4>
                    <p className="text-gray-600 text-sm">You're a tenant and need a Lease Agreement for US property but your landlord doesn't have one ready.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Legal Protection</h4>
                    <p className="text-gray-600 text-sm">Avoid legal risks with professional documents that comply with state laws.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What It Includes Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Does a Lease Agreement Include?</h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              A Lease Agreement, often also referred to as a Rental Agreement, sets expectations and rules for both landlords and tenants. Here are key sections included in the best Lease Agreements:
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                  <Home className="w-5 h-5 text-blue-500 mr-2" />
                  1. Property Description
                </h3>
                <p className="text-gray-700 mb-2">
                  Every lease should clearly mention the property's address and list all appliances and fixtures—such as a fridge, microwave, oven, washer, dryer, and water filtration system.
                </p>
                <p className="text-gray-600 text-sm">
                  Including these items ensures that tenants and landlords are on the same page regarding maintenance and responsibility.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                  <Users className="w-5 h-5 text-green-500 mr-2" />
                  2. Tenant Information
                </h3>
                <p className="text-gray-700">
                  All adult tenants must be named and sign the Lease Agreement. This ensures shared legal accountability for rent, rules, and property care.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 text-orange-500 mr-2" />
                  3. Lease Duration
                </h3>
                <p className="text-gray-700 mb-2">
                  Specify if the lease is month-to-month, for a year, or custom.
                </p>
                <p className="text-gray-600 text-sm">
                  At Legal Gram, you can choose flexible durations when you draft lease agreements for free using our document builder.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">4. Renewal Terms</h3>
                <p className="text-gray-700">
                  Outline whether the lease renews automatically or requires formal notice. Most agreements require a 30 or 60-day notice for non-renewal.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  5. Rent, Deposits, and Fees
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>Include:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Monthly rent amount and due date</li>
                    <li>Accepted payment methods</li>
                    <li>Late fee rules</li>
                    <li>Security deposit terms (handling, use, and return)</li>
                    <li>Any non-refundable fees (e.g., pet fees or cleaning charges)</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">6. Utilities</h4>
                  <p className="text-gray-700 text-sm">
                    Clarify who covers electricity, water, gas, trash, internet, or oil bills. A well-drafted lease helps avoid disputes over utility payments.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">7. HOA Fees</h4>
                  <p className="text-gray-700 text-sm">
                    State whether the landlord or tenant is responsible for homeowners' association dues. Missed payments can lead to legal or financial penalties.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">8. Usage and Subletting</h4>
                  <p className="text-gray-700 text-sm">
                    Indicate that the property is for residential use unless otherwise stated. If subletting is allowed, explain the process.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">9. Landlord Entry</h4>
                  <p className="text-gray-700 text-sm">
                    Landlords must give advance notice—typically 24 hours—before entering the rental unit for repairs or inspections.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">10. Repairs and Maintenance</h4>
                  <p className="text-gray-700 text-sm">
                    Landlords are responsible for major repairs. Minor upkeep like mowing the lawn or pool maintenance may be assigned to the tenant.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">11. Rules and HOA Policies</h4>
                  <p className="text-gray-700 text-sm">
                    Include any house rules and community regulations, including quiet hours or restrictions on alterations.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">12. Pets</h4>
                  <p className="text-gray-700 text-sm">
                    List the number, type, and breed of pets allowed. Mention if special pet liability insurance is required.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Tips Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Legal Tips for First-Time Landlords</h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              If you're new to property rental, these tips can save you from future legal headaches:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Always Use a Written Lease</h4>
                <p className="text-blue-800 text-sm">
                  A verbal agreement is not enough. Always draft a Lease Agreement to avoid confusion and to establish clear legal rights.
                </p>
              </div>

              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <h4 className="font-semibold text-green-900 mb-2">Collect a Security Deposit</h4>
                <p className="text-green-800 text-sm">
                  This shows tenants you care about the condition of the home and gives you a cushion for damages. Use a Renter's Inspection Checklist at move-in.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Screen Tenants Properly</h4>
                <p className="text-purple-800 text-sm">
                  Use a Rental Application, check credit, verify income, and request employer references. Disqualifying tenants based on inability to pay is legal, as long as anti-discrimination laws are followed.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Follow the Lease Terms</h4>
                <p className="text-orange-800 text-sm">
                  If you fail to uphold your end—like ignoring repairs—you weaken your ability to enforce the rules. Know your Lease and follow it closely.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-red-500 bg-red-50 p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Know Your Rights</h4>
                  <p className="text-red-800 text-sm">
                    Landlords have the right to enter the unit for emergencies or repairs with proper notice. If needed, follow local laws to initiate eviction for lease violations.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">Understand Tenant Rights</h4>
                  <p className="text-indigo-800 text-sm">
                    Learn your state's tenant protection laws. Visit HUD.gov's Tenant Rights by State page or consult Legal Gram for resources.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Lease Agreement FAQs</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Is a Lease Agreement Legally Binding?</h4>
                <p className="text-gray-700 mb-2">
                  Yes. Once both parties sign, the Lease Agreement becomes enforceable.
                </p>
                <p className="text-gray-600 text-sm">
                  At Legal Gram, our platform lets you safely sign and store your lease online.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Why Should I Create a Rental Agreement?</h4>
                <ul className="text-gray-700 space-y-1 mb-2">
                  <li>• Sets clear expectations</li>
                  <li>• Avoids confusion about rent or responsibilities</li>
                  <li>• Protects both landlord and tenant</li>
                </ul>
                <p className="text-gray-600 text-sm">
                  Skipping a lease increases risks of late payments, disputes, or eviction complications.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">What Terms Are Not Allowed in a Lease?</h4>
                <p className="text-gray-700 mb-2">
                  You cannot include illegal or discriminatory clauses. For example, you can't deny tenants based on race, gender, or family size.
                </p>
                <p className="text-gray-600 text-sm">
                  Some states also require disclosure of where the deposit is held.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">What Should Be Included in a Residential Lease?</h4>
                <p className="text-gray-700 mb-2">To create the best Lease Agreement for your home, you'll need:</p>
                <ul className="text-gray-700 space-y-1 mb-2">
                  <li>• Property address</li>
                  <li>• Tenant details</li>
                  <li>• Lease dates</li>
                  <li>• Rent and payment methods</li>
                  <li>• Additional terms like rules, maintenance, pets, etc.</li>
                </ul>
                <p className="text-gray-600 text-sm">
                  Legal Gram's Lease Agreement drafting tool guides you through each step.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">How Much Does a Lawyer Charge for a Lease?</h4>
                <p className="text-gray-700 mb-2">
                  Traditional attorneys may charge $200–$500 per hour.
                </p>
                <p className="text-gray-600 text-sm">
                  At Legal Gram, you can draft Lease Agreements for free or connect with a licensed lawyer at an affordable rate.
                </p>
              </div>
            </div>
          </section>

          {/* Next Steps Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Are the Next Steps After Creating a Lease?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Review Your Lease Thoroughly</h4>
                  <p className="text-gray-700">Check all terms and ensure accuracy before proceeding.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Share It with Your Tenant</h4>
                  <p className="text-gray-700">Provide the document for review before signing.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Get All Parties to Sign</h4>
                  <p className="text-gray-700">Collect signatures online or in person from all parties.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Distribute Copies</h4>
                  <p className="text-gray-700">Give each party a copy of the signed Lease for their records.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
              <h4 className="font-semibold text-yellow-900 mb-2">State-Specific Requirements:</h4>
              <p className="text-yellow-800 text-sm">
                In states like Florida, leases over one year require two witnesses. In Washington, notarization is required for long-term leases. Always check local laws.
              </p>
            </div>
          </section>

          {/* Checklist Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Lease Agreement Checklist by Legal Gram</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Quick Steps to Success:</h3>
              <p className="text-green-800">
                At Legal Gram, we make it easy to create, customize, and sign your best Lease Agreement—all online, all compliant, and all at no cost to you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Create Your Lease Agreement for US properties</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Use our easy form to draft online for free</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Review the details and consult parties</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Sign securely and distribute copies</span>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Get Started Today</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Ready to Create Your Lease Agreement?</h3>
              <p className="text-green-800">
                Get started today and draft your Lease Agreement for free in just minutes. Our guided process ensures you don't miss any important details.
              </p>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => navigate('/documents/lease-agreement')}
                className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white px-8 py-3 text-lg"
              >
                Start Creating Your Lease Agreement
              </Button>
              <p className="text-gray-600 mt-2 text-sm">
                Return to the form to begin the guided process
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="border-t pt-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-600 text-sm">
                <strong>Disclaimer:</strong> This information is provided for educational purposes only and does not constitute legal advice. 
                While our Lease Agreement template covers common provisions, every rental situation is unique. 
                Consider consulting with a qualified attorney for complex rental arrangements or specific legal questions about your state's requirements.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default LeaseAgreementInfo;
