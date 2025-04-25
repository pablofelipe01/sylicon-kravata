"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ConsultaTicket() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ticketNumber.trim()) {
      toast.error("Por favor ingresa un número de ticket");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setTicketInfo(null);
    
    try {
      const response = await fetch(`/api/support/status?ticket=${encodeURIComponent(ticketNumber.trim())}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al consultar el ticket");
      }
      
      setTicketInfo(data.ticket);
    } catch (err) {
      console.error("Error al consultar el ticket:", err);
      setError(err.message || "No se pudo obtener información del ticket");
      toast.error("Error al consultar el ticket");
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener la clase CSS según el estado del ticket
  const getStatusClass = (estado) => {
    const statusMap = {
      "Pendiente de revisión": "bg-yellow-500",
      "En revisión": "bg-blue-500",
      "Esperando información adicional": "bg-orange-500",
      "En proceso de solución": "bg-indigo-500",
      "Resuelto": "bg-green-500",
      "Cerrado": "bg-gray-500"
    };
    
    return statusMap[estado] || "bg-gray-500";
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold mb-6 text-white">Consulta el estado de tu ticket</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="space-y-4">
          <div className="w-full">
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="Ingresa el número de ticket (ej. TK-123456-7890)"
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-5 py-2 font-medium text-white rounded-md shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                backgroundSize: '200% auto',
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundPosition = 'right center';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundPosition = 'left center';
              }}
            >
              {isLoading ? "Consultando..." : "Consultar"}
            </button>
          </div>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-red-200 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {ticketInfo && (
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h3 className="text-lg font-bold text-white mb-2 md:mb-0">
              Ticket: <span className="font-mono">{ticketInfo.ticketNumber}</span>
            </h3>
            
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusClass(ticketInfo.estado)}`}></span>
              <span className="text-white">{ticketInfo.estado}</span>
            </div>
          </div>
          
          <div className="space-y-3 text-gray-300">
            <p>
              <span className="font-semibold">Tipo de problema:</span>{" "}
              {ticketInfo.tipoProblema}
            </p>
            <p>
              <span className="font-semibold">Fecha de creación:</span>{" "}
              {ticketInfo.fechaCreacion}
            </p>
            <p>
              <span className="font-semibold">Última actualización:</span>{" "}
              {ticketInfo.ultimaActualizacion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}