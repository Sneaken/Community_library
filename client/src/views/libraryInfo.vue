<template>
  <div class="info">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/library' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/library/infoList' }"
        >公告列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>详细信息</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="infos">
      <h2>{{ info.title }}</h2>
      <p v-html="infohtml"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: "libraryInfo",
  data() {
    return {
      info: {
        title: this.$route.query.title,
        content: ''
      }
    };
  },computed:{
      infohtml(){
                  return this.info.content.replace(/：\s/g,":<br\>").replace(/。\s/g, "。<br\>");
      },
    },methods:{
        getInfo() {
            this.$axios.post("/api/generalPurpose/findInfo",{title:this.info.title}).then(res => {
                if (res.data.success) {
                    this.info = res.data.data;
                }
            });
        }
    },created () {
      this.getInfo()
    }
};
</script>

<style scoped>
.info {
  width: 1030px;
  margin: 50px auto;
  line-height: 25px;
}
.infos {
  font-size: 20px;
  border: 1px solid #959ca5;
  margin-top: 10px;
}
.infos h2 {
  display: block;
  font-size: 30px;
  padding: 30px 40px 10px;
}
.infos p {
  font-size: 22px;
  text-align: left;
  line-height: 50px;
  padding: 10px 80px;
}

</style>
