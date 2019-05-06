<template>
  <div>
    <div style="margin-top: 15px;">
      <!--      分类浏览-->
      <el-input
        placeholder="请输入内容"
        v-model="Form.input"
        class="input-with-select"
      >
        <el-select v-model="Form.select" slot="prepend" placeholder="请选择">
          <el-option label="题名" value="1"></el-option>
          <el-option label="责任者" value="2"></el-option>
          <el-option label="ISBN号" value="3"></el-option>
          <el-option label="索书号" value="4"></el-option>
          <el-option label="出版方" value="5"></el-option>
        </el-select>
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
        select: "1",
        input: ""
      }
    };
  },
  methods: {
    submit() {
        this.$router.push({ path: '/library/bookSearch', query: { select:this.Form.select,input:this.Form.input}});
        this.$router.go(0);
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
