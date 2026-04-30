import { useEffect, useState } from 'react';
import { verifyAccount } from '../api/auth';
import '../styles/VerifyAccountPage.css';

const STATES = {
  loading: {
    eyebrow: 'Verificando',
    title: 'Estamos verificando tu cuenta...',
    text: 'Por favor esperá un momento.',
    iconClass: 'is-loading',
  },
  success: {
    eyebrow: 'Todo listo',
    title: '¡Cuenta verificada!',
    iconClass: 'is-success',
  },
  error: {
    eyebrow: 'Algo salió mal',
    title: 'No se pudo verificar la cuenta',
    iconClass: 'is-error',
  },
};

function VerifyAccountPage() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function checkToken() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Token inválido o faltante.');
        return;
      }

      try {
        const data = await verifyAccount(token);
        setStatus('success');
        setMessage(
          data?.message ||
          'Tu cuenta fue verificada correctamente. Ya podés iniciar sesión.'
        );
      } catch (err) {
        console.error('Error verificando cuenta', err);
        const msg =
          err.response?.data?.message ||
          'No se pudo verificar tu cuenta. El enlace puede estar vencido o ser incorrecto.';
        setStatus('error');
        setMessage(msg);
      }
    }

    checkToken();
  }, []);

  function goToLogin() {
    window.location.href = '/';
  }

  const state = STATES[status];

  return (
    <div className="verify-outer">
      <div className={`verify-card is-${status}`}>
        <div className="verify-body">

          {/* ── Icono ── */}
          <div className={`verify-icon-wrap ${state.iconClass}`}>
            {status === 'loading' && <div className="verify-spinner" />}
            {status === 'success' && <span className="verify-icon">✓</span>}
            {status === 'error' && <span className="verify-icon">✕</span>}
          </div>

          {/* ── Textos ── */}
          <span className={`verify-eyebrow ${state.iconClass}`}>
            {state.eyebrow}
          </span>

          <h1 className="verify-title">{state.title}</h1>

          <p className="verify-text">
            {status === 'loading' ? state.text : message}
          </p>

          {/* ── Botón (solo en success y error) ── */}
          {status !== 'loading' && (
            <button className="verify-button" onClick={goToLogin}>
              {status === 'success' ? 'Ir al login →' : 'Volver al inicio →'}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default VerifyAccountPage;