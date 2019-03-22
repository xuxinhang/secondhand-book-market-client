import Vue from 'vue';
import Vuex from 'vuex';

import cartStore from './cart';
import { CartStoreState } from './cart';

export interface State {
  cart: CartStoreState;
}

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },

  modules: {
    cart: cartStore,
  },
});
