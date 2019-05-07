<template>
  <div class="none-data-tip">
    <div class="none-ico"></div>
    <div>{{msg}}</div>
  </div>
</template>

<script>
    export default {
        name: "noneData",
        props: {
            msg: {
                type: String,
                default: '暂无数据'
            },
        },
    }
</script>

<style scoped>
  .none-data-tip {
    text-align: center;
    color: #999;
    font-size: 14px;
  }
  .none-data-tip .none-ico {
    display: inline-block;
    width: 167px;
    height: 260px;
    background: url('../assets/none-data.png') no-repeat center;
    background-size: 100%;
  }
  @media only screen and (max-width: 767px) {
    .none-data-tip .none-ico {
      width: 100px;
      height: 140px;
    }

  }
  @media only screen and (max-width: 768px) {
    .none-data-tip {
      display: table;
      margin: 60px auto 0;
    }

  }

</style>
