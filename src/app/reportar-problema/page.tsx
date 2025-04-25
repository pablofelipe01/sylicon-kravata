"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ConfirmacionEnvio from "../components/features/reportes/ConfirmacionEnvio";
import ConsultaTicket from "../components/features/reportes/ConsultaTicket";

export default function ReportarProblemaPage() {
  const [tipoProblema, setTipoProblema] = useState("");
  const [externalId, setExternalId] = useState("");
  const [correo, setCorreo] = useState("");
  const [documento, setDocumento] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiereExternalId, setRequiereExternalId] = useState(true);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const fileInputRef = useRef(null);

  // Lista de problemas predefinidos
  const problemas = [
    "Compré tokens pero no llegaron a mi billetera",
    "Me inscribí pero aún no me han aprobado",
    "Intento comprar un Token pero no me lleva a PSE",
    "Error: No se pudo obtener la URL de pago PSE",
    "Quiero cambiar mi información bancaria/correo",
    "Me arrepentí de la compra, solicito devolución",
    "Olvidé mi External ID",
    "Otro"
  ];

  // Manejar cambio de tipo de problema
  const handleTipoProblemaChange = (e) => {
    const problema = e.target.value;
    setTipoProblema(problema);
    
    // Si el problema es "Olvidé mi External ID", no requerir el External ID
    if (problema === "Olvidé mi External ID") {
      setRequiereExternalId(false);
    } else {
      setRequiereExternalId(true);
    }
  };

  // Manejar carga de archivos
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setArchivos(selectedFiles);
  };

  // Manejar clic en botón de agregar archivos
  const handleAddFilesClick = () => {
    fileInputRef.current.click();
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (tipoProblema === "") {
      toast.error("Por favor selecciona un tipo de problema");
      return;
    }
    
    if (requiereExternalId && externalId === "") {
      toast.error("Por favor ingresa tu External ID");
      return;
    }
    
    if (!requiereExternalId && documento === "") {
      toast.error("Por favor ingresa tu número de documento");
      return;
    }
    
    if (correo === "") {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }
    
    if (comentarios === "") {
      toast.error("Por favor describe tu problema");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Preparar FormData para enviar al backend
      const formData = new FormData();
      formData.append('tipoProblema', tipoProblema);
      formData.append('correo', correo);
      
      if (requiereExternalId) {
        formData.append('externalId', externalId);
      } else {
        formData.append('documento', documento);
      }
      
      formData.append('comentarios', comentarios);
      
      // Agregar archivos si existen
      if (archivos.length > 0) {
        archivos.forEach(file => {
          formData.append('files', file);
        });
      }
      
      // Enviar solicitud al endpoint de la API
      const response = await fetch('/api/support', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar la solicitud');
      }
      
      // Guardar el número de ticket para mostrarlo en la confirmación
      setTicketNumber(result.ticket.ticketNumber);
      
      // Mostrar confirmación
      setMostrarConfirmacion(true);
      
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      toast.error(error.message || "Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cierre de confirmación
  const handleCloseConfirmation = () => {
    setMostrarConfirmacion(false);
    
    // Resetear el formulario después de cerrar la confirmación
    setTipoProblema("");
    setExternalId("");
    setCorreo("");
    setDocumento("");
    setComentarios("");
    setArchivos([]);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-900 text-white">
      {mostrarConfirmacion && <ConfirmacionEnvio ticketNumber={ticketNumber} onClose={handleCloseConfirmation} />}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white text-center">Reportar un Problema</h1>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 text-white">Crear nueva solicitud</h2>
              <form onSubmit={handleSubmit}>
                {/* Tipo de problema */}
                <div className="mb-6">
                  <label htmlFor="tipoProblema" className="block text-gray-300 mb-2">
                    Tipo de problema *
                  </label>
                  <select
                    id="tipoProblema"
                    value={tipoProblema}
                    onChange={handleTipoProblemaChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecciona el tipo de problema</option>
                    {problemas.map((problema, index) => (
                      <option key={index} value={problema}>
                        {problema}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Correo electrónico (ahora siempre visible y obligatorio) */}
                <div className="mb-6">
                  <label htmlFor="correo" className="block text-gray-300 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                {/* External ID (condicional) */}
                {requiereExternalId ? (
                  <div className="mb-6">
                    <label htmlFor="externalId" className="block text-gray-300 mb-2">
                      External ID *
                    </label>
                    <input
                      type="text"
                      id="externalId"
                      value={externalId}
                      onChange={(e) => setExternalId(e.target.value)}
                      placeholder="Ingresa tu External ID"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                ) : (
                  /* Documento de identidad (solo si olvidó External ID) */
                  <div className="mb-6">
                    <label htmlFor="documento" className="block text-gray-300 mb-2">
                      Número de documento (CC/Pasaporte) *
                    </label>
                    <input
                      type="text"
                      id="documento"
                      value={documento}
                      onChange={(e) => setDocumento(e.target.value)}
                      placeholder="Ingresa tu número de documento"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                )}
                
                {/* Comentarios */}
                <div className="mb-6">
                  <label htmlFor="comentarios" className="block text-gray-300 mb-2">
                    Describe tu problema *
                  </label>
                  <textarea
                    id="comentarios"
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    placeholder="Proporciona todos los detalles que consideres relevantes para resolver tu problema"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500 min-h-32"
                    rows={5}
                    required
                  ></textarea>
                </div>
                
                {/* Carga de archivos */}
                <div className="mb-8">
                  <label className="block text-gray-300 mb-2">
                    Archivos de soporte (capturas de pantalla, documentos)
                  </label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                  />
                  
                  <div className="flex items-center mb-4">
                    <button
                      type="button"
                      onClick={handleAddFilesClick}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                        />
                      </svg>
                      Agregar archivos
                    </button>
                  </div>
                  
                  {/* Lista de archivos seleccionados */}
                  {archivos.length > 0 && (
                    <div className="bg-gray-700 rounded-md p-3 mt-2">
                      <p className="text-sm text-gray-300 mb-2">Archivos seleccionados:</p>
                      <ul className="space-y-1">
                        {archivos.map((file, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 mr-2" 
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
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Botón de envío */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 font-medium text-white rounded-md shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                      backgroundSize: '200% auto',
                    }}
                    onMouseOver={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundPosition = 'right center';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundPosition = 'left center';
                    }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </div>
                    ) : (
                      "Enviar solicitud"
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Componente para consultar estado de tickets */}
            <div>
              <ConsultaTicket />
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Si necesitas ayuda adicional, puedes contactarnos directamente a{" "}
              <a href="mailto:syliconservicioalcliente@gmail.com" className="text-green-400 hover:text-green-300">
              syliconservicioalcliente@gmail.com
              </a>
            </p>
            
            <Link href="/contacto" className="inline-block mt-4 text-green-400 hover:text-green-300">
              Ir a la página de contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}