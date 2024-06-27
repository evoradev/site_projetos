import React, { useState, useEffect } from 'react';
import Input from '../form/Input';
import SubmitButton from '../form/SubmitButton';
import styles from './CadastroForm.module.css';

function CadastroForm() {
  const [formData, setFormData] = useState({
    Codigo: '',
    nome: '',
    cpf: '',
    contato: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const enviarDadosParaBackend = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/insert', {
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
        text="Codigo"
        name="codigo"
        placeholder="Insira o codigo:"
        required
        onChange={handleInputChange}
      />
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
      <SubmitButton text="Enviar" onClick={enviarDadosParaBackend} />
    </form>
  );
}

export default CadastroForm;
