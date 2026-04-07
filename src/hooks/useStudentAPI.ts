"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';
import type { StudentStatusResponse, GetStudentClassroomResponse, JoinClassroomResponse } from '@/types';

export function useStudentAPI() {
  const { jwtToken } = useAuth();

  const getStudentStatus = useCallback(async () => {
    const { data, error } = await apiFetch<StudentStatusResponse>('/student', {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const getClassroomInfo = useCallback(async () => {
    const { data, error } = await apiFetch<GetStudentClassroomResponse>('/student/classroom', {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const joinClassroom = useCallback(async (classroomId: string) => {
    const { data, error } = await apiFetch<JoinClassroomResponse>('/student/classroom/join', {
      method: 'POST', body: JSON.stringify({ classroom_id: classroomId }),
    }, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  return { getStudentStatus, getClassroomInfo, joinClassroom, isAuthenticated: Boolean(jwtToken) };
}
