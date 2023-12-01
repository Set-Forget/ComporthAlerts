"use client"

import { useEffect, useState } from "react";
import { fetchAccountRole, fetchOrganizationAddresses } from "../utils/dbUtils";

export const useIncidentsFetcher = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Utilizar las funciones de supabaseUtils para obtener la información necesaria
        const addresses = await fetchOrganizationAddresses();
        const role = await fetchAccountRole();

        

        // Lógica condicional basada en el rol
        if (role === 'admin') {
          // Si el rol es admin, obtener todos los incidentes
          fetch('https://phl.carto.com/api/v2/sql?q=SELECT * FROM case_investigations ORDER BY investigationcompleted DESC LIMIT 20')
            .then(response => response.json())
            .then(data => {
              setIncidents(data.rows);
            })
            .catch(error => {
              console.error('Error fetching incidents:', error);
            });
        } else if (role === 'client') {
          // Si el rol es client, obtener incidentes filtrados por las direcciones
          if (addresses) {
            const addressArray = addresses.map(address => address.street).join(',');
            fetch(`https://phl.carto.com/api/v2/sql?q=SELECT * FROM case_investigations WHERE Adress IN (${addressArray}) ORDER BY investigationcompleted`)
              .then(response => response.json())
              .then(data => {
                setIncidents(data.rows);
              })
              .catch(error => {
                console.error('Error fetching incidents:', error);
              });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  console.log(incidents);
  
  return incidents;
};