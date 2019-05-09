<template>
  <div>
    <div style="margin-top: 15px;">
      <!--      分类浏览-->
      <el-input
        placeholder="请输入内容"
        v-model="Form.input"
        class="input-with-select"
        @keyup.enter.native="submit"
      >
        <el-select v-model="Form.select" slot="prepend" placeholder="请选择">
          <el-option label="题名" value="ztm"></el-option>
          <el-option label="责任者" value="zrz"></el-option>
          <el-option label="ISBN号" value="isbn"></el-option>
          <el-option label="索书号" value="ssh"></el-option>
          <el-option label="出版方" value="cbs"></el-option>
        </el-select>
        <span>关键词不能为空</span>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="submit"
        ></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      Form: {
        select: this.$route.query.select || "ztm",
        input: this.$route.query.input || ""
      }
    };
  },
  methods: {
    submit() {
      if (this.Form.input) {
        this.$router.push({
          path: "/library/bookSearch",
          query: { select: this.Form.select, input: this.Form.input }
        });
      } else {
        this.$message.warning("关键词不能为空！");
      }
    }
  }
};
</script>

<style scoped>
.el-select {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
