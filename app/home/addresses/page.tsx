"use client";

import { useRequireAuth } from "@/utils/hooks/auth";
import { AddressCRUD } from "../components/AddressCRUD";
import { AddressTable } from "../components/table/AddressTable";

export default () => {
  useRequireAuth();

  return (
    <div>
    <AddressCRUD />
    <AddressTable/>
    </div>
  );
};
