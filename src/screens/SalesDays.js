import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import SaleCard from '../components/SaleCard';
import colors from '../styles/colors'
import Header from '../components/Header';

export default function SalesDays() {
  const [sales, setSales] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(true)

  const image = require('../assets/logo.png');

  useEffect(() => {
    async function fetchVendas() {
      try {
        const res = await fetch(
          'https://script.google.com/macros/s/AKfycbyDi80grbAAVbRxhefmI4ZUSoHyXz63Yail91NnWKQQDeWXZArA24Hko7KwHY1qYmQyzw/exec?vendedor=EMERSON'
        );
        const data = await res.json();

        if (Array.isArray(data.saida)) {
          setSales(data.saida);
        } else {
          throw new Error('Resposta da API não é um array válido');
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
        setReload(true)
      }
    }

    fetchVendas();
  }, [!reload]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.danger }}>{error}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* onPress, icone, descriptionIcone, image */}
      <Header 
        onPress={() => setReload(!reload)} 
        icone={'reload'} /* enviar o nome do icone a ser renderizado no header */
        descriptionIcone={'Atualizar'} /* enviar a descrição do botão */
        image={ image } /* enviar a imagem */
      />
      <FlatList
        data={sales}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item, index }) => (
          <SaleCard
            item={item}
            isExpanded={selectedIndex === index}
            onPress={() => setSelectedIndex(index === selectedIndex ? null : index)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });