import React, { useState } from 'react';
import socketIOClient from 'socket.io-client';
import Input from '../form/Input';
import SubmitButton from '../form/SubmitButton';
import styles from './CadastroForm.module.css';

const ENDPOINT = "ws://localhost:3000";

function CadastroForm() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    contato: '',
    digital: '',
  });

  const handleReceberDigital = () => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit('solicitarDigital');
    socket.on('digitalData', data => {
      setFormData({
        ...formData,
        digital: data,
      });
      socket.disconnect();
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const enviarDadosParaBackend = async () => {
    try {
      const response = await fetch('/api/enviarDados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dados enviados com sucesso!', data);
      } else {
        throw new Error('Erro ao enviar dados');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <form className={styles.form}>
      <Input
        type="text"
        text="Nome"
        name="nome"
        placeholder="Insira o seu nome:"
        value={formData.nome}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        text="CPF"
        name="cpf"
        placeholder="Insira o seu CPF"
        value={formData.cpf}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        text="Contato"
        name="contato"
        placeholder="Insira o contato"
        value={formData.contato}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        text="Digital gerada"
        name="digital"
        placeholder="Insira a digital gerada"
        value={formData.digital}
        onChange={handleInputChange}
      />
      <SubmitButton text="Receber Digital" onClick={handleReceberDigital} />
      <SubmitButton text="Enviar" onClick={enviarDadosParaBackend} />
    </form>
  );
}

export default CadastroForm;
