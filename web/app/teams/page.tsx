"use client";
// web/app/teams/page.tsx
import { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import { apiFetch } from '@/lib/api';
import { Plus, Users, Shield, User as UserIcon, Mail, Trash2 } from 'lucide-react';

interface TeamMember {
  id: string;
  role: 'ADMIN' | 'MEMBER';
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface TeamDetails {
  id: string;
  name: string;
  members: TeamMember[];
}

export default function TeamsPage() {
  const { teams, activeTeam, refreshTeams } = useTeam();
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTeam) {
      fetchTeamDetails(activeTeam.id);
    }
  }, [activeTeam]);

  async function fetchTeamDetails(teamId: string) {
    setIsLoading(true);
    try {
      const data = await apiFetch(`/teams/${teamId}`);
      setTeamDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam) return;
    setError('');
    
    try {
      await apiFetch(`/teams/${activeTeam.id}/members`, {
        method: 'POST',
        body: JSON.stringify({ email: newMemberEmail, role: 'MEMBER' }),
      });
      setNewMemberEmail('');
      setIsAddingMember(false);
      fetchTeamDetails(activeTeam.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeTeam || !confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await apiFetch(`/teams/${activeTeam.id}/members/${userId}`, {
        method: 'DELETE',
      });
      fetchTeamDetails(activeTeam.id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!activeTeam) return <div className="text-slate-500">Please select a team.</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{activeTeam.name}</h1>
          <p className="text-slate-500">Manage team members and roles.</p>
        </div>
        <button 
          onClick={() => setIsAddingMember(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </button>
      </div>

      {isAddingMember && (
        <div className="rounded-xl border bg-blue-50 p-6">
          <h3 className="text-sm font-bold text-blue-900 mb-4">Add New Member</h3>
          <form onSubmit={handleAddMember} className="flex gap-4">
            <div className="flex-1">
              <input
                type="email"
                required
                placeholder="User email address"
                className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
              {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Invite
            </button>
            <button
              type="button"
              onClick={() => setIsAddingMember(false)}
              className="rounded-lg bg-white border border-blue-200 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {teamDetails?.members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <span className="font-medium text-slate-900">{member.user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{member.user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {member.role === 'ADMIN' ? (
                        <Shield className="h-3 w-3 text-blue-600 mr-1.5" />
                      ) : (
                        <Users className="h-3 w-3 text-slate-400 mr-1.5" />
                      )}
                      <span className={member.role === 'ADMIN' ? 'font-bold text-blue-600' : ''}>
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleRemoveMember(member.user.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">Loading team members...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
