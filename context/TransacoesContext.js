// context/TransacoesContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Importando as funções do banco de dados
import {
  inicializarBanco,
  buscarTodasTransacoes,
  inserirTransacao,
  excluirTransacao,
} from '../database/db';

const TransacoesContext = createContext(null);

export function TransacoesProvider({ children }) {
  const [transacoes, setTransacoes] = useState([]); // Inicializa como array vazio
  const [carregando, setCarregando] = useState(true);

  // Efeito para inicializar o banco e carregar os dados ao abrir o app
  useEffect(() => {
    const prepararApp = async () => {
      try {
        await inicializarBanco();
        await carregarTransacoes();
      } catch (erro) {
        console.error('Erro na inicialização:', erro);
      } finally {
        setCarregando(false);
      }
    };

    prepararApp();
  }, []);

  // Função para buscar dados do banco
  async function carregarTransacoes() {
    try {
      const dados = await buscarTodasTransacoes();
      // Garantia extra: se o banco retornar null/undefined, vira array vazio
      setTransacoes(Array.isArray(dados) ? dados : []);
    } catch (erro) {
      console.error('Erro ao buscar transações:', erro);
      setTransacoes([]);
    }
  }

  // Adicionar nova transação
  async function adicionarTransacao(novaTransacao) {
    try {
      await inserirTransacao(novaTransacao);
      // Recarrega do banco para garantir que temos os dados sincronizados (incluindo o ID do SQLite)
      await carregarTransacoes();
    } catch (erro) {
      console.error('Erro ao adicionar:', erro);
    }
  }

  // Remover transação
  async function removerTransacao(id) {
    try {
      await excluirTransacao(id);
      // Atualiza o estado local para refletir a exclusão instantaneamente
      setTransacoes(prev => prev.filter(t => t.id !== id));
    } catch (erro) {
      console.error('Erro ao remover:', erro);
    }
  }

  // Cálculos de saldo (usando useMemo para performance)
  const receitas = useMemo(() => {
    return transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((soma, t) => soma + (Number(t.valor) || 0), 0);
  }, [transacoes]);

  const despesas = useMemo(() => {
    return transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((soma, t) => soma + (Number(t.valor) || 0), 0);
  }, [transacoes]);

  const saldo = receitas - despesas;

  const valorProvido = {
    transacoes,
    carregando,
    receitas,
    despesas,
    saldo,
    adicionarTransacao,
    removerTransacao,
    carregarTransacoes // Útil se quiser dar um "pull to refresh" na lista
  };

  return (
    <TransacoesContext.Provider value={valorProvido}>
      {children}
    </TransacoesContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useTransacoes() {
  const contexto = useContext(TransacoesContext);
  if (!contexto) {
    throw new Error('useTransacoes precisa estar dentro de <TransacoesProvider>');
  }
  return contexto;
}