/**
 * Vuex 市场列表
 */

// @ts-ignore
import apier from '@/utils/apier.js';
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
  searchKeyword: string;
}

const initialFilter = {
  type: 1,
  basic: 0,
  grade: 0,
  college: 0,
};

export default {
  namespaced: true,
  state: {
    listReady: false,
    list: [
      // ...exampleCartList,
    ],
    searchKeyword: '',
    filter: { ...initialFilter },
    initialFilter,
  },

  getters: {
    filter(state: MarketStoreState) {
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
    //
    setSearchKeyword(state: MarketStoreState, payload: string) {
      state.searchKeyword = payload;
    },
  },

  actions: {
    async fetchGoodList(ctx: ActionContext<MarketStoreState, any>) {
      const reqInp = {
        filter: ctx.state.filter,
        searchKeyword: ctx.state.searchKeyword,
      }; // [TOOD]
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
