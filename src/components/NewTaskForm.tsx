import { useState } from 'react';
import type { Priority, Task } from '../models/task';
import { createTask } from '../models/task';

interface NewTaskFormProps {
  onCreate(task: Task): void;
}

export function NewTaskForm({ onCreate }: NewTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const task = createTask({ title, description, dueDate, priority });
      onCreate(task);
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-task-form">
      <div className="field">
        <label htmlFor="title">Título *</label>
        <input
          id="title"
          placeholder="Digite o título da tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          placeholder="Detalhes opcionais"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="dueDate">Data de vencimento</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="priority">Prioridade</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="primary-button">
        Criar tarefa
      </button>
    </form>
  );
}

