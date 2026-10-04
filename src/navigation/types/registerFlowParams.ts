// src/navigation/types/registerFlowParams.ts
import type { RegisterPasswordResponse } from '@/types/auth/register-password';

export type RegisterFlowParamList = {
  RoleSelection: undefined;
  CreateAccount: undefined;
  ProfessionalInfo: undefined;
  PatientInfo: undefined;
  AdditionalInfo: undefined;
  ReviewInformation: undefined;
  /**
   * The welcome screen needs the created user to open the session without a
   * second login, so the answer travels with the route.
   */
  FinalWelcome: { registration: RegisterPasswordResponse };
};
