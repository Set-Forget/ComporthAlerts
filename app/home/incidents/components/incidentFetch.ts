"use client"

import { useEffect, useState } from "react";
import { fetchAccountRole, fetchAccountOrganization } from "../utils/dbUtils";
import { fetchAdminIncidents, fetchClientIncidents } from "./dbFunctions";
import { format } from "date-fns";

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

export const useIncidentsFetcher = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar cargar los incidentes desde localStorage
    const cachedIncidents = JSON.parse(localStorage.getItem("incidents") || "[]");
    setIncidents(cachedIncidents);

    // Lógica de carga solo si no hay datos en localStorage
    if (cachedIncidents.length === 0) {
      const fetchData = async () => {
        try {
          const role = await fetchAccountRole();
          const organization = await fetchAccountOrganization();

          let fetchedIncidents = [];

          if (role === "admin") {
            const data = await fetchAdminIncidents();
            //mostrar 100 filas nomas

            fetchedIncidents = data.rows.slice(0, 100);
          } else if (role === "client" && organization) {
            const data = await fetchClientIncidents(organization);
            fetchedIncidents = data.rows;
          }

          // Transformar los incidentes a tipo string
          const stringifiedIncidents = fetchedIncidents.map((incident: any) => {
            const stringifiedIncident: Incident = {
              casenumber: String(incident.casenumber),
              casetype: String(incident.casetype),
              caseresponsibility: String(incident.caseresponsibility),
              investigationprocessid: String(incident.investigationprocessid),
              investigationtype: String(incident.investigationtype),
              investigationcompleted: format(new Date(incident.investigationcompleted), "MM/dd/yyyy"),
              investigationstatus: String(incident.investigationstatus),
              address: String(incident.address),
              unit_num: String(incident.unit_num),
              zip: String(incident.zip),
              opa_owner: String(incident.opa_owner),
            };
            return stringifiedIncident;
          });

          // Guardar los incidentes en localStorage y en el estado local
          localStorage.setItem("incidents", JSON.stringify(stringifiedIncidents));
          setIncidents(stringifiedIncidents);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchData();
    } else {
      // Si hay datos en localStorage, establecer loading en false
      setLoading(false);
    }
  }, []); // Este efecto solo se ejecuta en el montaje y desmontaje

  return { incidents, loading };
};
