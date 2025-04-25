
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Pencil, Save, KeyRound, LogOut, CheckCircle } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AccountInfoProps {
  user: User;
  onSignOut: () => void;
}

const AccountInfo = ({ user, onSignOut }: AccountInfoProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // In a real app, we would send this data to the backend
    toast.success("Profile information updated successfully", {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Information</h1>
          <p className="text-muted-foreground">
            View and update your personal information.
          </p>
        </div>
        <Button variant="destructive" onClick={onSignOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Card className="border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="bg-muted/50 dark:bg-rocket-gray-800/50">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
                className={`w-full ${isEditing ? "border-primary/50 focus:border-primary" : ""}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
                className={`w-full ${isEditing ? "border-primary/50 focus:border-primary" : ""}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className={`w-full ${isEditing ? "border-primary/50 focus:border-primary" : ""}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className={`w-full ${isEditing ? "border-primary/50 focus:border-primary" : ""}`}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="mr-2">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="bg-muted/50 dark:bg-rocket-gray-800/50">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle>Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-4">Change your password or update your security settings.</p>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountInfo;
