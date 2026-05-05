"use client";
// web/app/projects/page.tsx
import { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { Plus, Briefcase, ChevronRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  _count: {
    tasks: number;
  };
}

export default function ProjectsPage() {
  const { activeTeam } = useTeam();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeTeam) {
      async function fetchProjects() {
        try {
          const data = await apiFetch(`/projects?teamId=${activeTeam!.id}`);
          setProjects(data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
      fetchProjects();
    }
  }, [activeTeam]);

  if (!activeTeam) return <div className="text-slate-500">Please select a team to view projects.</div>;
  if (isLoading) return <div className="text-slate-500">Loading projects...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500">Manage your team's work buckets.</p>
        </div>
        {/* Only show if User is Admin for activeTeam (RBAC logic can be added here) */}
        <button className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
          >
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{project._count.tasks} Tasks</p>
            </div>
            <div className="mt-6 flex items-center text-sm font-medium text-blue-600">
              Go to board <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full rounded-xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-500">
            No projects found in this team.
          </div>
        )}
      </div>
    </div>
  );
}
