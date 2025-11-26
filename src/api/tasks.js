import api from './client';

export async function getTasks() {
  const { data } = await api.get('/api/tasks');
  return data;
}

export async function createTask(task) {
  const { data } = await api.post('/api/tasks', task);
  return data;
}

export async function deleteTask(id) {
  await api.delete(`/api/tasks/${id}`);
}

export async function updateTask(id, task) {
  const { data } = await api.put(`/api/tasks/${id}`, task);
  return data;
}
