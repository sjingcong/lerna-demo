/**
 * 证件校验器统一导出
 */

export { default as IdCardValidator } from './idCard';
export { default as PassportValidator } from './passport';
export { default as HkMacaoTaiwanValidator } from './hkMacaoTaiwan';
export { default as BirthCertificateValidator } from './birthCertificate';
export { default as HouseholdRegisterValidator } from './householdRegister';
export { default as MilitaryIdValidator } from './militaryId';
export { default as DriverLicenseValidator } from './driverLicense';
export { default as ForeignerPermanentResidentValidator } from './foreignerPermanentResident';

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
