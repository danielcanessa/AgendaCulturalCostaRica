// utils/agendaService.js

export async function agregarEventoAgendaBackend(eventId, token) {
    try {
      const response = await fetch("http://localhost:8000/api/userevents/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ event_id: eventId })
      });
  
      if (!response.ok) throw new Error("Error al guardar el evento");
  
      return await response.json();
    } catch (error) {
      console.error("Error al añadir evento a la agenda:", error);
      return null;
    }
  }
  
  export async function obtenerEventosAgendaBackend(token) {
    try {
      const response = await fetch("http://localhost:8000/api/userevents/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) throw new Error("Error al obtener eventos guardados");
  
      return await response.json(); // Debe retornar lista de eventos
    } catch (error) {
      console.error("Error al obtener eventos guardados:", error);
      return [];
    }
  }

  export async function eliminarEventoAgendaBackend(userEventId, token) {
    try {
      const response = await fetch(`http://localhost:8000/api/userevents/${userEventId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return response.status === 204;
    } catch (error) {
      console.error("Error al eliminar evento de la agenda:", error);
      return false;
    }
  }
  