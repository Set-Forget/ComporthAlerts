"use client";

import { useRequireAuth } from "@/utils/hooks/auth";
import { OrganizationCRUD, OrganizationTable } from "./components";


export default () => {
  useRequireAuth();
  return (
    <div>
      <OrganizationCRUD />
      <OrganizationTable />
    </div>
  );
};
