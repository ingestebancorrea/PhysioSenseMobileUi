export type UserAccountRole = 'fisioterapeuta' | 'paciente';

export enum UserRoleId {
  FISIOTERAPEUTA = 1,
  PACIENTE = 2,
}

export type UserRoleAlias = 'FIS' | 'PAC';

export enum SocialLoginProvider {
  GOOGLE = 'googleTokenValidation',
  FACEBOOK = 'facebookTokenValidation',
  AZURE = 'azureTokenValidation',
}
