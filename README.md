# Plano de Corte - Guilhotina 🖨️📏

Uma aplicação visual e intuitiva para otimizar cortes em materiais como papel e cartolina. Com ela, você pode planejar, visualizar e exportar planos de corte, simplificando o processo para materiais de diferentes tamanhos, gramaturas e múltiplos cortes. 

## 🎉 Funcionalidades

- **Configuração Personalizada:** Defina as dimensões do papel e do corte, a quantidade de folhas, a gramatura e o material.
- **Cálculo de Corte Automático:** Visualize a quantidade de cortes possíveis por folha, as sobras de cada corte e o total de produtos após o corte.
- **Exportação em PDF:** Gere um relatório PDF com os planos de corte, incluindo detalhes de medidas e quantidades.
- **Visualização de Corte em Canvas:** Simule a disposição dos cortes em uma tela para fácil visualização das configurações.

## 🛠️ Tecnologias Utilizadas

- **React** - Frontend interativo e responsivo.
- **Ant Design** - Interface moderna e intuitiva com componentes prontos.
- **jsPDF** - Geração de documentos PDF para exportação de planos de corte.
- **HTML5 Canvas** - Renderização dinâmica dos planos de corte.

## 📦 Estrutura do Projeto

```
plano-de-corte-guilhotina
│   README.md
│   package.json
└───src
    │   App.js          # Componente principal e lógica da aplicação
    │   App.css         # Estilos personalizados para a aplicação
    └───assets          # Recursos de mídia, se aplicável
```

## 🚀 Como Executar o Projeto

1. **Clone o Repositório**:

    ```bash
    git clone https://github.com/seu-usuario/plano-de-corte-guilhotina.git
    cd plano-de-corte-guilhotina
    ```

2. **Instale as Dependências**:

    ```bash
    npm install
    ```

3. **Inicie o Projeto**:

    ```bash
    npm start
    ```

4. **Acesse a Aplicação**:
   Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000).

## 🔧 Parâmetros Personalizáveis

### 1. Tamanho do Papel e do Corte
- `Papel - Largura` e `Papel - Altura`: Dimensões totais do material.
- `Corte - Largura` e `Corte - Altura`: Medidas de cada corte.

### 2. Quantidade e Múltiplos
- `Qtd. de Folhas`: Quantidade total de folhas a serem cortadas.
- `Múltiplo`: Multiplica o total final de produtos por corte, ideal para otimizar a produção.

### 3. Material e Gramatura
- `Material`: Escolha entre tipos de papel (Duplex, Klabin, etc).
- `Gramatura`: Peso do material, em gramas, para especificações detalhadas.

## 🎨 Visualização do Plano de Corte

Após configurar as dimensões e clicar em "Gerar Plano de Corte", um canvas exibe o plano com todos os cortes, suas sobras e medidas. Uma tabela de resumo mostra o total após o corte e o total em produtos.

## 📄 Exportação do Plano em PDF

Com a opção "Exportar como PDF", gere um arquivo com todas as informações de corte e detalhes de materiais para fácil impressão e consulta. O PDF inclui:

- Plano visual dos cortes
- Quantidade de folhas e produtos após o corte
- Informações detalhadas sobre sobras e materiais

## 📌 Exemplo de Uso

1. Insira as dimensões do papel e dos cortes.
2. Selecione o material e a gramatura.
3. Ajuste a quantidade de folhas e o múltiplo, caso aplicável.
4. Clique em "Gerar Plano de Corte" para visualizar o plano no canvas.
5. Exporte o plano em PDF para impressão ou compartilhamento.

---

**Desenvolvido com ❤️ por Edvam Santos**
