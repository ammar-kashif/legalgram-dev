import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, FileText, CheckCircle, XCircle, Calendar } from "lucide-react";
import type { DocumentSubmission } from "@/types/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Update interface to match the exact data shape from Supabase
interface Submission {
  id: string;
  created_at: string;
  user_email: string;
  type: string;
  status: string;
  title: string;
  content: string;
}

// Update interface to match the exact data shape from Supabase
interface Consultation {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
}

type SubmissionType = Submission | Consultation;

const SubmissionsTable = () => {
  const [submissions, setSubmissions] = useState<DocumentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<SubmissionType | null>(null);
  const [filter, setFilter] = useState<'all' | 'documents' | 'consultations'>('all');
  
  useEffect(() => {
    console.log("SubmissionsTable component mounted, fetching data...");
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    console.log("Fetching submissions from Supabase...");
    
    try {
      const { data: documentData, error: documentError } = await supabase
        .from('document_submissions')
        .select<'*', DocumentSubmission>('*');
        
      // Fetch consultations
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultations')
        .select('*');
        
      // Log any errors but don't return early - we might have partial data
      if (documentError) {
        console.error('Error fetching document submissions:', documentError);
        toast.error('Failed to load some document submissions');
      }
      
      if (consultationError) {
        console.error('Error fetching consultations:', consultationError);
        toast.error('Failed to load some consultations');
      }

      console.log("Document submissions fetched:", documentData);
      console.log("Consultations fetched:", consultationData);

      // Combine both types of data - handle null/undefined cases
      const allData = [
        ...(documentData || []),
        ...(consultationData || [])
      ];

      // Only proceed if we have data to display
      if (allData.length === 0) {
        console.log("No data retrieved from either source");
        toast.warning('No submissions or consultations found');
        setLoading(false);
        return;
      }

      // Sort by created_at date, newest first
      allData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      console.log("Combined and sorted data:", allData);
      
      // Cast the data to match our interfaces and update state
      setSubmissions(allData as any);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      // If search is empty, refresh data
      fetchData();
      return;
    }
    
    // Client-side filtering based on search term
    const filtered = submissions.filter(item => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      if (isConsultation(item)) {
        return item.name.toLowerCase().includes(lowerSearchTerm) || 
               item.email.toLowerCase().includes(lowerSearchTerm) ||
               item.message.toLowerCase().includes(lowerSearchTerm);
      } else {
        return item.user_email.toLowerCase().includes(lowerSearchTerm) || 
               item.title.toLowerCase().includes(lowerSearchTerm) ||
               item.type.toLowerCase().includes(lowerSearchTerm) ||
               item.content.toLowerCase().includes(lowerSearchTerm);
      }
    });
    
    setSubmissions(filtered);
  };

  const updateItemStatus = async (id: string, status: 'approved' | 'rejected', itemType: 'consultation' | 'document') => {
    try {
      let result;
      
      if (itemType === 'consultation') {
        // Update consultation status
        result = await supabase
          .from('consultations')
          .update({ status })
          .eq('id', id);
      } else {
        // Update document submission status
        result = await supabase
          .from('document_submissions')
          .update({ status })
          .eq('id', id);
      }
      
      if (result.error) {
        console.error(`Error updating ${itemType}:`, result.error);
        toast.error(`Failed to update ${itemType}`);
        return;
      }
      
      // Update the local state
      setSubmissions(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status } : item
        )
      );
      
      // If the selected item is being updated, update that too
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem({ ...selectedItem, status });
      }
      
      toast.success(`${itemType === 'consultation' ? 'Consultation' : 'Document'} ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      
      // Refresh data to ensure we have the latest from the server
      fetchData();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  // Fixed isConsultation function with null check
  const isConsultation = (item: SubmissionType | null): item is Consultation => {
    return item !== null && 'name' in item;
  };

  // Filter submissions based on current filter
  let filteredSubmissions = submissions;
  if (filter === 'documents') {
    filteredSubmissions = submissions.filter(item => !isConsultation(item));
  } else if (filter === 'consultations') {
    filteredSubmissions = submissions.filter(item => isConsultation(item));
  }

  // Debug output
  console.log("Current filter:", filter);
  console.log("Filtered submissions:", filteredSubmissions);
  console.log("Total submissions:", submissions.length);
  console.log("Loading state:", loading);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Submissions & Consultations</h2>
        <div className="flex items-center gap-2">
          <div>
            <select 
              className="bg-rocket-gray-800 border border-rocket-gray-700 rounded-md px-3 py-1.5 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'documents' | 'consultations')}
            >
              <option value="all">All</option>
              <option value="documents">Documents</option>
              <option value="consultations">Consultations</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[250px]"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button variant="outline" onClick={handleSearch}>Search</Button>
          <Button variant="outline" onClick={fetchData} className="gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Title/Request</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
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
            ) : filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {isConsultation(item) ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Consultation
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Document
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{isConsultation(item) ? item.name : item.user_email}</TableCell>
                  <TableCell className="font-medium">{isConsultation(item) ? 
                    item.message.substring(0, 40) + (item.message.length > 40 ? '...' : '') : 
                    item.title}
                  </TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                        item.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                        "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                      variant="outline"
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-1"
                            onClick={() => setSelectedItem(item)}
                          >
                            {isConsultation(item) ? 
                              <Calendar className="h-3.5 w-3.5" /> : 
                              <FileText className="h-3.5 w-3.5" />}
                            <span>View</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {isConsultation(selectedItem) ? 
                                'Consultation Request' : 
                                selectedItem?.title || 'Document Request'}
                            </DialogTitle>
                            <DialogDescription>
                              {isConsultation(selectedItem) ? 
                                `From ${selectedItem?.name}` : 
                                `From ${selectedItem?.user_email || 'Unknown'}`}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            {selectedItem && isConsultation(selectedItem) ? (
                              // Consultation details
                              <>
                                <div>
                                  <span className="text-sm font-medium">Name:</span>
                                  <p>{selectedItem.name}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Email:</span>
                                  <p>{selectedItem.email}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Phone:</span>
                                  <p>{selectedItem.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Request:</span>
                                  <p className="mt-1 p-3 bg-muted rounded-md">{selectedItem.message}</p>
                                </div>
                              </>
                            ) : selectedItem && !isConsultation(selectedItem) ? (
                              // Document details
                              <>
                                <div>
                                  <span className="text-sm font-medium">Type:</span>
                                  <p>{selectedItem.type}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Content:</span>
                                  <p className="mt-1 p-3 bg-muted rounded-md">{selectedItem.content}</p>
                                </div>
                              </>
                            ) : null}
                            <div>
                              <span className="text-sm font-medium">Status:</span>
                              <p>{selectedItem?.status.charAt(0).toUpperCase() + selectedItem?.status.slice(1)}</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                className="gap-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={() => {
                                  if (selectedItem) {
                                    updateItemStatus(
                                      selectedItem.id, 
                                      'rejected', 
                                      isConsultation(selectedItem) ? 'consultation' : 'document'
                                    );
                                  }
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </Button>
                              <Button
                                className="gap-1"
                                onClick={() => {
                                  if (selectedItem) {
                                    updateItemStatus(
                                      selectedItem.id, 
                                      'approved', 
                                      isConsultation(selectedItem) ? 'consultation' : 'document'
                                    );
                                  }
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Approve</span>
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-green-500 hover:text-green-600 hover:bg-green-50"
                        onClick={() => updateItemStatus(
                          item.id, 
                          'approved', 
                          isConsultation(item) ? 'consultation' : 'document'
                        )}
                        disabled={item.status === 'approved'}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => updateItemStatus(
                          item.id, 
                          'rejected', 
                          isConsultation(item) ? 'consultation' : 'document'
                        )}
                        disabled={item.status === 'rejected'}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
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

export default SubmissionsTable;
