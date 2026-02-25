import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Task } from '../models/task';
import { NewTaskForm } from './NewTaskForm';

describe('NewTaskForm', () => {
  it('cria tarefa quando título é preenchido e chama onCreate', () => {
    const handleCreate = vi.fn<(task: Task) => void>();

    render(<NewTaskForm onCreate={handleCreate} />);

    const titleInput = screen.getByLabelText(/título \*/i);
    const submitButton = screen.getByRole('button', { name: /criar tarefa/i });

    fireEvent.change(titleInput, { target: { value: 'Nova tarefa' } });
    fireEvent.click(submitButton);

    expect(handleCreate).toHaveBeenCalledTimes(1);
    const createdTask = handleCreate.mock.calls[0][0];
    expect(createdTask.title).toBe('Nova tarefa');
    expect(createdTask.completed).toBe(false);
  });

  it('exibe mensagem de erro quando tenta criar sem título', () => {
    const handleCreate = vi.fn<(task: Task) => void>();

    render(<NewTaskForm onCreate={handleCreate} />);

    const submitButton = screen.getByRole('button', { name: /criar tarefa/i });

    fireEvent.click(submitButton);

    expect(handleCreate).not.toHaveBeenCalled();
    expect(
      screen.getByText(/título da tarefa é obrigatório/i)
    ).toBeInTheDocument();
  });

  it('salva data de vencimento usando atalho Amanhã', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 25, 10, 0, 0)); // 25/02/2026

    const handleCreate = vi.fn<(task: Task) => void>();
    render(<NewTaskForm onCreate={handleCreate} />);

    fireEvent.change(screen.getByLabelText(/título \*/i), {
      target: { value: 'Tarefa com vencimento' }
    });

    fireEvent.click(screen.getByRole('button', { name: /amanhã/i }));
    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));

    expect(handleCreate).toHaveBeenCalledTimes(1);
    expect(handleCreate.mock.calls[0][0].dueDate).toBe('2026-02-26');

    vi.useRealTimers();
  });
});

