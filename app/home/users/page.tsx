"use client";

import { UserTable } from "../components/table/UserTable";
import { UserCRUD } from "../components/UserCRUD";

export default () => {
  
  
  return (
    <div>
      <UserCRUD />
      <UserTable />
    </div>
  );
};
