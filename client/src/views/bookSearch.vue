<template>
  <div class="component-eBookSearch md-xs">
    123
<!--    <div class="container">-->
<!--      <div class="search-length padMargin" v-show="!firstIn">共检索到<span>{{searchCount}}</span>条关于 {{keywords}} 的结果</div>-->
<!--      <div class="row">-->
<!--        &lt;!&ndash; 搜索结果列表 &ndash;&gt;-->
<!--        <ul class="search-result-lists padMargin">-->
<!--          <li v-for="item in bookResult"-->
<!--              :key="item.bookName">-->
<!--            <router-link-->
<!--              :to="{path: item.skipUrl}"-->
<!--              target="_blank"-->
<!--            >-->
<!--              <div class="component-book-info clearfix">-->
<!--                <span class="book-cover"><img :src="item.fcover" alt="" class="img-responsive"></span>-->
<!--                <div class="book-about">-->
<!--                  <h3 class="book-name">{{item.ftitle}}</h3>-->
<!--                  &lt;!&ndash; 书籍类型 &ndash;&gt;-->
<!--                  <div class="book-author-publish">-->
<!--                    <p><i class="iconfont icon-user-avatar"></i>{{item.fauthor}}</p>-->
<!--                    <p><i class="iconfont icon-chubanshe"></i>{{item.fpublisher}}-->
<!--                      <template v-if="item.publishDate">-->
<!--                        | {{item.publishDate}}年-->
<!--                      </template>-->
<!--                    </p>-->
<!--                  </div>-->
<!--                  <p class="book-intro">{{item.fsummary}}</p>-->
<!--                </div>-->
<!--              </div>-->
<!--            </router-link>-->
<!--          </li>-->
<!--        </ul>-->

<!--        &lt;!&ndash; 无数据提示 &ndash;&gt;-->
<!--        <none-data-->
<!--          v-show="!bookResult.length && !loading && !firstIn"-->
<!--          msg="请搜索其他关键词"-->
<!--        ></none-data>-->

<!--        &lt;!&ndash; 第一次进入页面，搜索内容为空 &ndash;&gt;-->
<!--        <none-search-->
<!--          v-if="firstIn"-->
<!--        ></none-search>-->

<!--        &lt;!&ndash; 加载更多 &ndash;&gt;-->
<!--        <load-more @more-data="viewMore" :current="currentPage" :total="totalPage" :load="loading" v-show="bookResult.length"></load-more>-->

