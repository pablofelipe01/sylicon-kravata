import React from 'react';
import Image from 'next/image';

export default function NosotrosPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Nosotros</h1>
        
        {/* Yesika Padilla Section */}
        <section className="mb-16 bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="rounded-full overflow-hidden border-4 border-blue-500 h-64 w-64 relative">
                <Image
                  src="/yesi.png"
                  alt="Yesika Padilla"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold text-white mb-4">Yesika Padilla</h2>
              <p className="text-gray-300 mb-4">
                Ingeniera con especialización en comunicaciones móviles y máster en liderazgo tecnológico por la Universidad de Brown. Con más de 9 años de experiencia en el Ministerio TIC de Colombia y más de 8 años en la banca colombiana, ha trabajado en la intersección de la tecnología y la inclusión financiera en el sector público y privado.
              </p>
              <p className="text-gray-300 mb-4">
                Ha liderado proyectos innovadores que integran nuevas tecnologías como blockchain, inteligencia artificial e Internet de las cosas (IoT). Su enfoque en la tokenización de inmuebles en blockchain refleja un compromiso con la transformación del acceso a la propiedad y la inversión, promoviendo soluciones inclusivas y sostenibles en el mercado inmobiliario.
              </p>
            </div>
          </div>
        </section>
        
        <h2 className="text-2xl font-bold text-white mb-6">Nuestros Aliados</h2>
        
        {/* Pentaco Section */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="h-32 w-64 relative">
                <Image
                  src="/pentaco-logo.png"
                  alt="Pentaco Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-xl font-bold text-white mb-3">Pentaco</h3>
              <p className="text-gray-300">
                Pentaco es un gestor de activos inmobiliarios especializado en estructurar, gestionar y administrar vehículos de inversión alternativos. Pentaco se enfoca en construir soluciones de análisis e inversión disruptivas que no solo aporten significativamente a la industria, sino que también trasciendan fronteras y continúen entregando resultados excepcionales. Los más de 30 años de experiencia de Pentaco en el sector inmobiliario lo posicionan como una empresa líder en el sector y en Latinoamérica.
              </p>
            </div>
          </div>
        </section>
        
        {/* Custor Section */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="h-32 w-64 relative bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400 text-center p-4">Logo pendiente</p>
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-xl font-bold text-white mb-3">Custor</h3>
              <p className="text-gray-300">
                Custor es una entidad enfocada en realizar inversiones innovadoras de alto crecimiento en Colombia y Latinoamérica. El gerente de Custor, Juan Pablo Romero, cuenta con más de 25 años de experiencia en los sectores de tecnología, aviación, inmobiliaria y de infraestructura.
              </p>
              <p className="text-gray-400 text-sm mt-2 italic">
                (Para Custor nos hace falta el logo. Juan Pablo, ¿nos podrías enviar un logo si tienes?)
              </p>
            </div>
          </div>
        </section>
        
        {/* Pronus Section */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="h-32 w-64 relative">
                <Image
                  src="/pronus-logo.png"
                  alt="Pronus Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-xl font-bold text-white mb-3">Pronus</h3>
              <p className="text-gray-300">
                Pronus es una boutique de inversión e innovación en entidades financieras, combinando lo mejor de la banca de inversión, el conocimiento en regulación y la tecnología para crear, transformar y financiar empresas, productos y servicios financieros incluyentes y sostenibles.
              </p>
            </div>
          </div>
        </section>
        
        {/* SFI Section */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="h-32 w-64 relative">
                <Image
                  src="/sfi-logo.png"
                  alt="SFI Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-xl font-bold text-white mb-3">SFI</h3>
              <p className="text-gray-300">
                SFI es una boutique de inversión que ofrece servicios de inversiones en portafolios de finca raíz mediante acciones de la propia compañía, y participación directa en inversiones y en proyectos inmobiliarios.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}