import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ScrollView, SafeAreaView, ActivityIndicator
} from 'react-native';
import { registerUser } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false); // 👈 estado para loading

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, password, phone } = form;

    if (!name || !email || !password || !phone) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Erro', 'Senha não atende aos critérios de segurança.');
      return;
    }

    setIsLoading(true); // 👈 começa o carregamento

    try {
      await registerUser(form);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.replace('Login') }
      ]);
    } catch (err) {
      Alert.alert('Erro no cadastro', err.message || 'Não foi possível registrar.');
    } finally {
      setIsLoading(false); // 👈 encerra o carregamento
    }
  };

  const validatePassword = (password) => (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@#$%^&+=!]/.test(password) &&
    !/\s/.test(password)
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crie sua conta</Text>

        <TextInput style={styles.input} placeholder="Nome" value={form.name} onChangeText={text => handleChange('name', text)} />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={form.email} onChangeText={text => handleChange('email', text)} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={form.password} onChangeText={text => handleChange('password', text)} />
        <Text style={styles.passwordHint}>Senha deve conter 8+ caracteres, uma maiúscula, uma minúscula, número e símbolo.</Text>
        <TextInput style={styles.input} placeholder="Telefone" keyboardType="numeric" value={form.phone} onChangeText={text => handleChange('phone', text.replace(/\D/g, '').slice(0, 11))} />

        <TouchableOpacity style={[styles.button, isLoading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Voltar ao Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20, paddingTop: 50, backgroundColor: '#F0F4FA', flexGrow: 1, alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0B1E51', marginBottom: 20 },
  input: { width: '100%', padding: 12, borderColor: '#ccc', borderWidth: 1, borderRadius: 6, marginBottom: 12, backgroundColor: '#fff' },
  passwordHint: { fontSize: 12, color: '#666', marginBottom: 10, textAlign: 'left' },
  button: { backgroundColor: '#0B1E51', paddingVertical: 14, borderRadius: 30, width: '100%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#1d4fd7', marginTop: 20, fontWeight: 'bold' },
});
