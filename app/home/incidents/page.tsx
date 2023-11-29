"use client";
import React from 'react';
import { DataTable } from '@/components/DataTable';
import { useIncidentsFetcher } from './incidentFetch';

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
  const incidents = useIncidentsFetcher();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formattedIncidents: Incident[] = incidents.map(incident => ({
    ...incident,
    investigationcompleted: formatDate(incident.investigationcompleted),
    investigationprocessid: String(incident.investigationprocessid),
  }));
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
                  }
                ]}
                data={formattedIncidents}
              />
            </div>
          );
        };
        
        export default IncidentsPage;