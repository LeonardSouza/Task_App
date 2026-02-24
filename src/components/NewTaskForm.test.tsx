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
});

