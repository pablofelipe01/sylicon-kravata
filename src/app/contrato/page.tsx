import React from 'react';
import Image from 'next/image';

export default function ContratoPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Contrato de Compra de Tokens Inmobiliarios</h1>
        
        {/* Introducción */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="h-20 w-40 relative">
              <Image
                src="/logo.png"
                alt="Logo de la empresa"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <p className="text-gray-300 mb-4">
            Este contrato de compra de tokens inmobiliarios (en adelante, el `Contrato`) se celebra entre la sociedad TokenInmuebles SAS, identificada con NIT 901.XXX.XXX-X, representada legalmente por Yesika Padilla, identificada con C.C. XX.XXX.XXX (en adelante, el `VENDEDOR`) y la persona natural o jurídica que acepta los términos y condiciones establecidos en el presente documento (en adelante, el `COMPRADOR`).
          </p>
        </section>
        
        {/* Sección 1: Definiciones */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">1. Definiciones</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">1.1. Tokens Inmobiliarios</h3>
              <p className="text-gray-300">
                Son activos digitales representados en la blockchain que otorgan derechos económicos sobre un inmueble específico, permitiendo la adquisición fraccionada de derechos sobre bienes raíces.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">1.2. Plataforma</h3>
              <p className="text-gray-300">
                Se refiere a la aplicación web y móvil operada por el VENDEDOR, a través de la cual el COMPRADOR puede adquirir, gestionar y transferir Tokens Inmobiliarios.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">1.3. Inmueble Tokenizado</h3>
              <p className="text-gray-300">
                Propiedad inmobiliaria cuyos derechos económicos han sido representados digitalmente mediante tokens en la blockchain y son objeto de este contrato.
              </p>
            </div>
          </div>
        </section>
        
        {/* Sección 2: Objeto del Contrato */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">2. Objeto del Contrato</h2>
          <p className="text-gray-300 mb-4">
            El presente Contrato tiene por objeto establecer los términos y condiciones bajo los cuales el COMPRADOR adquiere Tokens Inmobiliarios que representan derechos económicos sobre el Inmueble Tokenizado, incluyendo pero no limitado a:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Derecho a recibir ingresos por arrendamiento, proporcionales a la cantidad de tokens adquiridos.</li>
            <li>Derecho a participar en la valorización del inmueble en caso de venta.</li>
            <li>Derecho a transferir o vender los tokens adquiridos conforme a las condiciones establecidas.</li>
          </ul>
        </section>
        
        {/* Sección 3: Precio y Forma de Pago */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">3. Precio y Forma de Pago</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">3.1. Precio</h3>
              <p className="text-gray-300">
                El precio de cada Token Inmobiliario será el establecido en la Plataforma al momento de la compra, expresado en pesos colombianos (COP) o en la moneda digital especificada.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">3.2. Forma de Pago</h3>
              <p className="text-gray-300">
                El COMPRADOR podrá realizar el pago mediante transferencia bancaria, tarjeta de crédito/débito o criptomonedas aceptadas por la Plataforma. Una vez confirmado el pago, los Tokens Inmobiliarios serán transferidos a la billetera digital del COMPRADOR.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">3.3. Comisiones</h3>
              <p className="text-gray-300">
                El COMPRADOR acepta pagar las comisiones establecidas en la Plataforma por concepto de adquisición, gestión y transferencia de Tokens Inmobiliarios.
              </p>
            </div>
          </div>
        </section>
        
        {/* Sección 4: Obligaciones de las Partes */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">4. Obligaciones de las Partes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">4.1. Obligaciones del VENDEDOR</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Garantizar la legitimidad y validez de los Tokens Inmobiliarios.</li>
                <li>Proporcionar información veraz y actualizada sobre el Inmueble Tokenizado.</li>
                <li>Gestionar profesionalmente el Inmueble Tokenizado para maximizar su rentabilidad.</li>
                <li>Distribuir los rendimientos generados por el Inmueble Tokenizado según la participación de cada COMPRADOR.</li>
                <li>Mantener la Plataforma operativa y segura para la gestión de los Tokens Inmobiliarios.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">4.2. Obligaciones del COMPRADOR</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Proporcionar información personal verídica durante el proceso de registro y KYC.</li>
                <li>Custodiar adecuadamente las credenciales de acceso a su cuenta y billetera digital.</li>
                <li>Cumplir con las normativas aplicables en materia de prevención de lavado de activos y financiación del terrorismo.</li>
                <li>Pagar oportunamente el precio acordado por los Tokens Inmobiliarios.</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Sección 5: Riesgos y Limitaciones */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">5. Riesgos y Limitaciones</h2>
          <p className="text-gray-300 mb-4">
            El COMPRADOR reconoce y acepta los siguientes riesgos asociados a la adquisición de Tokens Inmobiliarios:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Volatilidad en el valor de los Tokens Inmobiliarios debido a fluctuaciones del mercado inmobiliario.</li>
            <li>Riesgos tecnológicos inherentes a la tecnología blockchain.</li>
            <li>Cambios regulatorios que puedan afectar la tenencia o transferencia de Tokens Inmobiliarios.</li>
            <li>Iliquidez potencial en el mercado secundario de Tokens Inmobiliarios.</li>
          </ul>
        </section>
        
        {/* Sección 6: Duración y Terminación */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">6. Duración y Terminación</h2>
          <p className="text-gray-300 mb-4">
            Este Contrato estará vigente desde el momento de la adquisición de los Tokens Inmobiliarios hasta que ocurra alguna de las siguientes circunstancias:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>El COMPRADOR transfiera la totalidad de sus Tokens Inmobiliarios.</li>
            <li>El Inmueble Tokenizado sea vendido y el producto de la venta sea distribuido entre los titulares de Tokens Inmobiliarios.</li>
            <li>Por mutuo acuerdo entre las partes.</li>
          </ul>
        </section>
        
        {/* Sección 7: Ley Aplicable y Resolución de Conflictos */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">7. Ley Aplicable y Resolución de Conflictos</h2>
          <p className="text-gray-300 mb-4">
            Este Contrato se regirá e interpretará de acuerdo con las leyes de la República de Colombia. Cualquier controversia derivada de este Contrato será resuelta mediante arbitraje de conformidad con el Reglamento del Centro de Arbitraje y Conciliación de la Cámara de Comercio de Bogotá.
          </p>
        </section>
        
        {/* Sección 8: Aceptación de Términos */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">8. Aceptación de Términos</h2>
          <p className="text-gray-300 mb-4">
            Al adquirir Tokens Inmobiliarios a través de la Plataforma, el COMPRADOR declara haber leído, entendido y aceptado en su totalidad los términos y condiciones establecidos en el presente Contrato.
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center">
            <div className="w-full md:w-1/2">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">Firma del COMPRADOR</h3>
                <div className="h-32 border border-gray-600 rounded-lg mb-2"></div>
                <div className="flex flex-col space-y-2">
                  <input 
                    type="text" 
                    placeholder="Nombre completo" 
                    className="bg-gray-800 text-white p-2 rounded border border-gray-600"
                  />
                  <input 
                    type="text" 
                    placeholder="Documento de identidad" 
                    className="bg-gray-800 text-white p-2 rounded border border-gray-600"
                  />
                  <input 
                    type="text" 
                    placeholder="Correo electrónico" 
                    className="bg-gray-800 text-white p-2 rounded border border-gray-600"
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">Firma del VENDEDOR</h3>
                <div className="h-32 flex items-center justify-center border border-gray-600 rounded-lg mb-2">
                  <div className="h-16 w-32 relative">
                    <Image
                      src="/firma-yesika.png"
                      alt="Firma Representante Legal"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>
                <div className="text-center text-gray-300">
                  <p>Yesika Padilla</p>
                  <p>Representante Legal</p>
                  <p>TokenInmuebles SAS</p>
                  <p>NIT 901.XXX.XXX-X</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Botones de Acción */}
        <section className="mb-10 flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 w-full md:w-auto">
            Aceptar y Firmar Contrato
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 w-full md:w-auto">
            Descargar PDF
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 w-full md:w-auto">
            Cancelar
          </button>
        </section>
        
        {/* Sello de Verificación Blockchain */}
        <section className="mb-10 bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 relative mb-4">
              <Image
                src="/blockchain-seal.png"
                alt="Sello de Verificación Blockchain"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Contrato Verificado en Blockchain</h3>
            <p className="text-gray-300 text-center">
              Este contrato ha sido registrado en la blockchain para garantizar su integridad y autenticidad.
              <br />
              Hash de verificación: 0x7f4e6c8a2b0d1e9f3c5a7b6d8e0c2f4a6b8d0e2c4f6a8b0d2e4f6a8c0e2d4f6
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}