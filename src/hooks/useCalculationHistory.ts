import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { CalculationHistory, ProductData, PricingResults } from '@/types';
// Gerador simples de ID único
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const HISTORY_KEY = 'calculation-history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Hook para gerenciar o histórico de cálculos
 */
export function useCalculationHistory() {
  const [history, setHistory] = useLocalStorage<CalculationHistory[]>(HISTORY_KEY, []);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Adiciona um novo cálculo ao histórico
   */
  const addToHistory = useCallback((productData: ProductData, results: PricingResults) => {
    setIsLoading(true);
    
    try {
      const newItem: CalculationHistory = {
        id: generateId(),
        productData: {
          ...productData,
          id: productData.id || generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        results,
        timestamp: new Date(),
      };

      setHistory(prevHistory => {
        // Adiciona no início e limita o número máximo de itens
        const updatedHistory = [newItem, ...prevHistory];
        return updatedHistory.slice(0, MAX_HISTORY_ITEMS);
      });
    } catch (error) {
      console.error('Erro ao adicionar ao histórico:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setHistory]);

  /**
   * Remove um item do histórico
   */
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  }, [setHistory]);

  /**
   * Atualiza um item existente no histórico
   */
  const updateHistoryItem = useCallback((id: string, productData: ProductData, results: PricingResults) => {
    setHistory(prevHistory => 
      prevHistory.map(item => {
        if (item.id === id) {
          return {
            ...item,
            productData: {
              ...productData,
              updatedAt: new Date(),
            },
            results,
            timestamp: new Date(),
          };
        }
        return item;
      })
    );
  }, [setHistory]);

  /**
   * Duplica um item do histórico (cria uma nova entrada baseada em uma existente)
   */
  const duplicateHistoryItem = useCallback((id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
      const duplicatedProductData: ProductData = {
        ...item.productData,
        id: generateId(),
        name: `${item.productData.name} (Cópia)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      addToHistory(duplicatedProductData, item.results);
      return duplicatedProductData;
    }
    return null;
  }, [history, addToHistory]);

  /**
   * Busca um item do histórico pelo ID
   */
  const getHistoryItem = useCallback((id: string): CalculationHistory | undefined => {
    return history.find(item => item.id === id);
  }, [history]);

  /**
   * Limpa todo o histórico
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  /**
   * Filtra o histórico por nome do produto
   */
  const searchHistory = useCallback((searchTerm: string): CalculationHistory[] => {
    if (!searchTerm.trim()) return history;
    
    const term = searchTerm.toLowerCase();
    return history.filter(item => 
      item.productData.name.toLowerCase().includes(term)
    );
  }, [history]);

  /**
   * Ordena o histórico por diferentes critérios
   */
  const sortHistory = useCallback((sortBy: 'name' | 'date' | 'profit', order: 'asc' | 'desc' = 'desc'): CalculationHistory[] => {
    const sorted = [...history].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.productData.name.localeCompare(b.productData.name);
          break;
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'profit':
          comparison = a.results.netProfit - b.results.netProfit;
          break;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [history]);

  /**
   * Estatísticas do histórico
   */
  const getHistoryStats = useCallback(() => {
    if (history.length === 0) {
      return {
        totalCalculations: 0,
        averageProfit: 0,
        totalProfit: 0,
        bestProduct: null,
        worstProduct: null,
      };
    }

    const totalProfit = history.reduce((sum, item) => sum + item.results.netProfit, 0);
    const averageProfit = totalProfit / history.length;
    
    const bestProduct = history.reduce((best, current) => 
      current.results.netProfit > best.results.netProfit ? current : best
    );
    
    const worstProduct = history.reduce((worst, current) => 
      current.results.netProfit < worst.results.netProfit ? current : worst
    );

    return {
      totalCalculations: history.length,
      averageProfit: Math.round(averageProfit * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      bestProduct,
      worstProduct,
    };
  }, [history]);

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    updateHistoryItem,
    duplicateHistoryItem,
    getHistoryItem,
    clearHistory,
    searchHistory,
    sortHistory,
    getHistoryStats,
  };
}