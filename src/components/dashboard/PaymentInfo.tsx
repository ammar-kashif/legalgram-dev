
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const PaymentInfo: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Payment Information</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            No payment methods on file. Add a payment method to access premium features.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentInfo;
