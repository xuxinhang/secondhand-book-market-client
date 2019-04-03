<template>
  <div class="sell_wrapper">
    <section :class="{ 'sell_body': true, 'sell_body--blurred': formStage === 2 }">
      <van-cell-group class="sell_form-cell">
        <van-field
          v-model="formValue.desc"
          type="textarea"
          label="描述"
          placeholder="描述一下图书吧！100字以内"
          :error-message="formError.desc"
          autosize
        />
        <van-cell title="图片上传">
          <span v-show="formError.imageFile" class="image-uploader-errmsg van-field__error-message">
            {{formError.imageFile}}
          </span>
          <van-uploader class="image-uploader" :after-read="onUploaderRead" accept="image/gif, image/jpeg, image/png">
            <div class="preview-image">
              <img v-if="imagePreviewURL" :src="imagePreviewURL" />
              <span v-else><van-icon name="photograph" size="1.31em" color="#ccc" /></span>
            </div>
          </van-uploader>
        </van-cell>
      </van-cell-group>
      <van-cell-group class="sell_form-cell">
        <van-field
          v-model="formValue.price"
          label="期待价格"
          type="number"
          placeholder="￥0.0"
          :error-message="formError.price"
          input-align="right"
        />
      </van-cell-group>
      <van-cell-group class="sell_form-cell">
        <van-field
          v-model="formValue.tel"
          label="联系方式"
          type="tel"
          placeholder="联系电话"
          :error-message="formError.tel"
          input-align="right"
        />
      </van-cell-group>
      <van-cell-group class="sell_form-cell">
        <van-field
          v-model="formValue.address"
          label="取货地址"
          placeholder="只支持寝室楼栋取货"
          :error-message="formError.address"
        />
      </van-cell-group>
      <div class="sell_form-submit">
        <van-button v-if="formStage >= 1" disabled block class="submit-btn">提交中</van-button>
        <van-button v-else type="primary" block class="submit-btn" @click="onSubmitBtnClick">提交</van-button>
      </div>
    </section>

    <!-- 成功提示 -->
    <section class="sell_success-tip" v-if="formStage === 2">
      <div class="sell_success-tip_content">
        <empty-placeholder iconName="passed" title="提交成功" desc="你的卖书订单很快就会开始处理" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EmptyPlaceholder from '@/components/EmptyPlaceholder.vue';
import apier from '@/utils/apier.js';
import AsyncValidator from 'async-validator';

interface FormValue {
  [propName: string]: string | File | undefined;
}

interface FormError {
  [propName: string]: string;
}

const formRules = {
  price: { required: true, pattern: /^([1-9][0-9]*|0)(\.[0-9]{1,2})?$/, message: '请输入合法的价格' },
  tel: { required: true, pattern: /[0-9\+-]+/, message: '请输入合法的电话号码' },
  address: [
    { required: true, message: '请输入配送地址' },
    { max: 100, message: '地址不超过100个字符' }, // [TODO]
  ],
  desc: [
    { required: true, message: '请输入图书描述' },
    { max: 100, message: '描述不超过100个字符' },
  ],
  imageFile: { required: true, message: '请上传图片' },
};

export default Vue.extend({
  components: { EmptyPlaceholder },
  data() {
    return {
      imagePreviewURL: '',
      formValue: {
        desc: '',
        address: '',
        tel: '',
        price: '', // 注意价格值的类型
        imageFile: undefined,
      } as FormValue,
      formError: {
        desc: '',
        address: '',
        tel: '',
        price: '',
        imageFile: '',
      } as FormError,
      formStage: 0,
    };
  },

  methods: {
    onUploaderRead(result: {file: File, content: string}) {
      this.formValue.imageFile = result.file;
      // console.log(file);
      // 准备图片预览URL
      // const fr = new FileReader();
      // fr.onload = e => this.imagePreviewURL = e.target ? e.target.result : '';
      // console.log(file);
      // fr.readAsDataURL(file[0]);
      this.imagePreviewURL = result.content;
    },
    async onSubmitBtnClick() {
      // 校验
      const inputValue = this.formValue;
      const validator = new AsyncValidator(formRules);
      try {
        await validator.validate(inputValue);
        // Reset form errors
        this.formError = Object.keys(inputValue).reduce((accu, key) => {
          accu[key] = '';
          return accu;
        }, {} as FormError);
      } catch ({ errors, fields }) {
        // Update error info
        this.formError = Object.keys(inputValue).reduce((accu, key) => {
          accu[key] = fields[key]
            ? fields[key].map((item: { message?: string }) => item.message).join('。')
            : '';
          return accu;
        }, {} as FormError);
        return;
      }

      // 整理数据
      const submittedData = {
        ...this.formValue,
        price: parseFloat(String(inputValue.price) || ''),
      };

      this.formStage = 1;
      apier.fetch('submitSellOrder', submittedData)
        .then(() => {
          this.formStage = 2;
        })
        .catch(({ stat }) => {
          this.$dialog({
            title: '提交遇到问题，请稍后重试。',
            message: stat.frimsg,
          });
          this.formStage = 0;
        });
    },
  },
});
</script>

<style lang="scss" scoped>
@import '~@/styles/_vars.scss';

.sell_wrapper {
  position: relative;
  height: 100%;
}

.sell_body {
  height: 100%;
  background: $page-gray-bg;
  overflow: auto;
}
.sell_body--blurred {
  filter: blur(0.8em);
}

.sell_form-cell {
  margin-bottom: 0.625em;
  box-shadow:0 1px 2px 0 rgba(0,0,0,0.05);
  &::after {
    border: none;
  }
}
.sell_form-submit {
  padding: 1em;
  .submit-btn {
    max-width: 20em;
    margin: 0 auto;
  }
}
.preview-image {
  width: 5.625em;
  height: 5.625em;
  position: relative;
  overflow: hidden;
  background: #f7f6f4;
  & > img {
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    min-height: 100%;
    min-width: 100%;
    margin: auto;
  }
  & > span {
    display: block;
    height: 1.31em;
    width: 1.31em;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    margin: auto;
  }
}

.image-uploader {
  vertical-align: middle;
}
.image-uploader-errmsg {
  margin-right: 0.8em;
}

.sell_success-tip {
  position: absolute;
  top: 0; left: 0; right:0; bottom: 0;
  background: rgba(0,0,0,0.01);
}
.sell_success-tip_content {
  position: absolute;
  padding: 1em 0 1.4em;
  top: 50%;
  left: 50%;
  width: 85%;
  border-radius: 4px;
  background-color: #fff;
  transform: translate3d(-50%, -50%, 0);
  box-shadow: 0 0 1px 2px rgba(0,0,0,0.05);
}
</style>
