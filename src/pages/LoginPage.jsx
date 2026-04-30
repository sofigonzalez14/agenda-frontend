import { useState } from 'react';
import { login } from '../api/auth';
import '../styles/loginPage.css';
import { useTheme } from '../hooks/Usetheme';

function LoginPage({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { theme, toggleTheme } = useTheme();
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (onLogin) onLogin(data.user);
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
      <button className="btn-outline" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>
      <div className="auth-card">

        {/* ── Panel izquierdo ── */}
        <div className="auth-side-panel">
          <div className="auth-side-brand">
            ✓ Taskly <span>app</span>
          </div>
          <div className="auth-side-tagline">
            <h2>Organizá tu mundo, una tarea a la vez.</h2>
            <p>Categorías, prioridades y fechas límite en un solo lugar.</p>
          </div>
          <div className="auth-side-pills">
            <div className="auth-side-pill">Categorías con color</div>
            <div className="auth-side-pill">Prioridades visuales</div>
            <div className="auth-side-pill">Siempre sincronizado</div>
          </div>
        </div>

        {/* ── Panel derecho: formulario ── */}
        <div className="auth-form-panel">
          <div className="auth-eyebrow">Bienvenido</div>
          <h1 className="auth-title">Iniciá sesión</h1>
          <p className="auth-subtitle">Continuá donde lo dejaste.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="tu@email.com"
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
                placeholder="••••••••"
                required
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-primary-btn">
              Ingresar →
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
    </div>
  );
}

export default LoginPage;