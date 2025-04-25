
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, UserX, UserCheck, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  uid?: string;
  email: string;
  display_name?: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    name?: string;
  };
}

const UserManagementTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch users
  const fetchUsers = async (search?: string) => {
    try {
      setLoading(true);
      
      // Call our Supabase Edge Function to get users
      const { data, error } = await supabase.functions.invoke('get-all-users', {
        body: { searchTerm: search || searchTerm }
      });
      
      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users. Please try again later.');
        return;
      }
      
      if (Array.isArray(data)) {
        setUsers(data);
        console.log("Fetched users:", data);
      } else {
        console.error('Invalid response format:', data);
        toast.error('Received invalid data format from server.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleSearch = () => {
    fetchUsers(searchTerm);
  };

  // Handle user ban/unban
  const handleUserAction = async (userId: string, action: 'ban' | 'unban') => {
    try {
      // Call our manage-user edge function
      const { data, error } = await supabase.functions.invoke('manage-user', {
        body: { action, userId }
      });
      
      if (error) {
        console.error(`Error ${action}ing user:`, error);
        toast.error(`Failed to ${action} user`);
        return;
      }
      
      if (data?.success) {
        toast.success(data.message || `User has been ${action === 'ban' ? 'banned' : 'unbanned'}`);
        // Refresh user list
        fetchUsers();
      } else {
        toast.error(data?.message || `Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  // Filter out admin user only for display (not during search)
  const filteredUsers = users.filter(user => 
    !searchTerm || (user.email?.toLowerCase() !== "admin@legalgram.com")
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[250px]"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button variant="outline" onClick={handleSearch}>Search</Button>
          <Button 
            variant="outline" 
            onClick={() => fetchUsers()} 
            title="Refresh users"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.display_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || '-'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="font-mono text-xs truncate max-w-[150px]" title={user.id}>
                    {user.id}
                  </TableCell>
                  <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleUserAction(user.id, 'ban')}
                      >
                        <UserX className="h-3.5 w-3.5" />
                        <span>Ban</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-green-500 hover:text-green-600 hover:bg-green-50"
                        onClick={() => handleUserAction(user.id, 'unban')}
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Unban</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagementTable;
