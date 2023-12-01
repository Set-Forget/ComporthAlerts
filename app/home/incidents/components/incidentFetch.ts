"use client"

import { useEffect, useState } from "react";
import { fetchAccountRole, fetchAccountOrganization } from "../utils/dbUtils";

export const useIncidentsFetcher = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Utilizar las funciones de supabaseUtils para obtener la información necesaria
        const role = await fetchAccountRole();
        const organization = await fetchAccountOrganization();

        if (role === 'admin') {
          fetch('https://phl.carto.com/api/v2/sql?q=SELECT * FROM case_investigations ORDER BY investigationcompleted DESC LIMIT 20')
            .then(response => response.json())
            .then(data => {
              setIncidents(data.rows);
              setLoading(false);
            })
            .catch(error => {
              console.error('Error fetching incidents:', error);
              setLoading(false);
            });
        } else if (role === 'client' && organization) {
          const apiUrl = `https://phl.carto.com/api/v2/sql?q=SELECT * FROM case_investigations WHERE opa_owner ILIKE %27${encodeURIComponent(organization)}%27 ORDER BY investigationcompleted DESC`;
            fetch(apiUrl)
              .then(response => response.json())
              .then(data => {
                setIncidents(data.rows);
                setLoading(false);
              })
              .catch(error => {
                console.error('Error fetching incidents:', error);
                setLoading(false);
              });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    
    fetchData();
  }, []);
  
  return {incidents, loading};
};