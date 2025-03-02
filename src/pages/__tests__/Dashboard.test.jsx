import "@testing-library/jest-dom"
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { useAuth } from '../../hooks/useAuth';
import { useTask } from '../../hooks/useTask';
import { useNavigate } from 'react-router-dom';

// Mock das dependências
vi.mock('../../hooks/useAuth');
vi.mock('../../hooks/useTask');
vi.mock('react-router-dom');

describe('Dashboard Component', () => {
  const mockLogout = vi.fn();
  const mockNavigate = vi.fn();
  const mockAddTask = vi.fn();
  const mockToggleTask = vi.fn();
  const mockDeleteTask = vi.fn();

  const mockUser = { email: 'user@test.com' };
  const mockTasks = [
    { id: 1, title: 'Tarefa 1', completed: false },
    { id: 2, title: 'Tarefa 2', completed: true },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    useAuth.mockReturnValue({ 
      user: mockUser, 
      logout: mockLogout 
    });
    
    useTask.mockReturnValue({ 
      tasks: mockTasks,
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
    });
    
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('deve renderizar corretamente as informações do usuário', () => {
    render(<Dashboard />);
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(`Bem-vindo, ${mockUser.email}!`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument();
  });

  it('deve fazer logout ao clicar no botão sair', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    await user.click(screen.getByRole('button', { name: /sair/i }));
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('deve adicionar nova tarefa corretamente', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    const input = screen.getByPlaceholderText(/nova tarefa/i);
    const addButton = screen.getByRole('button', { name: /adicionar/i });

    await user.type(input, 'Nova tarefa teste');
    await user.click(addButton);

    expect(mockAddTask).toHaveBeenCalledWith('Nova tarefa teste');
    expect(input).toHaveValue('');
  });

  it('deve alternar o estado de completado da tarefa', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    const taskItems = screen.getAllByRole('listitem');
    await user.click(taskItems[0].querySelector('span'));
    
    expect(mockToggleTask).toHaveBeenCalledWith(1);
  });

  it('deve deletar tarefa ao clicar no botão de exclusão', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    const deleteButtons = screen.getAllByRole('button', { name: /❌/i });
    await user.click(deleteButtons[0]);
    
    expect(mockDeleteTask).toHaveBeenCalledWith(1);
    expect(screen.getByText(/tarefa excluída/i)).toBeInTheDocument();
  });

  it('deve mostrar mensagens de sucesso', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    // Teste de mensagem de sucesso
    await user.type(screen.getByPlaceholderText(/nova tarefa/i), 'Tarefa válida');
    await user.click(screen.getByRole('button', { name: /adicionar/i }));
    expect(screen.getByText(/Tarefa adicionada com sucesso!/i)).toBeInTheDocument();
  });

  it('não deve adicionar tarefa vazia', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    const addButton = screen.getByRole('button', { name: /adicionar/i });
    await user.click(addButton);
    
    expect(mockAddTask).not.toHaveBeenCalled();
  });
});