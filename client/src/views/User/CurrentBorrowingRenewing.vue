<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column type="index" label="序号" align="center" width="70">
    </el-table-column>
    <el-table-column
      prop="book_label"
      label="单册条码"
      align="center"
      width="208%"
    >
    </el-table-column>
    <el-table-column prop="ztm" label="正题名" align="center" width="208%">
    </el-table-column>
    <el-table-column
      prop="borrow_time"
      label="借阅时间"
      align="center"
      width="208%"
    >
    </el-table-column>
    <el-table-column
      prop="should_still_return_time"
      label="应还时间"
      align="center"
      width="208%"
    >
    </el-table-column>
    <el-table-column
      prop="renewal_time"
      label="续借时间"
      align="center"
      width="208%"
    >
    </el-table-column>
    <el-table-column
      prop="number_of_renewals"
      label="续借次数"
      align="center"
      width="208%"
    >
    </el-table-column>
    <el-table-column prop="status" label="状态" align="center" width="208%">
    </el-table-column>
    <el-table-column prop="operation" label="操作" align="center" width="208%">
      <template slot-scope="scope">
        <el-button size="small" @click="handleRenew(scope.row)"
          >续借</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "currentBorrowingRenewing",
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
        .post("/api/user/currentBorrowingBooks")
        .then(res => {
          this.tableData = res.data;
            this.tableData.forEach((value, index, array) => {
            array[index].borrow_time = this.renderTime(value.borrow_time);
            array[index].should_still_return_time = this.renderTime(
              value.should_still_return_time
            );
            array[index].renewal_time = value.renewal_time
              ? this.renderTime(value.renewal_time)
              : "";
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleRenew(row) {
      // 续借
      this.$axios
        .post("/api/user/renew", {
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

<style scoped></style>
