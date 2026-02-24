import { useEffect, useState } from 'react';
import type { Task } from './models/task';
import { NewTaskForm } from './components/NewTaskForm';
import { TaskList } from './components/TaskList';
import './styles.css';

type Filter = 'all' | 'pending' | 'completed';

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

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleCreate = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task App</h1>
        <p>Organize suas tarefas diárias em um só lugar.</p>
      </header>
      <main>
        <NewTaskForm onCreate={handleCreate} />
        <TaskList
          tasks={tasks}
          filter={filter}
          onFilterChange={setFilter}
          onToggle={handleToggle}
        />
      </main>
    </div>
  );
}

