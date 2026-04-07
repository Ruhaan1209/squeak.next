"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';
import type { GetQuestionRequest, GetQuestionResponse, EvaluateAnswerRequest, EvaluateAnswerResponse } from '@/types';

export function useQnaAPI() {
  const { jwtToken } = useAuth();

  const getQuestion = useCallback(async (body: GetQuestionRequest) => {
    const { data, error } = await apiFetch<GetQuestionResponse>('/qna', {
      method: 'POST', body: JSON.stringify(body),
    }, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const evaluateQnA = useCallback(async (body: EvaluateAnswerRequest) => {
    const { data, error } = await apiFetch<EvaluateAnswerResponse>('/qna/evaluate', {
      method: 'POST', body: JSON.stringify(body),
    }, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  return { isAuthenticated: Boolean(jwtToken), getQuestion, evaluateQnA };
}
