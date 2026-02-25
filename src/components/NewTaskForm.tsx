import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

  const isoToLocalDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const localDateToIso = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleQuickDate = (type: 'today' | 'tomorrow' | 'none') => {
    if (type === 'none') {
      setDueDate('');
      return;
    }

    const base = new Date();
    if (type === 'tomorrow') {
      base.setDate(base.getDate() + 1);
    }

    setDueDate(localDateToIso(base));
  };

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
    <form onSubmit={handleSubmit} className="new-task-form" noValidate>
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
          <DatePicker
            id="dueDate"
            selected={dueDate ? isoToLocalDate(dueDate) : null}
            onChange={(date) => {
              if (!date) {
                setDueDate('');
                return;
              }
              setDueDate(localDateToIso(date));
            }}
            minDate={new Date(new Date().setHours(0, 0, 0, 0))}
            placeholderText="Selecione uma data"
            className="datepicker-input"
            dateFormat="dd/MM/yyyy"
          />
          <div className="quick-date-row">
            <span className="quick-date-label">Atalhos:</span>
            <button
              type="button"
              className="chip-button"
              onClick={() => handleQuickDate('today')}
            >
              Hoje
            </button>
            <button
              type="button"
              className="chip-button"
              onClick={() => handleQuickDate('tomorrow')}
            >
              Amanhã
            </button>
            <button
              type="button"
              className="chip-button subtle"
              onClick={() => handleQuickDate('none')}
            >
              Sem data
            </button>
          </div>
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

