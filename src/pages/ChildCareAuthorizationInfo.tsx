import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, Users, Clock, Shield, Scale, Heart } from "lucide-react";

const ChildCareAuthorizationInfo = () => {
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
            <Heart className="w-16 h-16 text-bright-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Child Care Authorization Form Guide</h1>
            <p className="text-xl text-gray-600">Complete guide to understanding and creating your Child Care Authorization Form</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Is a Child Care Authorization Form?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Child Care Authorization Form is a legal document that allows a parent or guardian to temporarily assign certain caregiving responsibilities and limited decision-making powers to another trusted adult—such as a babysitter, nanny, family member, or friend. This form ensures that the designated caregiver has permission to act on behalf of your child in specific situations, such as picking up your child from school or daycare or making day-to-day care decisions during your absence.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              By creating a Child Care Authorization, you formally document your consent for someone else to care for your child and establish the scope of their authority. This can prevent confusion, avoid delays in caregiving decisions, and provide schools or daycare centers with proper documentation for child release procedures.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Important Note:</h3>
              <p className="text-blue-800">
                If you need to authorize someone to make major legal or medical decisions for your child over a longer period, you should instead use a Power of Attorney for Minor Child.
              </p>
            </div>
          </section>

          {/* When to Use Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-bright-orange-500" />
              When to Use a Child Care Authorization Form
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You should use a Child Care Authorization Form for US parents or guardians when:
            </p>
            <ul className="text-gray-700 space-y-2 ml-4">
              <li>• You want to authorize a school or daycare to release your child to a specific individual (e.g., grandparent, nanny).</li>
              <li>• You need to temporarily delegate childcare responsibilities during a short-term absence (e.g., business trip, medical emergency, travel).</li>
              <li>• You wish to grant someone limited authority to make everyday decisions, such as transportation, meals, and general supervision.</li>
            </ul>
          </section>

          {/* What It Includes Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-bright-orange-500" />
              What Does a Child Care Authorization Form Include?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              A properly drafted Child Care Authorization Form typically contains the following provisions:
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">1. Parent or Guardian's Information</h3>
                <p className="text-gray-700">
                  Includes the full legal name, contact details, and signature of the parent or legal guardian granting the authority.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">2. Child's Details</h3>
                <p className="text-gray-700">
                  Specifies the full name, date of birth, and any relevant medical or emergency contact information for the child.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">3. Authorized Caregiver's Information</h3>
                <p className="text-gray-700">
                  Identifies the individual receiving temporary authority, including their name, address, phone number, and relationship to the child.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">4. Scope of Authority</h3>
                <p className="text-gray-700 mb-2">
                  Outlines what actions the caregiver is authorized to perform, such as:
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Picking up the child from school or daycare</li>
                  <li>• Providing supervision and transportation</li>
                  <li>• Making routine care decisions (e.g., food, hygiene, bedtime)</li>
                  <li>• Approving minor medical care (if permitted)</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">5. Timeframe of Authorization</h3>
                <p className="text-gray-700 mb-2">
                  States the start and end date or conditions under which the authorization is valid. For example, it may be effective:
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• On a specific date</li>
                  <li>• Until a set expiration date</li>
                  <li>• Until the parent provides written revocation</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">6. Limitations and Exclusions</h3>
                <p className="text-gray-700">
                  Specifies any restrictions—such as not allowing medical decisions or prohibiting overnight stays—depending on the parent's preferences.
                </p>
              </div>
            </div>
          </section>

          {/* Why Use Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-bright-orange-500" />
              Why Use a Child Care Authorization Form?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Using a Child Care Authorization Form ensures peace of mind while you're away by:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Creating a written legal record of your consent</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Avoiding delays in pickup or emergency care situations</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Ensuring caregivers can act quickly and responsibly</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Making it easier for institutions like schools or clinics to cooperate with temporary guardians</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              This document is especially helpful during travel, unexpected emergencies, or school pickup arrangements involving non-parental caregivers.
            </p>
          </section>

          {/* Legal Gram Section */}
          <section className="bg-bright-orange-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Scale className="w-6 h-6 mr-2 text-bright-orange-500" />
              Draft Your Child Care Authorization for Free with Legal Gram
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Legal Gram, we make it easy to create a free Child Care Authorization Form online. Our customizable template allows you to:
            </p>
            <ul className="text-gray-700 space-y-2 ml-4 mb-6">
              <li>• Specify dates of authorization</li>
              <li>• Define the caregiver's authority and limitations</li>
              <li>• Instantly download or print the document for school, daycare, or caregiver use</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Whether you're preparing for a quick trip or setting up emergency care options, our Child Care Authorization template provides the clarity and legal assurance you need.
            </p>
            
            <div className="text-center">
              <Button 
                onClick={() => navigate('/child-care-auth')}
                className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white px-8 py-3 text-lg"
              >
                Create Your Child Care Authorization Form Now
              </Button>
            </div>
            
            <p className="text-center text-lg font-semibold text-gray-800 mt-4">
              Protect your child's care with confidence—create your Child Care Authorization Form for free today at Legal Gram.
            </p>
          </section>

          {/* Additional Information */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Need More Help?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Legal Advice</h4>
                <p className="text-gray-600 text-sm mb-2">
                  For complex situations or legal questions, consult with a qualified attorney.
                </p>
                <Button variant="outline" onClick={() => navigate('/ask-a-lawyer')}>
                  Ask a Lawyer
                </Button>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Other Forms</h4>
                <p className="text-gray-600 text-sm mb-2">
                  Explore our library of legal document templates.
                </p>
                <Button variant="outline" onClick={() => navigate('/documents')}>
                  Browse Documents
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ChildCareAuthorizationInfo;
