import api from './api';

// Lista todos os alertas (sem paginação)
export const getAlerts = async () => {
  const res = await api.get('/alerts');
  return res.data;
};

// Cria um novo alerta
export const createAlert = async (data) => {
  const res = await api.post('/alerts', data);
  return res.data;
};

// Deleta um alerta por ID
export const deleteAlert = async (id) => {
  await api.delete(`/alerts/${id}`);
};

// Deleta todos os alertas com mais de 7 dias
export const deleteOldAlerts = async () => {
  await api.delete('/alerts/older-than-7-days');
};

// Lista os eventos disponíveis (para seleção no alerta)
export const getEventList = async () => {
  const res = await api.get('/events/list');
  return res.data;
};
