export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  completed: boolean;
}

export function createTask(input: {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
}): Task {
  const title = input.title.trim();

  if (!title) {
    throw new Error('O título da tarefa é obrigatório.');
  }

  return {
    id: crypto.randomUUID(),
    title,
    description: input.description?.trim() || undefined,
    dueDate: input.dueDate || undefined,
    priority: input.priority ?? 'medium',
    completed: false
  };
}

