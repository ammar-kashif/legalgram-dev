
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, FileText, Clock } from "lucide-react";

const legalTopics = [
  "Family Law", "Business Law", "Property Law", "Criminal Law", 
  "Employment Law", "Immigration", "Intellectual Property"
];

const LegalAdvice = () => {
  const [question, setQuestion] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleSubmitQuestion = () => {
    if (!question.trim()) {
      toast.error("Please enter your legal question");
      return;
    }
    
    if (!selectedTopic) {
      toast.error("Please select a legal topic");
      return;
    }
    
    // In a real app, we would send this to the backend
    toast.success("Your question has been submitted!");
    setQuestion("");
    setSelectedTopic(null);
  };

  return (
    <div>
      <h1 className="heading-lg mb-2">Legal Advice</h1>
      <p className="text-rocket-gray-500 mb-6">
        Get expert legal advice from our team of experienced lawyers.
      </p>
      
      <Tabs defaultValue="ask" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ask">
            <MessageCircle className="mr-2 h-4 w-4" />
            Ask a Question
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            My Documents
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ask" className="mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="heading-sm mb-4">Ask a Legal Question</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Topic</label>
              <div className="flex flex-wrap gap-2">
                {legalTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    onClick={() => setSelectedTopic(topic)}
                    className="text-sm"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your Question</label>
              <Textarea
                placeholder="Describe your legal issue in detail..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            
            <Button onClick={handleSubmitQuestion}>
              Submit Question
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="heading-sm mb-4">Your Legal Documents</h2>
            <p className="text-rocket-gray-500">
              You haven't created any legal documents yet. Documents related to your legal inquiries will appear here.
            </p>
            <Button className="mt-4">Create Document</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="heading-sm mb-4">Question History</h2>
            <p className="text-rocket-gray-500">
              Your history of legal questions and answers will appear here once you start using our legal advice service.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalAdvice;
