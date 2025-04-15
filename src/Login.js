import React, { useState } from "react";
import { Card, Button, Input, Select, Form, message, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import "./Login.css";

const { Option } = Select;
const { Title } = Typography;

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const rawData = "QWRtaW5pc3RyYWRvcjpFZDIwMjY7QWJuZXI6QWIyMDI1O0dlb3Zhbm5hOkdlMjAyNQ==";

  // Constrói o dicionário de usuários de forma dinâmica
  const users = {};
  atob(rawData)
    .split(";")
    .forEach((entry) => {
      const [user, pass] = entry.split(":");
      users[user] = pass;
    });

  const handleLogin = () => {
    if (users[username] && users[username] === password) {
      onLoginSuccess();
    } else {
      message.error("Usuário ou senha incorretos");
    }
  };

  return (
    <div className="login-container">
      <Card bordered={false} className="login-card">
        <Title level={3} className="login-title">SISTEMA DE CORTE</Title>

        <Form layout="vertical" onFinish={handleLogin} className="login-form">
          <Form.Item label="Usuário" required>
            <Select
              placeholder="Selecione seu usuário"
              value={username}
              onChange={(value) => setUsername(value)}
              style={{ width: "100%" }}
            >
              <Option value="Administrador">Administrador</Option>
              <Option value="Abner">Abner</Option>
              <Option value="Geovanna">Geovanna</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Senha" required>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Entrar
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
