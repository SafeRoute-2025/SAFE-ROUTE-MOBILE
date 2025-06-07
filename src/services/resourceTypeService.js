import api from './api';

export const getAll = async () => await api.get('/resource-types').then(res => res.data);
