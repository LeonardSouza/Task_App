import { describe, expect, it } from 'vitest';
import { createTask, type Priority } from './task';

describe('createTask', () => {
  it('cria uma tarefa válida quando o título é preenchido', () => {
    const task = createTask({
      title: 'Estudar React',
      description: 'Revisar hooks principais',
      dueDate: '2026-02-24',
      priority: 'high'
    });

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Estudar React');
    expect(task.description).toBe('Revisar hooks principais');
    expect(task.dueDate).toBe('2026-02-24');
    expect(task.priority).toBe<'high'>('high' as Priority);
    expect(task.completed).toBe(false);
  });

  it('remove espaços em branco do título e descrição', () => {
    const task = createTask({
      title: '   Lavar louça   ',
      description: '   depois do almoço   '
    });

    expect(task.title).toBe('Lavar louça');
    expect(task.description).toBe('depois do almoço');
  });

  it('lança erro quando o título é vazio ou só espaços', () => {
    expect(() => createTask({ title: '' })).toThrowError(
      /título da tarefa é obrigatório/i
    );
    expect(() => createTask({ title: '   ' })).toThrowError(
      /título da tarefa é obrigatório/i
    );
  });

  it('usa prioridade média como padrão quando não informada', () => {
    const task = createTask({ title: 'Tarefa sem prioridade explícita' });
    expect(task.priority).toBe<'medium'>('medium' as Priority);
  });
});

