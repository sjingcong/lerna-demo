import HttpRequest from '@giom/shared/tools/http-client';
import { useAuthStore } from '@/store';

const auth = useAuthStore();
const httpInstance = new HttpRequest({
  enableLogging: true,
  auth: auth,
  baseUrl: '/',
  refreshTokenUrl: '/auth/refreshToken',
});


export default httpInstance;