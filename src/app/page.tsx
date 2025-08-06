'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { PricingSimulator } from '@/components/PricingSimulator';
import { ReverseCalculator } from '@/components/ReverseCalculator';
import { HistoryManager } from '@/components/HistoryManager';
import { Charts } from '@/components/Charts';
import { TabType, ProductData, PricingResults } from '@/types';
import { useCalculationHistory } from '@/hooks/useCalculationHistory';

/**
 * Página principal da aplicação
 */
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('simulator');
  const [chartsData, setChartsData] = useState<{
    productData: ProductData;
    results: PricingResults;
  } | null>(null);
  const [editingData, setEditingData] = useState<ProductData | null>(null);

  const { addToHistory } = useCalculationHistory();

  /**
   * Callback quando um cálculo é realizado no simulador
   */
  const handleCalculation = (productData: ProductData, results: PricingResults) => {
    // Salvar no histórico
    addToHistory(productData, results);
    
    // Exibir gráficos automaticamente
    setChartsData({ productData, results });
  };

  /**
   * Callback para editar um item do histórico
   */
  const handleEditItem = (productData: ProductData) => {
    setEditingData(productData);
    setActiveTab('simulator');
  };

  /**
   * Callback para visualizar gráficos de um item do histórico
   */
  const handleViewCharts = (productData: ProductData, results: PricingResults) => {
    setChartsData({ productData, results });
  };

  /**
   * Limpa os dados de edição após uso
   */
  const clearEditingData = () => {
    setEditingData(null);
  };

  /**
   * useEffect para limpar edição após renderizar simulador
   */
  useEffect(() => {
    if (editingData && activeTab === 'simulator') {
      const timeout = setTimeout(() => {
        clearEditingData();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [editingData, activeTab]);

  /**
   * Renderiza o conteúdo da tab ativa
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'simulator':
        return (
          <div className="space-y-6">
            <PricingSimulator
              onCalculate={handleCalculation}
              initialData={editingData || undefined}
            />

            {/* Gráficos */}
            {chartsData && (
              <Charts
                productData={chartsData.productData}
                results={chartsData.results}
              />
            )}
          </div>
        );

      case 'reverse':
        return <ReverseCalculator />;

      case 'history':
        return (
          <HistoryManager
            onEditItem={handleEditItem}
            onViewCharts={handleViewCharts}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="animate-fadeIn">
        {renderTabContent()}
      </div>
    </Layout>
  );
}
