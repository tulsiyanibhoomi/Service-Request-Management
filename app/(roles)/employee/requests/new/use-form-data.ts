import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export type EmployeeOverview = {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
};

export const useRequestFormData = () => {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");

  const [formData, setFormData] = useState<any>(null);
  const [requestTypes, setRequestTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/auth/current-user");
        if (!res.ok) throw new Error("Failed to fetch current user");
        const { user } = await res.json();

        const typeRes = await fetch("/api/request-types/type-names");
        if (!typeRes.ok) throw new Error("Failed to fetch request types");
        const types = await typeRes.json();
        setRequestTypes(types);

        const overviewRes = await fetch("/api/employee/overview");
        if (!overviewRes.ok)
          throw new Error("Failed to fetch employee overview");
        const overviewData: EmployeeOverview = await overviewRes.json();

        const requestNumber = overviewData.total + 1;
        const initials = user.fullname
          .split(" ")
          .map((n: string) => n[0])
          .join("");
        const serviceRequestNo = `${initials.toUpperCase()}-${String(
          requestNumber,
        ).padStart(4, "0")}`;

        if (requestId) {
          const reqRes = await fetch(`/api/employee/requests/${requestId}`);
          if (!reqRes.ok) throw new Error("Failed to fetch request details");
          const request = await reqRes.json();

          setFormData({
            serviceRequestNo: request.no,
            serviceRequestTitle: request.title,
            serviceRequestDescription: request.description,
            serviceRequestTypeId: request.type_id,
            urgency: request.priority,
            serviceRequestDateTime: request.datetime || "",
            existingFiles: request.attachments || [],
            newFiles: [],
            employee_id: user.userid,
          });
        } else {
          setFormData({
            serviceRequestNo,
            serviceRequestTitle: "",
            serviceRequestDescription: "",
            serviceRequestTypeId: "",
            urgency: "",
            serviceRequestDateTime: "",
            existingFiles: [],
            newFiles: [],
            employee_id: user.userid,
          });
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestId]);

  return { formData, setFormData, requestTypes, loading, error, requestId };
};
