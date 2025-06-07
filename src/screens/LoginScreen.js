import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { login } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      await login(email, password);
      navigation.replace('Main');
    } catch (err) { 
      Alert.alert('Erro no login', err.message || 'Falha na autenticação');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register'); // você vai criar essa tela depois
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.loginBox}>
          <Image
            source={require('../../assets/saferoute-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.message}>Faça login para acessar o sistema.</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1E51',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  loginBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#0B1E51',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 14,
    color: '#000',
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#0B1E51',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#1d4fd7',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
