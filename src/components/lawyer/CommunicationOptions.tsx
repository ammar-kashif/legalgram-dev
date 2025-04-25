
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Video, 
  Phone,
  Calendar, 
  Clock,
  CheckCircle,
  ThumbsUp
} from "lucide-react";
import { cn } from "@/lib/utils";

type CommunicationMethod = "chat" | "video" | "phone";

interface MethodCardProps {
  type: CommunicationMethod;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  pricing: string;
  isPopular?: boolean;
  onClick: (type: CommunicationMethod) => void;
  isSelected: boolean;
}

function MethodCard({
  type,
  title,
  description,
  icon,
  benefits,
  pricing,
  isPopular,
  onClick,
  isSelected
}: MethodCardProps) {
  return (
    <div 
      className={cn(
        "border rounded-xl p-6 transition-all duration-300 hover:shadow-md relative",
        isSelected ? "border-rocket-blue-500 dark:border-rocket-blue-400 shadow-md" : "border-gray-200 dark:border-gray-700",
        isPopular ? "ring-2 ring-rocket-blue-500 dark:ring-rocket-blue-400" : ""
      )}
      onClick={() => onClick(type)}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-rocket-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <div className="flex items-center mb-4">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mr-4",
          isSelected ? "bg-rocket-blue-100 text-rocket-blue-600 dark:bg-rocket-blue-900/30 dark:text-rocket-blue-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        )}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-rocket-gray-900 dark:text-white">{title}</h3>
      </div>
      
      <p className="text-rocket-gray-600 dark:text-rocket-gray-300 mb-6">{description}</p>
      
      <ul className="space-y-3 mb-6">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center text-rocket-gray-700 dark:text-rocket-gray-200">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      
      <div className="text-xl font-bold text-rocket-gray-900 dark:text-white mb-5">
        {pricing}
      </div>
      
      <Button 
        className={cn("w-full", 
          isSelected ? "bg-rocket-blue-600 hover:bg-rocket-blue-700" : ""
        )}
        variant={isSelected ? "default" : "outline"}
      >
        {isSelected ? "Selected" : "Choose This Option"}
      </Button>
    </div>
  );
}

export default function CommunicationOptions() {
  const [selectedMethod, setSelectedMethod] = useState<CommunicationMethod>("chat");
  const navigate = useNavigate();
  
  const handleMethodSelect = (method: CommunicationMethod) => {
    setSelectedMethod(method);
  };

  return (
    <section className="py-16">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-rocket-gray-900 dark:text-white mb-4">
          Choose How You Want to Connect
        </h2>
        <p className="text-lg text-rocket-gray-600 dark:text-rocket-gray-300">
          Select the communication method that works best for you and get legal advice from certified lawyers specialized in various practice areas.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MethodCard
          type="chat"
          title="Live Chat"
          description="Get answers to your legal questions through our secure messaging platform."
          icon={<MessageSquare size={24} />}
          benefits={[
            "Instant connection with a lawyer",
            "Send documents for review",
            "Conversation transcript saved",
            "Follow-up questions included"
          ]}
          pricing="$29.99 per session"
          isSelected={selectedMethod === "chat"}
          onClick={handleMethodSelect}
          isPopular={true}
        />
        
        <MethodCard
          type="video"
          title="Video Conference"
          description="Face-to-face consultation with a lawyer through secure video calling."
          icon={<Video size={24} />}
          benefits={[
            "30-minute private consultation",
            "Screen sharing capability",
            "Document review in real-time",
            "Encrypted secure connection"
          ]}
          pricing="$79.99 per session"
          isSelected={selectedMethod === "video"}
          onClick={handleMethodSelect}
        />
        
        <MethodCard
          type="phone"
          title="Phone Call"
          description="Traditional phone consultation with a legal professional."
          icon={<Phone size={24} />}
          benefits={[
            "15-minute initial consultation",
            "Callback scheduling available",
            "Extended hours availability",
            "Speciality lawyer matching"
          ]}
          pricing="$49.99 per session"
          isSelected={selectedMethod === "phone"}
          onClick={handleMethodSelect}
        />
      </div>
      
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center text-rocket-gray-700 dark:text-rocket-gray-300">
            <Clock className="h-5 w-5 mr-2" />
            <span>Available 24/7</span>
          </div>
          <div className="flex items-center text-rocket-gray-700 dark:text-rocket-gray-300">
            <Calendar className="h-5 w-5 mr-2" />
            <span>Schedule in advance</span>
          </div>
          <div className="flex items-center text-rocket-gray-700 dark:text-rocket-gray-300">
            <ThumbsUp className="h-5 w-5 mr-2" />
            <span>Satisfaction guaranteed</span>
          </div>
        </div>
        
        <Button size="lg" onClick={() => navigate(`/lawyer-connect/${selectedMethod}`)}>
          Continue with {selectedMethod === "chat" ? "Live Chat" : selectedMethod === "video" ? "Video Conference" : "Phone Call"}
        </Button>
      </div>
    </section>
  );
}
