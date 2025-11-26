import { useState } from 'react';
import { registerUser } from '../api/auth';
import '../styles/LoginPage.css'; 

function RegisterPage({ onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await registerUser(name, email, password);

      setMessage(
        'Registro realizado. Podés iniciar sesión con tus credenciales.'
      );
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        'No se pudo registrar el usuario. Probá con otro email o más tarde.';
      setError(msg);
    }
  }

  return (
    <div className="auth-outer">
      <div className="auth-card">
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Registrate para usar tu agenda</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Nombre
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"  
              required
            />
          </label>

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

          <label className="auth-label">
            Repetir contraseña
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"   
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button type="submit" className="auth-primary-btn">
            Crear cuenta
          </button>
        </form>

        <p className="auth-switch-text">
          ¿Ya tenés cuenta?{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            className="auth-link-btn"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;


