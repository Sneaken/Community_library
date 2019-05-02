<template>
  <!-- <div class="component-index" :style="{'padding-bottom': footerHeight}"> -->
  <div class="component-index">
    <!-- header -->
<!--    <header class="header">-->
<!--      <site-header></site-header>-->
      <!-- 搜索 -->
<!--      <search></search>-->
<!--    </header>-->

    <!-- 主内容 -->
    <router-view></router-view>
    <!-- 非主内容, 如Modal等 -->
    <router-link to="user/login">我的图书馆</router-link>

<!--    &lt;!&ndash;侧部信息 &ndash;&gt;-->
<!--    <lib-info></lib-info>-->

    <!-- footer -->
<!--    <footer class="footer">-->
<!--      <site-footer></site-footer>-->
<!--    </footer>-->
  </div>
</template>

<script>
    import search from '../components/search';      // 搜索框
    import Login from '../views/User/Login';  // 用户登录Modal
    // import siteHeader from '../components/header';      // 页头
    // import libInfo from '../components/libInfo';      // 侧部信息

    export default {
        name: "index",
        components: {
            search,
            Login,
            // siteHeader,
            // libInfo,
        },
    }
</script>

<style scoped>

</style>
