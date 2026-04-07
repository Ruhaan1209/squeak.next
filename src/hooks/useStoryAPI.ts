"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';
import type { GetStoryPageResponse, GetStoryQNAContextResponse, StoryItem } from '@/types';

export function useStoryAPI() {
  const { jwtToken } = useAuth();

  const getStory = useCallback(async (params: { id: string; page: string }) => {
    const qs = new URLSearchParams(params).toString();
    const { data, error } = await apiFetch<GetStoryPageResponse>(`/story?${qs}`, {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const getStoryQnAContext = useCallback(async (id: string) => {
    const { data, error } = await apiFetch<GetStoryQNAContextResponse>(`/story/context?id=${id}`, {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const queryStories = useCallback(async (params: {
    language: string; cefr: string; subject: string; page: string; pagesize: string;
  }) => {
    const qs = new URLSearchParams(params).toString();
    const { data, error } = await apiFetch<StoryItem[]>(`/story/query?${qs}`, {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  return { isAuthenticated: Boolean(jwtToken), getStory, getStoryQnAContext, queryStories };
}
