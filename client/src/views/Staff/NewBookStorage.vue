<template>
  <div class="register">
    <div class="form_container">
      <el-form
        :model="bookInfoForm"
        status-icon
        :rules="rules"
        ref="bookInfoForm"
        label-width="80px"
        class="registerForm"
      >
        <el-form-item label="索书号" prop="ssh">
          <el-input
            type="text"
            v-model="bookInfoForm.ssh"
            placeholder="请输入索书号"
          ></el-input>
        </el-form-item>
        <el-form-item label="正题名" prop="ztm">
          <el-input
            v-model="bookInfoForm.ztm"
            placeholder="请输入正题名"
          ></el-input>
        </el-form-item>
        <el-form-item label="责任者" prop="zrz">
          <el-input
            v-model="bookInfoForm.zrz"
            placeholder="请输入责任者"
          ></el-input>
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input
            type="text"
            v-model="bookInfoForm.isbn"
            placeholder="请输入ISBN号"
          ></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input
            type="text"
            v-model="bookInfoForm.price"
            placeholder="请输入单价"
          ></el-input>
        </el-form-item>
        <el-form-item label="出版方" prop="cbs">
          <el-input
            type="text"
            v-model="bookInfoForm.cbs"
            placeholder="请输入出版方"
          ></el-input>
        </el-form-item>
        <el-form-item label="出版时间" prop="datestr">
          <el-input
            type="text"
            v-model="bookInfoForm.datestr"
            placeholder="请输入出版时间"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容简介" prop="content">
          <el-input
            type="textarea"
            autosize
            v-model="bookInfoForm.content"
            placeholder="请输入内容简介"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书页数" prop="pages">
          <el-input
            type="text"
            v-model="bookInfoForm.pages"
            placeholder="请输入图书页数"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书数量" prop="reserve">
          <el-input
            type="text"
            v-model.number="bookInfoForm.reserve"
            placeholder="请输入图书数量"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('bookInfoForm')"
            class="submit_btn"
            >提交</el-button
          >
          <el-button @click="resetForm('bookInfoForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewBookStorage",
  data() {
    return {
      bookInfoForm: {
        ssh: "",
        ztm: "",
        zrz: "",
        isbn: "",
        price: "",
        cbs: "",
        datestr: "",
        content: "",
        pages: null,
        reserve: null
      },
      rules: {
        ssh: [{ required: true, message: "索书号", trigger: "blur" }],
        ztm: [{ required: true, message: "正题名不能为空", trigger: "blur" }],
        zrz: [{ required: true, message: "责任者不能为空", trigger: "blur" }],
        isbn: [
          { required: true, message: "ISBN不能为空", trigger: "blur" },
          { min: 15, max: 18, message: "长度在15到18之间", trigger: "blur" }
          // {validate:}
        ],
        datestr: [
          { required: true, message: "出版时间不能为空", trigger: "blur" }
        ],
        price: [{ required: true, message: "单价不能为空", trigger: "blur" }],
        cbs: [{ required: true, message: "出版方不能为空", trigger: "blur" }],
        pages: [{ required: true, message: "页码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/staff/newBookStorage", this.bookInfoForm)
            .then(res => {
              this.results = res.data.results;
              console.log(res.data);
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
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped></style>
