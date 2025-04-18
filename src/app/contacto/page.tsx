"use client";

import React from 'react';
import Link from 'next/link';

export default function ContactoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Contacto</h1>
        
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <p className="text-gray-300 mb-8 text-lg">
            Si tienes alguna pregunta o comentario, no dudes en ponerte en contacto con nosotros. Estamos aquí para ayudarte.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #3A8D8C 0%, #71BB87 100%)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Teléfono</h3>
                <p className="text-gray-300 text-lg">+57 1 805 2141</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #3A8D8C 0%, #71BB87 100%)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Dirección</h3>
                <p className="text-gray-300 text-lg">Carrera 7 No. 77-07 Oficina 901</p>
                <p className="text-gray-300 text-lg">Bogotá – Colombia</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #3A8D8C 0%, #71BB87 100%)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Email</h3>
                <p className="text-gray-300 text-lg">info@sylicon.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-700 pt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Horario de atención</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300 font-medium">Lunes a Viernes</p>
                <p className="text-gray-400">9:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p className="text-gray-300 font-medium">Sábados</p>
                <p className="text-gray-400">9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/" className="inline-block">
              <div 
                className="px-6 py-3 font-medium text-white rounded-lg shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-[#3A8D8C] to-[#8CCA6E] hover:from-[#4DA7A2] hover:to-[#71BB87]"
              >
                Volver al inicio
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}