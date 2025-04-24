"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { initializeMarketplaceData } from "./lib/initialize-data";
import FAQ from "./components/FAQ";

export default function HomePage() {
  // Inicializar datos al cargar la página
  useEffect(() => {
    const init = async () => {
      try {
        await initializeMarketplaceData();
      } catch (err) {
        console.error("Error initializing marketplace data:", err);
      }
    };
    
    init();
  }, []);

  return (
    <div>
      {/* Hero section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Invierte en el futuro inmobiliario con tokens digitales
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Compra y vende fracciones de propiedades inmobiliarias a través de tokens seguros respaldados por blockchain.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/marketplace">
                <button className="px-5 py-2.5 font-medium text-white rounded-md shadow-md hover:shadow-lg transition-all"
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
                  Explorar Marketplace
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="px-5 py-2.5 font-medium text-white rounded-md bg-gray-700 hover:bg-gray-600 transition-colors shadow-md">
                  Mi Cuenta
                </button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <Image
                src="/Token7.webp"
                alt="Propiedad tokenizada"
                width={500}
                height={500}
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-5 -right-5 text-white p-4 rounded-lg shadow-lg"
                   style={{ background: 'linear-gradient(135deg, #3A8D8C 0%, #8CCA6E 100%)' }}>
                <p className="text-lg font-bold">Tokens</p>
                <p className="text-sm">Disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">¿Por qué invertir en tokens inmobiliarios?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="mb-4" style={{ color: '#71BB87' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Inversión Accesible</h3>
              <p className="text-gray-300">Accede al mercado inmobiliario con pequeñas inversiones, sin necesidad de grandes capitales.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="mb-4" style={{ color: '#71BB87' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Liquidez Inmediata</h3>
              <p className="text-gray-300">Compra y vende tus tokens en cualquier momento, sin los largos procesos de una venta inmobiliaria tradicional. Pero recuerda, mientras más tiempo mantengas tus activos (Tokens), más incrementas tu patrimonio.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="mb-4" style={{ color: '#71BB87' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Seguridad Blockchain</h3>
              <p className="text-gray-300">Tus inversiones están respaldadas por contratos inteligentes en blockchain, garantizando transparencia y seguridad, con la vigilancia y regulación del sistema financiero tradicional. No utilizamos criptomonedas, sino un sistema híbrido que combina la innovación tecnológica con la solidez de la banca establecida.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(90deg, rgba(58, 141, 140, 0.9) 0%, rgba(113, 187, 135, 0.9) 100%)' }}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Comienza a invertir hoy mismo</h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Únete a la revolución de la inversión inmobiliaria y empieza a construir tu portafolio de tokens inmobiliarios.
          </p>
          <Link href="/marketplace">
            <button className="px-6 py-3 font-medium text-[#3A8D8C] bg-white rounded-md shadow-lg hover:shadow-xl transition-all">
              Explorar Propiedades
            </button>
          </Link>
        </div>
      </section>
      
      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}