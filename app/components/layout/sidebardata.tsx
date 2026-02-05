import {
  FiHome,
  FiDatabase,
  FiUsers,
  FiActivity,
  FiGrid,
  FiUser,
  FiFolder,
} from "react-icons/fi";
import { ReactNode } from "react";

export type MenuItem = {
  name: string;
  path?: string;
  icon?: ReactNode;
  subItems?: MenuItem[];
};

export const menuItemsByRole: Record<string, MenuItem[]> = {
  Admin: [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
    { name: "Requests", path: "/admin/requests", icon: <FiDatabase /> },
    {
      name: "Request Status",
      path: "/admin/request-status",
      icon: <FiActivity />,
    },

    // {
    //   name: "Masters",
    //   icon: <FiDatabase />,
    //   subItems: [
    //     { name: "Status Master", path: "/admin/masters/service-status", icon: <FiActivity /> },
    //     { name: "Department Master", path: "/admin/masters/departments", icon: <FiGrid /> },
    //     { name: "Department Person Master", path: "/admin/masters/department-person", icon: <FiUsers /> },
    //     { name: "Service Type Master", path: "/admin/masters/service-types", icon: <FiDatabase /> },
    //     { name: "Request Type Master", path: "/admin/masters/request-type", icon: <FiDatabase /> },
    //     { name: "Request Type-Person Mapping", path: "/admin/masters/requesttype-person", icon: <FiUsers /> },
    //   ],
    // },

    {
      name: "Departments",
      path: "/admin/departments",
      icon: <FiGrid />,
    },

    {
      name: "Users & Roles",
      path: "/admin/users",
      icon: <FiUsers />,
    },
  ],

  HOD: [
    { name: "Dashboard", path: "/hod/dashboard", icon: <FiHome /> },
    { name: "Requests", path: "/hod/requests", icon: <FiFolder /> },
  ],

  Technician: [
    { name: "Dashboard", path: "/technician/dashboard", icon: <FiHome /> },
    { name: "Requests", path: "/technician/requests", icon: <FiFolder /> },
  ],

  Employee: [
    { name: "Dashboard", path: "/employee/dashboard", icon: <FiHome /> },
    { name: "Requests", path: "/employee/requests", icon: <FiDatabase /> },
    { name: "My Profile", path: "/employee/profile", icon: <FiUser /> },
  ],
};
