import React, { useState } from 'react';
import { Card, Button, Input, Row, Col } from 'antd';
import 'antd/dist/reset.css'; // Importa o CSS do Ant Design
import './App.css'; // Importa o CSS Personalizado
import { jsPDF } from 'jspdf';

const App = () => {
  const [paperWidth, setPaperWidth] = useState(66);
  const [paperHeight, setPaperHeight] = useState(96);
  const [cutWidth, setCutWidth] = useState(66);
  const [cutHeight, setCutHeight] = useState(33);

  const calculateCuts = () => {
    const rows = Math.floor(paperHeight / cutHeight);
    const cols = Math.floor(paperWidth / cutWidth);
    const totalCutWidth = cols * cutWidth;
    const totalCutHeight = rows * cutHeight;

    const leftoverWidth = paperWidth - totalCutWidth;
    const leftoverHeight = paperHeight - totalCutHeight;

    return { rows, cols, leftoverWidth, leftoverHeight };
  };

  const drawPlan = () => {
    const canvas = document.getElementById('planCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { rows, cols, leftoverWidth, leftoverHeight } = calculateCuts();
    const cutW = (paperWidth / cols) * 10; // Fator de escala para visualização
    const cutH = (paperHeight / rows) * 10;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ctx.strokeStyle = 'black'; // Linhas normais
        ctx.lineWidth = 1; // Linha padrão
        ctx.strokeRect(j * cutW, i * cutH, cutW, cutH);

        ctx.font = '12px Arial';
        const text = `${cutWidth}x${cutHeight}`;
        const textWidth = ctx.measureText(text).width;
        const textX = j * cutW + (cutW - textWidth) / 2;
        const textY = i * cutH + (cutH + 12) / 2; // Ajusta o texto ao centro verticalmente

        ctx.fillText(text, textX, textY);
      }
    }

    ctx.font = '14px Arial';
    ctx.fillText(`Papel: ${paperWidth}x${paperHeight}`, 10, paperHeight * 10 - 10);

    ctx.strokeStyle = 'darkred'; // Cor vermelha escura para as linhas da sobra
    ctx.lineWidth = 2; // Linha mais grossa para a sobra

    if (leftoverWidth > 0) {
      ctx.strokeRect(cols * cutW, 0, leftoverWidth * 10, paperHeight * 10);
      ctx.fillText(`Sobra: ${leftoverWidth} cm`, cols * cutW + 5, 20);
    }
    if (leftoverHeight > 0) {
      ctx.strokeRect(0, rows * cutH, paperWidth * 10, leftoverHeight * 10);
      ctx.fillText(`Sobra: ${leftoverHeight} cm`, 10, rows * cutH + 20);
    }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1; // Linha padrão para os outros detalhes
  };

  const generatePDF = () => {
    const { rows, cols, leftoverWidth, leftoverHeight } = calculateCuts();
    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth();
    const cutW = 180 / paperWidth;  // Fator de escala para o PDF
    const cutH = 260 / paperHeight; // Fator de escala para o PDF
    const centerX = (pageWidth - cutW * paperWidth) / 2; // Centralizar cortes no PDF

    pdf.text(`Plano de Corte - Papel: ${paperWidth}x${paperHeight} cm`, centerX, 10);

    pdf.setDrawColor(0, 0, 0); // Preto para as linhas de corte
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        pdf.rect(centerX + j * cutW * cutWidth, 20 + i * cutH * cutHeight, cutW * cutWidth, cutH * cutHeight);
        pdf.text(`${cutWidth}x${cutHeight}`, centerX + 2 + j * cutW * cutWidth, 25 + i * cutH * cutHeight);
      }
    }

    pdf.setDrawColor(139, 0, 0); // Vermelho escuro para a linha da sobra
    pdf.setFont("helvetica", "bold"); // Fonte em negrito para o texto

    if (leftoverWidth > 0) {
      pdf.rect(centerX + cols * cutW * cutWidth, 20, cutW * leftoverWidth, cutH * paperHeight);
      const textX = centerX + cols * cutW * cutWidth + cutW * leftoverWidth + 5;
      const textY = 30 + cutH * paperHeight / 2;
      pdf.text(`Sobra: ${leftoverWidth} cm`, textX, textY, { angle: 90 });
    }
    if (leftoverHeight > 0) {
      pdf.rect(centerX, 20 + rows * cutH * cutHeight, cutW * paperWidth, cutH * leftoverHeight);
      const textX = centerX + 2;
      const textY = 30 + rows * cutH * cutHeight + cutH * leftoverHeight - 5;
      pdf.text(`Sobra: ${leftoverHeight} cm`, textX, textY);
    }

    pdf.save('plano-de-corte.pdf');
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ textAlign: 'center' }}>Plano de Corte</h1>
      <Card
        style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '15px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Input
              type="number"
              value={paperWidth}
              onChange={(e) => setPaperWidth(Number(e.target.value))}
              addonBefore="Papel - Largura:"
              style={{ marginBottom: '10px' }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              type="number"
              value={paperHeight}
              onChange={(e) => setPaperHeight(Number(e.target.value))}
              addonBefore="Altura:"
              style={{ marginBottom: '10px' }}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Input
              type="number"
              value={cutWidth}
              onChange={(e) => setCutWidth(Number(e.target.value))}
              addonBefore="Corte - Largura:"
              style={{ marginBottom: '10px' }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              type="number"
              value={cutHeight}
              onChange={(e) => setCutHeight(Number(e.target.value))}
              addonBefore="Altura:"
              style={{ marginBottom: '10px' }}
            />
          </Col>
        </Row>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" onClick={drawPlan} style={{ marginRight: '10px' }}>
            Gerar Plano de Corte
          </Button>
          <Button type="default" onClick={generatePDF}>
            Exportar como PDF
          </Button>
        </div>
      </Card>
      <canvas
        id="planCanvas"
        width={paperWidth * 10}
        height={paperHeight * 10}
        style={{ border: '1px solid black', marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
      ></canvas>
    </div>
  );
};

export default App;
