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
  assigned_on?: Date;
  assigned_to_fullname?: string;
  userid: number;
  username: string;
  userfullname: string;
  priority?: string;
  attachments?: string[];
  reassignment_requested?: boolean;
  reassignment_requested_reason?: string;
  status_history: ServiceRequestStatusHistory[];
  submitted_at: Date;
};

interface ServiceRequestStatusHistory {
  id: string;
  status: string;
  changed_at: Date;
  changed_by?: {
    username: string;
  } | null;
  changed_by_fullname?: string;
  notes?: string | null;
}
