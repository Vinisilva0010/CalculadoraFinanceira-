import {
  ProductData,
  PricingResults,
  ReverseCalculationData,
  ReverseCalculationResults,
  CostDistribution,
  PriceComparison
} from '@/types';

/**
 * Calcula o valor dos impostos com base no tipo (porcentagem ou valor fixo)
 */
export function calculateTaxAmount(baseValue: number, taxes: { type: 'percentage' | 'fixed'; value: number }): number {
  if (taxes.type === 'percentage') {
    return (baseValue * taxes.value) / 100;
  }
  return taxes.value;
}

/**
 * Calcula o valor da comissão de venda
 */
export function calculateCommissionAmount(sellingPrice: number, commissionPercentage: number): number {
  return (sellingPrice * commissionPercentage) / 100;
}

/**
 * Calcula o preço mínimo de venda (para não ter prejuízo)
 */
export function calculateMinimumPrice(productData: ProductData): number {
  const { unitCost, taxes, salesCommission, otherExpenses } = productData;
  
  // Se os impostos são em porcentagem, precisamos calcular o preço considerando que os impostos incidem sobre o preço final
  if (taxes.type === 'percentage') {
    // Fórmula: PreçoMínimo = (CustoUnitário + OutrasDespesas) / (1 - (Impostos% + Comissão%) / 100)
    const totalPercentage = taxes.value + salesCommission;
    const minimumPrice = (unitCost + otherExpenses) / (1 - totalPercentage / 100);
    return Math.round(minimumPrice * 100) / 100;
  } else {
    // Se impostos são valor fixo: PreçoMínimo = CustoUnitário + Impostos + OutrasDespesas + Comissão%
    // Precisamos calcular iterativamente porque a comissão depende do preço final
    let estimatedPrice = unitCost + taxes.value + otherExpenses;
    let commission = calculateCommissionAmount(estimatedPrice, salesCommission);
    let minimumPrice = unitCost + taxes.value + otherExpenses + commission;
    
    // Ajustar para que a comissão seja calculada sobre o preço final correto
    for (let i = 0; i < 10; i++) { // máximo 10 iterações para convergir
      commission = calculateCommissionAmount(minimumPrice, salesCommission);
      const newPrice = unitCost + taxes.value + otherExpenses + commission;
      if (Math.abs(newPrice - minimumPrice) < 0.01) break;
      minimumPrice = newPrice;
    }
    
    return Math.round(minimumPrice * 100) / 100;
  }
}

/**
 * Calcula o preço ideal com base na margem de lucro desejada
 */
export function calculateIdealPrice(productData: ProductData): number {
  const minimumPrice = calculateMinimumPrice(productData);
  const { desiredMargin } = productData;
  
  // Preço ideal = preço mínimo + margem de lucro
  const idealPrice = minimumPrice * (1 + desiredMargin / 100);
  return Math.round(idealPrice * 100) / 100;
}

/**
 * Calcula todos os resultados de precificação
 */
export function calculatePricingResults(productData: ProductData): PricingResults {
  const minimumPrice = calculateMinimumPrice(productData);
  const idealPrice = calculateIdealPrice(productData);
  
  // Calcular custos com base no preço ideal
  const taxAmount = calculateTaxAmount(idealPrice, productData.taxes);
  const commissionAmount = calculateCommissionAmount(idealPrice, productData.salesCommission);
  const totalCosts = productData.unitCost + taxAmount + commissionAmount + productData.otherExpenses;
  
  const grossProfit = idealPrice - productData.unitCost;
  const netProfit = idealPrice - totalCosts;
  
  return {
    minimumPrice,
    idealPrice,
    netProfit: Math.round(netProfit * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    commissionAmount: Math.round(commissionAmount * 100) / 100,
  };
}

/**
 * Calcula os resultados da calculadora reversa
 */
export function calculateReverseResults(data: ReverseCalculationData): ReverseCalculationResults {
  const { sellingPrice, unitCost, taxes, salesCommission, otherExpenses = 0 } = data;
  
  const taxAmount = calculateTaxAmount(sellingPrice, taxes);
  const commissionAmount = calculateCommissionAmount(sellingPrice, salesCommission);
  const totalCosts = unitCost + taxAmount + commissionAmount + otherExpenses;
  const realProfit = sellingPrice - totalCosts;
  const marginObtained = totalCosts > 0 ? (realProfit / totalCosts) * 100 : 0;
  
  // Gerar sugestão baseada no resultado
  let suggestion: ReverseCalculationResults['suggestion'];
  
  if (realProfit < 0) {
    suggestion = {
      type: 'danger',
      message: 'Você está tendo PREJUÍZO! O preço de venda é menor que os custos totais.',
      recommendedPrice: Math.ceil(totalCosts * 1.2), // sugere 20% de margem mínima
    };
  } else if (marginObtained < 10) {
    suggestion = {
      type: 'warning',
      message: 'Margem muito baixa. Considere aumentar o preço para ter uma margem mais saudável.',
      recommendedPrice: Math.ceil(totalCosts * 1.25), // sugere 25% de margem
    };
  } else {
    suggestion = {
      type: 'good',
      message: `Margem saudável de ${marginObtained.toFixed(1)}%. Continue assim!`,
    };
  }
  
  return {
    realProfit: Math.round(realProfit * 100) / 100,
    marginObtained: Math.round(marginObtained * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    commissionAmount: Math.round(commissionAmount * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    suggestion,
  };
}

/**
 * Calcula a distribuição de custos para o gráfico de pizza
 */
export function calculateCostDistribution(productData: ProductData, sellingPrice: number): CostDistribution {
  const taxAmount = calculateTaxAmount(sellingPrice, productData.taxes);
  const commissionAmount = calculateCommissionAmount(sellingPrice, productData.salesCommission);
  const totalCosts = productData.unitCost + taxAmount + commissionAmount + productData.otherExpenses;
  const profit = sellingPrice - totalCosts;
  
  // Converter para porcentagens
  const total = sellingPrice;
  
  return {
    cost: Math.round((productData.unitCost / total) * 10000) / 100,
    taxes: Math.round((taxAmount / total) * 10000) / 100,
    commission: Math.round((commissionAmount / total) * 10000) / 100,
    otherExpenses: Math.round((productData.otherExpenses / total) * 10000) / 100,
    profit: Math.round((profit / total) * 10000) / 100,
  };
}

/**
 * Formata valores monetários para exibição
 */
export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Formata porcentagens para exibição
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Valida se os dados do produto estão completos e válidos
 */
export function validateProductData(data: Partial<ProductData>): string[] {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Nome do produto é obrigatório');
  }
  
  if (data.unitCost === undefined || data.unitCost < 0) {
    errors.push('Custo unitário deve ser um valor positivo');
  }
  
  if (!data.taxes || data.taxes.value < 0) {
    errors.push('Impostos devem ser um valor positivo');
  }
  
  if (data.salesCommission === undefined || data.salesCommission < 0 || data.salesCommission > 100) {
    errors.push('Comissão de venda deve estar entre 0% e 100%');
  }
  
  if (data.otherExpenses === undefined || data.otherExpenses < 0) {
    errors.push('Outras despesas devem ser um valor positivo');
  }
  
  if (data.desiredMargin === undefined || data.desiredMargin < 0) {
    errors.push('Margem de lucro desejada deve ser um valor positivo');
  }
  
  return errors;
}