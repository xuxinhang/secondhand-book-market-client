<template>
  <div class="market-list">
    <!-- 筛选侧边栏 -->
    <div :class="{'market-list_filter-pane-wrapper': true, 'closed': !filterPaneOpen}">
      <div class="market-list_filter-pane_mask" @click="onFilterPaneCancel" />
      <aside class="market-list_filter-pane">
        <div class="market-list_filter-pane_body">
          <div v-for="ft in filterPaneList" :key="ft.name" class="market-list_filter-pane_block">
            <div class="market-list_filter-pane_title">{{ft.label}}</div>
            <div class="market-list_filter-pane_select">
              <tag-select
                :tags="ft.tags"
                :active="filterValue[ft.name]"
                @change="setFilterValue(ft.name, $event)"
              />
            </div>
          </div>
        </div>
        <div class="market-list_filter-pane_bottom">
          <van-button class="filter-reset-btn" text="重置" square @click="onFilterPaneReset" />
          <van-button type="primary" square="" text="完成" @click="onFilterPaneDone" />
        </div>
      </aside>
    </div>
    <div class="market-list_filter-tab">
      <van-tabs v-model="typeFilterTabActiveIndex" :line-height="2" color="#ff7d7e">
        <van-tab title="单本出售"></van-tab>
        <van-tab title="整套租售"></van-tab>
      </van-tabs>
    </div>
    <section class="market-list_search-bar">
      <div class="market-list_search-input">
        <van-search
          v-model="searchKeyword"
          placeholder="搜索图书"
          :show-action="!!storeSearchKeyword"
          @search="onSearchSubmit"
          @cancel="onSearchCancel"
          @clear="onSearchClear"
        />
      </div>
      <button class="market-list_filter-btn" @click="openFilterPane">
        筛选<van-icon class="market-list_filter-btn_icon" name="star" size="1.25em" color="#ffab5a" />
      </button>
    </section>
    <div class="market-list_body">
      <div class="market-list_list-loading" v-if="goodListLoading">
        <span class="loading-wrap">
          <van-loading type="spinner" color="white" />
        </span>
      </div>
      <div v-else-if="goodList.length === 0" class="market-list_list-empty">
        <empty-placeholder
          iconName="warn-o"
          title="没有符合条件的图书"
          desc="请修改关键字或条件后重新搜索"
        />
      </div>
      <template v-else v-show="!goodListLoading">
        <div v-for="item in goodList" class="market-list_good-card" :key="item.goodId">
          <van-card
            :desc="item.desc"
            :price="formatPrice(item.price).join('.')"
            :thumb="item.imgUrl"
            centered
            @click="onCardClick(item.goodId)"
          >
            <div slot="title" class="van-card__title">
              {{item.title}}
              <span v-if="item.restNum === 0" class="market-list_waiting-tip">
                <van-tag color="#ffae57" size="medium">补货中</van-tag>
              </span>
            </div>
          </van-card>
        </div>
        <div class="page-content-footer">
          服务无底线
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TagSelect from '@/components/TagSelect.vue';
import EmptyPlaceholder from '@/components/EmptyPlaceholder.vue';
import { formatPrice } from '@/utils/utils';

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
  components: {
    TagSelect,
    EmptyPlaceholder,
  },

  data() {
    return {
      filterPaneList: tagList,
      // 这是过滤器值的缓存，真正的值在Vuex里面
      filterValue: { // 0 null 代表没有选中
        type: 1 as number,
        basic: 0 as number, // 单本1 整套2
        grade: 0 as number,
        college: 0 as number,
      },
      filterPaneOpen: false,
      // 这是搜索缓存，真正的值在Vuex里面
      searchKeyword: '',
      searchActive: false,
      goodListLoading: false,
      // Good List Data
      // goodList: [{
      //   title: '微积分',
      //   desc: '三里河哪里有卖民心里舒服只能怪',
      //   restNum: 0,
      //   price: 12,
      //   imgUrl: 'https://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
      // }],
    };
  },
  computed: {
    typeFilterTabActiveIndex: {
      get(): number {
        return this.$store.getters['market/filter'].type - 1;
      },
      set(tabIndex: number) {
        const val = tabIndex + 1;
        if (this.filterValue.type === val) { return; }
        this.filterValue.type = val;
        this.pushFilterToStore();
      },
    },
    // Vuex Store 中的关键字
    storeSearchKeyword: {
      get(): string {
        return this.$store.state.market.searchKeyword;
      },
      set(kw: string) {
        this.$store.commit('market/setSearchKeyword', kw);
      },
    },
    goodList() {
      return this.$store.state.market.list;
    },
  },

  methods: {
    formatPrice,
    onCardClick(targ: number) {
      this.$router.push(`/market/${targ}`);
    },
    // Search box
    onSearchSubmit() {
      this.storeSearchKeyword = String(this.searchKeyword).trim();
      this.fetchGoodList();
    },
    pullSearchKeyword() {
      this.searchKeyword = this.storeSearchKeyword;
    },
    onSearchCancel() {
      // 取消搜索相当于提交空关键字
      this.searchKeyword = this.storeSearchKeyword = '';
      this.fetchGoodList();
    },
    onSearchClear() {
      this.searchKeyword = '';
    },
    setFilterValue(name: string, value: any) {
      Vue.set(this.filterValue, name, value);
    },
    // Filter Pane
    openFilterPane() {
      this.filterPaneOpen = true;
      this.pullFilterToStore();
    },
    onFilterPaneReset() {
      this.onFilterPaneCancel();
      this.$store.commit('market/resetFilter');
      this.fetchGoodList();
    },
    onFilterPaneDone() {
      this.onFilterPaneCancel();
      this.pushFilterToStore();
    },
    onFilterPaneCancel() {
      this.filterPaneOpen = false;
    },
    // Vuex Sync
    pushFilterToStore() {
      this.$store.commit('market/updateFilter', this.filterValue);
      this.fetchGoodList();
    },
    pullFilterToStore() {
      this.filterValue = { ...this.$store.getters['market/filter'] };
    },
    // 获取数据
    fetchGoodList() {
      this.goodListLoading = true;
      this.$store.dispatch('market/fetchGoodList')
        .then(() => {
          this.goodListLoading = false;
        })
        .catch(({ stat }) => {
          this.goodListLoading = false;
          this.$toast.fail(stat.frimsg);
        });
    },
  },

  mounted() {
    if (!this.$store.state.market.listReady) {
      this.pushFilterToStore();
    }
    this.pullSearchKeyword();
  },

});
</script>

