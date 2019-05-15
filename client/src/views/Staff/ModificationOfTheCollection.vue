<template>
  <div class="form_container">
    <el-form
      :model="bookInfoForm"
      status-icon
      ref="bookInfoForm"
      label-width="200px"
    >
      <el-form-item label="索书号" prop="ssh">
        <el-input
          type="text"
          v-model="bookInfoForm.ssh"
          placeholder="请输入索书号进行查询"
          @keyup.enter.native="findBook"
          :disabled="checked"
        ></el-input>
      </el-form-item>
      <el-form-item label="正题名" prop="ztm">
        <el-input v-model="bookInfoForm.ztm" :disabled="checked"></el-input>
      </el-form-item>
      <el-form-item label="责任者" prop="zrz">
        <el-input v-model="bookInfoForm.zrz" :disabled="checked"></el-input>
      </el-form-item>
      <el-form-item label="ISBN" prop="isbn">
        <el-input
          type="text"
          v-model="bookInfoForm.isbn"
          :disabled="checked"
        ></el-input>
      </el-form-item>
      <template v-for="item in bookInfoForm.location">
        <el-form-item :label="item.book_label + '典藏地'" :disabled="checked">
          <el-input type="text" v-model="item.collection_place"></el-input>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button type="primary" @click="findBook" class="submit_btn"
          >查询</el-button
        >
        <el-button type="primary" @click="submitForm" class="submit_btn"
          >确认修改</el-button
        >
        <el-button @click="resetForm('bookInfoForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ModificationOfTheCollection",
  data() {
    return {
      checked: false,
      bookInfoForm: {
        ssh: "",
        ztm: "",
        zrz: "",
        isbn: "",
        location: []
      }
    };
  },
  methods: {
    findBook() {
      this.$axios
        .post("/api/staff/findBook2", { ssh: this.bookInfoForm.ssh })
        .then(res => {
          if (res.data.success) {
            this.checked = true;
            this.bookInfoForm = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    resetForm(formName) {
      this.bookInfoForm.location = [];
      this.$refs[formName].resetFields();
      this.checked = false;
    },
    submitForm() {
      this.$axios
        .post("/api/staff/updateBookStorage", this.bookInfoForm)
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          } else {
            this.$message.error(res.data.msg);
          }
        });
    }
  }
};
</script>

<style scoped>
.form_container {
  width: 1000px;
  margin: 0 auto;
}
</style>
