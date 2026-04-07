"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';
import type {
  TranslateRequest, TranslateResponse,
  TextToSpeechRequest, TextToSpeechResponse,
  SpeechToTextRequest, SpeechToTextResponse,
  AudiobookResponse, AudioHealthResponse,
} from '@/types';

export function useAudioAPI() {
  const { jwtToken } = useAuth();

  const pingAudio = useCallback(async () => {
    const { data, error } = await apiFetch<AudioHealthResponse>('/audio', {}, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const translate = useCallback(async (body: TranslateRequest) => {
    const { data, error } = await apiFetch<TranslateResponse>('/audio/translate', {
      method: 'POST', body: JSON.stringify(body),
    }, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const tts = useCallback(async (body: TextToSpeechRequest) => {
    return apiFetch<TextToSpeechResponse>('/audio/tts', {
      method: 'POST', body: JSON.stringify(body),
    }, jwtToken);
  }, [jwtToken]);

  const stt = useCallback(async (body: SpeechToTextRequest) => {
    return apiFetch<SpeechToTextResponse>('/audio/stt', {
      method: 'POST', body: JSON.stringify(body),
    }, jwtToken);
  }, [jwtToken]);

  const getAudiobook = useCallback(async (params: {
    news_id?: string; story_id?: string; type: string; page: string;
  }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<AudiobookResponse>(`/audio/audiobook?${qs}`, {}, jwtToken);
  }, [jwtToken]);

  return { isAuthenticated: Boolean(jwtToken), pingAudio, translate, tts, stt, getAudiobook };
}
