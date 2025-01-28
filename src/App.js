import React, { useState, useEffect } from "react"; // Adicionando useEffect
import { Card, Button, Input, Row, Col, Select, message } from "antd";
import "antd/dist/reset.css"; // Importa o CSS do Ant Design
import "./App.css"; // Importa o CSS Personalizado
import { jsPDF } from "jspdf";
import Particles, { initParticlesEngine } from "@tsparticles/react"; // Importando Particles
import { loadSquaresPreset } from "@tsparticles/preset-squares";
import { loadSlim } from "@tsparticles/slim";
import { loadEasingQuadPlugin } from "@tsparticles/plugin-easing-quad";

const { Option } = Select;

const App = () => {
  const [paperWidth, setPaperWidth] = useState(66);
  const [paperHeight, setPaperHeight] = useState(96);
  const [cutWidth, setCutWidth] = useState(12);
  const [cutHeight, setCutHeight] = useState(12);
  const [paperQuantity, setPaperQuantity] = useState(1);
  const [multiplo, setMultiplo] = useState(2);
  const [material, setMaterial] = useState("Papel");
  const [gramatura, setGramatura] = useState(0);
  const [totals, setTotals] = useState({ totalCuts: 0, totalProducts: 0 });

  const [particlesInit, setParticlesInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine); // Carrega a versão leve do motor de partículas
      await loadSquaresPreset(engine); // Carrega o preset squares
      loadEasingQuadPlugin(engine);
    }).then(() => {
      setParticlesInit(true);
    });
  }, []);

  const particlesOptions = {
    preset: "squares", // Defina o preset como squares
  };

  const calculateCuts = () => {
    const rows = Math.floor(paperHeight / cutHeight);
    const cols = Math.floor(paperWidth / cutWidth);
    const totalCutWidth = cols * cutWidth;
    const totalCutHeight = rows * cutHeight;

    const leftoverWidth = paperWidth - totalCutWidth;
    const leftoverHeight = paperHeight - totalCutHeight;

    return {
      rows,
      cols,
      leftoverWidth,
      leftoverHeight,
      totalCuts: rows * cols,
    };
  };

  const updateTotals = () => {
    const { totalCuts } = calculateCuts();
    const totalProducts = totalCuts * paperQuantity * multiplo;
    setTotals({ totalCuts, totalProducts });
  };

  const scaleFactor = 0.9; // Valor fixo inicial para teste

  const drawPlan = () => {
    const canvas = document.getElementById("planCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { rows, cols, leftoverWidth, leftoverHeight, totalCuts } =
      calculateCuts();
    const cutW = (paperWidth / cols) * 10; // Fator de escala para visualização
    const cutH = (paperHeight / rows) * 10;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ctx.strokeStyle = "white"; // Linhas normais
        ctx.lineWidth = 1; // Linha padrão
        ctx.strokeRect(j * cutW, i * cutH, cutW, cutH);

        ctx.font = "12px Arial";
        ctx.fillStyle = "white"; // Define a cor da fonte para white
        const text = `${cutWidth}x${cutHeight}`;
        const textWidth = ctx.measureText(text).width;
        const textX = j * cutW + (cutW - textWidth) / 2;
        const textY = i * cutH + (cutH + 12) / 2; // Ajusta o texto ao centro verticalmente

        ctx.fillText(text, textX, textY);
      }
    }

    ctx.font = "14px Arial";
    ctx.fillStyle = "white"; // Define a cor da fonte para white
    ctx.fillText(
      `Formato: ${paperWidth}x${paperHeight}`,
      10,
      paperHeight * 10 - 10
    );

    ctx.strokeStyle = "white"; // Cor vermelha escura para as linhas da sobra
    ctx.lineWidth = 2; // Linha mais grossa para a sobra

    if (leftoverWidth > 0) {
      ctx.strokeRect(cols * cutW, 0, leftoverWidth * 10, paperHeight * 10);
      ctx.fillText(`Sobra: ${leftoverWidth} cm`, cols * cutW + 5, 20);
    }
    if (leftoverHeight > 0) {
      ctx.strokeRect(0, rows * cutH, paperWidth * 10, leftoverHeight * 10);
      ctx.fillText(`Sobra: ${leftoverHeight} cm`, 10, rows * cutH + 20);
    }

    ctx.strokeStyle = "White";
    ctx.lineWidth = 1; // Linha padrão para os outros detalhes

    ctx.font = "08px Arial";
    ctx.fillText(
      `Total Após Corte: ${totalCuts * paperQuantity}`,
      10,
      20 + paperHeight * 10
    );
  };

  const generatePDF = () => {
    const { rows, cols, leftoverWidth, leftoverHeight, totalCuts } =
      calculateCuts();
    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth();
    const cutW = 160 / paperWidth; // Fator de escala para o PDF
    const cutH = 200 / paperHeight; // Fator de escala para o PDF
    const centerX = (pageWidth - cutW * paperWidth) / 2; // Centralizar cortes no PDF

    // Adiciona o título do PDF
    pdf.setFontSize(13);
    pdf.text(
      `Plano de Corte - ${material} ${gramatura}gm ${paperWidth}x${paperHeight} cm`,
      centerX,
      10
    );

    // Adiciona o total de folhas e o total após corte
    pdf.setFontSize(10);
    pdf.text(`Total de Folhas: ${paperQuantity}`, centerX, 15);
    pdf.text(`Total Após Corte: ${totalCuts * paperQuantity}`, centerX, 20);
    pdf.text(
      `Total em Produtos: ${totalCuts * paperQuantity * multiplo}`,
      centerX,
      25
    );

    // Desenha os cortes
    pdf.setDrawColor(0, 0, 0); // Preto para as linhas de corte
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        pdf.rect(
          centerX + j * cutW * cutWidth,
          30 + i * cutH * cutHeight,
          cutW * cutWidth,
          cutH * cutHeight
        );
        pdf.text(
          `${cutWidth}x${cutHeight}`,
          centerX + 2 + j * cutW * cutWidth,
          45 + i * cutH * cutHeight
        );
      }
    }

    // Desenha as sobras
    pdf.setDrawColor(139, 0, 0); // Vermelho escuro para a linha da sobra
    pdf.setFont("helvetica", "bold"); // Fonte em negrito para o texto

    if (leftoverWidth > 0) {
      pdf.rect(
        centerX + cols * cutW * cutWidth,
        30,
        cutW * leftoverWidth,
        cutH * paperHeight
      );
      const textX = centerX + cols * cutW * cutWidth + cutW * leftoverWidth + 5;
      const textY = 23 + (cutH * paperHeight) / 2;
      pdf.text(`Sobra: ${leftoverWidth} cm`, textX, textY, { angle: 90 });
    }
    if (leftoverHeight > 0) {
      pdf.rect(
        centerX,
        30 + rows * cutH * cutHeight,
        cutW * paperWidth,
        cutH * leftoverHeight
      );
      const textX = centerX + 2;
      const textY = 40 + rows * cutH * cutHeight + cutH * leftoverHeight - 5;
      pdf.text(`Sobra: ${leftoverHeight} cm`, textX, textY);
    }

    pdf.save(
      `Plano de Corte - ${material} ${gramatura}gm - ${paperWidth}x${paperHeight} cm.pdf`
    );
  };

  const [messageApi, contextHolder] = message.useMessage();

  const info = () => {
    messageApi.info("Plano Gerado, Exporte o PDF ou Visualize!");
  };

  const viewPDF = () => {
    const { rows, cols, leftoverWidth, leftoverHeight, totalCuts } =
      calculateCuts();
    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth();
    const cutW = 160 / paperWidth; // Fator de escala para o PDF
    const cutH = 200 / paperHeight; // Fator de escala para o PDF
    const centerX = (pageWidth - cutW * paperWidth) / 2; // Centralizar cortes no PDF

    // Adiciona o título do PDF
    pdf.setFontSize(13);
    pdf.text(
      `Plano de Corte - ${material} ${gramatura}gm ${paperWidth}x${paperHeight} cm`,
      centerX,
      10
    );

    // Adiciona o total de folhas e o total após corte
    pdf.setFontSize(10);
    pdf.text(`Total de Folhas: ${paperQuantity}`, centerX, 15);
    pdf.text(`Total Após Corte: ${totalCuts * paperQuantity}`, centerX, 20);
    pdf.text(
      `Total em Produtos: ${totalCuts * paperQuantity * multiplo}`,
      centerX,
      25
    );

    // Desenha os cortes
    pdf.setDrawColor(0, 0, 0); // Preto para as linhas de corte
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        pdf.rect(
          centerX + j * cutW * cutWidth,
          30 + i * cutH * cutHeight,
          cutW * cutWidth,
          cutH * cutHeight
        );
        pdf.text(
          `${cutWidth}x${cutHeight}`,
          centerX + 2 + j * cutW * cutWidth,
          45 + i * cutH * cutHeight
        );
      }
    }

    // Desenha as sobras
    pdf.setDrawColor(139, 0, 0); // Vermelho escuro para a linha da sobra
    pdf.setFont("helvetica", "bold"); // Fonte em negrito para o texto

    if (leftoverWidth > 0) {
      pdf.rect(
        centerX + cols * cutW * cutWidth,
        30,
        cutW * leftoverWidth,
        cutH * paperHeight
      );
      const textX = centerX + cols * cutW * cutWidth + cutW * leftoverWidth + 5;
      const textY = 23 + (cutH * paperHeight) / 2;
      pdf.text(`Sobra: ${leftoverWidth} cm`, textX, textY, { angle: 90 });
    }
    if (leftoverHeight > 0) {
      pdf.rect(
        centerX,
        30 + rows * cutH * cutHeight,
        cutW * paperWidth,
        cutH * leftoverHeight
      );
      const textX = centerX + 2;
      const textY = 40 + rows * cutH * cutHeight + cutH * leftoverHeight - 5;
      pdf.text(`Sobra: ${leftoverHeight} cm`, textX, textY);
    }

    // Gera o Blob e abre em uma nova aba
    const pdfBlob = pdf.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, "_blank");
  };

  return (
    <div
      className="zoomed" // Nova classe para aplicar o zoom apenas no conteúdo
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: window.innerWidth < 768 ? "column" : "row",
        height: "100vh",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Card
          className="card-transparent" /* Adicione a classe personalizada aqui */
          style={{
            width: "100%",
            maxWidth: "600px",
            marginBottom: "20px",
            zIndex: 1,
          }}
        >
          <h1 style={{ textAlign: "center", color: "white" }}>
            Plano de Corte - Guilhotina
          </h1>
          <p style={{ textAlign: "center", color: "white" }}>
            Ed's Sistemas - Versão: 4.5.0
          </p>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Input
                type="number"
                value={paperWidth}
                onChange={(e) => setPaperWidth(Number(e.target.value))}
                addonBefore={
                  <span className="white-label">Papel - Largura:</span>
                }
                style={{ marginBottom: "15px" }} // Aumentar a margem inferior
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                type="number"
                value={paperHeight}
                onChange={(e) => setPaperHeight(Number(e.target.value))}
                addonBefore={
                  <span className="white-label">Papel - Altura:</span>
                }
                style={{ marginBottom: "15px" }} // Aumentar a margem inferior
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Input
                type="number"
                value={cutWidth}
                onChange={(e) => setCutWidth(Number(e.target.value))}
                addonBefore={
                  <span className="white-label">Corte - Largura:</span>
                }
                style={{ marginBottom: "15px" }} // Aumentar a margem inferior
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                type="number"
                value={cutHeight}
                onChange={(e) => setCutHeight(Number(e.target.value))}
                addonBefore={
                  <span className="white-label">Corte - Altura:</span>
                }
                style={{ marginBottom: "15px" }} // Aumentar a margem inferior
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Input
                type="number"
                value={paperQuantity}
                onChange={(e) => setPaperQuantity(Number(e.target.value))}
                addonBefore={
                  <span className="white-label">Qtd. de Folhas:</span>
                }
                style={{ marginBottom: "15px" }} // Aumentar a margem inferior
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                type="number"
                value={multiplo}
                onChange={(e) => setMultiplo(Number(e.target.value))}
                addonBefore={<span className="white-label">Montagem:</span>}
                style={{ marginBottom: "15px" }} // Aumentar a margem inferior
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Select
                value={material}
                onChange={setMaterial}
                placeholder="Escolha o Papel"
                style={{ width: "100%", marginBottom: "15px" }} // Aumentar a margem inferior
              >
                <Option value="Triplex">Triplex</Option>
                <Option value="Duplex">Duplex</Option>
                <Option value="Klabin">Klabin</Option>
                <Option value="Couche">Couche</Option>
                <Option value="Couche Adesivo">Couche Adesivo</Option>
                <Option value="Kraft">Kraft</Option>
                <Option value="Onda B">Onda B</Option>
                <Option value="Onda E">Onda E</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12}>
              <Input
                type="number"
                value={gramatura}
                onChange={(e) => setGramatura(Number(e.target.value))}
                addonBefore={
                  <span className="white-label">Gramatura (gm):</span>
                }
                style={{ marginBottom: "15px" }} // Aumentar a margem inferior
              />
            </Col>
          </Row>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {contextHolder}
            <Button
              type="primary"
              onClick={() => {
                updateTotals();
                drawPlan();
                info();
              }}
              style={{
                backgroundColor: "rgba(211, 211, 211, 0.46)", // Cinza claro
                color: "black",
                marginRight: window.innerWidth < 768 ? "0" : "10px",
                marginBottom: window.innerWidth < 768 ? "10px" : "0",
                width: window.innerWidth < 768 ? "100%" : "auto",
              }}
            >
              Gerar Plano de Corte
            </Button>
            <Button
              type="default"
              onClick={generatePDF}
              style={{
                marginRight: window.innerWidth < 768 ? "0" : "10px",
                marginBottom: window.innerWidth < 768 ? "10px" : "0",
                width: window.innerWidth < 768 ? "100%" : "auto",
              }}
            >
              Exportar como PDF
            </Button>
            <Button
              type="default"
              onClick={viewPDF}
              style={{
                width: window.innerWidth < 768 ? "100%" : "auto",
                marginBottom: window.innerWidth < 768 ? "10px" : "0", // Adicionando margem inferior para mobile
              }}
            >
              Visualizar PDF
            </Button>
          </div>
        </Card>

        <Card
          className="card-transparent" /* Adicione a classe personalizada aqui */
          style={{
            width: "100%",
            maxWidth: "600px",
            marginTop: "3px",
            zIndex: 1,
          }}
        >
          <h3 style={{ color: "white" }}>Totais Separados:</h3>
          <p style={{ color: "white" }}>
            Total Após Corte: {totals.totalCuts * paperQuantity}
          </p>
          <p style={{ color: "white" }}>
            Total em Produtos: {totals.totalProducts}
          </p>
          <p style={{ color: "white" }}>
            ©2025 Copyright. Todos os direitos reservados à Edvam Santos.
          </p>
        </Card>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          position: "relative", // Para o container ter um contexto de posição
        }}
      >
        {particlesInit && (
          <Particles
            id="tsparticles"
            options={particlesOptions} // Passa as opções configuradas
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
          />
        )}

        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto", // Permite rolagem se o canvas for maior que o espaço disponível
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <canvas
            id="planCanvas"
            width={paperWidth * 10}
            height={paperHeight * 10}
            style={{
              transform: `scale(${scaleFactor})`,
              transformOrigin: "center",
              maxWidth: "100%",
              maxHeight: "100%",
              display: "block",
              margin: "auto",
              zIndex: 0,
            }} // Adicionado zIndex para o canvas
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default App;
