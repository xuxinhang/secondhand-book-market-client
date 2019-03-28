import Vue from 'vue';
import Vuex from 'vuex';

import cartStore from './cart';
import marketStore from './market';
import { CartStoreState } from './cart';
import createStorageSyncPlugin from './storageSync';

export interface State {
  cart?: CartStoreState; // @HACK
  emphasizedCartTab: boolean;
}

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    emphasizedCartTab: false,
    // cart: {},
  },
  mutations: {
    setEmphasizedCartTab(state, payload: boolean) {
      state.emphasizedCartTab = payload;
    },
  },
  actions: {
    emphasizeCartTab(context) {
      context.commit('setEmphasizedCartTab', true);
      // 2000ms 的动画时间绝对够了
      setTimeout(() => context.commit('setEmphasizedCartTab', false), 2000);
    },
  },

  plugins: [
    createStorageSyncPlugin<State>({
      stateToStorage: (st) => JSON.stringify(st.cart),
      storageToState: (raw: string) => {
        try {
          return JSON.parse(raw);
        } catch (e) {
          return undefined;
        }
      },
      storageKey: 'sbm_cart',
      initMutationName: 'cart/_INIT',
    }),
  ],

  modules: {
    cart: cartStore,
    market: marketStore,
  },
});
