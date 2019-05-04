<template>
  <div class="register">
    <div class="form_container">
      <el-form
        :model="registerForm"
        status-icon
        :rules="rules"
        ref="registerForm"
        label-width="80px"
        class="registerForm"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input
            type="tel"
            v-model="registerForm.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="id_number">
          <el-input
            v-model="registerForm.id_number"
            placeholder="请输入身份证号"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="registerForm.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('registerForm')"
            class="submit_btn"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReaderRegistration",
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^[1][3-8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号有误"));
      }
      callback();
    };
    const validateIdNumber = (rule, value, callback) => {
      // 1 "验证通过!", 0 //校验不通过
      const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
      //号码规则校验
      if (!format.test(value)) {
        callback(new Error("身份证号码不合规"));
      }
      //区位码校验
      //出生年月日校验   前正则限制起始年份为1900;
      const year = value.substr(6, 4), //身份证年
        month = value.substr(10, 2), //身份证月
        date = value.substr(12, 2), //身份证日
        time = Date.parse(month + "-" + date + "-" + year), //身份证日期时间戳date
        now_time = Date.parse(new Date()), //当前时间戳
        dates = new Date(year, month, 0).getDate(); //身份证当月天数
      if (time > now_time || date > dates) {
        callback(new Error("身份证号码日期不合规"));
      }
      //校验码判断
      const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //系数
      const b = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]; //校验码对照表
      const id_array = value.split("");
      let sum = 0;
      for (let k = 0; k < 17; k++) {
        sum += parseInt(id_array[k]) * parseInt(c[k]);
      }
      if (
        id_array[17] &&
        id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()
      ) {
        callback(new Error("身份证号码校验码不合规"));
      }
      callback();
    };
    const validateName = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5]{2,5}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入中文姓名"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        phone: "",
        id_number: "",
        name: ""
      },
      rules: {
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        id_number: [
          { required: true, message: "身份证号不能为空", trigger: "blur" },
          { validator: validateIdNumber, trigger: "blur" }
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/staff/registerReader", this.registerForm)
            .then(res => {
              if (res.data.success) {
                //注册成功
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.$router.push("/staff");
              } else {
                this.$message.error(res.data.msg);
              }
            });
        }
      });
    }
  }
};
</script>

<style scoped></style>
