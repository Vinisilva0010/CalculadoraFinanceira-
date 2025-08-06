import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, FileText, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { ProductData, PricingResults } from '@/types';
import { calculatePricingResults, formatCurrency, formatPercentage, validateProductData } from '@/utils/calculations';

interface PricingSimulatorProps {
  onCalculate: (productData: ProductData, results: PricingResults) => void;
  initialData?: Partial<ProductData>;
}

/**
 * Componente do Simulador de Precificação
 */
export function PricingSimulator({ onCalculate, initialData }: PricingSimulatorProps) {
  const [formData, setFormData] = useState<Partial<ProductData>>({
    name: initialData?.name || '',
    unitCost: initialData?.unitCost || 0,
    taxes: initialData?.taxes || { type: 'percentage', value: 0 },
    salesCommission: initialData?.salesCommission || 0,
    otherExpenses: initialData?.otherExpenses || 0,
    desiredMargin: initialData?.desiredMargin || 20,
  });

  const [results, setResults] = useState<PricingResults | null>(null);
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
  const updateFormData = (field: keyof ProductData, value: any) => {
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
   * Calcula os resultados da precificação
   */
  const handleCalculate = () => {
    setIsCalculating(true);
    setErrors([]);

    // Validar dados
    const validationErrors = validateProductData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsCalculating(false);
      return;
    }

    try {
      // Criar objeto ProductData completo
      const productData: ProductData = {
        id: Date.now().toString(),
        name: formData.name!,
        unitCost: formData.unitCost!,
        taxes: formData.taxes!,
        salesCommission: formData.salesCommission!,
        otherExpenses: formData.otherExpenses!,
        desiredMargin: formData.desiredMargin!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Calcular resultados
      const calculationResults = calculatePricingResults(productData);
      setResults(calculationResults);

      // Notificar componente pai
      onCalculate(productData, calculationResults);
    } catch (error) {
      setErrors(['Erro ao calcular precificação. Verifique os dados informados.']);
    } finally {
      setIsCalculating(false);
    }
  };

  /**
   * Limpa o formulário
   */
  const handleClear = () => {
    setFormData({
      name: '',
      unitCost: 0,
      taxes: { type: 'percentage', value: 0 },
      salesCommission: 0,
      otherExpenses: 0,
      desiredMargin: 20,
    });
    setResults(null);
    setErrors([]);
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Entrada */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Calculator className="inline mr-2" />
            Dados do Produto/Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do Produto */}
            <div className="md:col-span-2">
              <Input
                label="Nome do Produto/Serviço"
                Icon={FileText}
                placeholder="Ex: Consulta de Marketing"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
              />
            </div>

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
              helperText="Custos indiretos, fixos, etc."
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

            {/* Margem de Lucro Desejada */}
            <Input
              label="Margem de Lucro Desejada (%)"
              Icon={Target}
              type="number"
              step="0.1"
              min="0"
              placeholder="20,0"
              value={formData.desiredMargin}
              onChange={(e) => updateFormData('desiredMargin', parseFloat(e.target.value) || 0)}
              helperText="Margem de lucro que você deseja obter"
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
              Icon={Calculator}
              size="lg"
              className="flex-1"
            >
              Calcular Precificação
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
        <Card className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="text-success-600">
              <Target className="inline mr-2" />
              Resultados da Precificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Preço Mínimo */}
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-gray-600 mb-1">Preço Mínimo</h4>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.minimumPrice)}</p>
                <p className="text-xs text-gray-500 mt-1">Para não ter prejuízo</p>
              </div>

              {/* Preço Ideal */}
              <div className="bg-primary-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-primary-600 mb-1">Preço Ideal</h4>
                <p className="text-2xl font-bold text-primary-700">{formatCurrency(results.idealPrice)}</p>
                <p className="text-xs text-primary-600 mt-1">Com margem desejada</p>
              </div>

              {/* Lucro Líquido */}
              <div className="bg-success-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-success-600 mb-1">Lucro Líquido</h4>
                <p className="text-2xl font-bold text-success-700">{formatCurrency(results.netProfit)}</p>
                <p className="text-xs text-success-600 mt-1">Por unidade vendida</p>
              </div>

              {/* Custos Totais */}
              <div className="bg-warning-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-warning-600 mb-1">Custos Totais</h4>
                <p className="text-2xl font-bold text-warning-700">{formatCurrency(results.totalCosts)}</p>
                <p className="text-xs text-warning-600 mt-1">Por unidade</p>
              </div>
            </div>

            {/* Detalhamento dos Custos */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Detalhamento dos Custos:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Impostos:</span>
                  <span className="ml-2 font-medium">{formatCurrency(results.taxAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Comissão:</span>
                  <span className="ml-2 font-medium">{formatCurrency(results.commissionAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Lucro Bruto:</span>
                  <span className="ml-2 font-medium">{formatCurrency(results.grossProfit)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Margem Real:</span>
                  <span className="ml-2 font-medium text-success-600">
                    {formatPercentage((results.netProfit / results.totalCosts) * 100)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}