<!--        &lt;!&ndash; 分页 &ndash;&gt;-->
<!--        <div class="pagination-wrap">-->
<!--          <pagination ref="pbPager"-->
<!--                      :current="currentPage"-->
<!--                      :total="totalPage"-->
<!--                      @page-change="pageChange"-->
<!--          ></pagination>-->
<!--        </div>-->
<!--        &lt;!&ndash; loading &ndash;&gt;-->
<!--        <loading class="lend-loading" v-show="loading"></loading>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
    let self = null; // 自定义变量存储实例this

    export default {
        name: "bookSearch",
        // data () {
        //     return {
        //         // isMobile: this.$store.state.isMobile,
        //         coverLinks: this.$store.state.bookCoverLinks,
        //
        //         // 搜索结果列表
        //         bookResult: [],     // 图书
        //         // magazineResult: [], // 期刊
        //         firstIn: true,  // 刚进入页面
        //         searchCount: 0,
        //         // 分页
        //         currentPage: 1,
        //         totalPage: 0,
        //         maxLength: 20,
        //         loading: true,
        //         keywords: '',
        //         // url传参
        //         // queryparams: {},
        //
        //         // 无更多数据提示文本
        //         // noMoreData: false,
        //     };
        // },
        //
        // created () {
        //     self = this;
        //     // self.queryparams = self.$route.query;
        //     // 默认显示搜索框
        //     // self.commitEvent('changeSearchBar', true); // 显示搜索框
        // },
        //
        // computed: {
        //     getSearchEvent () {
        //         return this.$store.state.searchEvent || '';
        //     },
        //     isMobile () {
        //         return this.$store.state.isMobile;
        //     }
        //     // showNoneDataType () {
        //     //   return this.bookResult;
        //     // }
        // },
        //
        // watch: {
        //     getSearchEvent (newVal, oldVal) {
        //         // console.log('watch')
        //         self.init();
        //     }
        // },
        //
        // components: {
        //     // bookInfo,
        //     // loadMore,
        //     // noneSearch
        // },
        //
        // mounted () {
        //     this.chekQuery();
        //     self.commitEvent('changeSearchBar', true);
        //     self.init();
        // },
        //
        // destroyed () {
        //     self.commitEvent('changeSearchBar', false); // 离开检索页即隐藏搜索框
        // },
        //
        // methods: {
        //     chekQuery () {
        //         this.keywords = this.$route.query.skw || "";
        //         this.$router.replace({
        //             query: {}
        //         });
        //     },
        //     init () {
        //         self.initList();
        //         self.getIPAC(1);
        //     },
        //     initList () { // 初始化列表
        //         self.bookResult.length = 0;
        //         self.currentPage = 1;
        //         self.totalPage = 0;
        //
        //         // 页码初始化
        //         this.$refs.pbPager.init();
        //     },
        //     getIPAC (pageNum) {
        //         if (!self.getSearchEvent && !this.keywords) {
        //             // console.log('000000000');
        //             self.loading = false;
        //             return;
        //         }
        //         // console.log('ss', self.getSearchEvent)
        //         // let skw = "";
        //         if (self.getSearchEvent) {
        //             this.keywords = self.getSearchEvent;
        //         } else {
        //             // this.keywords = self.getSearchEvent;
        //         }
        //         // console.log('kw', this.keywords)
        //         self.firstIn = false;
        //         self.loading = true;
        //         ebookSearch.getIPAC({
        //             keywords: this.keywords,
        //             page: pageNum
        //         })
        //             .then(res => {
        //                 if (res.code == -1) {
        //                     self.loading = false;
        //                     return;
        //                 }
        //                 let data = res.result.bm;
        //                 if (!data.length) {
        //                     self.loading = false;
        //                     self.searchCount = 0;
        //                     return;
        //                 }
        //
        //                 let tempArr = data.map((item, index) => {
        //                     return {
        //                         ftitle: item.title,
        //                         fcover: `${self.coverLinks}${item.bookid}`,
        //                         fauthor: item.author || '暂无作者',
        //                         fpublisher: item.publisher || '暂无出版社信息',
        //                         fpublishdate: item.publishdate,
        //                         fbookid: item.bookid,
        //                         fsummary: self.utils.replacePunctuation(decodeURIComponent(item.summary)) || '暂无简介',
        //                         skipUrl: `/index/pBookDetails?bid=${item.bookid}&type=zbook`
        //                     };
        //                 });
        //                 self.loading = false;
        //                 self.currentPage = pageNum;
        //                 self.totalPage = Math.ceil(res.result.maxrows / self.maxLength);
        //                 self.searchCount = res.result.maxrows;
        //                 // Mobile 点击 加载更多 -> 追加数据
        //                 if (self.isMobile) {
        //                     // self.commitEvent('changeSearchBar', false);
        //                     self.bookResult.push(...tempArr);
        //                     // if (self.currentPage === self.totalPage) {
        //                     //   self.noMoreData = true;
        //                     // }
        //                     return;
        //                 }
        //                 self.bookResult = tempArr;
        //             }).catch((error) => {
        //             if (error === '10001') {
        //                 let t = setTimeout(() => {
        //                     self.getIPAC(1);
        //                     clearTimeout(t);
        //                 }, 500);
        //             }
        //         });
        //     },
        //     pageChange (pageNum) {
        //         window.scrollTo(0,0);
        //         // self.bookResult.length = 0;
        //         self.getIPAC(pageNum);
        //     },
        //     viewMore () {
        //         // if (self.noMoreData) {
        //         //   return;
        //         // }
        //         self.currentPage ++;
        //         self.getIPAC(self.currentPage);
        //     }
        // }
    }
</script>

<style scoped>

</style>
