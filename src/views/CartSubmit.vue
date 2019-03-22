<template>
  <div class="wrapper">
    <section class="cart-submit_header">
    </section>
    <section class="cart-submit_body">
      <ul class="cart-list" v-if="cartCheckedList.length">
        <li
          v-for="item in cartCheckedList"
          :key="item.good.goodId"
        >
          <div class="cart-item_card">
            <van-card
              :num="item.num"
              :price="item.good.price"
              :desc="item.good.desc"
              :title="item.good.title"
              :thumb="item.good.imgUrl"
            />
          </div>
        </li>
      </ul>
      <form class="cart-submit_form">
        <van-field
          class="cart-submit_field-cell"
          v-model="formData.name"
          label="姓名"
          placeholder=""
          :error-message="formError.name"
        />
        <van-field
          class="cart-submit_field-cell"
          v-model="formData.tel"
          label="联系电话"
          placeholder=""
          :error-message="formError.tel"
        />
        <van-field
          class="cart-submit_field-cell"
          v-model="formData.address"
          label="配送地址"
          placeholder="只支持寝室楼栋配送"
          :error-message="formError.address"
        />
        <van-field
          class="cart-submit_field-cell"
          v-model="formData.comment"
          label="留言"
          placeholder="有租赁图书需求请在此备注"
          :error-message="formError.comment"
        />
      </form>
    </section>
    <section class="cart-submit_footer">
      <van-submit-bar
        class="submir-bar"
        :price="totalPrice * 100"
        button-text="确认"
        :loading="formLoading"
        @submit="onSubmit"
      >
      </van-submit-bar>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
// import AsyncValidator from 'async-validator';
import EmptyPlaceholder from '@/components/EmptyPlaceholder.vue';
import { State } from '@/store/index';
import { CartItem, CartItemEditPatch } from '@/store/cart';
import apier, { ResponseStat } from '@/utils/apier.ts';
// eslint-disable-next-line
const AsyncValidator = require('async-validator').default; // [TODO]

interface FormData {
  [propName: string]: string;
}

interface FormError {
  [propName: string]: string;
}


const formRules = {
  name: { required: true, min: 2, message: '须输入合法的姓名' },
  tel: { required: true, pattern: /[0-9\+-]+/, message: '请输入电话号码' },
  address: [
    { required: true, message: '请输入配送地址' },
    { max: 100, message: '地址不超过100个字符' }, // [TODO]
  ],
  comment: [
    { max: 100, message: '评论不超过100个字符' }, // [TODO]
  ],
};

export default Vue.extend({
  components: {
    EmptyPlaceholder,
  },

  data() {
    return {
      formData: {
        name: '',
        tel: '',
        address: '',
        comment: '',
      } as FormData,
      formError: {
        name: '',
        tel: '',
        address: '',
        comment: '',
      } as FormError,
      formLoading: false,
    };
  },

  computed: {
    cartCheckedList(): CartItem[] {
      return this.$store.state.cart.list.filter((item: CartItem) => item.checked);
    },
    totalPrice(): number {
      return this.cartCheckedList.reduce((accu: number, item: CartItem) => {
        return item.checked ? (accu + item.num * item.good.price) : accu;
      }, 0);
    },
  },

  methods: {
    async onSubmit() {
      const inputs = this.formData;
      const validator = new AsyncValidator(formRules);
      this.formLoading = true;
      try {
        await validator.validate(inputs);
        // Reset form errors
        this.formError = Object.keys(this.formData).reduce((accu, key) => {
          accu[key] = '';
          return accu;
        }, {} as FormError);

        // Start to request
        apier.fetch('submitOrder', {
          ...this.formData,
          goods: this.cartCheckedList.map((item) => ({ goodId: item.good.goodId, num: item.num })),
        })
          .then(({ stat, data }: { stat: ResponseStat, data: any }) => {
            this.$router.replace('/cart/success');
          })
          .catch(({ stat, data }: { stat: ResponseStat, data: any }) => {
            this.$dialog.alert({
              title: '提交订单时遇到错误',
              message: stat.frimsg, // [TODO]
            });
          });

      } catch ({ errors, fields }) {
        this.formError = Object.keys(this.formData).reduce((accu, key) => {
          accu[key] = fields[key]
            ? fields[key].map((item: { message?: string }) => item.message).join('。')
            : '';
          return accu;
        }, {} as FormError);
      } finally {
        this.formLoading = false;
      }
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

.cart-submit_header {
  flex: 0;
}

.cart-submit_footer {
  flex: 0;
  .submir-bar {
    position: static;
  }
}

.cart-submit_body {
  flex: 1;
  overflow: auto;
  background: $page-gray-bg;
}

.cart-submit_field-cell {
  margin-bottom: 0.4em;
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
  list-style: none;
  margin-bottom: 0.4em;
  padding-top: 0.4em;
  background: white;
  li {
    display: flex;
    align-items: center;
    background: white;
    border-bottom: 1px solid #eeeeee;
  }
}

.cart-item_card {
  flex: 1;
  .van-card {
    background: transparent;
  }
}

// .empty-placeholder-wrapper {
//   padding: 1.3em;
// }

</style>
