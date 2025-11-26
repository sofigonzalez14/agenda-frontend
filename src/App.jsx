import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import CategoriesPage from './pages/CategoriesPage';

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login'); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setScreen('tasks');
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    setScreen('tasks');
  }

  function handleLogout() {
    setUser(null);
    setScreen('login');
  }

  if (!user) {
    if (screen === 'register') {
      return (
        <RegisterPage
          onGoToLogin={() => setScreen('login')}
        />
      );
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onGoToRegister={() => setScreen('register')}
      />
    );
  }

  if (screen === 'categories') {
    return (
      <CategoriesPage
        goBack={() => setScreen('tasks')}
      />
    );
  }
  return (
    <TasksPage
      user={user}
      onLogout={handleLogout}
      goToCategories={() => setScreen('categories')}
    />
  );
}

export default App;




