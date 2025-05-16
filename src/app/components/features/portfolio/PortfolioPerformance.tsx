
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card } from '@/app/components/ui';

// Datos dummy para el rendimiento del portafolio
const performanceData = [
  { month: 'Ene', rendimiento: 2.4, benchmark: 1.8 },
  { month: 'Feb', rendimiento: -1.2, benchmark: -0.8 },
  { month: 'Mar', rendimiento: 3.5, benchmark: 2.1 },
  { month: 'Abr', rendimiento: 1.8, benchmark: 0.9 },
  { month: 'May', rendimiento: 4.2, benchmark: 2.5 },
  { month: 'Jun', rendimiento: -0.5, benchmark: -1.2 },
  { month: 'Jul', rendimiento: 2.8, benchmark: 1.5 },
  { month: 'Ago', rendimiento: 3.7, benchmark: 2.2 },
];

// Datos dummy para rendimiento por token
const tokenPerformanceData = [
  { name: 'TokenA', rendimiento: 6.5, valorización: 4.2, dividendos: 2.3 },
  { name: 'TokenB', rendimiento: -2.1, valorización: -2.5, dividendos: 0.4 },
  { name: 'TokenC', rendimiento: 8.2, valorización: 5.8, dividendos: 2.4 },
  { name: 'TokenD', rendimiento: 3.7, valorización: 1.2, dividendos: 2.5 },
  { name: 'TokenE', rendimiento: 5.1, valorización: 3.3, dividendos: 1.8 },
];

// Proyecciones de ingresos
const projectionData = [
  { trimestre: 'Q1 2025', dividendos: 120, alquileres: 200 },
  { trimestre: 'Q2 2025', dividendos: 150, alquileres: 230 },
  { trimestre: 'Q3 2025', dividendos: 180, alquileres: 250 },
  { trimestre: 'Q4 2025', dividendos: 210, alquileres: 290 },
];

export default function PortfolioPerformance() {
  // Calcular rendimiento total (promedio ponderado dummy)
  const totalYield = 4.3; // Porcentaje dummy
  
  // Datos para KPIs
  const kpiData = {
    rendimientoAnual: '4.3%',
    rendimientoMensual: '0.35%',
    rentabilidadPromedio: '5.8%',
    valorActual: 12500,
    valorInicial: 11500,
    rendimientoTotal: '8.7%',
    dividendosAcumulados: 680,
  };

  return (
    <div>
      {/* KPIs de rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 shadow flex flex-col">
          <span className="text-gray-400 text-sm">Rendimiento Anual</span>
          <span className="text-2xl font-bold text-white">{kpiData.rendimientoAnual}</span>
          <span className="text-green-500 text-sm mt-1">↑ vs. mercado (2.1%)</span>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 shadow flex flex-col">
          <span className="text-gray-400 text-sm">Valor Actual</span>
          <span className="text-2xl font-bold text-white">${kpiData.valorActual.toLocaleString()}</span>
          <span className="text-green-500 text-sm mt-1">↑ ${kpiData.valorActual - kpiData.valorInicial} desde inversión</span>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 shadow flex flex-col">
          <span className="text-gray-400 text-sm">Dividendos Acumulados</span>
          <span className="text-2xl font-bold text-white">${kpiData.dividendosAcumulados}</span>
          <span className="text-gray-400 text-sm mt-1">Último pago: $120 (Ago 2024)</span>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 shadow flex flex-col">
          <span className="text-gray-400 text-sm">Rendimiento Total</span>
          <span className="text-2xl font-bold text-white">{kpiData.rendimientoTotal}</span>
          <div className="mt-2 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-300" 
              style={{ width: `${parseFloat(kpiData.rendimientoTotal)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de rendimiento histórico */}
        <div className="bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-white mb-4">Rendimiento Histórico</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                  formatter={(value) => [`${value}%`, 'Rendimiento']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rendimiento"
                  stroke="#8CCA6E"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Tu Portafolio"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#777"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Benchmark de Mercado"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Rendimiento por token */}
        <div className="bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-white mb-4">Rendimiento por Token</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tokenPerformanceData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                  formatter={(value) => [`${value}%`, 'Rendimiento']}
                />
                <Legend />
                <Bar dataKey="valorización" stackId="a" name="Valorización" fill="#3A8D8C" />
                <Bar dataKey="dividendos" stackId="a" name="Dividendos" fill="#8CCA6E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Proyección de ingresos */}
      <div className="bg-gray-800 rounded-lg p-4 shadow mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Proyección de Ingresos (2025)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={projectionData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="trimestre" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                formatter={(value) => [`$${value}`, 'Proyección']}
              />
              <Legend />
              <Bar dataKey="dividendos" name="Dividendos" fill="#8CCA6E" />
              <Bar dataKey="alquileres" name="Ingresos por Alquileres" fill="#56ADEF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-gray-400 text-sm mt-2 italic">
          * Proyecciones basadas en el rendimiento histórico y las condiciones actuales del mercado. Los resultados reales pueden variar.
        </p>
      </div>
      
      {/* Resumen de operaciones */}
      <div className="bg-gray-800 rounded-lg p-4 shadow">
        <h3 className="text-lg font-bold text-white mb-4">Resumen de Operaciones</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha de Compra</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio de Compra</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor Actual</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rentabilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr className="bg-gray-900/50">
                <td className="px-4 py-3 text-white">TokenA</td>
                <td className="px-4 py-3 text-gray-300">15/03/2024</td>
                <td className="px-4 py-3 text-gray-300">$5,200</td>
                <td className="px-4 py-3 text-gray-300">$5,538</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400">+6.5%</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-white">TokenB</td>
                <td className="px-4 py-3 text-gray-300">22/04/2024</td>
                <td className="px-4 py-3 text-gray-300">$2,800</td>
                <td className="px-4 py-3 text-gray-300">$2,741</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-900/30 text-red-400">-2.1%</span>
                </td>
              </tr>
              <tr className="bg-gray-900/50">
                <td className="px-4 py-3 text-white">TokenC</td>
                <td className="px-4 py-3 text-gray-300">10/02/2024</td>
                <td className="px-4 py-3 text-gray-300">$3,500</td>
                <td className="px-4 py-3 text-gray-300">$3,787</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400">+8.2%</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-white">TokenD</td>
                <td className="px-4 py-3 text-gray-300">05/05/2024</td>
                <td className="px-4 py-3 text-gray-300">$1,800</td>
                <td className="px-4 py-3 text-gray-300">$1,867</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400">+3.7%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}