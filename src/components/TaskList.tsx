import type { Task } from '../models/task';

type Filter = 'all' | 'pending' | 'completed';

interface TaskListProps {
  tasks: Task[];
  filter: Filter;
  onFilterChange(filter: Filter): void;
  onToggle(taskId: string): void;
  onDelete(taskId: string): void;
}

export function TaskList({
  tasks,
  filter,
  onFilterChange,
  onToggle,
  onDelete
}: TaskListProps) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const parseIsoToLocalDate = (value: string) => {
    const [y, m, d] = value.split('-').map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
    return new Date(value);
  };

  const formatDate = (value?: string) => {
    if (!value) return '';
    try {
      const date = parseIsoToLocalDate(value);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return value;
    }
  };

  const getDueDateBadge = (value?: string) => {
    if (!value) return null;

    const parsed = parseIsoToLocalDate(value);
    if (Number.isNaN(parsed.getTime())) {
      return { label: value, className: 'neutral' as const };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateOnly = new Date(parsed);
    dateOnly.setHours(0, 0, 0, 0);

    if (dateOnly.getTime() < today.getTime()) {
      return {
        label: `Atrasada · ${formatDate(value)}`,
        className: 'overdue' as const
      };
    }

    if (dateOnly.getTime() === today.getTime()) {
      return {
        label: 'Hoje',
        className: 'today' as const
      };
    }

    return {
      label: `Até ${formatDate(value)}`,
      className: 'future' as const
    };
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    if (priority === 'high') return 'Alta';
    if (priority === 'low') return 'Baixa';
    return 'Média';
  };

  return (
    <section className="task-list">
      <header className="task-list-header">
        <h2>Tarefas</h2>
        <div className="filters">
          <button
            type="button"
            className={filter === 'all' ? 'active' : ''}
            onClick={() => onFilterChange('all')}
          >
            Todas
          </button>
          <button
            type="button"
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => onFilterChange('pending')}
          >
            Pendentes
          </button>
          <button
            type="button"
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => onFilterChange('completed')}
          >
            Concluídas
          </button>
        </div>
      </header>

      {filteredTasks.length === 0 ? (
        <p className="empty-state">Nenhuma tarefa para exibir.</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <div className="task-main">
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                  />
                  <span className="task-title">{task.title}</span>
                </label>
                <button
                  type="button"
                  className="icon-button delete-button"
                  aria-label="Excluir tarefa"
                  onClick={() => onDelete(task.id)}
                >
                  ✕
                </button>
              </div>
              <div className="task-meta">
                {task.priority && (
                  <span className={`priority ${task.priority}`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                )}
                {(() => {
                  const badge = getDueDateBadge(task.dueDate);
                  if (!badge) return null;
                  return (
                    <span className={`due-date ${badge.className}`}>
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

