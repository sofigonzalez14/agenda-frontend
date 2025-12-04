import { useEffect, useState } from 'react';
import { verifyAccount } from '../api/auth';
import '../styles/VerifyAccountPage.css';

function VerifyAccountPage() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
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
        setStatus('loading');
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

  return (
    <div className="verify-outer">
      <div className="verify-card">
        {status === 'loading' && (
          <>
            <div className="verify-icon verify-loading">⏳</div>
            <h1 className="verify-title">Verificando tu cuenta...</h1>
            <p className="verify-text">Por favor esperá un momento.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="verify-icon verify-success">✅</div>
            <h1 className="verify-title">¡Cuenta verificada!</h1>
            <p className="verify-text">{message}</p>
            <button className="verify-button" onClick={goToLogin}>
              Ir al login
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="verify-icon verify-error">❌</div>
            <h1 className="verify-title">No se pudo verificar la cuenta</h1>
            <p className="verify-text">{message}</p>
            <button className="verify-button" onClick={goToLogin}>
              Volver al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyAccountPage;