<style lang="scss" scoped>
@import '~@/styles/_vars.scss';

.market-list {
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.market-list_filter-tab {
  flex: 0;
  .van-tabs__nav {
    background-color: transparent;
  }
}
.market-list_search-bar {
  display: flex;
  flex: 0;
  background: $gray-delt;
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
.market-list_list-loading {
  padding: 1em;
  text-align: center;
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

.market-list_waiting-tip {
  font-weight: normal;
  margin-left: 0.4em;
}

@mixin filter-pane-transition {
  transition: cubic-bezier(.08,.82,.17,1) 0.6s;
}

.market-list_filter-pane-wrapper {
  &.closed {
    visibility: hidden;
    .market-list_filter-pane {
      transform: translateX(105%);
    }
    .market-list_filter-pane_mask {
      opacity: 0;
    }
  }
  position: absolute;
  z-index: 100;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  @include filter-pane-transition;
}

.market-list_filter-pane_mask {
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,0.1);
  @include filter-pane-transition;
}

.market-list_filter-pane {
  display: flex;
  flex-direction: column;
  position: absolute;
  box-sizing: border-box;
  padding: 0.2em 0 0 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 18.75em;
  background: white;
  box-shadow: -1px 0.1em 0.16em 0 rgba(0,0,0,0.40);
  @include filter-pane-transition;
}

.market-list_filter-pane_body {
  flex: 1;
  overflow: auto;
}

.market-list_list-loading {
  padding: 2em;
  & > .loading-wrap {
    display: inline-block;
    margin: 0 auto;
    background: rgba(0,0,0,0.5);
    padding: 0.8em;
    border-radius: 0.2em;
  }
}

.market-list_filter-pane_block {
  padding: 0.75em 3.37em 0.75em 1.28em;
  border-bottom: 1px solid #ededed;
}

.market-list_filter-pane_title {
  font-size: 0.69em;
  color: #9b9b9b;
  margin-bottom: 0.84rem;
}

.market-list_filter-pane_select {
  font-size: 0.875rem;
}

.market-list_filter-pane_bottom {
  display: flex;
  flex: 0;
  & > button {
    flex: 1;
  }
  .filter-reset-btn {
    border-style: solid none none none;
    color: $primary-color;
  }
}

.page-content-footer {
  display: flex;
  margin: 1.6em 2em;
  align-items: center;
  color: $gray-gamma;
  font-size: 0.7em;
  &::before, &::after {
    content: '';
    flex: 1;
    margin: 0 2em;
    height: 1px;
    background: rgba($gray-gamma, 0.4);
  }
}

</style>

<style lang="scss">
.market-list_search-bar {
  .van-search {
    background: transparent !important;
  }
  .van-search__content {
    background: white;
  }
}
</style>



