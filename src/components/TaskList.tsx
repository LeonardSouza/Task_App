import type { Task } from '../models/task';

type Filter = 'all' | 'pending' | 'completed';

interface TaskListProps {
  tasks: Task[];
  filter: Filter;
  onFilterChange(filter: Filter): void;
  onToggle(taskId: string): void;
}

export function TaskList({
  tasks,
  filter,
  onFilterChange,
  onToggle
}: TaskListProps) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const formatDate = (value?: string) => {
    if (!value) return '';
    try {
      const date = new Date(value);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return value;
    }
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
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                />
                <span className="task-title">{task.title}</span>
              </label>
              <div className="task-meta">
                {task.priority && (
                  <span className={`priority ${task.priority}`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                )}
                {task.dueDate && (
                  <span className="due-date">
                    Vence em {formatDate(task.dueDate)}
                  </span>
                )}
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

