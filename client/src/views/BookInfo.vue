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

            <el-image  :src="book.img_place" style="width: 120px; height: 173px" v-if="book.img_place"></el-image>
<!--            <img :src="book.img_place" alt="" width="120" height="173" v-if="book.img_place" />-->
            <img src="../assets/book.jpg" alt="" width="120" height="173" v-else />

            <div class="book-about">
              <h3 class="book-name">{{ book.ztm }}</h3>
              <p>索书号: {{ book.ssh }}</p>
              <p>ISBN: {{ book.isbn }}</p>
              <p>定价: {{ book.price }}</p>
              <p>页数: {{ book.pages }}</p>

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
                <el-table-column align="center" label="复本／藏书记录">
                  <el-table-column prop="book_label" label="条码号" width="180" align="center">
                  </el-table-column>
                  <el-table-column prop="status" label="状态" align="center">
                  </el-table-column>
                  <el-table-column
                    prop="should_still_return_time"
                    label="应还日期"
                    align="center"
                    :formatter="renderTime"
                  >
                  </el-table-column>
                  <el-table-column prop="collection_place" label="典藏地" align="center">
                  </el-table-column>
                  <el-table-column prop="reservation" label="预约" align="center">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="handleEdit(scope.row)"
                        >预约</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
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
          <el-table :data="book_reservate" height="250" style="width: 100%" >
            <el-table-column prop="book_label" label="条码号" width="180" align="center">
            </el-table-column>
            <el-table-column prop="collection_place" label="典藏地" width="180" align="center">
            </el-table-column>
            <el-table-column
              prop="time_of_appointment"
              label="预约时间"
              align="center"
              :formatter="renderTime"
            >
            </el-table-column>
            <el-table-column
              prop="ending_time_of_appointment"
              label="解约时间"
              align="center"
              :formatter="renderTime"
            >
            </el-table-column>
          </el-table>
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
      book: {},
      book_reservate: []
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
    renderTime(date, column) {
      if (date[column.property]) {
        return new Date(
          new Date(date[column.property]).getTime() + 16 * 3600 * 1000
        )
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
      }
      return "";
    },
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
            this.book_reservate = res.data.data.book_reservate;
          } else {
            // this.book = {};
            // this.book_reservate = {};
            this.$message.error(res.data.msg);
              this.$router.push('/library');
          }
        });
    },
    handleEdit(row) {
      this.$axios
        .post("/api/user/bookReservation", {
          book_label: row.book_label
        })
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          } else {
            this.$message.error(res.data.msg);
          }
        });
      this.getBookInfo();
    }
  },
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
  padding-bottom: 35px;
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
  padding-top: 10px;
}

.book-intro-y {
  text-indent: 2em;
  line-height: 20px;
  word-wrap:break-word;
}
.book-intro-n {
  margin-top: 30px;
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
