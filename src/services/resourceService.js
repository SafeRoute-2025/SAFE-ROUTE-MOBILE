import api from './api';

export async function getResourcesBySafePlace(safePlaceId) {
  const res = await api.get(`/resources?safePlaceId=${safePlaceId}`);
  return res.data;
}

export const createResource = async (payload) => await api.post('/resources', payload);
export const updateResource = async (id, payload) => await api.put(`/resources/${id}`, payload);
export const deleteResource = async (id) => await api.delete(`/resources/${id}`);