export type ServiceRequest = {
  service_request_id: number;
  no: string;
  datetime?: Date;
  type_id: number;
  type: string;
  dept_id: number;
  department: string;
  title: string;
  description: string;
  status: string;
  assigned_to_userid?: number;
  assigned_to?: number;
  assigned_to_fullname?: string;
  userid: number;
  username: string;
  userfullname: string;
  priority?: string;
  attachments?: string[];
  reassign_requested?: boolean;
  status_history: ServiceRequestStatusHistory[];
};

interface ServiceRequestStatusHistory {
  id: string;
  status: string;
  changed_at: Date;
  changed_by?: {
    fullname: string;
  } | null;
  notes?: string | null;
}
