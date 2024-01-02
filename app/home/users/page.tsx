"use client";

import { useRequireAuth } from "@/utils/hooks/auth";
import { UserTable } from "../components/table/UserTable";
import { UserCRUD } from "../components/UserCRUD";

export default () => {
  useRequireAuth();
  
  return (
    <div>
      <UserCRUD />
      <UserTable />
    </div>
  );
};
