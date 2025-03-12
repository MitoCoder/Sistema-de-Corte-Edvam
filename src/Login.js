import React, { useState } from 'react';
import { Card, Button, Input, Select, Form, message, Row, Col } from 'antd';
import './Login.css';

const { Option } = Select;

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Definindo usuários e senhas
  const users = {
    Abner: 'Ab2025',
    Geovanna: 'Ge2025',
    Jakeline: 'Ja2025',
  };

  const handleLogin = () => {
    if (users[username] && users[username] === password) {
      onLoginSuccess(); // Chama a função do componente pai se o login for bem-sucedido
    } else {
      message.error('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="login-container">
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="Login"
            bordered={false}
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item label="Usuário" required>
                <Select
                  placeholder="Selecione seu usuário"
                  value={username}
                  onChange={(value) => setUsername(value)}
                  style={{ width: '100%' }}
                >
                  <Option value="Abner">Abner</Option>
                  <Option value="Geovanna">Geovanna</Option>
                  <Option value="Jakeline">Jakeline</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Senha" required>
                <Input.Password
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
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

