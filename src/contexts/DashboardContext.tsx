"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { apiFetch } from '@/lib/api-client';

interface ClassroomItem {
  classroom_id: string;
  name: string;
  students_count?: number;
}

interface DashboardContextType {
  profileUsername: string;
  isProfileLoading: boolean;
  classrooms: ClassroomItem[];
  selectedClassroom: ClassroomItem | null;
  setSelectedClassroom: (c: ClassroomItem | null) => void;
  fetchClassrooms: () => Promise<void>;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { jwtToken } = useAuth();
  const { showNotification } = useNotification();

  const [profileUsername, setProfileUsername] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomItem | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchClassrooms = async () => {
    if (!jwtToken) return;
    const { data } = await apiFetch<{ classrooms: ClassroomItem[] }>('/teacher/classroom', {}, jwtToken);
    if (data?.classrooms) {
      setClassrooms(data.classrooms);
      if (!selectedClassroom && data.classrooms.length > 0) {
        setSelectedClassroom(data.classrooms[0]);
      }
    }
  };

  useEffect(() => {
    if (!jwtToken) return;

    const loadProfile = async () => {
      setIsProfileLoading(true);
      try {
        const { data } = await apiFetch<{ username: string }>('/profile', {}, jwtToken);
        if (data?.username) {
          setProfileUsername(data.username);
        }
      } catch {
        showNotification('Failed to load profile', 'error');
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadProfile();
    fetchClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwtToken]);

  return (
    <DashboardContext.Provider
      value={{
        profileUsername,
        isProfileLoading,
        classrooms,
        selectedClassroom,
        setSelectedClassroom,
        fetchClassrooms,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
