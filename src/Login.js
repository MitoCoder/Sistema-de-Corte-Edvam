import React, { useState } from "react";
import { Card, Button, Input, Select, Form, message, Row, Col, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import "./Login.css";

const { Option } = Select;
const { Title } = Typography;

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const users = {
    Mestre: "Ed2025",
    Abner: "Ab2025",
    Geovanna: "Ge2025",
    Jakeline: "Ja2025",
  };

  const handleLogin = () => {
    if (users[username] && users[username] === password) {
      onLoginSuccess();
    } else {
      message.error("Usuário ou senha incorretos");
    }
  };

  return (
    <div className="login-container">
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col xs={24} sm={20} md={12} lg={8}>
          <Card className="login-card">
            <Title level={3} className="login-header">SISTEMA DE CORTE</Title>
            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item label="Usuário" required>
                <Select
                  placeholder="Selecione seu usuário"
                  value={username}
                  onChange={(value) => setUsername(value)}
                  style={{ width: "100%" }}
                >
                  <Option value="Abner">Abner</Option>
                  <Option value="Geovanna">Geovanna</Option>
                  <Option value="Jakeline">Jakeline</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Senha" required>
                <Input.Password
                  placeholder="Digite sua senha"
                  prefix={<LockOutlined />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Button type="primary" htmlType="submit" block className="login-button">
                Entrar
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;


