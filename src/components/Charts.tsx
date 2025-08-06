import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { PieChart, BarChart3 } from 'lucide-react';
import { ProductData, PricingResults } from '@/types';
import { calculateCostDistribution, formatCurrency, formatPercentage } from '@/utils/calculations';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartsProps {
  productData: ProductData;
  results: PricingResults;
  currentPrice?: number;
}

/**
 * Componente que exibe gráficos visuais da precificação
 */
export function Charts({ productData, results, currentPrice }: ChartsProps) {
  // Calcular distribuição de custos usando o preço ideal
  const distribution = calculateCostDistribution(productData, results.idealPrice);

  // Dados para o gráfico de pizza (distribuição de custos)
  const pieData = {
    labels: ['Custo Unitário', 'Impostos', 'Comissão', 'Outras Despesas', 'Lucro'],
    datasets: [
      {
        data: [
          distribution.cost,
          distribution.taxes,
          distribution.commission,
          distribution.otherExpenses,
          distribution.profit,
        ],
        backgroundColor: [
          '#ef4444', // red-500 - Custo
          '#f59e0b', // yellow-500 - Impostos
          '#8b5cf6', // violet-500 - Comissão
          '#6b7280', // gray-500 - Outras despesas
          '#10b981', // emerald-500 - Lucro
        ],
        borderColor: [
          '#dc2626', // red-600
          '#d97706', // yellow-600
          '#7c3aed', // violet-600
          '#4b5563', // gray-600
          '#059669', // emerald-600
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const currency = formatCurrency((value / 100) * results.idealPrice);
            return `${label}: ${formatPercentage(value)} (${currency})`;
          },
        },
      },
    },
  };

  // Dados para o gráfico de barras (comparação de preços)
  const prices = [
    results.minimumPrice,
    results.idealPrice,
    currentPrice || 0,
  ].filter(price => price > 0);

  const labels = [
    'Preço Mínimo',
    'Preço Ideal',
    ...(currentPrice ? ['Preço Atual'] : []),
  ];

  const barData = {
    labels,
    datasets: [
      {
        label: 'Preços (R$)',
        data: prices,
        backgroundColor: [
          '#fbbf24', // yellow-400 - Preço mínimo
          '#3b82f6', // blue-500 - Preço ideal
          ...(currentPrice ? ['#10b981'] : []), // emerald-500 - Preço atual
        ],
        borderColor: [
          '#f59e0b', // yellow-500
          '#2563eb', // blue-600
          ...(currentPrice ? ['#059669'] : []), // emerald-600
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return formatCurrency(context.parsed.y);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          },
        },
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Pizza - Distribuição de Custos */}
      <Card>
        <CardHeader>
          <CardTitle>
            <PieChart className="inline mr-2" />
            Distribuição do Preço Final
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Como cada componente impacta no preço de {formatCurrency(results.idealPrice)}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico */}
            <div className="h-80">
              <Pie data={pieData} options={pieOptions} />
            </div>

            {/* Legenda Detalhada */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 mb-3">Detalhamento:</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-red-700">Custo Unitário</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-700">
                      {formatPercentage(distribution.cost)}
                    </div>
                    <div className="text-xs text-red-600">
                      {formatCurrency(productData.unitCost)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-yellow-700">Impostos</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-yellow-700">
                      {formatPercentage(distribution.taxes)}
                    </div>
                    <div className="text-xs text-yellow-600">
                      {formatCurrency(results.taxAmount)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-violet-50 rounded-lg border border-violet-200">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-violet-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-violet-700">Comissão</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-violet-700">
                      {formatPercentage(distribution.commission)}
                    </div>
                    <div className="text-xs text-violet-600">
                      {formatCurrency(results.commissionAmount)}
                    </div>
                  </div>
                </div>

                {productData.otherExpenses > 0 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Outras Despesas</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-700">
                        {formatPercentage(distribution.otherExpenses)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(productData.otherExpenses)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-emerald-700">Lucro Líquido</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-700">
                      {formatPercentage(distribution.profit)}
                    </div>
                    <div className="text-xs text-emerald-600">
                      {formatCurrency(results.netProfit)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Comparação de Preços */}
      <Card>
        <CardHeader>
          <CardTitle>
            <BarChart3 className="inline mr-2" />
            Comparação de Preços
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Visualize a diferença entre preço mínimo, ideal e atual
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico */}
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>

            {/* Informações Detalhadas */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 mb-3">Análise Comparativa:</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-yellow-700">Preço Mínimo</h5>
                    <span className="text-lg font-bold text-yellow-700">
                      {formatCurrency(results.minimumPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-600">
                    O menor preço para não ter prejuízo. Abaixo disso, você perde dinheiro.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-blue-700">Preço Ideal</h5>
                    <span className="text-lg font-bold text-blue-700">
                      {formatCurrency(results.idealPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600">
                    Preço recomendado com sua margem de lucro desejada de {formatPercentage(productData.desiredMargin)}.
                  </p>
                  <div className="mt-2 text-xs text-blue-600">
                    <strong>Diferença do mínimo:</strong> {formatCurrency(results.idealPrice - results.minimumPrice)}
                    {' '}(+{formatPercentage(((results.idealPrice - results.minimumPrice) / results.minimumPrice) * 100)})
                  </div>
                </div>

                {currentPrice && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium text-emerald-700">Preço Atual</h5>
                      <span className="text-lg font-bold text-emerald-700">
                        {formatCurrency(currentPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-600">
                      {currentPrice >= results.idealPrice ? 
                        'Ótimo! Seu preço está adequado ou acima do ideal.' :
                        currentPrice >= results.minimumPrice ?
                        'Você está lucrando, mas pode melhorar a margem.' :
                        'ATENÇÃO! Preço abaixo do mínimo, você está tendo prejuízo!'
                      }
                    </p>
                    <div className="mt-2 text-xs text-emerald-600">
                      <strong>Diferença do ideal:</strong> {formatCurrency(currentPrice - results.idealPrice)}
                      {' '}({formatPercentage(((currentPrice - results.idealPrice) / results.idealPrice) * 100)})
                    </div>
                  </div>
                )}
              </div>

              {/* Dicas */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h5 className="text-sm font-medium text-gray-700 mb-2">💡 Dicas:</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Nunca venda abaixo do preço mínimo</li>
                  <li>• O preço ideal garante a margem desejada</li>
                  <li>• Considere a concorrência na precificação final</li>
                  <li>• Revise seus custos periodicamente</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}