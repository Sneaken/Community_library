<template>
  <div class="index">
    <HeadNav></HeadNav>
    <LeftMenu></LeftMenu>
    <div class="rightContainer">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeadNav from "../../components/HeadNav";
import LeftMenu from "../../components/Staff/LeftMenu";

export default {
  name: "index",
  components: {
    HeadNav,
    LeftMenu
  }
};
</script>

<style scoped>
.index {
  height: 100%;
  overflow: hidden;
}
/*.rightContainer {*/
/*  position: relative;*/
/*  top: 0;*/
/*  left: 180px;*/
/*  width: calc(100% - 180px);*/
/*  height: calc(100% - 71px);*/
/*  overflow: auto;*/
/*  text-align: center;*/
/*}*/
.rightContainer {
  position: fixed;
  top: 71px;
  left: 180px;
  width: calc(100% - 180px);
  height: calc(100% - 71px);
  overflow: auto;
}
</style>
