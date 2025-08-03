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

export enum CertType {
  ID_CARD = '1',
  PASSPORT = '2',
  HK_MACAO_TAIWAN = '6',
  BIRTH_CERTIFICATE = 'A',
  HOUSEHOLD_REGISTER = 'L',
  MILITARY_ID = '3',
  DRIVER_LICENSE = '7',
  FOREIGNER_PERMANENT_RESIDENT = 'o',
}

export const CertOptions = [
  {
    label: '身份证',
    value: CertType.ID_CARD,
  },
  {
    label: '护照',
    value: CertType.PASSPORT,
  },
  {
    label: '港澳台回乡证',
    value: CertType.HK_MACAO_TAIWAN,
  },
  {
    label: '出生证',
    value: CertType.BIRTH_CERTIFICATE,
  },
  {
    label: '户口本',
    value: CertType.HOUSEHOLD_REGISTER,
  },
  {
    label: '军事证',
    value: CertType.MILITARY_ID,
  },
  {
    label: '司机执照',
    value: CertType.DRIVER_LICENSE,
  },
  {
    label: '外国永久居民身份证',
    value: CertType.FOREIGNER_PERMANENT_RESIDENT,
  },
];

export const CertValidateMap = {
  [CertType.ID_CARD]: IdCardValidator,
  [CertType.PASSPORT]: PassportValidator,
  [CertType.HK_MACAO_TAIWAN]: HkMacaoTaiwanValidator,
  [CertType.BIRTH_CERTIFICATE]: BirthCertificationValidator,
  [CertType.HOUSEHOLD_REGISTER]: HouseholdRegisterValidator,
  [CertType.MILITARY_ID]: MilitaryIdValidator,
  [CertType.DRIVER_LICENSE]: DriverLicenseValidator,
  [CertType.FOREIGNER_PERMANENT_RESIDENT]: ForeignerPermanentResidentValidator,
};
