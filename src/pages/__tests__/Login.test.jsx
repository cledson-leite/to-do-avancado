import "@testing-library/jest-dom"
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Mock das dependências
vi.mock('../../hooks/useAuth');
vi.mock('react-router-dom');

describe('Login Component', () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Resetar os mocks antes de cada teste
    vi.clearAllMocks();
    
    // Configurar os mocks
    useAuth.mockReturnValue({ login: mockLogin });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('deve renderizar corretamente os campos do formulário', () => {
    render(<Login />);
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/digite seu e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/digite sua senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve atualizar os campos de email e senha quando digitado', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'senha123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('senha123');
  });

  it('deve chamar a função de login e navegar para o dashboard ao submeter', async () => {
    const user = userEvent.setup();
    render(<Login />);

    // Preencher formulário
    await user.type(screen.getByPlaceholderText(/digite seu e-mail/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/digite sua senha/i), 'senha123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // Verificar chamadas
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'senha123');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('não deve permitir submissão com campos vazios', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    // Tentar submeter sem preencher campos
    await user.click(submitButton);
    
    // Verificar que a função login não foi chamada
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});