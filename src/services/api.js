import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.149:8080/api',
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: false,
});

export default api;

export async function login(email, password) {
  const response = await fetch('http://192.168.0.149:8080/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 200) {
    return true;
  } else {
    throw new Error('Login inválido');
  }
}

export async function registerUser(data) {
  const response = await fetch('http://192.168.0.149:8080/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao registrar usuário');
  }

  return await response.json();
}

