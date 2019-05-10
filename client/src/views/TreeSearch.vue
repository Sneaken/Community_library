<template>
  <div class="component-TreeSearch">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/library' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类浏览</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="classify">
      <el-tree :data="data" accordion @node-click="handleNodeClick"> </el-tree>
    </div>
    <div class="content">
      <ul class="search-result-lists">
        <li v-for="item in bookResult" :key="item.ssh" class="row">
          <router-link
            :to="{ path: '/library/bookInfo', query: { ssh: item.ssh } }"
            target="_blank"
            class="link"
          >
            <img src="../assets/book.jpg" alt="" width="120" height="173" />

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

      <!--       无数据提示-->
      <none-data
        v-show="!bookResult.length && checked"
        msg="请搜索其他关键词"
        class="none-data"
      ></none-data>
    </div>
  </div>
</template>

<script>
import siteFooter from "../components/footer";
import noneData from "../components/noneData";
export default {
  name: "TreeSearch",
  data() {
    return {
      data: [],
      bookResult: [], // 图书
      allTableData: [],
      filterTableData: [],
      footer: false,
      checked: false,
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
    this.getClassifyInfo();
  },
  methods: {
    handleNodeClick(data) {
      if (!data.children) {
        // console.log (data);
        this.checked = true;
        this.getBookList(data.id);
      }
    },
    getClassifyInfo() {
      this.$axios.post("/api/generalPurpose/getClassifyContent").then(res => {
        if (res.data.success) {
          this.data = res.data.data;
        } else {
          this.data = [];
        }
      });
    },
    getBookList(data) {
      this.$axios
        .get("/api/generalPurpose/findBook", {
          params: {
            input: data,
            select: "category_id"
          }
        })
        .then(res => {
          if (res.data.success) {
            // this.bookResult = res.data.data;
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
      // this.$nextTick(() => {
      //   //上滑到顶部
      //   window.scrollTo(0, 0);
      // });
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
  },
  components: {
    noneData,
    siteFooter
  }
};
</script>

<style scoped>
.component-TreeSearch {
  /*width: 80%;*/
  float: left;
  margin: 50px auto;
}
.classify {
  width: 500px;
  /*margin: 100px auto;*/
  float: Left;
}
.content {
  float: Left;
  padding-left: 470px;
}
.search-result-lists {
  display: inline;
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
  word-wrap: break-word;
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
.el-tree {
  position: fixed;
  top: 50px;
}
.el-breadcrumb {
  position: fixed;
  top: 35px;
}
  .none-data{
    position: fixed;
    top:250px;
    left:840px;
  }
</style>
