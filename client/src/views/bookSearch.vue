<template>
  <div class="continer">
    <search class="search"></search>
    <div class="component-eBookSearch md-xs">
      <div class="search-length">
        共检索到<span class="search-count">{{ searchCount }}</span
        >条关于 {{ keywords }} 的结果
      </div>
      <!-- 搜索结果列表 -->
      <ul class="search-result-lists">
        <li v-for="item in bookResult" :key="item.bookName" class="row">
          <!--            <router-link-->
          <!--              :to="{path: item.skipUrl}"-->
          <!--              target="_blank"-->
          <!--            >-->
          <img src="../assets/book.jpg" alt="" width="120" height="173" />

          <div class="book-about">
            <h3 class="book-name">{{ item.ztm }}</h3>
            <!-- 书籍类型 -->
            <div class="book-author-publish">
              <p><i class="el-icon-user-solid"></i>{{ item.zrz }}</p>
              <p>
                <i class="iconfont icon-chubanshe"></i>{{ item.cbs }}
                <template v-if="item.datestr">
                  | {{ item.datestr }}年
                </template>
              </p>
            </div>
            <p class="book-intro" v-if="item.content">{{ item.content }}</p>
            <p class="book-intro" v-else>暂无简介</p>
          </div>
          <!--            </router-link>-->
        </li>
      </ul>

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
    </div>
    <!-- footer -->
    <!--      <footer class="footer">-->
    <!--        <site-footer></site-footer>-->
    <!--      </footer>-->
  </div>
</template>

<script>
import search from "../components/search";
import siteFooter from "../components/footer";
export default {
  name: "bookSearch",
  data() {
    return {
      //         // 搜索结果列表
      bookResult: [], // 图书
      //         // magazineResult: [], // 期刊
      //         firstIn: true,  // 刚进入页面
      //         // 分页
      //         currentPage: 1,
      //         totalPage: 0,
      //         maxLength: 20,
      //         loading: true,
      keywords: this.$route.query.input
      //         // url传参
      //         // queryparams: {},
      //
      //         // 无更多数据提示文本
      //         // noMoreData: false,
    };
  },
  created() {
    this.getBookList();
    // history.go(0)
  },
  //
  computed: {
      searchCount () {
          return this.bookResult.length;
      }
  },
  components: {
    // bookInfo,
    // loadMore,
    // noneSearch
    search,
    siteFooter
  },
  methods: {
    getBookList() {
      this.$axios
        .get("/api/generalPurpose/find", {
          params: {
            input: this.$route.query.input
          }
        })
        .then(res => {
          if (res.data.success) {
            this.bookResult = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
      // history.go(0);
    }
  }
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
};
</script>

<style scoped>
  .continer{
  }
  .search {
    width: 800px;
    margin: 0 auto;
  }
  .el-icon-user-solid{
    width: 20px;
    height: 20px;
  }
  .search-length{
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #999;
    text-align: center;
  }
  .component-eBookSearch.md-xs{
    padding-top: 19px;
  }
  .search-count{
    color:#5c7bc8;
    padding: 0 4px;
  }
.search-result-lists {
  padding: 20px;
}
.search-result-lists .row {
  width: 1000px;
  height: 200px;
  line-height: 25px;
  margin: 0 auto 20px;
  border-bottom: 1px solid #E0E5E8;
}
.search-result-lists img {
  vertical-align: baseline;
}
.book-about {
  display: inline-block;
  width: 500px;
  line-height: 28px;
  padding-left: 100px;
}
.book-intro{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
-webkit-box-orient: vertical;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 250px;
  padding-left: 150px;
  background-color: aliceblue;
  z-index: 9999;
}
</style>
