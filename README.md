# 🧮 Calculadora de Precificação Inteligente

Uma ferramenta completa e intuitiva para pequenos empreendedores calcularem o preço ideal de seus produtos e serviços, analisarem custos e maximizarem lucros.

## 🎯 Objetivo

Substituir planilhas complicadas e cálculos manuais por uma interface simples e eficiente, ajudando MEIs, autônomos, freelancers e pequenos negócios a definir preços competitivos e lucrativos.

## ✨ Funcionalidades

### 🧩 Simulador de Precificação
- **Formulário completo** para entrada de dados:
  - Nome do produto/serviço
  - Custo unitário
  - Impostos (% ou valor fixo)
  - Comissão de venda (%)
  - Outras despesas
  - Margem de lucro desejada

- **Cálculos automáticos**:
  - Preço mínimo (sem prejuízo)
  - Preço ideal (com margem desejada)
  - Lucro líquido por unidade

### 🔄 Calculadora Reversa
- Análise de preços já praticados
- Entrada: preço atual, custos, impostos, comissão
- Resultado: lucro real, margem obtida, sugestões de melhoria

### 📊 Relatórios Visuais
- **Gráfico de pizza**: distribuição percentual do preço final
- **Gráfico de barras**: comparação entre preço mínimo, ideal e atual
- Análise detalhada de cada componente de custo

### 💾 Histórico e Gerenciamento
- Armazenamento local (localStorage)
- Histórico dos últimos 50 cálculos
- Funcionalidades:
  - ✏️ Editar simulações anteriores
  - 📋 Duplicar cálculos
  - 🗑️ Excluir itens específicos
  - 🔍 Buscar por nome do produto
  - 📈 Estatísticas do histórico

### 📱 Interface Responsiva
- Design adaptado para celular e desktop
- TailwindCSS para estilização moderna
- Ícones Lucide React
- Animações suaves
- Acessibilidade aprimorada

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone/baixe o projeto**
```bash
# Se usando git
git clone <url-do-repositorio>
cd calculadora-precificacao

# Ou extraia o arquivo ZIP baixado
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute em modo desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse a aplicação**
```
http://localhost:3000
```

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Executar build em produção
npm start
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   └── globals.css        # Estilos globais
│
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Input, etc)
│   ├── Layout.tsx        # Layout com navegação
│   ├── PricingSimulator.tsx    # Simulador principal
│   ├── ReverseCalculator.tsx   # Calculadora reversa
│   ├── Charts.tsx        # Gráficos visuais
│   └── HistoryManager.tsx      # Gerenciamento de histórico
│
├── hooks/                # Hooks personalizados
│   ├── useLocalStorage.ts      # Hook para localStorage
│   └── useCalculationHistory.ts # Hook para histórico
│
├── types/                # Interfaces TypeScript
│   └── index.ts          # Tipos e interfaces
│
└── utils/                # Funções utilitárias
    └── calculations.ts   # Lógica de cálculos
```

## 💡 Como Usar

### 1. Simulador de Precificação
1. Acesse a aba "Simulador"
2. Preencha os dados do produto/serviço:
   - Nome descritivo
   - Custo unitário (R$)
   - Tipo e valor dos impostos
   - Comissão de venda (%)
   - Outras despesas (R$)
   - Margem de lucro desejada (%)
3. Clique em "Calcular Precificação"
4. Visualize os resultados e gráficos

### 2. Calculadora Reversa
1. Acesse a aba "Calculadora Reversa"
2. Informe o preço atual de venda
3. Preencha os custos envolvidos
4. Analise se sua margem está adequada
5. Siga as sugestões de melhoria

### 3. Histórico
1. Acesse a aba "Histórico"
2. Visualize todos os cálculos salvos
3. Use a busca para encontrar produtos específicos
4. Organize por data, nome ou lucro
5. Edite, duplique ou exclua cálculos
6. Visualize estatísticas gerais

## 🎨 Tecnologias Utilizadas

- **Next.js 14** - Framework React full-stack
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização utilitária
- **Chart.js + react-chartjs-2** - Gráficos interativos
- **Lucide React** - Ícones modernos
- **React Hooks** - Gerenciamento de estado
- **localStorage** - Persistência local

## 📋 Funcionalidades Técnicas

### Cálculos Implementados
- ✅ Preço mínimo considerando impostos variáveis
- ✅ Cálculo iterativo para convergência de preços
- ✅ Suporte a impostos percentuais e valores fixos
- ✅ Validação completa de dados de entrada
- ✅ Formatação monetária brasileira (R$)

### Persistência de Dados
- ✅ Armazenamento no localStorage do navegador
- ✅ Histórico limitado a 50 itens (configurável)
- ✅ Backup automático dos dados
- ✅ Recuperação em caso de falhas

### Responsividade
- ✅ Layout adaptável (320px - 1920px+)
- ✅ Touch-friendly para dispositivos móveis
- ✅ Grid system responsivo
- ✅ Navegação mobile otimizada

## 🎯 Público-Alvo

- **MEIs** (Microempreendedores Individuais)
- **Pequenos comerciantes**
- **Freelancers e autônomos**
- **Vendedores de marketplace**
- **Prestadores de serviços**
- **Pequenos negócios locais**

## 🔧 Personalizações Possíveis

O projeto foi desenvolvido de forma modular. Você pode facilmente:

- 🎨 Alterar cores e temas no `tailwind.config.js`
- 💱 Modificar moeda padrão nos utilitários
- 📊 Adicionar novos tipos de gráficos
- 💾 Integrar com banco de dados
- 🌐 Adicionar autenticação de usuários
- 📱 Criar aplicativo mobile

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e comerciais. Fique à vontade para usar, modificar e distribuir conforme necessário.

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Você pode:
- Reportar bugs ou problemas
- Sugerir novas funcionalidades
- Melhorar a documentação
- Otimizar o código existente

## 📞 Suporte

Para dúvidas sobre o uso da calculadora:
1. Consulte esta documentação
2. Verifique os tooltips e textos de ajuda na interface
3. Teste com valores conhecidos para validar os cálculos

---

**💡 Dica:** A calculadora funciona 100% offline após o primeiro carregamento, sendo perfeita para uso em qualquer lugar!