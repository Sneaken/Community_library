<template>
  <div class="info">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/library' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <ul>
        <li v-for="(item, index) in InfoList" :key="index">
          <router-link
            :to="{
              name: 'info',
              params: { title: item.title, content: item.content }
            }"
          >
            <p>{{ item.title }}</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "libraryInfoList",
  data() {
    return {
      InfoList: []
    };
  },
  methods: {
    getInfo() {
      this.$axios.get("/api/generalPurpose/findInformation").then(res => {
        if (res.data.success) {
          this.InfoList = res.data.data;
        } else {
          console.log(2);
        }
      });
    }
  },
  created() {
    this.getInfo();
  }
};
</script>

<style scoped>
.info {
  width: 1000px;
  margin: 10px auto;
}
a{
  text-decoration: none;
}
a p {
  font-size: 20px;
  margin: 20px;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #999;
}
</style>
