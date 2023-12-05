"use client"

import { useEffect, useState } from "react";
import { fetchAccountRole, fetchAccountOrganization } from "../utils/dbUtils";
import { fetchAdminIncidents, fetchClientIncidents } from "./dbFunctions";

export const useIncidentsFetcher = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = await fetchAccountRole();
        const organization = await fetchAccountOrganization();
        
        

        if (role === 'admin') {
          const data = await fetchAdminIncidents();
          setIncidents(data.rows);
          setLoading(false)
        } else if (role === 'client' && organization) {
          const data = await fetchClientIncidents(organization);
          setIncidents(data.rows);
          setLoading(false)
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { incidents, loading };
};