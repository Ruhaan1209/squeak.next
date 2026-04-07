"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';
import type {
  OrganizationResponse, CreateOrganizationResponse, JoinOrganizationResponse,
  CreateCheckoutSessionResponse, CancelSubscriptionResponse,
} from '@/types';

export function useOrganizationAPI() {
  const { jwtToken } = useAuth();

  const getOrganization = useCallback(async () => {
    return apiFetch<OrganizationResponse>('/organization', {}, jwtToken);
  }, [jwtToken]);

  const createOrganization = useCallback(async () => {
    const { data, error } = await apiFetch<CreateOrganizationResponse>('/organization/create', {
      method: 'POST', body: JSON.stringify({}),
    }, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const joinOrganization = useCallback(async (orgId: string) => {
    const { data, error } = await apiFetch<JoinOrganizationResponse>('/organization/join', {
      method: 'POST', body: JSON.stringify({ organization_id: orgId }),
    }, jwtToken);
    if (error) throw error;
    return data!;
  }, [jwtToken]);

  const createCheckoutSession = useCallback(async () => {
    return apiFetch<CreateCheckoutSessionResponse>('/organization/payments/create-checkout-session', {
      method: 'POST', body: JSON.stringify({}),
    }, jwtToken);
  }, [jwtToken]);

  const cancelSubscriptionAtEndOfPeriod = useCallback(async () => {
    return apiFetch<CancelSubscriptionResponse>('/organization/payments/cancel-subscription-eop', {
      method: 'POST', body: JSON.stringify({}),
    }, jwtToken);
  }, [jwtToken]);

  return { getOrganization, createOrganization, joinOrganization, createCheckoutSession, cancelSubscriptionAtEndOfPeriod };
}
