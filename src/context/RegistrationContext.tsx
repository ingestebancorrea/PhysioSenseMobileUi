// src/context/RegistrationContext.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';

import type { UserAccountRole } from '@/types/auth';

export type UserRole = UserAccountRole | null;

export interface RegistrationData {
  role: UserRole;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  specialty: string;
  licenseNumber: string;
  institution: string;
  yearsExperience: string;
  birthDate: string;
  country: string;
  city: string;
  dominantHand: string;
  phone: string;
  notes: string;
  photoName: string;
}

const INITIAL_DATA: RegistrationData = {
  role: null,
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  specialty: '',
  licenseNumber: '',
  institution: '',
  yearsExperience: '',
  birthDate: '',
  country: '',
  city: '',
  dominantHand: '',
  phone: '',
  notes: '',
  photoName: '',
};

interface RegistrationContextValue {
  data: RegistrationData;
  updateField: <K extends keyof RegistrationData>(
    field: K,
    value: RegistrationData[K],
  ) => void;
  reset: () => void;
}

const RegistrationContext = createContext<RegistrationContextValue | undefined>(
  undefined,
);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<RegistrationData>(INITIAL_DATA);

  const value = useMemo<RegistrationContextValue>(
    () => ({
      data,
      updateField: (field, fieldValue) =>
        setData(prev => ({ ...prev, [field]: fieldValue })),
      reset: () => setData(INITIAL_DATA),
    }),
    [data],
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = (): RegistrationContextValue => {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error(
      'useRegistration debe usarse dentro de un RegistrationProvider',
    );
  }

  return context;
};
