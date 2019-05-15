<template>
  <div class="login">
    <div class="form_container">
      <div class="manage_tip">
        <span class="title">社区图书馆管理系统用户登录</span>
      </div>
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="80px"
        class="loginForm"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input
            type="tel"
            v-model="loginForm.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('loginForm')"
            class="submit_btn"
            >登 录</el-button
          >
        </el-form-item>
<!--        <div class="tipArea">-->
<!--          <p>-->
<!--            还没有账号？现在-->
<!--            <router-link to="/user/register">注册</router-link>-->
<!--          </p>-->
<!--        </div>-->
      </el-form>
    </div>
  </div>
</template>

<script>
import jwt_decode from "_jwt-decode@2.2.0@jwt-decode";

export default {
  name: "login",
  components: {},
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^[1][3-8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号有误"));
      }
      callback();
    };
    return {
      loginForm: {
        phone: "",
        password: ""
      },
      rules: {
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在6到30之间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/user/login", this.loginForm)
            .then(res => {
              if (res.data.success) {
                const { token } = res.data;
                localStorage.setItem("eleToken", token);

                //解析token
                const decoded = jwt_decode(token);

                //token存储到vuex
                this.$store.dispatch(
                  "setAuthenticated",
                  !this.isEmpty(decoded)
                );
                this.$store.dispatch("setUser", decoded);

                  const redirect = this.$route.query.redirect;
                  if(redirect){
                      this.$router.push(redirect);
                  }else{
                      this.$router.push("/index");
                  }
                //登录成功
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>

<style scoped>
  .login {
    position: relative;
    /*height: 936px;*/
  }
  .form_container {
    width: 370px;
    height: 210px;
    position: absolute;
    top: 20%;
    left: 34%;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
  }
  .form_container .manage_tip .title {
    font-family: "Microsoft YaHei", serif;
    font-weight: bold;
    font-size: 20px;
    color: #000;
  }
  .loginForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
  }

  .submit_btn {
    width: 100%;
  }
  .tipArea {
    text-align: right;
    font-size: 12px;
    color: #333;
  }
  .tipArea p a {
    color: #409eff;
  }
</style>
