<template>
  <!-- <div class="component-index" :style="{'padding-bottom': footerHeight}"> -->
  <div class="component-index">
    <!--     header -->
    <header class="header">
      <!--      <site-header></site-header>-->
      <router-link to="user/login">我的图书馆</router-link>
    </header>

    <!--       搜索-->
    <search class="search"></search>

    <!-- 主内容 -->
    <router-view></router-view>

    <!-- footer -->
    <footer class="footer">
      <site-footer></site-footer>
    </footer>
  </div>
</template>

<script>
import search from "../components/search"; // 搜索框
import Login from "../views/User/Login"; // 用户登录Modal
import siteFooter from "../components/footer";

export default {
  name: "index",
  components: {
    search,
    Login,
    siteFooter
  }
};
</script>

<style scoped>
.search {
  width: 800px;
  margin: 250px auto;
}
.component-index {
  height: 750px;
  background: linear-gradient(180deg, #3498db, white);
  /*background-color: #3498db;*/
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
