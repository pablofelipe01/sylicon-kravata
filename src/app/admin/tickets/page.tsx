"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AdminTicketsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  
  // Estado de autenticación local
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: ""
  });
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState({
    estado: "",
    search: ""
  });
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminComment, setAdminComment] = useState("");
  
  // Verificar si hay una sesión de administrador guardada
  useEffect(() => {
    const savedAdminSession = localStorage.getItem('adminSession');
    if (savedAdminSession === 'true') {
      setIsAdmin(true);
    }
  }, []);
  
  // Cargar tickets si está autenticado
  useEffect(() => {
    if (isAdmin) {
      fetchTickets();
    }
  }, [isAdmin, pagination.page, filters]);
  
  // Función para iniciar sesión
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Credenciales de administrador (solo para desarrollo)
    // En producción, esto debería validarse contra una base de datos o servicio
    if (loginCredentials.username === "admin" && loginCredentials.password === "sylicon2024") {
      setIsAdmin(true);
      localStorage.setItem('adminSession', 'true');
      toast.success("Sesión de administrador iniciada");
    } else {
      toast.error("Credenciales incorrectas");
    }
  };
  
  // Función para cerrar sesión
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminSession');
    toast.success("Sesión cerrada");
  };
  
  // Función para cargar tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setApiError(false);
      
      // Construir parámetros de consulta
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (filters.estado) {
        params.append("estado", filters.estado);
      }
      
      if (filters.search) {
        params.append("search", filters.search);
      }
      
      // Obtener tickets desde la API
      const response = await fetch(`/api/admin/tickets?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }
      
      const data = await response.json();
      setTickets(data.tickets);
      setPagination(prevState => ({
        ...prevState,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
      
    } catch (error) {
      console.error("Error fetching tickets:", error);
      
      setApiError(true);
      // Si la API falla, mostrar datos de ejemplo solo para desarrollo
      if (process.env.NODE_ENV === 'development') {
        const mockTickets = [
          {
            id: "1",
            ticketNumber: "TK-123456-7890",
            tipoProblema: "Compré tokens pero no llegaron a mi billetera",
            externalId: "EXT-12345",
            correo: "usuario@example.com",
            estado: "pendiente",
            comentarios: "Compré 10 tokens pero no se reflejan en mi cuenta",
            fechaCreacion: new Date().toISOString(),
            ultimaActualizacion: new Date().toISOString(),
            archivos: [
              { filename: "captura1.png", url: "#" }
            ]
          },
          {
            id: "2",
            ticketNumber: "TK-234567-8901",
            tipoProblema: "Error: No se pudo obtener la URL de pago PSE",
            documento: "1234567890",
            correo: "otro@example.com",
            estado: "en_revision",
            comentarios: "Intenté realizar el pago pero me sale error",
            fechaCreacion: new Date().toISOString(),
            ultimaActualizacion: new Date().toISOString()
          }
        ];
        
        setTickets(mockTickets);
        setPagination(prevState => ({
          ...prevState,
          total: mockTickets.length,
          totalPages: 1
        }));
        
        toast.error("Error al conectar con la API. Mostrando datos de ejemplo");
      } else {
        toast.error("Error al cargar los tickets");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar cambio de filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    
    // Resetear página a 1 cuando cambian los filtros
    setPagination(prevState => ({
      ...prevState,
      page: 1
    }));
  };
  
  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTickets();
  };
  
  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prevState => ({
        ...prevState,
        page: newPage
      }));
    }
  };
  
  // Abrir modal de detalles de ticket
  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.estado);
    setAdminComment(ticket.comentarioAdmin || "");
  };
  
  // Cerrar modal de detalles
  const closeTicketDetails = () => {
    setSelectedTicket(null);
  };
  
  // Actualizar estado del ticket
  const updateTicketStatus = async () => {
    try {
      const response = await fetch('/api/admin/tickets', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          estado: newStatus,
          comentarioAdmin: adminComment
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el ticket");
      }
      
      toast.success("Ticket actualizado correctamente");
      closeTicketDetails();
      fetchTickets();
      
    } catch (error) {
      console.error("Error updating ticket:", error);
      
      if (apiError) {
        // Si la API no está disponible, simular la actualización solo para desarrollo
        toast.success("Simulando actualización (solo para desarrollo)");
        closeTicketDetails();
        fetchTickets();
      } else {
        toast.error(error.message || "Error al actualizar el ticket");
      }
    }
  };
  
  // Si no está autenticado, mostrar formulario de login
  if (!isAdmin) {
    return (
      <div className="pt-20 min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Panel de Administración</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-300 mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  value={loginCredentials.username}
                  onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 font-medium text-white rounded-md shadow-md hover:shadow-lg transition-all"
                style={{ 
                  background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                  backgroundSize: '200% auto',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundPosition = 'right center';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundPosition = 'left center';
                }}
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  // Mapeo de estados para el selector y visualización
  const estadosOptions = [
    { value: "", label: "Todos los estados" },
    { value: "pendiente", label: "Pendiente de revisión" },
    { value: "en_revision", label: "En revisión" },
    { value: "esperando_informacion", label: "Esperando información" },
    { value: "en_proceso", label: "En proceso" },
    { value: "resuelto", label: "Resuelto" },
    { value: "cerrado", label: "Cerrado" }
  ];
  
  // Función para obtener la etiqueta de estado según el valor
  const getEstadoLabel = (value) => {
    const estado = estadosOptions.find(opt => opt.value === value);
    return estado ? estado.label : value;
  };
  
  // Función para obtener clase CSS según el estado
  const getStatusClass = (estado) => {
    const statusMap = {
      "pendiente": "bg-yellow-500",
      "en_revision": "bg-blue-500",
      "esperando_informacion": "bg-orange-500",
      "en_proceso": "bg-indigo-500",
      "resuelto": "bg-green-500",
      "cerrado": "bg-gray-500"
    };
    
    return statusMap[estado] || "bg-gray-500";
  };
  
  // Interfaz de administrador
  return (
    <div className="pt-20 min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestión de Tickets de Soporte</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
        
        {apiError && (
          <div className="bg-orange-900 bg-opacity-20 border border-orange-800 text-orange-200 p-4 rounded-md mb-6">
            ⚠️ Modo de desarrollo: No se pudo conectar con la API. Mostrando datos de ejemplo.
          </div>
        )}
        
        {/* Filtros */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Buscar por ticket, external ID, documento, correo..."
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="md:w-64">
              <select
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {estadosOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Filtrar
            </button>
          </form>
        </div>
        
        {/* Tabla de Tickets */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ticket #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tipo de Problema
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Identificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                      Cargando tickets...
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                      No hay tickets que coincidan con los filtros
                    </td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono">{ticket.ticketNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="line-clamp-1">
                          {ticket.tipoProblema}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {ticket.externalId || ticket.documento || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(ticket.estado)} bg-opacity-20 text-white`}>
                          {getEstadoLabel(ticket.estado)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(ticket.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openTicketDetails(ticket)}
                          className="text-green-400 hover:text-green-300"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Mostrando {tickets.length} de {pagination.total} resultados
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <span className="px-3 py-1 bg-gray-700 rounded-md">
                  {pagination.page} de {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Modal de Detalles de Ticket */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">
                  Ticket: <span className="font-mono">{selectedTicket.ticketNumber}</span>
                </h2>
                <button
                  onClick={closeTicketDetails}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Tipo de Problema</p>
                  <p className="text-white">{selectedTicket.tipoProblema}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm mb-1">Estado Actual</p>
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusClass(selectedTicket.estado)}`}></span>
                    <span>{getEstadoLabel(selectedTicket.estado)}</span>
                  </div>
                </div>
                
                {selectedTicket.externalId && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">External ID</p>
                    <p className="text-white">{selectedTicket.externalId}</p>
                  </div>
                )}
                
                {selectedTicket.documento && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Documento</p>
                    <p className="text-white">{selectedTicket.documento}</p>
                  </div>
                )}
                
                {selectedTicket.correo && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Correo</p>
                    <p className="text-white">{selectedTicket.correo}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-gray-400 text-sm mb-1">Fecha de Creación</p>
                  <p className="text-white">
                    {new Date(selectedTicket.fechaCreacion).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm mb-1">Última Actualización</p>
                  <p className="text-white">
                    {new Date(selectedTicket.ultimaActualizacion).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Descripción del Problema</p>
                <div className="bg-gray-700 p-4 rounded-md">
                  <p className="text-white whitespace-pre-wrap">{selectedTicket.comentarios}</p>
                </div>
              </div>
              
              {/* Archivos adjuntos */}
              {selectedTicket.archivos && selectedTicket.archivos.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-2">Archivos Adjuntos</p>
                  <div className="bg-gray-700 p-4 rounded-md">
                    <ul className="space-y-2">
                      {selectedTicket.archivos.map((archivo, index) => (
                     
                        <li key={index} className="flex items-center">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2 text-green-400" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                            />
                          </svg>
                          <a 
                            href={archivo.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 hover:underline"
                          >
                            {archivo.filename}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Comentario administrativo anterior si existe */}
              {selectedTicket.comentarioAdmin && (
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-2">Comentario Administrativo Anterior</p>
                  <div className="bg-gray-700 p-4 rounded-md border-l-4 border-green-500">
                    <p className="text-white whitespace-pre-wrap">{selectedTicket.comentarioAdmin}</p>
                  </div>
                </div>
              )}
              
              {/* Formulario para actualizar estado */}
              <div className="border-t border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Actualizar Estado</h3>
                
                <div className="mb-4">
                  <label htmlFor="newStatus" className="block text-gray-400 text-sm mb-2">
                    Nuevo Estado
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {estadosOptions.filter(opt => opt.value !== "").map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="adminComment" className="block text-gray-400 text-sm mb-2">
                    Comentario Administrativo
                  </label>
                  <textarea
                    id="adminComment"
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Agrega un comentario interno sobre este ticket..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeTicketDetails}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    onClick={updateTicketStatus}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Actualizar Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}