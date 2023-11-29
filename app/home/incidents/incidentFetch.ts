/*
import { useEffect, useState } from 'react';



export const useIncidentsFetcher = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch('https://phl.carto.com/api/v2/sql?q=SELECT * FROM case_investigations ORDER BY investigationcompleted DESC LIMIT 20')
      .then(response => response.json())
      .then(data => {
        setIncidents(data.rows);
      })
      .catch(error => {
        console.error('Error fetching incidents:', error);
      });
  }, []);

  return incidents;
};
*/
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react';
 // Reemplaza 'supabase' por la ubicación correcta de tu cliente Supabase


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)


export const useIncidentsFetcher = () => {  


  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch('https://phl.carto.com/api/v2/sql?q=SELECT * FROM case_investigations ORDER BY investigationcompleted DESC LIMIT 20')
      .then(response => response.json())
      .then(data => {
        setIncidents(data.rows);
      })
      .catch(error => {
        console.error('Error fetching incidents:', error);
      });
  }, []);

  return incidents;
};
