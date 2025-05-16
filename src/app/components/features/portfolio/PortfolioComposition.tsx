import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/app/components/ui';
import { TokenBalance } from '@/app/types';
import { truncateAddress } from '@/app/lib/formatters';

interface PortfolioCompositionProps {
  tokens: TokenBalance[];
}

// Array de colores para el gráfico
const COLORS = [
  '#8CCA6E', '#3A8D8C', '#4DA7A2', '#71BB87', '#56ADEF', 
  '#5B8AF5', '#7465D4', '#9B59B6', '#E67E22', '#F1C40F'
];

export default function PortfolioComposition({ tokens }: PortfolioCompositionProps) {
  // Si no hay tokens, mostrar mensaje
  if (!tokens || tokens.length === 0) {
    return (
      <Card className="p-8 text-center bg-gray-800 text-gray-400">
        <p>No hay tokens en tu portafolio.</p>
      </Card>
    );
  }

  // Calcular el valor total del portafolio
  const totalTokens = tokens.reduce((sum, token) => sum + Number(token.amount), 0);

  // Preparar datos para el gráfico
  const chartData = useMemo(() => {
    return tokens.map((token) => ({
      name: token.name || truncateAddress(token.tokenAddress),
      value: Number(token.amount),
      symbol: token.symbol || 'N/A',
      percentage: (Number(token.amount) / totalTokens) * 100
    }));
  }, [tokens, totalTokens]);

  // Ordenar tokens por cantidad (de mayor a menor)
  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => Number(b.amount) - Number(a.amount));
  }, [tokens]);

  // Función personalizada para el formato de las etiquetas del gráfico
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // No mostrar etiqueta para segmentos pequeños
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Formato personalizado para el tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
          <p className="font-bold text-white">{payload[0].name}</p>
          <p className="text-gray-300">{`${payload[0].value} tokens (${payload[0].payload.percentage.toFixed(2)}%)`}</p>
          <p className="text-gray-400 text-xs">{payload[0].payload.symbol}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Gráfico circular */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-white mb-4">Distribución de Tokens</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value, entry) => {
                // Limitar el texto si es demasiado largo
                return value.length > 15 ? `${value.substring(0, 15)}...` : value;
              }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla de distribución */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-white mb-4">Desglose del Portafolio</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cantidad</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">% del Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Blockchain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedTokens.map((token, index) => {
                  const percentage = (Number(token.amount) / totalTokens) * 100;
                  return (
                    <tr key={`${token.tokenAddress}-${index}`} className={index % 2 === 0 ? 'bg-gray-900/50' : ''}>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-white">{token.name || 'N/A'}</div>
                          <div className="text-xs text-gray-400">{token.symbol || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white">{token.amount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-700 rounded h-2 mr-2">
                            <div
                              className="h-full rounded"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            ></div>
                          </div>
                          <span className="text-white">{percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{token.blockchain}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-400 text-sm">Total de Tokens</p>
          <p className="text-2xl font-bold text-white">{totalTokens.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-400 text-sm">Tipos de Tokens</p>
          <p className="text-2xl font-bold text-white">{tokens.length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-400 text-sm">Token Principal</p>
          <p className="text-2xl font-bold text-white">
            {sortedTokens.length > 0 ? sortedTokens[0].name || truncateAddress(sortedTokens[0].tokenAddress) : 'N/A'}
          </p>
          <p className="text-gray-400 text-sm">
            {sortedTokens.length > 0 ? `${sortedTokens[0].amount} tokens (${((Number(sortedTokens[0].amount) / totalTokens) * 100).toFixed(1)}%)` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}