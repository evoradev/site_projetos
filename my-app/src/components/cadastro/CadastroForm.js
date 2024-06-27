import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import Input from '../form/Input';
import SubmitButton from '../form/SubmitButton';
import styles from './CadastroForm.module.css';

const ENDPOINT = "ws://localhost:4000"; // Porta do seu servidor WebSocket

function CadastroForm() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    contato: '',
    digital: '',
  });

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('digitalData', data => {
      setFormData(prevState => ({
        ...prevState,
        digital: data.digital,
      }));
      socket.disconnect();
    });

    return () => socket.disconnect();
  }, []);

  const handleReceberDigital = () => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit('solicitarDigital');
    socket.on('digitalData', data => {
      setFormData(prevState => ({
        ...prevState,
        digital: data.digital,
      }));
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
        required
        onChange={handleInputChange}
      />
      <Input
        type="text"
        text="CPF"
        name="cpf"
        placeholder="Insira o seu CPF"
        required
        onChange={handleInputChange}
      />
      <Input
        type="text"
        text="Contato"
        name="contato"
        placeholder="Insira o contato"
        required
        onChange={handleInputChange}
      />
      <Input
        type="text"
        text="Digital gerada"
        name="digital"
        placeholder="Insira a digital gerada"
        value={formData.digital}
        readOnly // A digital gerada será apenas visualizada
      />
      <SubmitButton text="Receber Digital" onClick={handleReceberDigital} />
      <SubmitButton text="Enviar" onClick={enviarDadosParaBackend} />
    </form>
  );
}

export default CadastroForm;
