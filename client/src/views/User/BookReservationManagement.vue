<template>
  <el-table :data="tableData" border style="width: 100%" class = "table">
    <el-table-column type="index" label="序号" align="center" width="70">
    </el-table-column>
    <el-table-column
      prop="book_label"
      label="单册条码"
      align="center"
      width="200%"
    >
    </el-table-column>
    <el-table-column prop="ztm" label="正题名" align="center" width="200%">
    </el-table-column>
    <el-table-column
      prop="time_of_appointment"
      label="预约时间"
      align="center"
      width="200%"
    >
    </el-table-column>
    <el-table-column
      prop="ending_time_of_appointment"
      label="预约结束时间"
      align="center"
      width="200%"
    >
    </el-table-column>
    <el-table-column prop="operation" label="操作" align="center" width="200%">
      <template slot-scope="scope">
        <el-button size="small" @click="handleCancelRenewal(scope.row)"
          >取消预约</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "BookReservationManagement",
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
        .post("/api/user/bookReservationManagement")
        .then(res => {
          this.tableData = res.data.data;
          this.tableData.forEach((value, index, array) => {
            array[index].time_of_appointment = this.renderTime(
              value.time_of_appointment
            );
            array[index].ending_time_of_appointment = this.renderTime(
              value.ending_time_of_appointment
            );
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
      handleCancelRenewal(row) {
      // 取消预约
      this.$axios
        .post("/api/user/cancelRenewal", {
          book_label: row.book_label
        })
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          } else {
            this.$message.error(res.data.msg);
          }
          this.getProfile();
        });
    }
  }
};
</script>

<style scoped>

</style>
