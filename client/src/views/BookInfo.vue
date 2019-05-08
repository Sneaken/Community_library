<template>
  <div>
    <div class="component-BookInfo">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/library' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>图书详情</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 图书简介 -->
      <div class="container">
        <div>
          <!-- 图书概览 -->
          <div class="row">
            <img src="../assets/book.jpg" alt="" width="120" height="173" />

            <div class="book-about">
              <h3 class="book-name">{{ book.ztm }}</h3>
              <p>索书号: {{ book.ssh }}</p>

              <!-- 书籍类型 -->
              <div class="book-zrz-cbs">
                <p><i class="el-icon-user"></i>{{ book.zrz }}</p>
                <p>
                  <i class="el-icon-notebook-2"></i>{{ book.cbs }}
                  <template v-if="book.datestr">
                    | {{ book.datestr }}年
                  </template>
                </p>
              </div>
            </div>
          </div>
          <!-- 简介 -->
          <div class="book-about-container">
            <div class="component-title">
              <h2 class="column-title">
                <span class="line"></span>
                <span>简介</span>
                <span class="line"></span>
              </h2>
            </div>

            <!-- 简介内容 -->
            <p class="book-intro-y" v-if="book.content">{{ book.content }}</p>
            <p class="book-intro-n" v-else>暂无简介</p>
          </div>

          <!-- 馆藏 -->
          <div class="collection padMargin">
            <div class="component-title">
              <h2 class="column-title">
                <span class="line"></span>
                <span>馆藏</span>
                <span class="line"></span>
              </h2>
            </div>
            <!-- 馆藏书籍列表 -->
            <div class="collection-container">
              <!-- 详细馆藏列表 -->
              <el-table
                :data="book.book_storage"
                height="250"
                style="width: 100%"
              >
                <el-table-column
                  align="center"
                  label="复本／藏书记录"
                >
                  <el-table-column
                    prop="storage.label"
                    label="条码号"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column prop="ssh" label="索书号"> </el-table-column>
                  <el-table-column prop="storage.status" label="状态">
                  </el-table-column>
                  <el-table-column prop="address" label="应还日期">
                  </el-table-column>
                  <el-table-column prop="address" label="典藏地">
                  </el-table-column>
                  <el-table-column prop="address" label="预约"> </el-table-column>
                </el-table-column>
              </el-table>

              <!--            &lt;!&ndash; 无数据提示 &ndash;&gt;-->
              <!--            <none-data-->
              <!--              v-if="!book.book_storage.length"-->
              <!--              msg="暂无馆藏信息"-->
              <!--              :custom-style="{ 'padding-top': '15px' }"-->
              <!--            ></none-data>-->
            </div>
          </div>

          <div class="component-title">
            <h2 class="column-title">
              <span class="line"></span>
              <span>预约信息</span>
              <span class="line"></span>
            </h2>
          </div>
          <!-- 预约信息 -->
          <el-table :data="book.book_storage" height="250" style="width: 100%">
            <el-table-column prop="date" label="条码号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="馆藏单位" width="180">
            </el-table-column>
            <el-table-column prop="address" label="典藏地"> </el-table-column>
            <el-table-column prop="address" label="典藏地"> </el-table-column>
            <el-table-column prop="address" label="典藏地"> </el-table-column>
          </el-table>

          <!--        &lt;!&ndash; 无数据提示 &ndash;&gt;-->
          <!--        <none-data-->
          <!--          v-if="!book.book_storage.length"-->
          <!--          msg="暂无馆藏信息"-->
          <!--          :custom-style="{ 'padding-top': '15px' }"-->
          <!--        ></none-data>-->
        </div>
      </div>
    </div>
    <!-- footer -->
    <footer class="footer">
      <site-footer></site-footer>
    </footer>
  </div>
</template>

<script>
import noneData from "../components/noneData";
import siteFooter from "../components/footer";
export default {
  name: "BookInfo",
  data() {
    return {
      book: {}
    };
  },
  components: {
    noneData,
    siteFooter
  },
  created() {
    this.getBookInfo();
  },
  methods: {
    getBookInfo() {
      this.$axios
        .get("/api/generalPurpose/getBookInfo", {
          params: {
            ssh: this.$route.query.ssh
          }
        })
        .then(res => {
          if (res.data.success) {
            this.book = res.data.data.book_info;
          } else {
            this.book = {};
          }
        });
    }
  }
};
</script>

<style scoped>
.component-BookInfo {
  width: 1000px;
  margin: 40px auto;
}
.el-breadcrumb {
  margin-bottom: 20px;
}
.row {
  padding-bottom: 50px;
  border-bottom: 1px solid #e0e5e8;
}
.book-about {
  display: inline-block;
  width: 500px;
  line-height: 28px;
  padding-left: 100px;
  vertical-align: top;
}
.book-about .book-zrz-cbs {
  color: #959ca5;
  padding-top: 63px;
}

.book-about .book-intro-y {
  width: 700px;
  margin-top: 10px;
}
.column-title {
  font-size: 18px;
  margin: 30px 0;
  text-align: center;
}
.line {
  display: inline-block;
  width: 40px;
  border-top: 3px solid #ccc;
  vertical-align: middle;
  margin: 0 20px;
}
.footer {
  padding-left: 150px;
}
</style>
