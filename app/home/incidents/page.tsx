"use client";
import React from "react";
import { DataTable } from "@/components/DataTable";
import { useIncidentsFetcher } from "./components/incidentFetch";

type Incident = {
  casenumber: string;
  casetype: string;
  caseresponsibility: string;
  investigationprocessid: string;
  investigationtype: string;
  investigationcompleted: string;
  investigationstatus: string;
  address: string;
  unit_num: string;
  zip: string;
  opa_owner: string;
};

const IncidentsPage: React.FC = () => {
  const { incidents, loading } = useIncidentsFetcher();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!incidents || incidents.length === 0) {
    return <p>No incidents available.</p>;
  }

  if (!Array.isArray(incidents)) {
    return <p>Invalid data format.</p>;
  }
  const formattedIncidents: Incident[] = incidents.map(
    (incident: Incident) => ({
      casenumber: incident.casenumber,
      casetype: incident.casetype,
      caseresponsibility: incident.caseresponsibility,
      investigationprocessid: incident.investigationprocessid.toString(),
      investigationtype: incident.investigationtype,
      investigationcompleted: formatDate(incident.investigationcompleted),
      investigationstatus: incident.investigationstatus,
      address: incident.address,
      unit_num: incident.unit_num,
      zip: incident.zip,
      opa_owner: incident.opa_owner,
    })
  );
  return (
    <div>
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
        data={formattedIncidents}
      />
    </div>
  );
};

export default IncidentsPage;
