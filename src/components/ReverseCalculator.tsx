import React, { useState } from 'react';
import { TrendingUp, DollarSign, Percent, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { ReverseCalculationData, ReverseCalculationResults } from '@/types';
import { calculateReverseResults, formatCurrency, formatPercentage } from '@/utils/calculations';

/**
 * Componente da Calculadora Reversa
 */
export function ReverseCalculator() {
  const [formData, setFormData] = useState<Partial<ReverseCalculationData>>({
    sellingPrice: 0,
    unitCost: 0,
    taxes: { type: 'percentage', value: 0 },
    salesCommission: 0,
    otherExpenses: 0,
  });

  const [results, setResults] = useState<ReverseCalculationResults | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Opções para o tipo de imposto
  const taxTypeOptions = [
    { value: 'percentage', label: 'Porcentagem (%)' },
    { value: 'fixed', label: 'Valor Fixo (R$)' },
  ];

  /**
   * Atualiza os dados do formulário
   */
  const updateFormData = (field: keyof ReverseCalculationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Atualiza os dados de impostos
   */
  const updateTaxData = (field: 'type' | 'value', value: any) => {
    setFormData(prev => ({
      ...prev,
      taxes: {
        ...prev.taxes!,
        [field]: value,
      },
    }));
  };

  /**
   * Valida os dados do formulário
   */
  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    if (!formData.sellingPrice || formData.sellingPrice <= 0) {
      validationErrors.push('Preço de venda deve ser maior que zero');
    }

    if (!formData.unitCost || formData.unitCost < 0) {
      validationErrors.push('Custo unitário deve ser um valor positivo');
    }

    if (!formData.taxes || formData.taxes.value < 0) {
      validationErrors.push('Impostos devem ser um valor positivo');
    }

    if (formData.salesCommission === undefined || formData.salesCommission < 0 || formData.salesCommission > 100) {
      validationErrors.push('Comissão de venda deve estar entre 0% e 100%');
    }

    if (formData.otherExpenses !== undefined && formData.otherExpenses < 0) {
      validationErrors.push('Outras despesas devem ser um valor positivo');
    }

    return validationErrors;
  };

  /**
   * Calcula os resultados da análise reversa
   */
  const handleCalculate = () => {
    setIsCalculating(true);
    setErrors([]);

    // Validar dados
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsCalculating(false);
      return;
    }

    try {
      // Criar objeto de dados completo
      const calculationData: ReverseCalculationData = {
        sellingPrice: formData.sellingPrice!,
        unitCost: formData.unitCost!,
        taxes: formData.taxes!,
        salesCommission: formData.salesCommission!,
        otherExpenses: formData.otherExpenses || 0,
      };

      // Calcular resultados
      const calculationResults = calculateReverseResults(calculationData);
      setResults(calculationResults);
    } catch (error) {
      setErrors(['Erro ao calcular análise reversa. Verifique os dados informados.']);
    } finally {
      setIsCalculating(false);
    }
  };

  /**
   * Limpa o formulário
   */
  const handleClear = () => {
    setFormData({
      sellingPrice: 0,
      unitCost: 0,
      taxes: { type: 'percentage', value: 0 },
      salesCommission: 0,
      otherExpenses: 0,
    });
    setResults(null);
    setErrors([]);
  };

  /**
   * Retorna o ícone adequado para o tipo de sugestão
   */
  const getSuggestionIcon = (type: 'good' | 'warning' | 'danger') => {
    switch (type) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning-500" />;
      case 'danger':
        return <AlertTriangle className="h-5 w-5 text-danger-500" />;
    }
  };

  /**
   * Retorna as classes CSS para o card de sugestão
   */
  const getSuggestionClasses = (type: 'good' | 'warning' | 'danger') => {
    switch (type) {
      case 'good':
        return 'bg-success-50 border-success-200 text-success-800';
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-800';
      case 'danger':
        return 'bg-danger-50 border-danger-200 text-danger-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Entrada */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TrendingUp className="inline mr-2" />
            Análise de Precificação Reversa
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Informe o preço atual de venda e os custos para analisar sua margem de lucro real
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preço de Venda */}
            <Input
              label="Preço de Venda Atual (R$)"
              Icon={DollarSign}
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.sellingPrice}
              onChange={(e) => updateFormData('sellingPrice', parseFloat(e.target.value) || 0)}
              helperText="Preço pelo qual você está vendendo atualmente"
            />

            {/* Custo Unitário */}
            <Input
              label="Custo Unitário (R$)"
              Icon={DollarSign}
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.unitCost}
              onChange={(e) => updateFormData('unitCost', parseFloat(e.target.value) || 0)}
              helperText="Custo direto para produzir/entregar uma unidade"
            />

            {/* Tipo de Imposto */}
            <Select
              label="Tipo de Imposto"
              options={taxTypeOptions}
              value={formData.taxes?.type || 'percentage'}
              onChange={(e) => updateTaxData('type', e.target.value as 'percentage' | 'fixed')}
            />

            {/* Valor do Imposto */}
            <Input
              label={formData.taxes?.type === 'percentage' ? 'Impostos (%)' : 'Impostos (R$)'}
              Icon={formData.taxes?.type === 'percentage' ? Percent : DollarSign}
              type="number"
              step={formData.taxes?.type === 'percentage' ? '0.1' : '0.01'}
              min="0"
              max={formData.taxes?.type === 'percentage' ? '100' : undefined}
              placeholder={formData.taxes?.type === 'percentage' ? '0,0' : '0,00'}
              value={formData.taxes?.value}
              onChange={(e) => updateTaxData('value', parseFloat(e.target.value) || 0)}
              helperText={formData.taxes?.type === 'percentage' ? 'Ex: ISS, ICMS, etc.' : 'Valor fixo de impostos'}
            />

            {/* Comissão de Venda */}
            <Input
              label="Comissão de Venda (%)"
              Icon={Percent}
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="0,0"
              value={formData.salesCommission}
              onChange={(e) => updateFormData('salesCommission', parseFloat(e.target.value) || 0)}
              helperText="Comissão de vendedores, marketplace, etc."
            />

            {/* Outras Despesas */}
            <Input
              label="Outras Despesas (R$)"
              Icon={DollarSign}
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.otherExpenses}
              onChange={(e) => updateFormData('otherExpenses', parseFloat(e.target.value) || 0)}
              helperText="Custos indiretos, fixos, etc. (opcional)"
            />
          </div>

          {/* Erros de Validação */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
              <h4 className="text-sm font-medium text-danger-800 mb-2">Corrija os seguintes erros:</h4>
              <ul className="text-sm text-danger-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCalculate}
              loading={isCalculating}
              Icon={TrendingUp}
              size="lg"
              className="flex-1"
            >
              Analisar Margem
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {results && (
        <div className="space-y-6 animate-fadeIn">
          {/* Resultados Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-600">
                <TrendingUp className="inline mr-2" />
                Análise de Margem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Lucro Real */}
                <div className={`p-4 rounded-lg text-center ${
                  results.realProfit >= 0 ? 'bg-success-50' : 'bg-danger-50'
                }`}>
                  <h4 className={`text-sm font-medium mb-1 ${
                    results.realProfit >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    Lucro Real
                  </h4>
                  <p className={`text-2xl font-bold ${
                    results.realProfit >= 0 ? 'text-success-700' : 'text-danger-700'
                  }`}>
                    {formatCurrency(results.realProfit)}
                  </p>
                  <p className={`text-xs mt-1 ${
                    results.realProfit >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    Por unidade vendida
                  </p>
                </div>

                {/* Margem Obtida */}
                <div className={`p-4 rounded-lg text-center ${
                  results.marginObtained >= 20 ? 'bg-success-50' : 
                  results.marginObtained >= 10 ? 'bg-warning-50' : 'bg-danger-50'
                }`}>
                  <h4 className={`text-sm font-medium mb-1 ${
                    results.marginObtained >= 20 ? 'text-success-600' : 
                    results.marginObtained >= 10 ? 'text-warning-600' : 'text-danger-600'
                  }`}>
                    Margem Obtida
                  </h4>
                  <p className={`text-2xl font-bold ${
                    results.marginObtained >= 20 ? 'text-success-700' : 
                    results.marginObtained >= 10 ? 'text-warning-700' : 'text-danger-700'
                  }`}>
                    {formatPercentage(results.marginObtained)}
                  </p>
                  <p className={`text-xs mt-1 ${
                    results.marginObtained >= 20 ? 'text-success-600' : 
                    results.marginObtained >= 10 ? 'text-warning-600' : 'text-danger-600'
                  }`}>
                    Sobre os custos
                  </p>
                </div>

                {/* Custos Totais */}
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Custos Totais</h4>
                  <p className="text-2xl font-bold text-gray-700">{formatCurrency(results.totalCosts)}</p>
                  <p className="text-xs text-gray-600 mt-1">Por unidade</p>
                </div>

                {/* Preço de Venda */}
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-primary-600 mb-1">Preço de Venda</h4>
                  <p className="text-2xl font-bold text-primary-700">{formatCurrency(formData.sellingPrice!)}</p>
                  <p className="text-xs text-primary-600 mt-1">Atual</p>
                </div>
              </div>

              {/* Detalhamento dos Custos */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Detalhamento dos Custos:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Custo Unitário:</span>
                    <span className="ml-2 font-medium">{formatCurrency(formData.unitCost!)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Impostos:</span>
                    <span className="ml-2 font-medium">{formatCurrency(results.taxAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Comissão:</span>
                    <span className="ml-2 font-medium">{formatCurrency(results.commissionAmount)}</span>
                  </div>
                  {formData.otherExpenses && formData.otherExpenses > 0 && (
                    <div>
                      <span className="text-gray-600">Outras Despesas:</span>
                      <span className="ml-2 font-medium">{formatCurrency(formData.otherExpenses)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sugestões */}
          <Card>
            <CardContent>
              <div className={`p-4 rounded-lg border-2 ${getSuggestionClasses(results.suggestion.type)}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-0.5">
                    {getSuggestionIcon(results.suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">
                      {results.suggestion.type === 'good' ? 'Parabéns!' : 
                       results.suggestion.type === 'warning' ? 'Atenção!' : 'Alerta!'}
                    </h4>
                    <p className="text-sm mb-3">{results.suggestion.message}</p>
                    
                    {results.suggestion.recommendedPrice && (
                      <div className="bg-white bg-opacity-50 p-3 rounded border">
                        <p className="text-sm font-medium mb-1">Preço Recomendado:</p>
                        <p className="text-lg font-bold">
                          {formatCurrency(results.suggestion.recommendedPrice)}
                        </p>
                        <p className="text-xs mt-1">
                          Diferença: {formatCurrency(results.suggestion.recommendedPrice - formData.sellingPrice!)}
                          {' '}({formatPercentage(((results.suggestion.recommendedPrice - formData.sellingPrice!) / formData.sellingPrice!) * 100)})
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}