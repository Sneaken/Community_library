<template>
  <el-form :model="Form" :rules="rules" ref="Form" label-width="100px" class="Form" @submit.native.prevent>
    <el-form-item label="标题" prop="title">
      <el-input v-model="Form.title"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input type="textarea" v-model="Form.content" autosize></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('Form')">立即创建</el-button>
      <el-button @click="resetForm('Form')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "InformationDevelopment",
  data() {
    return {
      Form: {
        title: "",
        content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.$axios
                .post("/api/admin/informationDevelopment",this.Form)
                .then(res => {
                    if (res.data.success) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.$refs[formName].resetFields();
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

<style scoped>
  .Form{
    width: 1000px;
    margin:50px auto;
  }
</style>
