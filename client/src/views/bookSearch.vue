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
        <li v-for="item in bookResult" :key="item.ssh" class="row">
          <router-link
            :to="{ path: '/library/bookInfo', query: { ssh: item.ssh } }"
            target="_blank"
            class="link"
          >
            <el-image  :src="item.img_place" style="width: 120px; height: 173px" v-if="item.img_place" lazy></el-image>
            <img src="../assets/book.jpg" alt="" width="120" height="173" v-else />

            <div class="book-about">
              <h3 class="book-name">{{ item.ztm }}</h3>
              <!-- 书籍类型 -->
              <div class="book-zrz-cbs">
                <p><i class="el-icon-user"></i>{{ item.zrz }}</p>
                <p>
                  <i class="el-icon-notebook-2"></i>{{ item.cbs }}
                  <template v-if="item.datestr">
                    | {{ item.datestr }}年
                  </template>
                </p>
              </div>
              <p class="book-intro-y" v-if="item.content">{{ item.content }}</p>
              <p class="book-intro-n" v-else>暂无简介</p>
            </div>
          </router-link>
        </li>
      </ul>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-if="paginations.total > 0"
          :page-sizes="paginations.page_sizes"
          :page-size="paginations.page_size"
          :layout="paginations.layout"
          :total="paginations.total"
          :current-page.sync="paginations.page_index"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>

      <!-- 无数据提示 -->
      <none-data v-show="!bookResult.length" msg="请搜索其他关键词"></none-data>
    </div>
    <!-- footer -->
    <footer :class="{ footer: true, footer1: bookResult.length < 3 }">
      <site-footer></site-footer>
    </footer>
  </div>
</template>

<script>
import search from "../components/search";
import siteFooter from "../components/footer";
import noneData from "../components/noneData";
export default {
  name: "bookSearch",
  data() {
    return {
      // 搜索结果列表
      bookResult: [], // 图书
      allTableData: [],
      filterTableData: [],
      footer: false,
      keywords: this.$route.query.input,
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      }
    };
  },
  created() {
    this.getBookList();
  },

  computed: {
    searchCount() {
      return this.allTableData.length;
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.getBookList();
        }
      }
    },
    bookResult() {
      this.footer = true;
    }
  },
  components: {
    noneData,
    search,
    siteFooter
  },
  methods: {
    getBookList() {
      this.$axios
        .get("/api/generalPurpose/findBook", {
          params: {
            input: this.$route.query.input,
            select: this.$route.query.select
          }
        })
        .then(res => {
          this.keywords = this.$route.query.input;
          if (res.data.success) {
            this.allTableData = res.data.data;
            this.filterTableData = res.data.data;
            // 设置分页数据
            this.setPaginations();
          } else {
            this.bookResult = [];
            this.allTableData = [];
            this.filterTableData = [];
            this.setPaginations();
          }
        });
    },
    handleCurrentChange(page) {
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.bookResult = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
      this.$nextTick(() => {
        //上滑到顶部
        window.scrollTo(0, 0);
      });
    },
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.bookResult = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
      // 总页数
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认分页数据
      this.bookResult = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    }
  }
};
</script>

<style scoped>
.search {
  width: 800px;
  margin: 0 auto;
}
.search-length {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #999;
  text-align: center;
}
.component-eBookSearch.md-xs {
  padding-top: 19px;
}
.search-count {
  color: #5c7bc8;
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
  border-bottom: 1px solid #e0e5e8;
}

.search-result-lists .row .link {
  color: #959ca5;
}
.book-about {
  display: inline-block;
  width: 500px;
  line-height: 28px;
  padding-left: 100px;
  vertical-align: top;
}
.book-about .book-name {
  color: #333;
  font-weight: bolder;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-bottom: 20px;
}
.book-zrz-cbs {
  padding: 0 20px;
}
.book-about .book-intro-y {
  width: 700px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin-top: 10px;
  word-wrap:break-word;
}
.book-about .book-intro-n {
  margin-top: 30px;
}
.pagination {
  text-align: right;
}
.footer1 {
  position: fixed;
  bottom: 0;
}
.footer {
  padding-left: 150px;
}
</style>
