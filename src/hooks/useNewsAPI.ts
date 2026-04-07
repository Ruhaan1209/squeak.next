"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';
import type { GetNewsResponse, NewsItem } from '@/types';

export function useNewsAPI() {
  const { jwtToken } = useAuth();

  const getNews = useCallback(async (id: string) => {
    const { data, error } = await apiFetch<GetNewsResponse>(`/news?id=${id}`, {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const queryNews = useCallback(async (params: {
    language: string; cefr: string; subject: string; page: string; pagesize: string;
  }) => {
    const qs = new URLSearchParams(params).toString();
    const { data, error } = await apiFetch<NewsItem[]>(`/news/query?${qs}`, {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  return { isAuthenticated: Boolean(jwtToken), getNews, queryNews };
}
