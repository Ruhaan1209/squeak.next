"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';
import type {
  BillingAccountResponse, BillingAccountUsageResponse,
  CreateIndividualCheckoutSessionResponse, CancelIndividualSubscriptionResponse,
} from '@/types';

export function useBillingAPI() {
  const { jwtToken } = useAuth();

  const getBillingAccount = useCallback(async () => {
    return apiFetch<BillingAccountResponse>('/billing', {}, jwtToken);
  }, [jwtToken]);

  const getBillingAccountUsage = useCallback(async (plan: string) => {
    return apiFetch<BillingAccountUsageResponse>(`/billing/usage?plan=${plan}`, {}, jwtToken);
  }, [jwtToken]);

  const createCheckoutSession = useCallback(async () => {
    return apiFetch<CreateIndividualCheckoutSessionResponse>('/billing/create-checkout-session', {
      method: 'POST', body: JSON.stringify({}),
    }, jwtToken);
  }, [jwtToken]);

  const cancelSubscriptionAtEndOfPeriod = useCallback(async () => {
    return apiFetch<CancelIndividualSubscriptionResponse>('/billing/cancel-subscription-eop', {
      method: 'POST', body: JSON.stringify({}),
    }, jwtToken);
  }, [jwtToken]);

  return { getBillingAccount, getBillingAccountUsage, createCheckoutSession, cancelSubscriptionAtEndOfPeriod };
}
