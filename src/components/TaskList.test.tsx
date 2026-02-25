import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Task } from '../models/task';
import { TaskList } from './TaskList';

describe('TaskList - datas de vencimento', () => {
  it('renderiza badges de vencimento para atrasada, hoje e futura', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 25, 12, 0, 0)); // 25/02/2026

    const tasks: Task[] = [
      {
        id: '1',
        title: 'Atrasada',
        completed: false,
        priority: 'medium',
        dueDate: '2026-02-24'
      },
      {
        id: '2',
        title: 'Hoje',
        completed: false,
        priority: 'medium',
        dueDate: '2026-02-25'
      },
      {
        id: '3',
        title: 'Futura',
        completed: false,
        priority: 'medium',
        dueDate: '2026-02-26'
      }
    ];

    render(
      <TaskList
        tasks={tasks}
        filter="all"
        onFilterChange={() => undefined}
        onToggle={() => undefined}
        onDelete={() => undefined}
      />
    );

    expect(screen.getByText(/^Atrasada ·/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^Hoje$/i)).toHaveLength(2);
    expect(screen.getByText(/^Até /i)).toBeInTheDocument();

    vi.useRealTimers();
  });
});

