<template>
  <el-form
    :model="ruleForm2"
    status-icon
    ref="ruleForm2"
    :rules="rules"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="身份证号" prop="id_number">
      <el-input v-model="ruleForm2.id_number" disabled></el-input>
    </el-form-item>

    <el-form-item label="手机号" prop="phone">
      <el-input type="tel" v-model="ruleForm2.phone"></el-input>
    </el-form-item>

    <el-form-item label="姓名" prop="name">
      <el-input v-model="ruleForm2.name" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input type="email" v-model="ruleForm2.email"></el-input>
    </el-form-item>
    <el-form-item label="押金" prop="deposit">
      <el-input v-model="ruleForm2.deposit" disabled></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm2')"
        >提交</el-button
      >
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "updateUser",
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^[1][3-8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号有误"));
      }
      callback();
    };
    return {
      ruleForm2: {
        id_number: "",
        phone: "",
        name: "",
        password: "",
        email: "",
        deposit: ""
      },
      rules: {
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/user/updateUser", this.ruleForm2)
            .then(res => {
              this.results = res.data.results;
              if (res.data.success) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                  this.$router.push('/infoShow');
              } else {
                this.$message.error(res.data.msg);
              }
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getProfile();
    },
    getProfile() {
      this.$axios
        .get("/api/user/getUser")
        .then(res => {
          this.ruleForm2 = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped></style>
