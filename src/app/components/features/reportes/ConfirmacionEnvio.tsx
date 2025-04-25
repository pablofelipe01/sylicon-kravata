"use client";

import Link from "next/link";

export default function ConfirmacionEnvio({ ticketNumber, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-green-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">¡Solicitud Enviada!</h2>
          
          <p className="text-gray-300 mb-6">
            Hemos recibido tu solicitud. Nuestro equipo de soporte la revisará y te contactará a la brevedad posible.
          </p>
          
          <p className="text-gray-300 mb-8 text-sm">
            Número de ticket: <span className="font-mono font-semibold">{ticketNumber}</span>
          </p>
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
            <Link href="/dashboard">
              <button 
                className="w-full sm:w-auto px-5 py-2 font-medium text-white rounded-md bg-gray-700 hover:bg-gray-600 transition-colors shadow-md"
                onClick={onClose}
              >
                Ir a mi cuenta
              </button>
            </Link>
            
            <button 
              className="w-full sm:w-auto px-5 py-2 font-medium text-white rounded-md shadow-md hover:shadow-lg transition-all"
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
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-400">
            Si necesitas ayuda adicional, contáctanos en{" "}
            <a href="mailto:syliconservicioalcliente@gmail.com" className="text-green-400 hover:text-green-300">
              syliconservicioalcliente@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}