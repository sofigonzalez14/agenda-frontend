import api from './client';

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data; // { message, token, user }
}

export async function registerUser(name, email, password) {
  const { data } = await api.post('/api/auth/register', {
    name,
    email,
    password,
  });
  return data; // { message, ... } según tu backend
}
