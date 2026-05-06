// App.js

import { StatusBar } from 'expo-status-bar';

import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';

import { PaperProvider } from 'react-native-paper';

import { CartaoSaldo } from './components/CartaoSaldo';

import { CardsResumo } from './components/CardsResumo';

import { ItemTransacao } from './components/ItemTransacao';

import { cores, espacamento } from './theme';


// Dados estáticos para demonstração (na Aula 4, virão do AsyncStorage)

const TRANSACOES = [

  { id: '1', descricao: 'Salário', valor: 5200, tipo: 'receita', categoria: 'salario', data: '01/05/2026' },

  { id: '2', descricao: 'Jogo', valor: 90, tipo: 'outros', categoria: 'moradia', data: '05/05/2026' },

  { id: '3', descricao: 'Supermercado', valor: 280.50, tipo: 'despesa', categoria: 'alimentacao', data: '07/05/2026' },

  { id: '4', descricao: 'Roupas', valor: 500, tipo: 'receita', categoria: 'salario', data: '10/05/2026' },

  { id: '5', descricao: 'Uber', valor: 35.90, tipo: 'despesa', categoria: 'transporte', data: '11/05/2026' },

  { id: '6', descricao: 'Remdios', valor: 89.90, tipo: 'despesa', categoria: 'saude', data: '12/05/2026' },

];

let nome = "Luciano dos Santos Nascimento"

const imagem = <img src="https://otempo.scene7.com/is/image/sempreeditora/frieren-ranking-oficial-revela-personagem-mais-popular?qlt=90&wid=1200&ts=1777743015143&dpr=off" alt='frierem'/>
export default function App() {

  // Calcula receitas, despesas e saldo

  const receitas = TRANSACOES

    .filter(t => t.tipo === 'receita')

    .reduce((acc, t) => acc + t.valor, 0);


  const despesas = TRANSACOES

    .filter(t => t.tipo === 'despesa')

    .reduce((acc, t) => acc + t.valor, 0);


  const saldo = receitas - despesas;


  return (

    <PaperProvider>

      <SafeAreaView style={styles.safeArea}>

        <StatusBar style="light" />


        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Cabeçalho */}

          <View style={styles.cabecalho}>

            <Text style={styles.tituloCabecalho}>Minhas Finanças do Luciano</Text>

            <Text style={styles.subtituloCabecalho}>Maio 2026</Text>

          </View>


          {/* Cards de resumo */}

          <CardsResumo receitas={receitas} despesas={despesas} />


          {/* Lista de transações */}

          <View style={styles.secao}>

            <Text style={styles.tituloSecao}>Transações feitas Recentes pelo {nome}</Text>

            {TRANSACOES.map(transacao => (

              <ItemTransacao

                key={transacao.id}

                descricao={transacao.descricao}

                valor={transacao.valor}

                tipo={transacao.tipo}

                categoria={transacao.categoria}

                data={transacao.data}

                onPress={() => console.log('Tocou em:', transacao.descricao)}

              />

            ))}

            {/* Card de saldo */}

            <CartaoSaldo saldo={saldo} mes="Maio" />

          </View>

          
          

        </ScrollView>

      </SafeAreaView>

    </PaperProvider>

  );

}


const styles = StyleSheet.create({

  safeArea: {

    flex: 1,

    backgroundColor: cores.primaria,
    
    // cor escura no topo (status bar area)
    paddingTop: 20,

    gap: 30,

    paddingBottom: 20,


  },

  scroll: {

    flex: 1,

    backgroundColor: cores.fundo,

  

  },

  cabecalho: {

    backgroundColor: cores.primaria,

    paddingHorizontal: espacamento.md,

    paddingVertical: espacamento.lg,

  },

  tituloCabecalho: {

    color: '#fff',

    fontSize: 22,

    fontWeight: 'bold',

  },

  subtituloCabecalho: {

    color: '#bdc3c7',

    fontSize: 14,

    marginTop: 2,

  },

  secao: {

    padding: espacamento.md,

    marginTop: espacamento.sm,

  },

  tituloSecao: {

    fontSize: 17,

    fontWeight: '700',

    color: cores.texto,

    marginBottom: espacamento.md,
    

  },

});
