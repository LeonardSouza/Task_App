import { useEffect, useState } from 'react';
import type { Task } from './models/task';
import { NewTaskForm } from './components/NewTaskForm';
import { TaskList } from './components/TaskList';
import './styles.css';

type Filter = 'all' | 'pending' | 'completed';
type ActiveTab = 'tasks' | 'new';

const STORAGE_KEY = 'task_app.tasks';

function loadInitialTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadInitialTasks());
  const [filter, setFilter] = useState<Filter>('all');
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleCreate = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    setActiveTab('tasks');
  };

  const handleToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task App</h1>
        <p>Organize suas tarefas diárias em um só lugar.</p>
      </header>
      <main>
        <div className="tabs">
        <button
            type="button"
            className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            Nova tarefa
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Minhas tarefas
          </button>
          
        </div>

        <div className="tab-panels">
          {activeTab === 'tasks' && (
            <TaskList
              tasks={tasks}
              filter={filter}
              onFilterChange={setFilter}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'new' && <NewTaskForm onCreate={handleCreate} />}
        </div>
      </main>
    </div>
  );
}

