"use client";

import { useState, useEffect } from 'react';
import { Card } from '../components/ui';
import KycForm from '../components/features/kyc/KycForm';
import KycStatus from '../components/features/kyc/KycStatus';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { checkKycStatus, getKycForm } from '../lib/api';

interface KycData {
  kycLink?: string;
  status?: string;
  complianceStatus?: string;
  externalId?: string;
  rejectionReason?: string;
  firstName?: string;
  surname?: string;
}

export default function KycRegistrationPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'intro' | 'form' | 'status' | 'complete'>('intro');
  const [apiResponse, setApiResponse] = useState<KycData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kycType, setKycType] = useState<'initial' | 'liveness'>('initial');
  const [initialKycCompleted, setInitialKycCompleted] = useState(false);
  const [livenessKycCompleted, setLivenessKycCompleted] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [needsLiveness, setNeedsLiveness] = useState(false);
  
  // Verificar estado del KYC al cargar si el usuario está logueado
  useEffect(() => {
    if (user.isLoggedIn && user.externalId) {
      checkInitialKycStatus();
    }
  }, [user.isLoggedIn, user.externalId]);
  
  const checkInitialKycStatus = async () => {
    if (!user.externalId) return;
    
    setIsCheckingStatus(true);
    try {
      const status = await checkKycStatus(user.externalId);
      console.log('Estado KYC del usuario:', status);
      
      // Verificar si completó el KYC inicial
      const isApproved = status.complianceStatus === 'approved' || 
                        status.complianceStatus === 'approved_no_selling' ||
                        status.status === 'completed';
      
      if (isApproved) {
        setInitialKycCompleted(true);
        
        // Si el estado es "approved_no_selling", necesita el liveness
        if (status.complianceStatus === 'approved_no_selling') {
          setNeedsLiveness(true);
          setKycType('liveness');
          setLivenessKycCompleted(false);
          // Ir directamente al formulario de liveness
          setCurrentStep('form');
        } else if (status.complianceStatus === 'approved') {
          // Ya completó ambos KYCs
          setLivenessKycCompleted(true);
          setCurrentStep('complete');
        }
      }
    } catch (err) {
      console.error('Error verificando estado inicial del KYC:', err);
    } finally {
      setIsCheckingStatus(false);
    }
  };
  
  const handleSuccess = (data: KycData) => {
    setApiResponse(data);
    if (currentStep === 'form' && data.kycLink) {
      // Si se ha generado correctamente el enlace KYC, avanzar al siguiente paso
      setCurrentStep('status');
    } else if (currentStep === 'status' && (data.status === 'completed' || data.complianceStatus === 'approved' || data.complianceStatus === 'approved_no_selling')) {
      // Si el KYC está completado
      if (kycType === 'initial') {
        // Si completó el inicial, ahora necesita el liveness
        setInitialKycCompleted(true);
        setKycType('liveness');
        setNeedsLiveness(true);
        setCurrentStep('form');
        // Limpiar respuesta anterior
        setApiResponse(null);
      } else {
        // Si completó el liveness, mostrar el paso final
        setLivenessKycCompleted(true);
        setCurrentStep('complete');
        // Marcar en localStorage que completó el liveness
        if (user.externalId) {
          localStorage.setItem(`liveness_completed_${user.externalId}`, 'true');
        }
      }
    }
    setError(null);
  };
  
  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };
  
  // Función para iniciar el proceso de liveness KYC
  const handleLivenessKyc = async () => {
    if (!user.externalId) {
      setError('Debes iniciar sesión para continuar');
      return;
    }
    
    try {
      setError(null);
      const response = await getKycForm(user.externalId, 'liveness');
      
      if (response.kycLink) {
        // Marcar que intentó el liveness
        localStorage.setItem(`liveness_attempted_${user.externalId}`, 'true');
        // Redirigir al enlace KYC
        window.location.href = response.kycLink;
      } else {
        setError('No se pudo obtener el enlace de verificación');
      }
    } catch (err) {
      console.error('Error obteniendo formulario liveness:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener el formulario de verificación');
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Verificación KYC</h2>
            <p className="mb-8 text-gray-300">
              Para operar en Sylicon Marketplace, necesitas completar el proceso de verificación KYC (Know Your Customer). 
              Este proceso consta de dos pasos: verificación inicial y verificación de identidad (liveness).
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2" style={{ color: '#71BB87' }}>📋 Paso 1: Verificación Inicial</h3>
                <p className="text-gray-300 text-sm">
                  Completa el formulario con tus datos personales y documentos de identidad. 
                  Este proceso inicial verifica tu información básica.
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2" style={{ color: '#71BB87' }}>🎥 Paso 2: Verificación de Identidad (Liveness)</h3>
                <p className="text-gray-300 text-sm">
                  Verifica tu identidad mediante reconocimiento facial en tiempo real. 
                  Este paso adicional garantiza la máxima seguridad en la plataforma.
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2" style={{ color: '#71BB87' }}>🕐 Tiempo estimado</h3>
                <p className="text-gray-300 text-sm">
                  El proceso completo toma aproximadamente 5-10 minutos. 
                  
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setCurrentStep('form')}
              className="w-full px-4 py-2 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
              style={{ 
                background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                backgroundSize: '200% auto',
              }}
            >
              Comenzar Verificación
            </button>
            
            {isCheckingStatus && (
              <p className="mt-4 text-gray-400 text-sm">Verificando estado anterior...</p>
            )}
          </div>
        );
      
      case 'form':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {kycType === 'initial' ? 'Verificación Inicial' : 'Verificación de Identidad (Liveness)'}
            </h2>
            
            {/* Mostrar estado de los pasos */}
            <div className="mb-6 space-y-3">
              <div className={`flex items-center p-3 rounded-lg ${initialKycCompleted ? 'bg-green-900/20' : 'bg-gray-800'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  initialKycCompleted ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  {initialKycCompleted ? '✓' : '1'}
                </div>
                <span className={initialKycCompleted ? 'text-green-400' : 'text-gray-300'}>
                  Verificación Inicial {initialKycCompleted && '(Completada)'}
                </span>
              </div>
              
              <div className={`flex items-center p-3 rounded-lg ${livenessKycCompleted ? 'bg-green-900/20' : 'bg-gray-800'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  livenessKycCompleted ? 'bg-green-500' : kycType === 'liveness' ? 'bg-blue-500' : 'bg-gray-600'
                }`}>
                  {livenessKycCompleted ? '✓' : '2'}
                </div>
                <span className={livenessKycCompleted ? 'text-green-400' : kycType === 'liveness' ? 'text-blue-400' : 'text-gray-300'}>
                  Verificación de Identidad (Liveness) {livenessKycCompleted && '(Completada)'}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              {kycType === 'initial' && !user.isLoggedIn ? (
                <div>
                  <p className="text-gray-300 mb-4">
                    A continuación, generaremos un enlace personalizado para que completes tu verificación KYC inicial.
                    Ingresa un identificador único que funcionará como tu External ID en el sistema Sylicon.
                  </p>
                  
                  <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2" style={{ color: '#71BB87' }}>
                      📋 Requisitos del identificador:
                    </h3>
                    <ul className="text-gray-300 space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">🔒</span>
                        <span>Debe ser personal e intransferible</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">🔢</span>
                        <span>Mínimo 12 caracteres</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">🔡</span>
                        <span>Debe incluir mayúsculas, minúsculas, números y símbolos (@, !, $, %, *)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <KycForm 
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>
              ) : kycType === 'liveness' || needsLiveness ? (
                <div>
                  {user.firstName && user.surname && (
                    <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                      <p className="text-gray-300">
                        <span className="font-semibold">Usuario:</span> {user.firstName} {user.surname}
                      </p>
                      <p className="text-gray-300">
                        <span className="font-semibold">External ID:</span> {user.externalId}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-gray-300 mb-4">
                    Excelente, has completado la verificación inicial. Ahora necesitas completar el segundo paso: 
                    la verificación de identidad mediante reconocimiento facial (liveness).
                  </p>
                  
                  <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2" style={{ color: '#71BB87' }}>
                      🎥 ¿Qué necesitarás?
                    </h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Una cámara web o cámara de dispositivo móvil</li>
                      <li>• Buena iluminación</li>
                      <li>• Seguir las instrucciones en pantalla</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-4">
                    <p className="text-blue-300 text-sm">
                      <strong>Importante:</strong> Usarás el mismo External ID ({user.externalId}) para completar este paso.
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleLivenessKyc}
                    className="w-full px-4 py-2 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
                    style={{ 
                      background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                      backgroundSize: '200% auto',
                    }}
                  >
                    Iniciar Verificación de Identidad
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-300 mb-4">
                    Ya has completado la verificación inicial. Por favor, inicia sesión para continuar.
                  </p>
                  <Link href="/login">
                    <button className="px-6 py-2 text-white font-medium rounded-md" 
                      style={{ background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)' }}>
                      Iniciar Sesión
                    </button>
                  </Link>
                </div>
              )}
            </div>
            
            {apiResponse && apiResponse.kycLink && (
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(58, 141, 140, 0.15)', borderColor: '#3A8D8C', borderWidth: '1px' }}>
                <p className="mb-2 text-white" style={{ color: '#71BB87' }}>
                  Se ha generado tu enlace de verificación {kycType === 'liveness' ? 'de identidad' : 'inicial'}:
                </p>
                <a 
                  href={apiResponse.kycLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: '#8CCA6E' }}
                >
                  Abrir Formulario de Verificación
                </a>
                <p className="mt-4 text-sm text-gray-400">
                  Una vez que hayas completado el formulario, regresa aquí y verifica el estado de tu verificación.
                </p>
                <div className="mt-4">
                  <button 
                    onClick={() => setCurrentStep('status')}
                    className="px-4 py-2 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
                    style={{ 
                      background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                      backgroundSize: '200% auto',
                    }}
                  >
                    He completado el formulario, verificar estado
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'status':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Verificar Estado {kycType === 'liveness' ? 'de Verificación de Identidad' : 'KYC'}
            </h2>
            <p className="mb-6 text-gray-300">
              Comprueba el estado de tu verificación. 
              {kycType === 'initial' 
                ? ' Una vez aprobada la verificación inicial, deberás completar el segundo paso.'
                : ' Una vez aprobada, podrás comenzar a vender tokens en Sylicon Marketplace.'
              }
            </p>
            
            <KycStatus 
              onSuccess={handleSuccess}
              onError={handleError}
            />
            
            {apiResponse && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Estado de tu verificación:</h3>
                
                {(apiResponse.status === 'completed' || apiResponse.complianceStatus === 'approved' || apiResponse.complianceStatus === 'approved_no_selling') && (
                  <div>
                    <p className="font-semibold mb-2" style={{ color: '#8CCA6E' }}>
                      ¡Tu verificación {kycType === 'liveness' ? 'de identidad' : 'inicial'} ha sido aprobada!
                    </p>
                    {(kycType === 'initial' || apiResponse.complianceStatus === 'approved_no_selling') ? (
                      <div>
                        <p className="text-gray-300 mb-4">
                          Excelente, has completado el primer paso. Ahora debes completar la verificación de identidad.
                        </p>
                        <button 
                          onClick={() => {
                            setInitialKycCompleted(true);
                            setKycType('liveness');
                            setNeedsLiveness(true);
                            setCurrentStep('form');
                            setApiResponse(null);
                          }}
                          className="px-4 py-2 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
                          style={{ 
                            background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                            backgroundSize: '200% auto',
                          }}
                        >
                          Continuar con Verificación de Identidad
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-300 mb-4">
                          Tu External ID es: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{apiResponse.externalId || user.externalId}</span>
                        </p>
                        <button 
                          onClick={() => {
                            setCurrentStep('complete');
                            // Marcar en localStorage que completó el liveness
                            if (user.externalId) {
                              localStorage.setItem(`liveness_completed_${user.externalId}`, 'true');
                            }
                          }}
                          className="px-4 py-2 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
                          style={{ 
                            background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                            backgroundSize: '200% auto',
                          }}
                        >
                          Continuar
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {(apiResponse.status === 'pending' || apiResponse.complianceStatus === 'in_review') && (
                  <p style={{ color: '#71BB87' }}>
                    Tu verificación está siendo procesada. Por favor, regresa más tarde para verificar el estado.
                  </p>
                )}
                
                {(apiResponse.status === 'rejected' || apiResponse.complianceStatus === 'rejected') && (
                  <div>
                    <p className="text-red-400 mb-2">
                      Tu verificación ha sido rechazada.
                    </p>
                    <p className="text-gray-300">
                      Motivo: {apiResponse.rejectionReason || "No se ha proporcionado un motivo específico."}
                    </p>
                    <button 
                      onClick={() => setCurrentStep('form')}
                      className="mt-4 px-4 py-2 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
                      style={{ background: 'linear-gradient(90deg, #FF9B9B 0%, #FF6B6B 100%)' }}
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'complete':
        return (
          <div className="text-center">
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#8CCA6E' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">¡Verificación Completada!</h2>
            <p className="mb-6 text-gray-300">
              Has completado exitosamente ambos pasos del proceso de verificación KYC. 
              Ahora puedes vender tokens en Sylicon Marketplace.
            </p>
            
            <div className="bg-gray-800 p-4 rounded-lg mb-8">
              <p className="text-gray-300 mb-2">Tu External ID:</p>
              <div className="font-mono bg-gray-700 px-4 py-2 rounded text-lg mb-4 text-white">
                {apiResponse?.externalId || user.externalId || "ID no disponible"}
              </div>
              <p className="text-sm text-gray-400">
                Guarda este ID en un lugar seguro, lo necesitarás para todas tus operaciones en la plataforma.
              </p>
            </div>
            
            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2" style={{ color: '#8CCA6E' }}>✅ Verificaciones completadas:</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Verificación inicial de datos</li>
                <li>• Verificación de identidad (Liveness)</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              {user.isLoggedIn ? (
                <Link href="/dashboard">
                  <button 
                    className="w-full px-4 py-2 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
                    style={{ 
                      background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                      backgroundSize: '200% auto',
                    }}
                  >
                    Ir al Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button 
                    className="w-full px-4 py-2 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
                    style={{ 
                      background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                      backgroundSize: '200% auto',
                    }}
                  >
                    Iniciar Sesión
                  </button>
                </Link>
              )}
              <Link href="/">
                <button 
                  className="w-full px-4 py-2 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all bg-gray-700 hover:bg-gray-600"
                >
                  Volver al Inicio
                </button>
              </Link>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900 border border-gray-800">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {['intro', 'form', 'status', 'complete'].map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        ['intro', 'form', 'status', 'complete'].indexOf(currentStep) >= index 
                          ? 'text-white' 
                          : 'bg-gray-700 text-gray-400'
                      }`}
                      style={
                        ['intro', 'form', 'status', 'complete'].indexOf(currentStep) >= index 
                          ? { background: 'linear-gradient(135deg, #3A8D8C 0%, #8CCA6E 100%)' }
                          : {}
                      }
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 text-gray-400">
                      {index === 0 ? 'Intro' : 
                      index === 1 ? kycType === 'liveness' ? 'Liveness' : 'Inicial' : 
                      index === 2 ? 'Estado' : 'Completado'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="w-full h-1 bg-gray-700 mt-4 rounded-full relative">
                <div 
                  className="absolute h-1 rounded-full" 
                  style={{
                    background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)',
                    width: `${
                      currentStep === 'intro' ? '0%' :
                      currentStep === 'form' ? '33%' :
                      currentStep === 'status' ? '66%' : '100%'
                    }`
                  }}
                ></div>
              </div>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300">
                {error}
              </div>
            )}
            
            {/* Current step content */}
            {renderStep()}
          </Card>
        </div>
      </div>
    </div>
  );
}