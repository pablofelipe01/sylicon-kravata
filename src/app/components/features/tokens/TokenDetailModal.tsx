"use client";

import React, { useState } from 'react';
import { TokenBalance } from '@/app/types';
import { Token } from '@/app/lib/supabase';

interface TokenDetailModalProps {
  token: TokenBalance | Token;
  isOpen: boolean;
  onClose: () => void;
}

export default function TokenDetailModal({ token, isOpen, onClose }: TokenDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'adicional' | 'documentos'>('general');
  
  if (!isOpen) return null;
  
  // Determinar si el token es de tipo TokenBalance o Token
  const isTokenBalance = 'tokenAddress' in token;
  
  // Extraer la dirección del token independientemente del tipo
  const tokenAddress = isTokenBalance ? token.tokenAddress : token.token_address;
  const tokenSymbol = isTokenBalance ? token.symbol : 'TKM'; // Asumimos TKM para el marketplace si no tiene símbolo
  
  // Solo mostrar datos especiales para el token TKM
  const isTKM = tokenSymbol === 'TKM';
  
  // Datos dummy de la fiduciaria y gestor (solo para el token TKM)
  const tokenData = {
    fiduciaria: {
      name: "Fiduciaria Bancolombia S.A.",
      nit: "800.150.280-0",
      address: "Carrera 48 # 26 - 85, Torre Sur, Piso 10, Medellín",
      phone: "(604) 404 2273",
      email: "servicioalcliente@fiduciariabancolombia.com",
      website: "https://www.fiduciariabancolombia.com",
      description: "Fiduciaria Bancolombia S.A. administra este vehículo de inversión bajo estrictos controles de regulación financiera, garantizando la transparencia y seguridad en todas las operaciones relacionadas con el activo subyacente.",
      experience: "30 años en el mercado fiduciario colombiano",
      rating: "AAA por Fitch Ratings"
    },
    gestor: {
      name: "Pentaco Capital",
      nit: "901.234.567-8",
      description: "Pentaco Capital es un gestor profesional especializado en activos inmobiliarios con más de 25 años de experiencia en el mercado. Se enfoca en maximizar el rendimiento de los activos bajo administración mediante estrategias innovadoras y sostenibles.",
      ceo: "Carlos Martínez",
      address: "Calle 100 # 13-21, Edificio Megacentro, Piso 14, Bogotá",
      phone: "(601) 617 0000",
      email: "inversiones@pentacocapital.com",
      website: "https://www.pentacocapital.com",
      aum: "$2.5 billones en activos bajo administración",
      teamSize: "45 profesionales especializados",
      trackRecord: "Retorno promedio anual del 12.3% en los últimos 5 años"
    },
    documents: [
      { name: "Prospecto de Inversión", url: "#", type: "pdf", size: "3.2 MB" },
      { name: "Contrato Fiduciario", url: "#", type: "pdf", size: "1.8 MB" },
      { name: "Estudio Técnico del Inmueble", url: "#", type: "pdf", size: "5.4 MB" },
      { name: "Avalúo Comercial", url: "#", type: "pdf", size: "2.1 MB" },
      { name: "Proyección Financiera", url: "#", type: "xlsx", size: "1.3 MB" }
    ],
    assetType: "Inmueble comercial",
    assetLocation: "Bogotá, Colombia",
    assetArea: "250 m²",
    assetValue: "$1,250,000,000",
    expectedYield: "8.5%",
    nextDistribution: "01/06/2025",
    lastDistribution: "01/05/2025",
    creationDate: "10/01/2024"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" 
          aria-hidden="true"
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          {/* Header con botón de cierre */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 bg-transparent rounded-lg hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              onClick={onClose}
            >
              <span className="sr-only">Cerrar</span>
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Título del Modal */}
          <div className="mb-5">
            <h3 className="text-2xl font-bold text-white">
              {token.name}
            </h3>
            <p className="text-gray-400">
              {tokenSymbol} • {isTokenBalance ? token.blockchain : token.protocol}
            </p>
          </div>
          
          {/* Si no es TKM, mostrar mensaje */}
          {!isTKM && (
            <div className="p-4 mb-6 text-center bg-gray-700 rounded-lg">
              <p className="text-gray-300">
                La información detallada para este token aún no está disponible. 
                Solo los tokens TKM cuentan con información completa en esta versión.
              </p>
            </div>
          )}
          
          {/* Tabs de Navegación (solo se muestran si es TKM) */}
          {isTKM && (
            <div className="flex border-b border-gray-700 mb-6">
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'general' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('general')}
              >
                Información General
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'adicional' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('adicional')}
              >
                Información Adicional
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'documentos' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('documentos')}
              >
                Documentos
              </button>
            </div>
          )}
          
          {/* Contenido de los Tabs */}
          {isTKM && (
            <div className="modal-content max-h-[70vh] overflow-y-auto pr-2">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h2 className="text-lg font-bold text-white mb-4">Características del Activo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 mb-1">Tipo de Activo</p>
                        <p className="text-white">{tokenData.assetType}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Ubicación</p>
                        <p className="text-white">{tokenData.assetLocation}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Área</p>
                        <p className="text-white">{tokenData.assetArea}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Valor Comercial</p>
                        <p className="text-white">{tokenData.assetValue}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h2 className="text-lg font-bold text-white mb-4">Detalles del Token</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 mb-1">Dirección del Token</p>
                        <p className="text-white font-mono text-sm break-all">{tokenAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Estándar</p>
                        <p className="text-white">{isTokenBalance ? token.standard : token.protocol}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Fecha de Creación</p>
                        <p className="text-white">{tokenData.creationDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Balance</p>
                        <p className="text-white">{isTokenBalance ? token.amount : "Disponible en marketplace"} tokens</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Rendimiento Esperado</p>
                        <p className="text-green-400">{tokenData.expectedYield}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Próxima Distribución</p>
                        <p className="text-white">{tokenData.nextDistribution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'adicional' && (
                <div className="space-y-6">
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h2 className="text-lg font-bold text-white mb-4">Fiduciaria</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3">
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-white mb-2">{tokenData.fiduciaria.name}</h3>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-400">NIT: <span className="text-white">{tokenData.fiduciaria.nit}</span></p>
                            <p className="text-gray-400">Calificación: <span className="text-white">{tokenData.fiduciaria.rating}</span></p>
                            <p className="text-gray-400">Experiencia: <span className="text-white">{tokenData.fiduciaria.experience}</span></p>
                            <p className="text-gray-400">Sitio Web: <a href={tokenData.fiduciaria.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{tokenData.fiduciaria.website.replace('https://', '')}</a></p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-2/3">
                        <h3 className="text-lg font-semibold text-white mb-2">Descripción</h3>
                        <p className="text-gray-300 mb-4">{tokenData.fiduciaria.description}</p>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">Contacto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 mb-1">Dirección</p>
                            <p className="text-white">{tokenData.fiduciaria.address}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Teléfono</p>
                            <p className="text-white">{tokenData.fiduciaria.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Email</p>
                            <p className="text-white">{tokenData.fiduciaria.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h2 className="text-lg font-bold text-white mb-4">Gestor</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3">
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-white mb-2">{tokenData.gestor.name}</h3>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-400">NIT: <span className="text-white">{tokenData.gestor.nit}</span></p>
                            <p className="text-gray-400">CEO: <span className="text-white">{tokenData.gestor.ceo}</span></p>
                            <p className="text-gray-400">Activos: <span className="text-white">{tokenData.gestor.aum}</span></p>
                            <p className="text-gray-400">Equipo: <span className="text-white">{tokenData.gestor.teamSize}</span></p>
                            <p className="text-gray-400">Sitio Web: <a href={tokenData.gestor.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{tokenData.gestor.website.replace('https://', '')}</a></p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-2/3">
                        <h3 className="text-lg font-semibold text-white mb-2">Descripción</h3>
                        <p className="text-gray-300 mb-4">{tokenData.gestor.description}</p>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">Desempeño Histórico</h3>
                        <p className="text-gray-300 mb-4">{tokenData.gestor.trackRecord}</p>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">Contacto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 mb-1">Dirección</p>
                            <p className="text-white">{tokenData.gestor.address}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Teléfono</p>
                            <p className="text-white">{tokenData.gestor.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Email</p>
                            <p className="text-white">{tokenData.gestor.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'documentos' && (
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h2 className="text-lg font-bold text-white mb-4">Documentos Legales y Técnicos</h2>
                  <div className="space-y-4">
                    {tokenData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mr-3 ${doc.type === 'pdf' ? 'text-red-400' : doc.type === 'xlsx' ? 'text-green-400' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-white font-medium">{doc.name}</p>
                            <p className="text-gray-400 text-sm">{doc.size} • {doc.type.toUpperCase()}</p>
                          </div>
                        </div>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors">
                          Descargar
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
