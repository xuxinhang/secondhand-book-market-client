<template>
  <div class="market-list">
    <aside class="market-list_filter-pane">

    </aside>
    <div class="market-list_filter-tab">
      <van-tabs v-model="typeFilterTabActiveIndex" line-height="2" color="#ff7d7e">
        <van-tab title="单本出售"></van-tab>
        <van-tab title="整套租售"></van-tab>
      </van-tabs>
    </div>
    <section class="market-list_search-bar">
      <div class="market-list_search-input">
        <van-search
          v-model="searchKeyword"
          placeholder="搜索图书"
          show-action
          @search="onSearchSubmit"
        />
      </div>
      <button class="market-list_filter-btn">
        筛选<van-icon class="market-list_filter-btn_icon" name="star" size="1.25em" color="#ffab5a" />
      </button>
    </section>
    <div class="market-list_body">
      <div v-for="item in goodList" class="market-list_good-card" :key="item.goodId">
        <van-card
          :desc="item.desc"
          :price="item.price"
          :thumb="item.imageUrl"
        >
          <!-- tag="标签" -->
          <div slot="title">
            {{item.title}}
            <span v-if="item.restNum === 0" class="market-list_waiting-tip">
              <van-icon name="star" size="1.2em" />补货中
            </span>
          </div>
          <div slot="num">
            <van-button>@</van-button>
          </div>
        </van-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const tagList = [
  {
    name: 'basic',
    label: '基本类型',
    tags: [
      { label: '课本', value: 1 },
      { label: '教辅', value: 2 },
      { label: '课外书', value: 3 },
    ],
  },
  {
    name: 'grade',
    label: '适合年级',
    tags: [
      { label: '大一', value: 1 },
      { label: '大二', value: 2 },
      { label: '大三', value: 3 },
      { label: '大四', value: 4 },
      { label: '研究生', value: 5 },
    ],
  },
  {
    name: 'college',
    label: '适合学院',
    tags: [
      { label: '电信', value: 1 },
      { label: '计科', value: 2 },
      { label: '光电', value: 3 },
      { label: '软件', value: 4 },
      { label: '其它', value: 5 },
    ],
  },
];

export default Vue.extend({
  data() {
    return {
      filterValue: {
        type: 1 as number,
        basic: 0 as number, // 单本1 整本2
        grade: 0 as number,
        college: 0 as number,
      },
      filterPaneOpen: false,
      searchKeyword: '',
      searchActive: false,
      // Good List Data
      goodList: [{
        title: '微积分',
        desc: '三里河哪里有卖民心里舒服只能怪',
        restNum: 0,
        price: 12,
        imageUrl: 'https://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
      }],
    };
  },
  computed: {
    typeFilterTabActiveIndex(): number {
      return this.filterValue.type + 1;
    },
  },

  methods: {
    onSearchSubmit() {
      window.alert(this.searchKeyword);
    },
  },

});
</script>

<style lang="scss" scoped>
@import '~@/styles/_vars.scss';

.market-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.market-list_filter-tab {
  flex: 0;
}
.market-list_search-bar {
  display: flex;
  flex: 0;
  background: #f0f0f0;
}
.market-list_search-input {
  flex: 1;
  // padding:
}
.market-list_filter-btn {
  // flex: 0 0;
  width: 5em;
  padding: 0;
  border: none;
  background: none;
  font-size: 14px;
}
.market-list_filter-btn_icon {
  margin: 0 0.4em;
}
.market-list_body {
  overflow: auto;
  flex: 1;
  background: $page-gray-bg;
}

.market-list_good-card {
  width: 100%;
  margin-bottom: 1em;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
  background: white;
  .van-card {
    background: transparent;
  }
}

</style>


