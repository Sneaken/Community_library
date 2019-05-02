<template>
  <div class="component-search" v-show="showSearchArea" @click.stop="searchBarClick">
    <div class="container">
      <div class="row">
        <div class="search-area unityPadding clearfix">
          <div class="search-select-item" ref="sitem">
            <strong
              class="book-search"
              :class="{active: showSearchList}"
              @click="searchListAction()"
            >{{currentSearchType}}</strong>
            <ul class="search-list" v-show="showSearchList">
              <li
                v-for="(item, index) in searchList"
                :key="item.name"
                :class="{active: index === currentSelect}"
                @click="chooseSearchType(index, item.sty, item.name, $event)"
              >{{item.name}}</li>
            </ul>
          </div>
          <!-- <div class="search-input" :style="{'padding-left': currentSize}"> -->
          <div class="search-input">
            <div class="search-icon" @click="searchAction"><i class="iconfont icon-search2"></i><span class="hidden-xs">搜索</span></div>
            <input
              type="text"
              placeholder="搜索关键字"
              v-model="keyword"
              :autofocus="true"
              @keyup.enter="searchAction"
            >
            <i class="iconfont icon-close-bg clear-input" @click="clearKeyWord"></i>
          </div>
          <button class="search-btn visible-xs" @click="searchAction">检索</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "search",
        data () {
            return {
                // 检索类型选择
                showSearchList: false,
                currentSelect: 0,
                searchList: [{
                    name: '书目检索',
                    order: 0,
                    sty: 'pbook'
                }, {
                    name: '电子书检索',
                    order: 1,
                    sty: 'ebook'
                }, {
                    name: '资源发现',
                    order: 2,
                    sty: ''
                }],
                currentSize: null,

                // 搜索关键字
                keyword: this.$route.query.skw || ""
            };
        },

        created () {
            self = this;

            // let sty = self.ls.getItem('searchType');
            // self.currentSelect = sty === 'ebook' ? 1 : 0;
        },

        computed: {
            /**
             * [showSearchArea 显示检索输入框]
             */
            showSearchArea () {
                return self.$store.state.showSearchBar;
            },
            /**
             * [currentSearchType 当前选择检索类型]
             */
            currentSearchType () {
                return self.searchList[self.currentSelect].name;
            }
        },

        mounted() {
            // 隐藏搜索栏
            document.addEventListener('click', self.hideSearch)
        },
        destroyed () {
            document.removeEventListener('click', self.hideSearch)
        },

        methods: {
            hideSearch (e) {
                let currentPage = self.$route.name;
                // 搜索页不隐藏搜索框
                if (currentPage === 'pBookSearch' || currentPage === 'eBookSearch') {
                    if (self.showSearchList) {
                        self.showSearchList = false;
                    }

                    return;
                }
                if (!self.$store.state.showSearchBar) {
                    return;
                }
                if (!self.$el.contains(e.target)) {
                    self.showSearchList = false;
                    self.commitEvent('changeSearchBar', false);
                }
            },
            searchBarClick (e) {  // 隐藏检索类型
                if (!self.showSearchList) {
                    return;
                }
                if (!self.$refs.sitem.contains(e.target)) {
                    self.showSearchList = false;
                }
            },
            /**
             * [searchListAction 检索类型展开事件]
             */
            searchListAction () {
                self.showSearchList = !self.showSearchList;
                // console.log(self.showSearchList);
            },
            /**
             * [chooseSearchType 选择搜索类型]
             * @param {Int} index 当前选择类型的索引
             * @param {Int} type 类型表示
             * @param {String} name 所选类型中文名
             * @param {Object} ev 当前事件对象
             */
            chooseSearchType (index, sty, name, ev) {
                self.currentSelect = index;
                self.searchListAction();
                // self.ls.setItem('searchType', sty);

                // if ( !self.isMobile ) {
                //   self.currentSize = `${ev.target.offsetWidth + 13}px`;
                // }
            },
            /**
             * 清除关键词
             */
            clearKeyWord () {
                self.keyword = '';
                self.commitEvent('changeSearchEvent', '');
            },
            /**
             * [searchAction 检索按钮事件]
             */
            searchAction () {
                if (self.keyword === '') {
                    alert('搜索关键字不能为空');
                    return;
                }
                if (self.currentSelect === 2) {
                    // 资源发现 - 跳转外链
                    // location.href = `http://en.shl.findplus.cn/?h=search_list&query=${self.keyword}`;
                    // 中英文跳转
                    let zw_yw = "cn";
                    if (/[\u4e00-\u9fa5]/.test(self.keyword)) {
                        zw_yw = "cn";
                    } else {
                        zw_yw = "en";
                    }
                    let url = "http://"+zw_yw+".shl.findplus.cn/?h=search_list&query=" + encodeURIComponent(self.keyword) + "&action[addexpander][]=fulltext";
                    window.open(url);

                    return;
                }

                let currentPage = self.$route.name; // 当前页面名
                // 传递搜索按钮事件
                self.commitEvent('changeSearchEvent', new String(self.keyword));

                // 当选择搜索类型为 `电子书检索`, `书目检索` 时, 跳转 电子书检索结果页, 其他跳转第三方页面
                if (self.currentSelect === 0) {
                    if (currentPage === 'pBookSearch') return;
                    self.openNewPage({
                        path: `/index/pBookSearch`
                    });

                    return;
                }

                if (self.currentSelect === 1) {
                    if (currentPage === 'eBookSearch') return;
                    self.openNewPage({
                        newwin: true,
                        path: `/eBook/eBookSearch`,
                        query: {skw: self.keyword}
                    });

                    return;
                }
            }
        }
    }
</script>

<style scoped>

</style>
