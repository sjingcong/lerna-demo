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
  const validator: any;
  export default validator;
}
