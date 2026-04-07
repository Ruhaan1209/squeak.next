"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';
import type {
  TeacherStatusResponse, GetClassroomListResponse, ClassroomContentItem,
  AcceptContentRequest, AcceptContentResponse, RejectContentRequest, RejectContentResponse,
} from '@/types';

export function useTeacherAPI() {
  const { jwtToken } = useAuth();

  const verifyTeacher = useCallback(async () => {
    const { data, error } = await apiFetch<TeacherStatusResponse>('/teacher', {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const getClassroomList = useCallback(async () => {
    const { data, error } = await apiFetch<GetClassroomListResponse>('/teacher/classroom', {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const fetchContent = useCallback(async (params: {
    language: string; cefr: string; subject: string; page: string;
    pagesize: string; whitelist: string; classroom_id: string;
  }) => {
    const qs = new URLSearchParams({ ...params, content_type: 'All' }).toString();
    const { data, error } = await apiFetch<ClassroomContentItem[]>(`/teacher/classroom/content?${qs}`, {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const acceptContent = useCallback(async (body: AcceptContentRequest) => {
    const { data, error } = await apiFetch<AcceptContentResponse>('/teacher/classroom/accept', {
      method: 'POST', body: JSON.stringify(body),
    }, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const rejectContent = useCallback(async (body: RejectContentRequest) => {
    const { data, error } = await apiFetch<RejectContentResponse>('/teacher/classroom/reject', {
      method: 'POST', body: JSON.stringify(body),
    }, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  return { isAuthenticated: Boolean(jwtToken), verifyTeacher, getClassroomList, fetchContent, acceptContent, rejectContent };
}
