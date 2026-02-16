import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useChatStore } from '../stores/useChatStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/user/check');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/user/login', { email, password });
    await checkAuth();
    return data;
  };

  const register = async (fullname, email, password) => {
    const { data } = await api.post('/user/register', { fullname, email, password });
    await checkAuth();
    return data;
  };

  const logout = async () => {
    await api.post('/user/logout');
    setUser(null);
    useChatStore.getState().reset?.();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
