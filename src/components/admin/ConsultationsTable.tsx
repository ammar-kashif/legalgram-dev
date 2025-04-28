import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Calendar, CheckCircle, XCircle, Phone, User, RefreshCw, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Consultation, Notification } from "@/types/supabase";

const ConsultationsTable: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    console.log("ConsultationsTable component mounted, fetching data...");
    fetchConsultations();
  }, [filterStatus]);
  
  const fetchConsultations = async () => {
    setLoading(true);
    console.log("Fetching consultations from Supabase...");
    
    try {
      let query = supabase
        .from('consultations')
        .select<'*', Consultation>('*');
        
      if (filterStatus !== "all") {
        query = query.eq('status', filterStatus);
      }
      
      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching consultations:', error);
        toast.error('Failed to load consultations');
        setLoading(false);
        return;
      }

      console.log("Consultations fetched:", data);
      setConsultations(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchConsultations();
      return;
    }
    
    setIsSearching(true);
    
    try {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = consultations.filter(item => 
        item.name.toLowerCase().includes(lowerSearchTerm) || 
        item.email.toLowerCase().includes(lowerSearchTerm) ||
        (item.phone && item.phone.toLowerCase().includes(lowerSearchTerm)) ||
        item.message.toLowerCase().includes(lowerSearchTerm)
      );
      
      setConsultations(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const createNotification = async (userId: string, title: string, message: string) => {
    if (!userId) {
      console.error('Cannot create notification: No user ID provided');
      return;
    }
    
    try {
      console.log(`Creating notification for user ${userId} with title: ${title}`);
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          is_read: false
        });
        
      if (error) {
        console.error('Error creating notification:', error);
        return;
      }
      
      console.log(`Notification created successfully for user ${userId}`);
    } catch (error) {
      console.error('Unexpected error creating notification:', error);
    }
  };

  const updateConsultationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { data: consultationData, error: fetchError } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        console.error('Error fetching consultation:', fetchError);
        toast.error('Failed to update consultation status');
        return;
      }
      
      const { error } = await supabase
        .from('consultations')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating consultation status:', error);
        toast.error('Failed to update consultation status');
        return;
      }
      
      if (consultationData && consultationData.email) {
        let userId = consultationData.user_id;
        
        if (!userId) {
          try {
            const { data: { users }, error: userError } = await supabase.functions.invoke('get-user-by-email', {
              body: { email: consultationData.email }
            });
            
            if (!userError && users && users.length > 0) {
              userId = users[0].id;
              await supabase
                .from('consultations')
                .update({ user_id: userId })
                .eq('id', id);
            }
          } catch (error) {
            console.error('Error finding user by email:', error);
          }
        }
        
        if (userId) {
          const title = status === 'approved' 
            ? 'Consultation Approved' 
            : 'Consultation Rejected';
            
          const message = status === 'approved'
            ? `Your consultation request regarding "${consultationData.message.substring(0, 30)}${consultationData.message.length > 30 ? '...' : ''}" has been approved.`
            : `Your consultation request regarding "${consultationData.message.substring(0, 30)}${consultationData.message.length > 30 ? '...' : ''}" has been rejected.`;
            
          await createNotification(userId, title, message);
        } else {
          console.warn(`No user_id found for consultation ${id} with email ${consultationData.email}`);
        }
      }
      
      setConsultations(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status } : item
        )
      );
      
      if (selectedConsultation && selectedConsultation.id === id) {
        setSelectedConsultation({ ...selectedConsultation, status });
      }
      
      toast.success(`Consultation ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const deleteConsultation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting consultation:', error);
        toast.error('Failed to delete consultation');
        return;
      }
      
      setConsultations(prev => prev.filter(item => item.id !== id));
      
      toast.success('Consultation deleted successfully');
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
      case "approved": 
        return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
      default:
        return "";
    }
  };

  return (
    <Card className="shadow-md border border-slate-200 dark:border-slate-800 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">Consultation Requests</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Review and manage client consultation requests
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-[250px] bg-background border-slate-200 dark:border-slate-700"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full sm:w-auto"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={fetchConsultations} 
              className="gap-1 w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-2">
        <ToggleGroup 
          type="single" 
          value={filterStatus} 
          onValueChange={(value) => {
            if (value) setFilterStatus(value as "all" | "pending" | "approved" | "rejected");
          }}
          className="justify-start border rounded-lg p-1 bg-slate-50 dark:bg-slate-900"
        >
          <ToggleGroupItem value="all" className="text-sm data-[state=on]:bg-white dark:data-[state=on]:bg-slate-800 data-[state=on]:text-primary data-[state=on]:shadow-sm">
            All
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="pending" 
            className="text-sm text-yellow-800 data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-900"
          >
            Pending
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="approved" 
            className="text-sm text-green-800 data-[state=on]:bg-green-100 data-[state=on]:text-green-900"
          >
            Approved
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="rejected" 
            className="text-sm text-red-800 data-[state=on]:bg-red-100 data-[state=on]:text-red-900"
          >
            Rejected
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900">
              <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="font-medium">Email</TableHead>
                <TableHead className="font-medium">Phone</TableHead>
                <TableHead className="font-medium">Request</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 bg-white dark:bg-slate-950">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                      <p className="text-slate-500 dark:text-slate-400">Loading consultation requests...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : consultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 bg-white dark:bg-slate-950">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                      <h3 className="text-lg font-medium">No consultation requests found</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-center text-sm">
                        {searchTerm ? 
                          "No requests match your search criteria. Try using different keywords or clear your search." :
                          filterStatus !== "all" ? 
                            `No ${filterStatus} consultation requests found.` :
                            "When clients request consultations, they will appear here."
                        }
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchTerm("");
                            fetchConsultations();
                          }}
                          className="mt-2"
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                consultations.map((consultation) => (
                  <TableRow 
                    key={consultation.id}
                    className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="font-medium">{consultation.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">{consultation.email}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      {consultation.phone ? (
                        <div className="flex items-center">
                          <Phone className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                          {consultation.phone}
                        </div>
                      ) : "Not provided"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-slate-600 dark:text-slate-300">
                      {consultation.message.substring(0, 40) + (consultation.message.length > 40 ? '...' : '')}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                        {formatDate(consultation.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(consultation.status)} transition-colors`}
                        variant="outline"
                      >
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 gap-1 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                              onClick={() => setSelectedConsultation(consultation)}
                            >
                              <Calendar className="h-3.5 w-3.5" />
                              <span>View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            {selectedConsultation && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Consultation Request</DialogTitle>
                                  <DialogDescription>
                                    From {selectedConsultation.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Name:</span>
                                    <p className="flex items-center mt-1">
                                      <User className="h-4 w-4 mr-2 text-slate-400" />
                                      {selectedConsultation.name}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Email:</span>
                                    <p className="mt-1">{selectedConsultation.email}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Phone:</span>
                                    <p className="flex items-center mt-1">
                                      <Phone className="h-4 w-4 mr-2 text-slate-400" />
                                      {selectedConsultation.phone || 'Not provided'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Request:</span>
                                    <p className="mt-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-md text-slate-700 dark:text-slate-300">
                                      {selectedConsultation.message}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Date:</span>
                                    <p className="mt-1">{formatDate(selectedConsultation.created_at)}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Status:</span>
                                    <p className="mt-1">
                                      <Badge
                                        className={`${getStatusColor(selectedConsultation.status)}`}
                                        variant="outline"
                                      >
                                        {selectedConsultation.status.charAt(0).toUpperCase() + selectedConsultation.status.slice(1)}
                                      </Badge>
                                    </p>
                                  </div>
                                  <DialogFooter className="flex justify-end gap-2 mt-6">
                                    <Button
                                      variant="outline"
                                      className="gap-1 text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
                                      onClick={() => {
                                        updateConsultationStatus(selectedConsultation.id, 'rejected');
                                      }}
                                      disabled={selectedConsultation.status === 'rejected'}
                                    >
                                      <XCircle className="h-4 w-4" />
                                      <span>Reject</span>
                                    </Button>
                                    <Button
                                      className="gap-1"
                                      onClick={() => {
                                        updateConsultationStatus(selectedConsultation.id, 'approved');
                                      }}
                                      disabled={selectedConsultation.status === 'approved'}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      <span>Approve</span>
                                    </Button>
                                  </DialogFooter>
                                </div>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-green-500 hover:text-green-600 hover:bg-green-50 border-green-200"
                          onClick={() => updateConsultationStatus(consultation.id, 'approved')}
                          disabled={consultation.status === 'approved'}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only">Approve</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                          onClick={() => updateConsultationStatus(consultation.id, 'rejected')}
                          disabled={consultation.status === 'rejected'}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only">Reject</span>
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only sm:not-sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Consultation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this consultation request from {consultation.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => deleteConsultation(consultation.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationsTable;
