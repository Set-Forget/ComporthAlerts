

export const fetchAdminIncidents = async () => {
  const response = await fetch('https://0emzr5dmgj.execute-api.us-east-2.amazonaws.com/default/testJT');
  return response.json();
};

export const fetchClientIncidents = async (organization: string) => {
  const apiUrl ="https://happy-mixed-gaura.glitch.me/" + 'https://0emzr5dmgj.execute-api.us-east-2.amazonaws.com/default/testJT'; // Reemplaza con la nueva ruta del endpoint para el rol
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ organization : organization }),
  });
  return response.json();
};