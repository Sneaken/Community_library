<template>
  <header class="head-nav">
    <el-row>
      <el-col :span="6" :offset="3" class="logo-container">
        <span class="title">社区图书馆后台管理系统</span>
      </el-col>
      <el-col :span="2" :offset="13" class="user">
        <div class="userInfo">
          <div class="welcome" v-if="user.name">
            <p class="name comename">欢迎</p>
            <p class="name username">{{ user.name }}</p>
          </div>
          <span class="dropDownArrow">
            <!--下拉箭头-->
            <el-dropdown trigger="click" @command="setDialogInfo">
              <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="info" v-if="user.name">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </el-col>
    </el-row>
  </header>
</template>

<script>
export default {
  name: "HeadNav",
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    setDialogInfo(cmdItem) {
      switch (cmdItem) {
        case "info":
          this.showInfoList();
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    showInfoList() {
        if (this.$store.getters.user.identity) {
            this.$router.push("/staff/infoShow2");
        }else{
            this.$router.push("/infoShow");

        }

    },
    logout() {
        if (this.$store.getters.user.identity) {
            //清除token
            localStorage.removeItem("eleToken");
            //设置vuex store
            this.$store.dispatch("clearCurrentState");
            //跳转
            this.$router.push("/staff/login");
      } else {
            //清除token
            localStorage.removeItem("eleToken");
            //设置vuex store
            this.$store.dispatch("clearCurrentState");
            //跳转
            this.$router.push("/user/login");
      }
    }
  }
};
</script>

<style scoped>
.head-nav {
  width: 100%;
  height: 60px;
  min-width: 600px;
  padding: 5px;
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
}
.logo-container {
  line-height: 60px;
  min-width: 400px;
}
.title {
  vertical-align: middle;
  font-size: 22px;
  font-family: "Microsoft YaHei", serif;
  letter-spacing: 3px;
}
.user {
  line-height: 60px;
  text-align: right;
  float: right;
  padding-right: 10px;
}
.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 5px;
}
.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}
.comename {
  font-size: 12px;
}
.username {
  color: #409eff;
  font-weight: bolder;
}
.dropDownArrow {
  cursor: pointer;
  margin-right: 5px;
}
.el-dropdown {
  color: #fff;
}
</style>
