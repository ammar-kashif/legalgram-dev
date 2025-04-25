
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface UserProfileProps {
  userEmail: string;
  userCreatedAt: string;
  userMetadata: any;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  userEmail, 
  userCreatedAt, 
  userMetadata 
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Account Information</h3>
              <p className="text-muted-foreground">
                Email: {userEmail}
              </p>
              <p className="text-muted-foreground">
                Member since: {userCreatedAt}
              </p>
              {userMetadata && (
                <>
                  {userMetadata.first_name && (
                    <p className="text-muted-foreground">
                      First Name: {userMetadata.first_name}
                    </p>
                  )}
                  {userMetadata.last_name && (
                    <p className="text-muted-foreground">
                      Last Name: {userMetadata.last_name}
                    </p>
                  )}
                  {userMetadata.phone && (
                    <p className="text-muted-foreground">
                      Phone: {userMetadata.phone}
                    </p>
                  )}
                </>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium">Subscription</h3>
              <p className="text-muted-foreground">
                Plan: Basic
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
