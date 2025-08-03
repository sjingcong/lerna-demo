import {
  BirthCertificationValidator,
  DriverLicenseValidator,
  ForeignerPermanentResidentValidator,
  HkMacaoTaiwanValidator,
  HouseholdRegisterValidator,
  IdCardValidator,
  MilitaryIdValidator,
  PassportValidator,
} from './validators';

export enum CertificationType {
  ID_CARD = '1',
  PASSPORT = '2',
  HK_MACAO_TAIWAN = '6',
  BIRTH_CERTIFICATE = 'A',
  HOUSEHOLD_REGISTER = 'L',
  MILITARY_ID = '3',
  DRIVER_LICENSE = '7',
  FOREIGNER_PERMANENT_RESIDENT = 'o',
}

export const CertificationOptions = [
  {
    label: '身份证',
    value: CertificationType.ID_CARD,
  },
  {
    label: '护照',
    value: CertificationType.PASSPORT,
  },
  {
    label: '港澳台回乡证',
    value: CertificationType.HK_MACAO_TAIWAN,
  },
  {
    label: '出生证',
    value: CertificationType.BIRTH_CERTIFICATE,
  },
  {
    label: '户口本',
    value: CertificationType.HOUSEHOLD_REGISTER,
  },
  {
    label: '军事证',
    value: CertificationType.MILITARY_ID,
  },
  {
    label: '司机执照',
    value: CertificationType.DRIVER_LICENSE,
  },
  {
    label: '外国永久居民身份证',
    value: CertificationType.FOREIGNER_PERMANENT_RESIDENT,
  },
];

export const CertificationValidateMap = {
  [CertificationType.ID_CARD]: IdCardValidator,
  [CertificationType.PASSPORT]: PassportValidator,
  [CertificationType.HK_MACAO_TAIWAN]: HkMacaoTaiwanValidator,
  [CertificationType.BIRTH_CERTIFICATE]: BirthCertificationValidator,
  [CertificationType.HOUSEHOLD_REGISTER]: HouseholdRegisterValidator,
  [CertificationType.MILITARY_ID]: MilitaryIdValidator,
  [CertificationType.DRIVER_LICENSE]: DriverLicenseValidator,
  [CertificationType.FOREIGNER_PERMANENT_RESIDENT]:
    ForeignerPermanentResidentValidator,
};
