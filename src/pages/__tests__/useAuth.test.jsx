// useAuth.test.js
import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useAuth Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  it('deve retornar null para usuário quando não autenticado', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.user).toBeNull();
  });

  it('deve carregar usuário do localStorage na inicialização', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
  });

  it('deve realizar login corretamente', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      result.current.login('test@example.com', 'password123');
    });
    
    expect(result.current.user).toEqual({
      id: 1,
      email: 'test@example.com',
      password: 'password123'
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(result.current.user)
    );
  });

  it('deve realizar logout corretamente', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('não deve realizar login com credenciais inválidas', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      result.current.login('', '');
    });
    
    expect(result.current.user).toBeNull();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});