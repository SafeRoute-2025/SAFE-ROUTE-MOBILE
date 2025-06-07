import api from './api';

export const getSafePlaces = async () => {
  const res = await api.get('/safe-places');
  return res.data;
};

export const getSafePlaceById = async (id) => {
  const res = await api.get(`/safe-places/${id}`);
  return res.data;
};

export const createSafePlace = async (data) => {
  const res = await api.post('/safe-places', data);
  return res.data;
};

export const updateSafePlace = async (id, data) => {
  const res = await api.put(`/safe-places/${id}`, data);
  return res.data;
};

export const deleteSafePlace = async (id) => {
  await api.delete(`/safe-places/${id}`);
};
