declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@bundled-es-modules/axios' {
  import { AxiosStatic } from 'axios';
  const axios: AxiosStatic;
  export { axios };
}

declare module 'id-validator' {
  interface IDValidator {
    isValid(id: string): boolean;
    getInfo(id: string): {
      valid: boolean;
      gender: number;
      birthday: string;
      age: number;
      province: string;
      city: string;
      area: string;
    } | null;
    makeID(): string;
  }

  const IDValidator: IDValidator;
  export = IDValidator;
}
