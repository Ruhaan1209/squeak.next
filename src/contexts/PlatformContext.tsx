"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '@/lib/api-client';

type OrganizationPlan = 'NO_ORGANIZATION' | 'FREE' | 'CLASSROOM';

interface PlatformContextType {
  isTeacher: boolean;
  isStudent: boolean;
  isLoading: boolean;
  plan: string;
  organizationPlan: OrganizationPlan;
  checkRoles: () => Promise<void>;
  checkPlan: () => Promise<void>;
}

const PlatformContext = createContext<PlatformContextType | null>(null);

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { jwtToken } = useAuth();

  const [plan, setPlan] = useState<string>('FREE');
  const [organizationPlan, setOrganizationPlan] = useState<OrganizationPlan>('NO_ORGANIZATION');
  const [isTeacher, setIsTeacher] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkRoles = async () => {
    if (!jwtToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      try {
        const { data } = await apiFetch<{ exists: boolean; plan?: string }>('/teacher', {}, jwtToken);
        if (data?.exists) {
          setIsTeacher(true);
          if (data.plan) {
            setOrganizationPlan(data.plan as OrganizationPlan);
          } else {
            setOrganizationPlan('NO_ORGANIZATION');
          }
        } else {
          setIsTeacher(false);
        }
      } catch {
        setIsTeacher(false);
      }

      try {
        const { data } = await apiFetch<{ student_id: string; plan?: string }>('/student', {}, jwtToken);
        if (data && data.student_id !== '') {
          setIsStudent(true);
          if (data.plan) {
            setOrganizationPlan(data.plan as OrganizationPlan);
          } else {
            setOrganizationPlan('NO_ORGANIZATION');
          }
        } else {
          setIsStudent(false);
        }
      } catch {
        setIsStudent(false);
      }
    } catch (error) {
      console.error('Error checking user roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPlan = async () => {
    if (!jwtToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await apiFetch<{ plan: string }>('/billing', {}, jwtToken);
      if (data?.plan) {
        setPlan(data.plan);
      }
    } catch (error) {
      console.error('Error checking user plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkRoles();
    checkPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwtToken]);

  return (
    <PlatformContext.Provider value={{ isTeacher, isStudent, isLoading, plan, organizationPlan, checkRoles, checkPlan }}>
      {children}
    </PlatformContext.Provider>
  );
};
