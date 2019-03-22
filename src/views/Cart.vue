<template>
  <div class="wrapper">
    <section class="cart-page_header">
      <ul class="toolbar">
        <li class="space"></li>
        <li v-if="editMode" class="edit-btn">
          <a @click="exitEditMode()">完成</a>
        </li>
        <li v-else class="edit-btn" :hidden="cartList.length === 0">
          <a @click="enterEditMode()">编辑</a>
        </li>
      </ul>
    </section>
    <section class="cart-page_body">
      <ul class="cart-list" v-if="cartList.length">
        <li
          v-for="(item, index) in cartList"
          :key="item.good.goodId"
          v-if="!(editMode && editCache[index].deleteFlag)"
        >
          <div class="cart-item_radio">
            <van-checkbox
              :value="item.checked"
              @input="onCardCheckBoxChange(index, $event)"
            />
          </div>
          <div class="cart-item_card">
            <van-card
              v-if="!editMode"
              :num="item.num"
              :price="item.good.price"
              :desc="item.good.desc"
              :title="item.good.title"
              :thumb="item.good.imgUrl"
            />
            <van-card v-else :price="item.good.price" :thumb="item.good.imgUrl">
              <div slot="title" class="stepper-wrap">
                <van-stepper v-model="editCache[index].num" :max="item.good.restNum" />
              </div>
            </van-card>
          </div>
          <button
            :hidden="editMode === false"
            @click="$set(editCache[index], 'deleteFlag', true)"
            class="cart-item_delete-btn"
          >
            删除
          </button>
        </li>
      </ul>
      <div v-else class="empty-placeholder-wrapper">
        <empty-placeholder title="购物车里什么都没有" desc="快去书籍市场淘几本" />
      </div>
    </section>
    <section class="cart-page_footer">
      <van-submit-bar
        class="submir-bar"
        :price="totalPrice * 100"
        button-text="结算"
        :disabled="selectedNumber === 0"
        @submit="onSubmit"
      >
        <van-checkbox
          :hidden="cartList.length === 0"
          class="select-all-checkbox"
          :value="allSelected"
          @input="onSelectAllClick"
        >
          全选
        </van-checkbox>
        <!-- <span slot="tip"></span> -->
      </van-submit-bar>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import EmptyPlaceholder from '@/components/EmptyPlaceholder.vue';
import { State } from '@/store/index';
import { CartItem, CartItemEditPatch } from '@/store/cart';

export default Vue.extend({
  components: {
    EmptyPlaceholder,
  },

  data() {
    return {
      editMode: false,
      editCache: [] as CartItemEditPatch[],
    };
  },

  computed: {
    // ...mapState({
    //   cartList: (state: State) => state.cart.list,
    // }),
    cartList(): CartItem[] {
      return this.$store.state.cart.list;
    },
    totalPrice(): number {
      return this.cartList.reduce((accu: number, item: CartItem) => {
        return item.checked ? (accu + item.num * item.good.price) : accu;
      }, 0);
    },
    allSelected(): boolean {
      return this.cartList.every((item) => item.checked);
    },
    selectedNumber(): number {
      return this.cartList.reduce((accu, item) => item.checked ? (accu + 1) : accu, 0);
    },
  },

  methods: {
    onCardCheckBoxChange(index: number, checked: boolean) {
      this.$store.commit('cart/setItemChecked', { itemIndex: index, checked });
    },
    onSelectAllClick() {
      this.$store.commit('cart/setItemCheckedAll', { checked: !this.allSelected });
    },
    onSubmit() {
      this.$router.push('/cart/submit');
    },
    enterEditMode() {
      this.editMode = true;
      const sourceItem = this.cartList.map(({ good, ...rest }: CartItem) => rest);
      this.editCache = sourceItem;
    },
    exitEditMode() {
      this.editMode = false;
      this.$store.commit('cart/updateList', this.editCache);
    },
  },
});
</script>

<style lang="scss" scoped>
@import '~@/styles/_vars.scss';

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cart-page_header {
  flex: 0;
}

.cart-page_footer {
  flex: 0;
  .submir-bar {
    position: static;
  }
}

.cart-page_body {
  flex: 1;
  overflow: auto;
  background: $page-gray-bg;
}

.toolbar {
  display: flex;
  padding: 0 1em;
  list-style: none;
  border-bottom: 1px solid #eee;
  background-color: white;
  font-size: 0.8em;
  a {
    text-decoration: none;
    color: inherit;
  }
  li {
    padding: 0.6em 0.4em;
  }
  .space {
    flex: 1;
  }
  .edit-btn {
    color: $secondary-color;
  }
}

.cart-list {
  background: tan;
}

.cart-list {
  list-style: none;
  li {
    display: flex;
    align-items: center;
    background: white;
    border-bottom: 1px solid #eeeeee;
  }
}

.cart-item_radio {
  flex: 0 0;
  padding: 0 0.3em 0 0.6em;
}
.cart-item_card {
  flex: 1;
  .van-card {
    background: transparent;
  }
}
.cart-item_delete-btn {
  flex: 0 0 4.5em;
  align-self: stretch;
  border: none;
  text-align: center;
  color: $primary-text-color;
  background: $primary-color;
}

.empty-placeholder-wrapper {
  padding: 1.3em;
}

.select-all-checkbox {
  padding-left: 0.8em;
}

</style>
