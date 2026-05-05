"use client";
// web/components/ProjectBoard.tsx
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { AlertCircle, Clock, User as UserIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assignee?: {
    id: string;
    name: string;
  };
}

const columns = [
  { id: 'TODO', title: 'To Do', color: 'bg-slate-100' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50' },
  { id: 'DONE', title: 'Done', color: 'bg-green-50' },
];

export function ProjectBoard({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await apiFetch(`/tasks?projectId=${projectId}`);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks(); // Refresh board
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) return <div className="py-10 text-center text-slate-500">Loading board...</div>;

  return (
    <div className="flex h-full space-x-6 overflow-x-auto pb-8">
      {columns.map((column) => (
        <div key={column.id} className="flex w-80 flex-shrink-0 flex-col">
          <div className="mb-4 flex items-center justify-between px-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              {column.title} <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                {tasks.filter((t) => t.status === column.id).length}
              </span>
            </h3>
          </div>

          <div className={clsx("flex-1 space-y-4 rounded-xl p-3", column.color)}>
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                    {task.priority === 'HIGH' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-500">{task.description}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                        <UserIcon className="h-3 w-3 text-slate-400" />
                      </div>
                      <span className="text-[10px] font-medium text-slate-600">
                        {task.assignee?.name || 'Unassigned'}
                      </span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center text-[10px] text-slate-400">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Status Switcher (Action) */}
                  <div className="mt-4 flex space-x-2 border-t pt-3">
                    {columns
                      .filter((c) => c.id !== task.status)
                      .map((c) => (
                        <button
                          key={c.id}
                          onClick={() => updateTaskStatus(task.id, c.id)}
                          className="rounded px-2 py-1 text-[10px] font-bold text-slate-400 transition-colors hover:bg-slate-50 hover:text-blue-600"
                        >
                          Move to {c.title}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
