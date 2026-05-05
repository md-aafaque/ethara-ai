import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
        Manage Tasks with <span className="text-blue-600">Ethara AI</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-600">
        The ultimate team collaboration platform. Organize projects, assign tasks, and track progress all in one place.
      </p>
      <div className="mt-10 flex space-x-4">
        <Link 
          href="/auth/login"
          className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
        >
          Get Started
        </Link>
        <Link 
          href="/auth/signup"
          className="rounded-lg bg-white border border-slate-200 px-8 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
