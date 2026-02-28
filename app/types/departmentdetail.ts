type ServiceType = {
  id: number;
  name: string;
};

export type DepartmentDetail = {
  service_dept_id: number;
  service_dept_name: string;
  description: string | null;
  cc_email_to_csv: string | null;
  created: string;
  modified: string;
  userid: number;
  username: string;
  hodName: string | null;
  service_types: ServiceType[];
};
