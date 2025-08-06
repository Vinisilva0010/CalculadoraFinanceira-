import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Edit3, 
  Copy, 
  Filter, 
  SortAsc, 
  SortDesc,
  Calendar,
  DollarSign,
  FileText,
  BarChart3
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { CalculationHistory, ProductData, PricingResults } from '@/types';
import { useCalculationHistory } from '@/hooks/useCalculationHistory';
import { formatCurrency, formatPercentage } from '@/utils/calculations';

interface HistoryManagerProps {
  onEditItem: (productData: ProductData) => void;
  onViewCharts: (productData: ProductData, results: PricingResults) => void;
}

/**
 * Componente para gerenciar histórico de cálculos
 */
export function HistoryManager({ onEditItem, onViewCharts }: HistoryManagerProps) {
  const {
    history,
    isLoading,
    removeFromHistory,
    duplicateHistoryItem,
    clearHistory,
    searchHistory,
    sortHistory,
    getHistoryStats,
  } = useCalculationHistory();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'profit'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showStats, setShowStats] = useState(true);

  // Filtrar e ordenar histórico
  const filteredHistory = searchHistory(searchTerm);
  const sortedHistory = sortHistory(sortBy, sortOrder);
  const displayHistory = searchTerm ? filteredHistory : sortedHistory;

  // Estatísticas
  const stats = getHistoryStats();

  // Opções para ordenação
  const sortOptions = [
    { value: 'date', label: 'Data' },
    { value: 'name', label: 'Nome' },
    { value: 'profit', label: 'Lucro' },
  ];

  /**
   * Formata data para exibição
   */
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Confirma a exclusão de um item
   */
  const handleDelete = (id: string, productName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${productName}"?`)) {
      removeFromHistory(id);
    }
  };

  /**
   * Confirma a limpeza do histórico
   */
  const handleClearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
      clearHistory();
    }
  };

  /**
   * Duplica um item do histórico
   */
  const handleDuplicate = (id: string) => {
    duplicateHistoryItem(id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando histórico...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {showStats && stats.totalCalculations > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <BarChart3 className="inline mr-2" />
              Estatísticas do Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-600 mb-1">Total de Cálculos</h4>
                <p className="text-2xl font-bold text-blue-700">{stats.totalCalculations}</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="text-sm font-medium text-green-600 mb-1">Lucro Médio</h4>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(stats.averageProfit)}</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="text-sm font-medium text-purple-600 mb-1">Lucro Total</h4>
                <p className="text-2xl font-bold text-purple-700">{formatCurrency(stats.totalProfit)}</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-600 mb-1">Melhor Produto</h4>
                <p className="text-lg font-bold text-yellow-700 truncate" title={stats.bestProduct?.productData.name}>
                  {stats.bestProduct?.productData.name || 'N/A'}
                </p>
                <p className="text-sm text-yellow-600">
                  {stats.bestProduct && formatCurrency(stats.bestProduct.results.netProfit)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros e Controles */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>
              <History className="inline mr-2" />
              Histórico de Cálculos ({history.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowStats(!showStats)}
                variant="outline"
                size="sm"
              >
                {showStats ? 'Ocultar' : 'Mostrar'} Stats
              </Button>
              {history.length > 0 && (
                <Button
                  onClick={handleClearHistory}
                  variant="danger"
                  size="sm"
                  Icon={Trash2}
                >
                  Limpar Tudo
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Controles de Busca e Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                Icon={Search}
                placeholder="Buscar por nome do produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'profit')}
              />
              
              <Button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                variant="outline"
                Icon={sortOrder === 'asc' ? SortAsc : SortDesc}
              />
            </div>
          </div>

          {/* Lista do Histórico */}
          {displayHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {history.length === 0 ? (
                <div>
                  <History className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum cálculo salvo</h3>
                  <p className="text-sm">Faça seu primeiro cálculo para começar o histórico</p>
                </div>
              ) : (
                <div>
                  <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-sm">Tente usar outros termos de busca</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayHistory.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    {/* Informações Principais */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-medium text-gray-900 truncate mr-2">
                          {item.productData.name}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Custo:</span>
                          <span className="ml-1 font-medium">{formatCurrency(item.productData.unitCost)}</span>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Preço Ideal:</span>
                          <span className="ml-1 font-medium text-primary-600">{formatCurrency(item.results.idealPrice)}</span>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Lucro:</span>
                          <span className={`ml-1 font-medium ${
                            item.results.netProfit >= 0 ? 'text-success-600' : 'text-danger-600'
                          }`}>
                            {formatCurrency(item.results.netProfit)}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Margem:</span>
                          <span className="ml-1 font-medium text-success-600">
                            {formatPercentage(item.productData.desiredMargin)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ações */}
                    <div className="flex flex-row sm:flex-col gap-2">
                      <Button
                        onClick={() => onEditItem(item.productData)}
                        variant="outline"
                        size="sm"
                        Icon={Edit3}
                        className="flex-1 sm:flex-none"
                      >
                        Editar
                      </Button>
                      
                      <Button
                        onClick={() => handleDuplicate(item.id)}
                        variant="outline"
                        size="sm"
                        Icon={Copy}
                        className="flex-1 sm:flex-none"
                      >
                        Duplicar
                      </Button>
                      
                      <Button
                        onClick={() => onViewCharts(item.productData, item.results)}
                        variant="outline"
                        size="sm"
                        Icon={BarChart3}
                        className="flex-1 sm:flex-none"
                      >
                        Gráficos
                      </Button>
                      
                      <Button
                        onClick={() => handleDelete(item.id, item.productData.name)}
                        variant="danger"
                        size="sm"
                        Icon={Trash2}
                        className="flex-1 sm:flex-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}