"use client";
// web/context/TeamContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface Team {
  id: string;
  name: string;
}

interface TeamContextType {
  teams: Team[];
  activeTeam: Team | null;
  setActiveTeam: (team: Team) => void;
  refreshTeams: () => Promise<void>;
  isLoading: boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTeams = async () => {
    try {
      const data = await apiFetch('/teams');
      setTeams(data);
      if (data.length > 0 && !activeTeam) {
        // Default to first team or previously stored team
        const savedTeamId = localStorage.getItem('activeTeamId');
        const found = data.find((t: Team) => t.id === savedTeamId) || data[0];
        setActiveTeam(found);
      }
    } catch (err) {
      console.error('Failed to fetch teams', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTeams();
  }, []);

  useEffect(() => {
    if (activeTeam) {
      localStorage.setItem('activeTeamId', activeTeam.id);
    }
  }, [activeTeam]);

  return (
    <TeamContext.Provider value={{ teams, activeTeam, setActiveTeam, refreshTeams, isLoading }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
