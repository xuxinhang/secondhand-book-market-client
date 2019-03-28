/**
 * Vuex 市场列表
 */

import apier from '@/utils/apier';
import { GoodItem } from '@/types';
import { ActionContext } from 'vuex';

interface FilterValue {
  [index: string]: number;
}

interface MarketStoreState {
  listReady: boolean;
  list: GoodItem[];
  filter: FilterValue;
  initialFilter: FilterValue;
}

const initialFilter = {
  type: 1,
};

export default {
  namespaced: true,
  state: {
    listReady: false,
    list: [
      // ...exampleCartList,
    ],
    filter: { ...initialFilter },
    initialFilter,
  },

  getters: {
    filter(state) {
      return state.filter;
    },
  },

  mutations: {
    updateFilter(state: MarketStoreState, payload: FilterValue) {
      state.filter = payload;
    },
    resetFilter(state: MarketStoreState) {
      state.filter = { ...state.initialFilter };
    },
    // Good List
    updateGoodList(state: MarketStoreState, list: GoodItem[]) {
      state.list = list;
      state.listReady = true;
    },
  },

  actions: {
    async fetchGoodList(ctx: ActionContext<MarketStoreState, any>) {
      const reqInp = {}; // [TOOD]
      try {
        const resp = await apier.fetch('goodList', reqInp);
        const { stat, data } = resp;
        ctx.commit('updateGoodList', data);
        return Promise.resolve(resp);
      } catch (resp) {
        return Promise.reject(resp);
      }
    },
  },
};
