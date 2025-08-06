/**
 * Interface para os dados de entrada do produto/serviço
 */
export interface ProductData {
  id: string;
  name: string;
  unitCost: number;
  taxes: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  salesCommission: number; // em porcentagem
  otherExpenses: number; // valor fixo
  desiredMargin: number; // em porcentagem
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface para os resultados dos cálculos de precificação
 */
export interface PricingResults {
  minimumPrice: number; // preço mínimo para não ter prejuízo
  idealPrice: number; // preço sugerido com base na margem desejada
  netProfit: number; // lucro líquido por unidade
  grossProfit: number; // lucro bruto por unidade
  totalCosts: number; // custos totais
  taxAmount: number; // valor dos impostos
  commissionAmount: number; // valor da comissão
}

/**
 * Interface para calculadora reversa
 */
export interface ReverseCalculationData {
  sellingPrice: number;
  unitCost: number;
  taxes: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  salesCommission: number;
  otherExpenses?: number;
}

/**
 * Interface para os resultados da calculadora reversa
 */
export interface ReverseCalculationResults {
  realProfit: number;
  marginObtained: number; // em porcentagem
  taxAmount: number;
  commissionAmount: number;
  totalCosts: number;
  suggestion: {
    type: 'good' | 'warning' | 'danger';
    message: string;
    recommendedPrice?: number;
  };
}

/**
 * Interface para dados do gráfico de pizza (distribuição de custos)
 */
export interface CostDistribution {
  cost: number;
  taxes: number;
  commission: number;
  otherExpenses: number;
  profit: number;
}

/**
 * Interface para comparação de preços (gráfico de barras)
 */
export interface PriceComparison {
  minimum: number;
  ideal: number;
  current?: number;
}

/**
 * Interface para histórico salvo no localStorage
 */
export interface CalculationHistory {
  id: string;
  productData: ProductData;
  results: PricingResults;
  timestamp: Date;
}

/**
 * Tipos para tabs da aplicação
 */
export type TabType = 'simulator' | 'reverse' | 'history';

/**
 * Interface para configurações da aplicação
 */
export interface AppSettings {
  defaultCurrency: string;
  defaultTaxType: 'percentage' | 'fixed';
  defaultCommission: number;
  maxHistoryItems: number;
}