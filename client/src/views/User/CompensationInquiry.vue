<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column type="index" label="序号" align="center" width="70">
    </el-table-column>
    <el-table-column
      prop="book_label"
      label="单册条码"
      align="center"
      width="333%"
    >
    </el-table-column>
    <el-table-column prop="ztm" label="正题名" align="center" width="333%">
    </el-table-column>
    <el-table-column prop="time" label="赔偿时间" align="center" width="333%">
    </el-table-column>
    <el-table-column prop="money" label="赔偿金额" align="center" width="333%">
    </el-table-column>
    <el-table-column prop="status" label="状态" align="center" width="333%">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "CompensationInquiry",
  data() {
    return {
      tableData: []
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
        .post("/api/user/bookCompensation")
        .then(res => {
          this.tableData = res.data;
          this.tableData.forEach((value, index, array) => {
            array[index].time = this.renderTime(value.time);
            array[index].money += '元';
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
