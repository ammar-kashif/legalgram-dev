
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MessageSquare, Send, User } from "lucide-react";
import { Link } from "react-router-dom";

const legalSpecialties = [
  "Family Law", "Criminal Law", "Real Estate Law", "Business Law", 
  "Immigration Law", "Intellectual Property", "Employment Law"
];

const AskLawyer = () => {
  const [question, setQuestion] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error("Please enter your question");
      return;
    }

    if (!selectedSpecialty) {
      toast.error("Please select a legal specialty");
      return;
    }

    setIsSubmitting(true);
    
    // Simulating submission
    setTimeout(() => {
      toast.success("Your question has been submitted to our legal team");
      setQuestion('');
      setSelectedSpecialty(null);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div>
      <h1 className="heading-lg mb-2">Ask a Lawyer</h1>
      <p className="text-rocket-gray-500 mb-6">
        Get answers to your legal questions from qualified attorneys.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Submit Your Question
              </CardTitle>
              <CardDescription>
                Our lawyers will review your question and respond within 24-48 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Legal Specialty</label>
                  <div className="flex flex-wrap gap-2">
                    {legalSpecialties.map(specialty => (
                      <Button
                        key={specialty}
                        type="button"
                        size="sm"
                        variant={selectedSpecialty === specialty ? "default" : "outline"}
                        onClick={() => setSelectedSpecialty(specialty)}
                      >
                        {specialty}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="question" className="block text-sm font-medium mb-1">Your Question</label>
                  <Textarea
                    id="question"
                    placeholder="Describe your legal situation or question in detail..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Submitting...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : (
                    <>
                      Submit Question <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Submit Your Question</h3>
                  <p className="text-sm text-muted-foreground">Select a legal category and describe your situation</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Lawyer Reviews</h3>
                  <p className="text-sm text-muted-foreground">A qualified attorney reviews your question</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Get Your Answer</h3>
                  <p className="text-sm text-muted-foreground">Receive a detailed response within 24-48 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AskLawyer;
