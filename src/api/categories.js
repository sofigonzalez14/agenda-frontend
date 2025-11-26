import api from './client';

export async function getCategories() {
  const res = await api.get('/api/categories');
  return res.data;
}

export async function createCategory(name) {
  const res = await api.post('/api/categories', { name });
  return res.data;
}

export async function updateCategory(id, name) {
  const res = await api.put(`/api/categories/${id}`, { name });
  return res.data;
}

export async function deleteCategory(id) {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
}


