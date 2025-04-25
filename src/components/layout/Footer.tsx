
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { memo } from "react";

// Memoized footer link component
const FooterLink = memo(({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="text-rocket-gray-200 hover:text-white transition-colors">
    {children}
  </Link>
));

FooterLink.displayName = 'FooterLink';

// Memoized contact item component
const ContactItem = memo(({ 
  icon: Icon, 
  children 
}: { 
  icon: React.ElementType; 
  children: React.ReactNode;
}) => (
  <li className="flex items-center gap-2">
    <Icon size={18} />
    {children}
  </li>
));

ContactItem.displayName = 'ContactItem';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-rocket-blue-500 text-white dark:bg-rocket-blue-900 transition-colors duration-300">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-rocket-blue-500 font-bold">
                LG
              </div>
              <span className="text-xl font-bold text-white">Legal Gram</span>
            </div>
            <p className="text-rocket-gray-200">
              We provide affordable, accessible legal services for individuals and businesses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <FooterLink to="/documents">
                  Create Documents
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/pricing">
                  Pricing Plans
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">
                  Contact Us
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Legal</h5>
            <ul className="space-y-2">
              <li>
                <FooterLink to="/terms">
                  Terms of Service
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/privacy">
                  Privacy Policy
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/disclaimer">
                  Legal Disclaimer
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Contact</h5>
            <ul className="space-y-2">
              <ContactItem icon={MapPin}>
                <span className="text-rocket-gray-200">123 Legal Ave, Suite 400</span>
              </ContactItem>
              <ContactItem icon={Phone}>
                <span className="text-rocket-gray-200">+1 (555) 123-4567</span>
              </ContactItem>
              <ContactItem icon={Mail}>
                <a href="mailto:info@legalgram.com" className="text-rocket-gray-200 hover:text-white transition-colors">
                  info@legalgram.com
                </a>
              </ContactItem>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-rocket-blue-400 dark:border-rocket-blue-800 text-center text-rocket-gray-200">
          <p>&copy; {currentYear} Legal Gram. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
