import { createPinia, defineStore } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const store = createPinia();

// 持久化插件
store.use(piniaPluginPersistedstate);

const useAuthStore = defineStore('authStore', {
  state: () => ({
    accessToken: '11111',
    refreshToken: '22222',
  }),
  getters: {
    getTokenStore: state => {
      return state;
    },
  },
  actions: {},
  persist: {},
});

export { store, useAuthStore };