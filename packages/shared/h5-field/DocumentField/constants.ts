import {
  BirthCertificateValidator,
  DriverLicenseValidator,
  ForeignerPermanentResidentValidator,
  HkMacaoTaiwanValidator,
  HouseholdRegisterValidator,
  IdCardValidator,
  MilitaryIdValidator,
  PassportValidator,
} from './validators';

export enum CertificateType {
  ID_CARD = '1',
  PASSPORT = '2',
  HK_MACAO_TAIWAN = '6',
  BIRTH_CERTIFICATE = 'A',
  HOUSEHOLD_REGISTER = 'L',
  MILITARY_ID = '3',
  DRIVER_LICENSE = '7',
  FOREIGNER_PERMANENT_RESIDENT = 'o',
}

export const CertificateOptions = [
  {
    label: '身份证',
    value: CertificateType.ID_CARD,
  },
  {
    label: '护照',
    value: CertificateType.PASSPORT,
  },
  {
    label: '港澳台回乡证',
    value: CertificateType.HK_MACAO_TAIWAN,
  },
  {
    label: '出生证',
    value: CertificateType.BIRTH_CERTIFICATE,
  },
  {
    label: '户口本',
    value: CertificateType.HOUSEHOLD_REGISTER,
  },
  {
    label: '军事证',
    value: CertificateType.MILITARY_ID,
  },
  {
    label: '司机执照',
    value: CertificateType.DRIVER_LICENSE,
  },
  {
    label: '外国永久居民身份证',
    value: CertificateType.FOREIGNER_PERMANENT_RESIDENT,
  },
];

export const CertificateValidateMap = {
  [CertificateType.ID_CARD]: IdCardValidator,
  [CertificateType.PASSPORT]: PassportValidator,
  [CertificateType.HK_MACAO_TAIWAN]: HkMacaoTaiwanValidator,
  [CertificateType.BIRTH_CERTIFICATE]: BirthCertificateValidator,
  [CertificateType.HOUSEHOLD_REGISTER]: HouseholdRegisterValidator,
  [CertificateType.MILITARY_ID]: MilitaryIdValidator,
  [CertificateType.DRIVER_LICENSE]: DriverLicenseValidator,
  [CertificateType.FOREIGNER_PERMANENT_RESIDENT]:
    ForeignerPermanentResidentValidator,
};
