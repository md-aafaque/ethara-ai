"use client";
// web/app/projects/[projectId]/page.tsx
import { useParams } from 'next/navigation';
import { ProjectBoard } from '@/components/ProjectBoard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/projects" 
          className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-slate-400 shadow-sm transition-colors hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Board</h1>
          <p className="text-xs text-slate-500">ID: {projectId}</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ProjectBoard projectId={projectId} />
      </div>
    </div>
  );
}
