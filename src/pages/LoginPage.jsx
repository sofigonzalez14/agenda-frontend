import { useState } from 'react';
import { login } from '../api/auth';
import '../styles/LoginPage.css';

function LoginPage({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (onLogin) {
        onLogin(data.user);
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        'Credenciales inválidas, cuenta no verificada o error del servidor';
      setError(msg);
    }
  }

  return (
    <div className="auth-outer">
      <div className="auth-card">
        <h1 className="auth-title">Mi Agenda de Tareas</h1>
        <p className="auth-subtitle">
          Iniciá sesión para gestionar tus tareas y categorías
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </label>

          <label className="auth-label">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-primary-btn">
            Ingresar
          </button>
        </form>

        <p className="auth-switch-text">
          ¿No tenés cuenta?{' '}
          <button
            type="button"
            onClick={onGoToRegister}
            className="auth-link-btn"
          >
            Registrarse
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;


