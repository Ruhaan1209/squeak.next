"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';
import type { GetProfileResponse, UpsertProfileRequest, UpsertProfileResponse } from '@/types';

export function useProfileAPI() {
  const { jwtToken } = useAuth();

  const getProfile = useCallback(async () => {
    return apiFetch<GetProfileResponse>('/profile', {}, jwtToken);
  }, [jwtToken]);

  const upsertProfile = useCallback(async (body: UpsertProfileRequest) => {
    const { data, error } = await apiFetch<UpsertProfileResponse>('/profile/upsert', {
      method: 'POST',
      body: JSON.stringify(body),
    }, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  return { getProfile, upsertProfile, isAuthenticated: Boolean(jwtToken) };
}
