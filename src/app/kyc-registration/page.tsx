"use client";

import { useState } from 'react';
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
            <h2 className="text-2xl font-bold mb-6">Verificación KYC</h2>
            <p className="mb-8 text-gray-300">
              Para operar en Sylicon Marketplace, necesitas completar el proceso de verificación KYC (Know Your Customer).
              Este proceso es necesario para cumplir con las regulaciones y garantizar la seguridad de todas las transacciones.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-400 mb-2">¿Qué es el KYC?</h3>
                <p className="text-gray-300 text-sm">
                  KYC (Know Your Customer) es un proceso de verificación de identidad que nos permite confirmar quién eres,
                  protegiendo así a todos los usuarios de nuestra plataforma contra fraudes y actividades ilícitas.
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-400 mb-2">¿Qué necesito para completar el KYC?</h3>
                <p className="text-gray-300 text-sm">
                  Necesitarás un documento de identidad oficial (DNI, pasaporte o licencia de conducir) y acceso a una cámara
                  para tomar una fotografía de tu rostro. El proceso toma aproximadamente 5-10 minutos.
                </p>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              onClick={() => setCurrentStep('form')}
              fullWidth
            >
              Comenzar Verificación
            </Button>
          </div>
        );
      
      case 'form':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Obtener Enlace de Verificación</h2>
            <p className="mb-6 text-gray-300">
              A continuación, generaremos un enlace personalizado para que completes tu verificación KYC.
              Ingresa un identificador único que te servirá como tu External ID una vez completado el proceso.
            </p>
            
            <KycForm 
              onSuccess={handleSuccess}
              onError={handleError}
            />
            
            {apiResponse && apiResponse.kycLink && (
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <p className="text-blue-300 mb-2">Se ha generado tu enlace de verificación:</p>
                <a 
                  href={apiResponse.kycLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  Abrir Formulario de Verificación
                </a>
                <p className="mt-4 text-sm text-gray-400">
                  Una vez que hayas completado el formulario, regresa aquí y verifica el estado de tu verificación.
                </p>
                <div className="mt-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => setCurrentStep('status')}
                  >
                    He completado el formulario, verificar estado
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'status':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Verificar Estado KYC</h2>
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
                <h3 className="font-semibold mb-2">Estado de tu verificación:</h3>
                {/* <div className="flex items-center gap-2 mb-4">
                  <span className="font-medium">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    apiResponse.status === 'completed' 
                      ? 'bg-green-900/40 text-green-400' 
                      : apiResponse.status === 'pending'
                        ? 'bg-yellow-900/40 text-yellow-400'
                        : 'bg-red-900/40 text-red-400'
                  }`}>
                    {apiResponse.status === 'completed' 
                      ? 'Completado' 
                      : apiResponse.status === 'pending'
                        ? 'Pendiente'
                        : 'Rechazado'}
                  </span>
                </div> */}
                
                {apiResponse.status === 'completed' && (
                  <div>
                    <p className="text-green-400 font-semibold mb-2">
                      ¡Tu verificación ha sido aprobada!
                    </p>
                    <p className="text-gray-300 mb-4">
                      Tu External ID es: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{apiResponse.externalId}</span>
                    </p>
                    <Button 
                      variant="primary" 
                      onClick={() => setCurrentStep('complete')}
                    >
                      Continuar
                    </Button>
                  </div>
                )}
                
                {apiResponse.status === 'pending' && (
                  <p className="text-yellow-400">
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
                    <Button 
                      variant="warning" 
                      onClick={() => setCurrentStep('form')}
                      className="mt-4"
                    >
                      Intentar de nuevo
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'complete':
        return (
          <div className="text-center">
            <div className="mb-6 text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">¡Verificación Completada!</h2>
            <p className="mb-6 text-gray-300">
              Has completado exitosamente el proceso de verificación KYC. Ahora puedes iniciar sesión en Sylicon Marketplace
              utilizando tu External ID.
            </p>
            
            <div className="bg-gray-800 p-4 rounded-lg mb-8">
              <p className="text-gray-300 mb-2">Tu External ID:</p>
              <div className="font-mono bg-gray-700 px-4 py-2 rounded text-lg mb-4">
                {apiResponse?.externalId || "ID no disponible"}
              </div>
              <p className="text-sm text-gray-400">
                Guarda este ID en un lugar seguro, lo necesitarás para iniciar sesión en la plataforma.
              </p>
            </div>
            
            <div className="space-y-4">
              <Link href="/login">
                <Button variant="primary" fullWidth>
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary" fullWidth>
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-900 border border-gray-800">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['intro', 'form', 'status', 'complete'].map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    ['intro', 'form', 'status', 'complete'].indexOf(currentStep) >= index 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
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
                className="absolute h-1 bg-blue-600 rounded-full" 
                style={{
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
  );
}