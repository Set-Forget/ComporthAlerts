"use client";
import React from "react";
import { DataTable } from "@/components/DataTable";
import { useIncidentsFetcher } from "./components/incidentFetch";
import { useRequireAuth } from "@/utils/hooks/auth";



const IncidentsPage: React.FC = () => {
  useRequireAuth();
  const { incidents, loading } = useIncidentsFetcher();
  



  if (loading) {
    return <p>Loading...</p>;
  }

  if (!incidents || incidents.length === 0) {
    return <p>No incidents available.</p>;
  }

  if (!Array.isArray(incidents)) {
    return <p>Invalid data format.</p>;
  }

  const handleRefreshData = () => {
      // Borra los datos almacenados en localStorage
      localStorage.removeItem("incidents");
      // Recarga la página para obtener datos actualizados
      window.location.reload();
    };


  return (
    <div className="flex flex-col space-y-2 relative">
      <div className="mb-4">
        <button
          className=" bg-zinc-900 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2 justify-end"
          onClick={handleRefreshData}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          Refresh
        </button>
      </div>

      <DataTable
        headers={[
          {
            accessorKey: "casenumber",
            header: "Case Number",
          },
          {
            accessorKey: "casetype",
            header: "Case Type",
          },
          {
            accessorKey: "caseresponsibility",
            header: "Case Responsibility",
          },
          {
            accessorKey: "investigationprocessid",
            header: "Investigation Process Id",
          },
          {
            accessorKey: "investigationcompleted",
            header: "Investigation Completed",
            filterFn: (row, id, value) => {
              const [from, to] = value.toString().split(",");
              const date: any = row.getValue(id);
              if (from && to) {
                return date >= from && date <= to;
              }
              if (from) {
                return date >= from;
              }
              if (to) {
                return date <= to;
              }
              return true;
            },
          },
          {
            accessorKey: "investigationstatus",
            header: "Investigation Status",
          },
          {
            accessorKey: "address",
            header: "Address",
          },
          {
            accessorKey: "zip",
            header: "Zip",
          },
          {
            accessorKey: "opa_owner",
            header: "Opa Owner",
          },
        ]}
        data={incidents}
      />
    </div>
  );
};

export default IncidentsPage;
