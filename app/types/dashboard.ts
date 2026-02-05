export type Overview = {
    total: number;
    pending: number;
    approved: number;
    in_progress: number;
    completed: number;
};

export type RecentRequest = {
    service_request_id: number;
    service_request_title: string;
    service_request_type_name: string;
    priority_level: string;
    service_request_status_name: string;
    service_request_datetime: string;
};