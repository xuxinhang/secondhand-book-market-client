import { GoodItem } from '@/types.ts';
import Vue from 'vue';

export interface CartItem {
  num: number;
  checked: boolean;
  good: GoodItem;
  deleteFlag?: boolean | undefined;
}

export interface CartStoreState {
  list: CartItem[];
  // ...
}

export interface CartItemEditPatch {
  num: number;
  checked?: boolean;
  deleteFlag?: boolean;
}

const exampleCartList = [
  {
    num: 2,
    checked: false,
    good: {
      goodId: 12,
      title: '电信学院-大二学年系列用书',
      restNum: 6,
      price: 23.5,
      imgUrl: 'https://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
    },
  },
  {
    num: 1,
    checked: true,
    good: {
      goodId: 13,
      title: 'FFT',
      restNum: 3,
      price: 253,
      imgUrl: 'https://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
    },
  },
];

export default {
  namespaced: true,
  state: {
    list: [
      // ...exampleCartList,
    ],
    // and more ...
  },

  getters: {
    cartCount: (state: CartStoreState): number => state.list.length,
  },

  mutations: {
    _INIT(state: CartStoreState, payload: CartStoreState) {
      // @HACK
      Object.entries(payload).forEach(([k, v]) => {
        Vue.set(state, k, v);
      });
    },
    setItemChecked(state: CartStoreState, { itemIndex, checked }: { itemIndex: number, checked: boolean }) {
      state.list[itemIndex].checked = checked;
    },
    setItemCheckedAll(state: CartStoreState, { checked }: { checked: boolean }) {
      for (const item of state.list) {
        item.checked = checked;
      }
    },
    updateList(state: CartStoreState, patch: CartItemEditPatch[]) {
      const prevList = state.list;
      state.list = prevList.reduce((accu: CartItem[], item: CartItem, i) => {
        // @HACK 这里是需要排除的属性
        const { deleteFlag, checked, ...rest } = patch[i];
        if (deleteFlag) { return accu; }
        accu.push({ ...item, ...rest });
        return accu;
      }, []);
    },
    removeCheckedItem(state: CartStoreState, patch: CartItemEditPatch[]) {
      state.list = state.list.filter((item) => !item.checked);
    },
    addGood(state: CartStoreState, payload: CartItem) {
      let plusFlag = false;
      for (const item of state.list) {
        if (item.good.goodId === payload.good.goodId) {
          item.num = item.num + payload.num;
          item.good = payload.good;
          plusFlag = true;
          break;
        }
      }
      if (!plusFlag) {
        state.list.push(payload);
      }
    },
  },

  actions: { },
};
