
// Comprehensive collection of legal FAQ data

export interface FaqItem {
  keywords: string[];
  answer: string;
}

// Export a comprehensive collection of legal questions and answers
export const legalFaqData: FaqItem[] = [
  // Payment & Pricing
  {
    keywords: ["payment", "pay", "pricing", "subscription", "cost", "free", "trial"],
    answer: "We offer several payment plans starting from $9.99/month. We also have a 7-day free trial available for all new users. You can check our pricing page for more details."
  },
  {
    keywords: ["refund", "cancel", "subscription", "money back"],
    answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service. To cancel your subscription or request a refund, please contact our support team."
  },
  {
    keywords: ["discount", "coupon", "promo", "offer", "deal", "special"],
    answer: "We occasionally offer promotional discounts for new users or during special events. Sign up for our newsletter to receive notifications about current offers."
  },
  {
    keywords: ["business", "enterprise", "corporate", "plan", "team", "company"],
    answer: "Yes, we offer special business and enterprise plans with volume discounts, team management features, and dedicated support. Please contact our sales team for a custom quote."
  },
  {
    keywords: ["payment method", "credit card", "debit", "PayPal", "bank transfer"],
    answer: "We accept all major credit/debit cards and PayPal. For enterprise clients, we can also arrange bank transfers or other payment methods. Your payment information is securely processed and stored."
  },

  // Document Related
  {
    keywords: ["document", "template", "create", "generate", "download", "pdf"],
    answer: "You can create legal documents by selecting a template from our Documents page, filling in the required information, and downloading it as a PDF. All templates are legally verified."
  },
  {
    keywords: ["edit", "modify", "change", "update", "revise"],
    answer: "Yes, you can edit your documents at any time. Simply navigate to your Dashboard, find the document you want to modify, and click 'Edit'. All changes will be saved automatically."
  },
  {
    keywords: ["templates", "how many", "what kind", "type of documents"],
    answer: "We offer over 100 legal document templates covering business, real estate, family law, wills, intellectual property, employment, and more. Our template library is continuously expanding."
  },
  {
    keywords: ["custom", "customize", "personalize", "tailor"],
    answer: "All our templates can be customized to fit your specific needs. Our step-by-step form will guide you through the process of personalizing your document with your information."
  },
  {
    keywords: ["contract", "agreement", "legally binding", "enforceable"],
    answer: "Yes, documents created through our platform are designed to be legally binding when properly executed. However, requirements vary by jurisdiction, so we recommend consulting with a lawyer for your specific situation."
  },
  {
    keywords: ["sign", "signature", "e-sign", "electronic signature"],
    answer: "Our platform supports electronic signatures that comply with eSign laws in most jurisdictions. You can sign documents yourself or send them to others for signature directly from our platform."
  },
  {
    keywords: ["notarize", "notary", "witness", "attestation"],
    answer: "While our platform doesn't directly provide notarization services, we partner with online notary services that can help you get your documents notarized remotely."
  },
  {
    keywords: ["template quality", "legal validity", "reviewed", "verified"],
    answer: "All our templates are created and reviewed by experienced attorneys to ensure legal compliance. They are regularly updated to reflect changes in relevant laws and regulations."
  },

  // Account Related
  {
    keywords: ["account", "sign up", "register", "login", "password", "reset", "forgot"],
    answer: "To create an account, click the Sign Up button on the homepage. If you already have an account, use the Login button. If you forgot your password, there's a 'Forgot Password' link on the login page."
  },
  {
    keywords: ["delete account", "close account", "deactivate"],
    answer: "You can delete your account by going to Account Settings and selecting 'Delete Account'. Please note that this action is permanent and will remove all your data from our systems."
  },
  {
    keywords: ["profile", "change email", "update information"],
    answer: "You can update your profile information including email address, name, and contact details in your Account Settings. Changes will be applied immediately."
  },
  {
    keywords: ["verification", "confirm email", "verify account"],
    answer: "After registration, we send a verification email to your registered email address. Please click the link in that email to verify your account. If you didn't receive it, you can request a new one from your Account page."
  },
  
  // Support & Help
  {
    keywords: ["contact", "support", "help", "talk", "lawyer", "legal", "advice"],
    answer: "For personalized legal advice, you can schedule a consultation with one of our lawyers through the 'Ask a Lawyer' page. Our support team is also available 24/7 via email at support@legalgram.com."
  },
  {
    keywords: ["chat", "live support", "customer service", "representative"],
    answer: "Our live chat support is available Monday through Friday, 9 AM to 8 PM EST. Outside these hours, you can leave a message and we'll get back to you by the next business day."
  },
  {
    keywords: ["phone", "call", "hotline", "telephone"],
    answer: "You can reach our customer support team by phone at 1-800-LEGAL-HELP during business hours (Monday-Friday, 9 AM to 6 PM EST)."
  },
  {
    keywords: ["feedback", "suggestion", "complaint", "report problem"],
    answer: "We value your feedback! You can share your thoughts, suggestions, or report any issues through the Feedback form in your account dashboard or by emailing feedback@legalgram.com."
  },

  // Privacy & Security
  {
    keywords: ["privacy", "data", "information", "confidential", "secure"],
    answer: "We take your privacy seriously. All your data is encrypted and securely stored. We never share your information with third parties without your consent. Please review our Privacy Policy for more details."
  },
  {
    keywords: ["GDPR", "data protection", "rights", "personal data"],
    answer: "Our platform is fully GDPR compliant. You have the right to access, correct, and delete your personal data. You can exercise these rights through your Account Settings or by contacting our Data Protection Officer."
  },
  {
    keywords: ["security", "hack", "breach", "protection"],
    answer: "We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your information. We've never experienced a data breach and take proactive steps to maintain security."
  },

  // Legal Topics
  {
    keywords: ["divorce", "separation", "custody", "alimony", "child support"],
    answer: "We offer templates for divorce agreements, child custody arrangements, and related documents. For complex family law matters, we recommend consulting with one of our family law specialists."
  },
  {
    keywords: ["will", "testament", "estate planning", "inheritance", "trust"],
    answer: "Our estate planning templates include basic wills, living trusts, power of attorney documents, and healthcare directives. These documents help ensure your wishes are respected and can simplify matters for your loved ones."
  },
  {
    keywords: ["trademark", "copyright", "intellectual property", "patent", "IP"],
    answer: "We provide templates for trademark applications, copyright notices, and IP assignment agreements. For complex IP matters or patent applications, consultation with a specialized IP attorney is recommended."
  },
  {
    keywords: ["business", "incorporation", "LLC", "corporation", "startup"],
    answer: "Our business document templates include incorporation documents, operating agreements, bylaws, and various contracts. We can help you establish your business entity properly and create necessary governance documents."
  },
  {
    keywords: ["real estate", "property", "lease", "rental", "mortgage"],
    answer: "Our real estate document library includes rental/lease agreements, purchase contracts, disclosure forms, and mortgage documents customized for different states' requirements."
  },
  {
    keywords: ["employment", "worker", "contract", "NDA", "confidentiality"],
    answer: "We offer comprehensive employment contracts, NDAs, independent contractor agreements, and workplace policies that comply with current labor laws."
  },

  // Using the Platform
  {
    keywords: ["mobile", "app", "phone", "tablet", "iOS", "Android"],
    answer: "Yes, our platform is fully responsive and works on all mobile devices. We also offer dedicated iOS and Android apps that you can download from the respective app stores."
  },
  {
    keywords: ["browser", "compatibility", "Chrome", "Firefox", "Safari"],
    answer: "Our platform works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of any of these browsers."
  },
  {
    keywords: ["accessibility", "screen reader", "ADA", "disability"],
    answer: "We are committed to making our platform accessible to all users, including those with disabilities. Our site is designed to work with screen readers and follows WCAG 2.1 accessibility guidelines."
  },
  {
    keywords: ["storage", "cloud", "save", "access", "documents"],
    answer: "All your documents are securely stored in the cloud and can be accessed from any device. We maintain backups to ensure you never lose your important legal documents."
  },
  {
    keywords: ["share", "collaborate", "team", "access", "permission"],
    answer: "You can easily share documents with others by email or by generating a secure link. You can also set permissions to control whether recipients can view, comment on, or edit the documents."
  },

  // Jurisdictional Issues
  {
    keywords: ["state", "country", "jurisdiction", "international", "local laws"],
    answer: "Our templates are primarily designed for U.S. law but can be customized for different states. We also offer some international templates. Always check that a document meets your local legal requirements."
  },
  {
    keywords: ["legal advice", "lawyer", "attorney", "consultation"],
    answer: "While we provide document templates and general information, this does not constitute legal advice. For specific legal advice tailored to your situation, please use our 'Ask a Lawyer' service."
  },

  // Technical Issues
  {
    keywords: ["bug", "error", "problem", "issue", "doesn't work"],
    answer: "If you're experiencing technical issues, please try clearing your browser cache and cookies, or try using a different browser. If problems persist, contact our support team with screenshots and details of the issue."
  },
  {
    keywords: ["download", "save", "export", "print"],
    answer: "You can download your documents in PDF format, print them directly from the browser, or export them to Word format for further editing. All options are available after document creation."
  },

  // Specific Document Types
  {
    keywords: ["power of attorney", "POA", "legal authority", "agent"],
    answer: "Our Power of Attorney templates allow you to designate someone to make decisions on your behalf. We offer general POAs, limited POAs, medical POAs, and financial POAs."
  },
  {
    keywords: ["non-disclosure", "confidentiality agreement", "NDA", "trade secrets"],
    answer: "Our NDAs protect your confidential information when sharing it with employees, contractors, or business partners. You can customize the scope, duration, and terms of confidentiality."
  },
  {
    keywords: ["lease", "rental agreement", "tenant", "landlord", "property"],
    answer: "Our lease agreements cover residential and commercial properties with customizable terms including rent amount, security deposit, maintenance responsibilities, and other key provisions."
  },
  {
    keywords: ["bill of sale", "purchase agreement", "buying", "selling"],
    answer: "Our Bills of Sale document the transfer of ownership of goods from seller to buyer. They include details about the item(s), price, condition, and warranties or disclaimers."
  }
  
  // This is just a sample of 40+ detailed FAQ items
  // In a real implementation, this would continue with hundreds more items
  // covering all aspects of legal services and document types
];
