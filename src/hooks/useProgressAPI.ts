"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';
import type { TodayProgressResponse, IncrementProgressResponse, StreakResponse } from '@/types';

export function useProgressAPI() {
  const { jwtToken } = useAuth();

  const getProgress = useCallback(async () => {
    const { data, error } = await apiFetch<TodayProgressResponse>('/progress', {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const incrementProgress = useCallback(async (amount: number) => {
    const { data, error } = await apiFetch<IncrementProgressResponse>(
      `/progress/increment?amount=${amount}`, {}, jwtToken
    );
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const getStreak = useCallback(async () => {
    const { data, error } = await apiFetch<StreakResponse>('/progress/streak', {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  return { isAuthenticated: Boolean(jwtToken), getProgress, incrementProgress, getStreak };
}
