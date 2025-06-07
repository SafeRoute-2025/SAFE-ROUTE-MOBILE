import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }) {
  const handleLogout = () => {
    // Aqui você pode limpar tokens, sessões ou navegar para login
    navigation.replace('Login'); // ou navigation.navigate('Login') se preferir empilhar
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4FA' }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#0B1E51" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../../assets/saferoute-logo.png')} style={styles.logo} />

        <Text style={styles.title}>Bem-vindo ao SafeRoute</Text>
        <Text style={styles.subtitle}>Monitore riscos, proteja vidas. Sua rota segura começa aqui.</Text>

        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Eventos')}>
          <Text style={styles.buttonText}>Ver eventos</Text>
        </TouchableOpacity>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Locais Seguros')}>
            <Text style={styles.cardText}>Locais Seguros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Recursos')}>
            <Text style={styles.cardText}>Recursos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Alertas')}>
            <Text style={styles.cardText}>Alertas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tip}>
          <Text style={styles.tipTitle}>Dica de Segurança por IA</Text>
          <Text style={styles.tipText}>Use rotas seguras em áreas com boa iluminação à noite.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
  },
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F4FA',
    paddingTop: 10,
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0B1E51',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  mainButton: {
    backgroundColor: '#0B1E51',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  card: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    borderRadius: 10,
    width: 140,
    alignItems: 'center',
    margin: 8,
  },
  cardText: {
    color: '#333',
    fontWeight: 'bold',
  },
  tip: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
  },
  tipTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#856404',
  },
  tipText: {
    color: '#856404',
    fontStyle: 'italic',
  },
});
