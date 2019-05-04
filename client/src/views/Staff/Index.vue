<template>
  <div class="index">
    <HeadNav></HeadNav>
    <LeftMenu></LeftMenu>
    <div class="rightContainer">
      <keep-alive>
      <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
    import HeadNav from '../../components/HeadNav';
    import LeftMenu from "../../components/Staff/LeftMenu";

    export default {
        name: "index",
        components: {
            HeadNav,
            LeftMenu
        }
    }
</script>

<style scoped>
  .index {
    /*height: 100%;*/
    overflow: hidden;
  }
  .rightContainer {
    position: relative;
    top: 0;
    left: 180px;
    width: calc(100% - 180px);
    height: calc(100% - 71px);
    overflow: auto;
    text-align: center;
  }
</style>
