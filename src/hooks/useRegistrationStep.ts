import { useState } from 'react';

import {
  useRegistration,
  type RegistrationData,
} from '@/context/RegistrationContext';
import type {
  RegistrationErrors,
  RegistrationField,
} from '@/utils/validation/registrationValidation';

type Validator = (data: RegistrationData) => RegistrationErrors;

interface RegistrationStep {
  data: RegistrationData;
  errors: RegistrationErrors;
  /** Validate on press. Returns `false` (and shows the errors) when invalid. */
  submit: (validate: Validator) => boolean;
  /** Update a text/select field and clear its error while the user fixes it. */
  change: (field: RegistrationField, value: string) => void;
  changeTerms: (accepted: boolean) => void;
}

/**
 * Per-step validation state for the create-account flow.
 *
 * Errors only appear after a failed submit, and each one is cleared as soon as
 * the field is edited. That way the user is never scolded for a field they have
 * not touched yet.
 */
export const useRegistrationStep = (): RegistrationStep => {
  const { data, updateField } = useRegistration();
  const [errors, setErrors] = useState<RegistrationErrors>({});

  const clearError = (field: RegistrationField) => {
    setErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  return {
    data,
    errors,
    submit: validate => {
      const nextErrors = validate(data);
      setErrors(nextErrors);

      // The validators return every field as a key, so `undefined` values have
      // to be filtered out: only real messages block the step.
      return !Object.values(nextErrors).some(Boolean);
    },
    change: (field, value) => {
      updateField(field, value);
      clearError(field);
    },
    changeTerms: accepted => {
      updateField('acceptTerms', accepted);
      clearError('acceptTerms');
    },
  };
};