
export interface SystemStat {
  id: string;
  stat_name: string;
  stat_value: number;
  change_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  user_id: string | null;
}

export interface DocumentSubmission {
  id: string;
  created_at: string;
  user_email: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  title: string;
  content: string;
}

export interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
}
