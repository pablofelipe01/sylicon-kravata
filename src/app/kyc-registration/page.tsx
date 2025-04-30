"use client";

import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button, Card } from '../components/ui';
import KycForm from '../components/features/kyc/KycForm';
import KycStatus from '../components/features/kyc/KycStatus';
import Link from 'next/link';

export default function KycRegistrationPage() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'form' | 'status' | 'complete'>('intro');
  const [apiResponse, setApiResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSuccess = (data: unknown) => {
    setApiResponse(data);
    if (currentStep === 'form' && data.kycLink) {
      // Si se ha generado correctamente el enlace KYC, avanzar al siguiente paso
      setCurrentStep('status');
    } else if (currentStep === 'status' && data.status === 'completed') {
      // Si el KYC está completado, mostrar el paso final
      setCurrentStep('complete');
    }
    setError(null);
  };
  
  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Verificación KYC</h2>
            <p className="mb-8 text-gray-300">
            Para operar en Sylicon Marketplace, necesitas completar el proceso de verificación KYC (Know Your Customer). Este proceso es necesario para cumplir con las regulaciones y garantizar la seguridad de todas las transacciones. La aprobación de tu verificación KYC puede tardar entre 15 minutos y 24 horas.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2" style={{ color: '#71BB87' }}>¿Qué es el KYC?</h3>
                <p className="text-gray-300 text-sm">
                  KYC (Know Your Customer) es un proceso de verificación de identidad que nos permite confirmar quién eres,
                  protegiendo así a todos los usuarios de nuestra plataforma contra fraudes y actividades ilícitas.
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2" style={{ color: '#71BB87' }}>¿Qué necesito para completar el KYC?</h3>
                <p className="text-gray-300 text-sm">
                Necesitarás un documento de identidad oficial (CC, pasaporte o licencia de conducir), acceso a una cámara para tomar una fotografía de tu rostro y una certificación de tu cuenta bancaria que no tenga clave de acceso. El proceso toma aproximadamente 5-10 minutos.
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
          </div>
        );
      
      case 'form':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Obtener Enlace de Verificación</h2>
            <div className="mb-6">
  <p className="text-gray-300 mb-4">
    A continuación, generaremos un enlace personalizado para que completes tu verificación KYC.
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
        <span>Debe incluir una combinación de:
          <ul className="pl-6 mt-1 space-y-1">
            <li>• Letras mayúsculas (A-Z)</li>
            <li>• Letras minúsculas (a-z)</li>
            <li>• Números (0-9)</li>
            <li>• Símbolos especiales (solo se permiten: @, !, $, %, &, *)</li>
          </ul>
        </span>
      </li>
      <li className="flex items-start">
        <span className="mr-2">⚠️</span>
        <span>No debe contener nombres propios</span>
      </li>
    </ul>
  </div>
  
  <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="font-semibold mb-2" style={{ color: '#71BB87' }}>
      ⚡ Importante:
    </h3>
    <p className="text-gray-300 mb-2">
      Este identificador funcionará como tu clave de acceso al sistema Sylicon, por lo que debes:
    </p>
    <ol className="text-gray-300 space-y-2">
      <li className="flex items-start">
        <span className="mr-2">🛠️</span>
        <span>Crearlo tú mismo</span>
      </li>
      <li className="flex items-start">
        <span className="mr-2">🧠</span>
        <span>Memorizarlo o guardarlo en un lugar seguro</span>
      </li>
      <li className="flex items-start">
        <span className="mr-2">🤐</span>
        <span>No compartirlo con nadie</span>
      </li>
    </ol>
    
    <div className="mt-4 p-3 rounded-lg border-l-2" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: '#71BB87' }}>
      <p className="text-gray-300">
        <span className="block font-medium mb-1" style={{ color: '#71BB87' }}>
          🛡️ La seguridad de tu cuenta y tus datos depende de la protección de este identificador.
        </span>
        Una vez completado el proceso KYC, utilizarás este código para todas tus operaciones dentro del sistema.
      </p>
    </div>
  </div>
</div>
            
            <KycForm 
              onSuccess={handleSuccess}
              onError={handleError}
            />
            
            {apiResponse && apiResponse.kycLink && (
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(58, 141, 140, 0.15)', borderColor: '#3A8D8C', borderWidth: '1px' }}>
                <p className="mb-2 text-white" style={{ color: '#71BB87' }}>Se ha generado tu enlace de verificación:</p>
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
            <h2 className="text-2xl font-bold text-white mb-6">Verificar Estado KYC</h2>
            <p className="mb-6 text-gray-300">
              Comprueba el estado de tu verificación. Una vez aprobada, recibirás tu External ID que podrás usar
              para iniciar sesión en Sylicon Marketplace.
            </p>
            
            <KycStatus 
              onSuccess={handleSuccess}
              onError={handleError}
            />
            
            {apiResponse && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Estado de tu verificación:</h3>
              
                
                {apiResponse.status === 'completed' && (
                  <div>
                    <p className="font-semibold mb-2" style={{ color: '#8CCA6E' }}>
                      ¡Tu verificación ha sido aprobada!
                    </p>
                    <p className="text-gray-300 mb-4">
                      Tu External ID es: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{apiResponse.externalId}</span>
                    </p>
                    <button 
                      onClick={() => setCurrentStep('complete')}
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
                
                {apiResponse.status === 'pending' && (
                  <p style={{ color: '#71BB87' }}>
                    Tu verificación está siendo procesada. Por favor, regresa más tarde para verificar el estado.
                  </p>
                )}
                
                {apiResponse.status === 'rejected' && (
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
              Has completado exitosamente el proceso de verificación KYC. Ahora puedes iniciar sesión en Sylicon Marketplace
              utilizando tu External ID.
            </p>
            
            <div className="bg-gray-800 p-4 rounded-lg mb-8">
              <p className="text-gray-300 mb-2">Tu External ID:</p>
              <div className="font-mono bg-gray-700 px-4 py-2 rounded text-lg mb-4 text-white">
                {apiResponse?.externalId || "ID no disponible"}
              </div>
              <p className="text-sm text-gray-400">
                Guarda este ID en un lugar seguro, lo necesitarás para iniciar sesión en la plataforma.
              </p>
            </div>
            
            <div className="space-y-4">
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
                      index === 1 ? 'Formulario' : 
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