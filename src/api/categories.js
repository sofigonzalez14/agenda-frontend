import api from './client';

export async function getCategories() {
  const { data } = await api.get('/api/categories');
  return data;
}

export async function createCategory(name) {
  const { data } = await api.post('/api/categories', { name });
  return data;
}

export async function updateCategory(id, name) {
  const { data } = await api.put(`/api/categories/${id}`, { name });
  return data;
}

export async function deleteCategory(id) {
  await api.delete(`/api/categories/${id}`);
}

