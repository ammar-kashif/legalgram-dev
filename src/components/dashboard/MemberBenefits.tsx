
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, MessageSquare, FileText, Building } from "lucide-react";

const benefitCards = [
  {
    icon: FileText,
    title: "Make legal documents",
    description: "Personalize, print, download, and defend unlimited legal docs.",
    plans: ["Legalgram", "Legalgram+"],
  },
  {
    icon: FileText,
    title: "Sign legal documents",
    description: "Sign your documents quickly and securely",
    plans: ["Legalgram", "Legalgram+"],
  },
  {
    icon: MessageSquare,
    title: "Ask legal questions",
    description: "Ask any legal question and get a quick answer online or consult live.",
    plans: ["Legalgram", "Legalgram+"],
  },
  {
    icon: User,
    title: "Retain a Legal Pro",
    description: "Get legal help from an experienced pro at a discounted rate.",
    price: "$149.99/15 mins",
    upgradeText: "Upgrade for up to HALF OFF*",
  },
  {
    icon: Building,
    title: "Register your business",
    description: "Register an LLC, Corp, or Nonprofit.",
    price: "$99.99",
    priceNote: "(excluding state fees)",
    upgradeText: "Upgrade to get your first business FREE",
  },
  {
    icon: FileText,
    title: "Book a Tax Pro Consult",
    description: "Plan ahead with a Tax Pro and keep more of your money at tax time.",
    price: "$199.99",
    upgradeText: "Upgrade for HALF OFF",
  }
];

const MemberBenefits = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Member benefits</h1>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Get more from your membership</h2>
          <p className="text-muted-foreground text-lg">
            With a Legalgram+ membership, you could get up to{" "}
            <span className="text-emerald-500 font-semibold">HALF OFF</span>{" "}
            Pro Services and get exclusive access to partner offers. Upgrade your membership to unlock.
          </p>
          <Button 
            className="w-full md:w-auto px-8 py-6 text-lg bg-orange-500 hover:bg-orange-600"
          >
            Get Legalgram+
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {benefitCards.map((card, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-lg">{card.title}</h3>
                  <p className="text-muted-foreground">{card.description}</p>
                </div>
              </div>
              
              {card.plans ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Included with</p>
                  {card.plans.map((plan, planIndex) => (
                    <div key={planIndex} className="flex items-center space-x-2">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={planIndex === 1 ? "text-emerald-500" : ""}>{plan}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {card.price && <p className="font-semibold">{card.price}</p>}
                  {card.priceNote && <p className="text-sm text-muted-foreground">{card.priceNote}</p>}
                  {card.upgradeText && (
                    <p className="text-sm text-emerald-500">{card.upgradeText}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemberBenefits;
