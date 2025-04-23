"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqItems = [
    {
      question: "¿Qué es Sylicon?",
      answer: "Sylicon es un marketplace de microinversión inmobiliaria, que une inversionistas y dueños de inmuebles a través de la tecnología Blockchain la cual permite tokenizar derechos inmobiliarios, generando una inversión segura, ágil, líquida y escalable."
    },
    {
      question: "¿Qué es un token inmobiliario?",
      answer: "Un token inmobiliario es una representación digital de una participación en un activo inmobiliario, como una propiedad o un portafolio de propiedades. Cada token refleja una porción del valor total del activo, lo que permite a las personas comprar y vender fracciones de bienes raíces sin necesidad de adquirir la propiedad completa."
    },
    {
      question: "¿Qué beneficios tiene invertir en tokens inmobiliarios?",
      answer: "Invertir en tokens inmobiliarios te permite acceder al mercado de bienes raíces con menores barreras de entrada, ya que puedes comprar fracciones de propiedades en lugar de propiedades enteras. También te brinda diversificación geográfica y sectorial, y mayor liquidez en comparación con las inversiones tradicionales en bienes raíces, ya que puedes vender tus tokens en la plataforma de Sylicon cuando lo desees."
    },
    {
      question: "¿Cómo funciona la compra de tokens inmobiliarios en la plataforma?",
      answer: "Para comprar tokens inmobiliarios, primero debes registrarte en nuestra plataforma y completar el proceso de verificación de identidad. Una vez verificado, debes conectar o crear tu billetera digital. Posteriormente, puedes navegar por las propiedades disponibles y seleccionar la oferta de tokens que deseas comprar. El pago lo realizas a través de tu billetera digital. Después de completar la transacción, los tokens se acreditarán en tu billetera digital automáticamente."
    },
    {
      question: "¿Es seguro invertir en tokens inmobiliarios a través de la blockchain?",
      answer: "Sí, la tecnología blockchain proporciona un alto nivel de seguridad al registrar todas las transacciones de manera inmutable y transparente. Cada token está respaldado por un activo inmobiliario real, lo que agrega valor intrínseco a la inversión. Contamos con auditorías regulares y protocolos de seguridad para proteger tanto los activos como la información de nuestros usuarios."
    },
    {
      question: "¿Cómo puedo vender mis tokens?",
      answer: "Para vender tus tokens, selecciona los tokens que deseas vender y publica una orden de venta en el mercado de la plataforma. Otros usuarios podrán comprarlos, y una vez completada la transacción, recibirás el pago correspondiente en tu cuenta."
    },
    {
      question: "¿Cuáles son los riesgos asociados a la inversión en tokens inmobiliarios?",
      answer: "Como en cualquier inversión, existen riesgos como la fluctuación del valor del activo subyacente, el riesgo de liquidez y riesgos inherentes al uso de la blockchain, como cambios regulatorios. Te recomendamos diversificar y evaluar adecuadamente antes de invertir."
    },
    {
      question: "¿Hay alguna tarifa por comprar o vender tokens?",
      answer: "Sí, nuestra plataforma cobra una tarifa del 1% sobre el valor de los tokens adquiridos por el comprador y del 1% sobre el valor de los tokens vendidos por el vendedor. Adicionalmente, Sylicon cobra el 7% sobre los rendimientos mensuales de los tokens."
    }
  ];

  const toggleAccordion = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Preguntas Frecuentes</h2>
          <div className="h-1 w-20 mx-auto" style={{ background: 'linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%)' }}></div>
          <p className="mt-4 text-gray-300">Encuentra respuestas a las preguntas más comunes sobre Sylicon y la inversión en tokens inmobiliarios.</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 ${
                activeIndex === index ? 'shadow-lg' : ''
              }`}
              style={
                activeIndex === index 
                  ? { boxShadow: '0 4px 6px -1px rgba(58, 141, 140, 0.1), 0 2px 4px -1px rgba(140, 202, 110, 0.06)' } 
                  : {}
              }
            >
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-semibold text-white">{item.question}</span>
                <svg 
                  className={`w-5 h-5 transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  style={{ color: '#71BB87' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 py-4 border-t border-gray-700 text-gray-300">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">¿No encontraste lo que buscabas?</p>
          <Link href="/contacto">
            <button 
              className="px-6 py-3 font-medium text-white rounded-lg shadow-md hover:shadow-lg transition-all"
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
              Contáctanos
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;