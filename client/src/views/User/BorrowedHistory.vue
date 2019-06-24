<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column type="index" label="序号" align="center" width="70">
    </el-table-column>
    <el-table-column
      prop="book_label"
      label="单册条码"
      align="center"
      width="100%"
    >
    </el-table-column>
    <el-table-column prop="ztm" label="正题名" align="center" width="200%">
    </el-table-column>
    <el-table-column
      prop="borrow_time"
      label="借阅时间"
      align="center"
      width="160%"
    >
    </el-table-column>
    <el-table-column
      prop="return_time"
      label="归还时间"
      align="center"
      width="160%"
    >
    </el-table-column>
    <el-table-column prop="status" label="状态" align="center" width="100%">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "borrowedHistory",
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    renderTime(date) {
      return new Date(new Date(date).getTime() + 16 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
    getProfile() {
      this.$axios
        .post("/api/user/borrowedHistory")
        .then(res => {
          this.tableData = res.data;
          this.tableData.forEach((value, index, array) => {
            array[index].borrow_time = this.renderTime(value.borrow_time);
            array[index].return_time = this.renderTime(value.return_time);
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped></style>
