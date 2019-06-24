<template>
  <el-row class="menu_page">
    <el-col>
      <el-menu
        mode="vertical"
        background-color="#324057"
        text-color="#fff"
        active-text-color="#409eff"
        class="el-menu-vertical-demo"
      >
        <template v-for="item in items">
          <router-link :to="item.path">
            <el-menu-item v-if="!item.children" :index="item.path">
              <i :class="'fa fa-margin ' + item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
          </router-link>

          <el-submenu v-if="item.children" :index="item.path" :key="item.path">
            <template slot="title">
              <i :class="'fa fa-margin ' + item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </template>
            <router-link
              v-for="(citem, cindex) in item.children"
              :to="citem.path"
              :key="cindex"
            >
              <el-menu-item :index="citem.path">
                <span slot="title">{{ citem.name }}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: "left-menu",
  data() {
    if (this.$store.getters.user.identity === "图书管理") {
      return {
        items: [
          {
            icon: "el-icon-view",
            name: "借阅图书",
            path: "/staff/borrowingBook"
          },
          {
            icon: "el-icon-menu",
            name: "图书归还",
            path: "/staff/bookReturn"
          },
            {
                icon: "el-icon-edit",
                name: "处罚",
                path: "/staff/punish"
            },
          {
            icon: "el-icon-document-add",
            name: "新书入库",
            path: "/staff/newBookStorage"
          },
          {
            icon: "el-icon-edit-outline",
            name: "图书信息编辑",
            path: "/staff/bookInformation",
            children: [
              { path: "/staff/bookInformationEditing", name: "内容修改" },
              { path: "/staff/modificationOfTheCollection", name: "典藏地修改" }
            ]
          },
          {
            icon: "el-icon-edit",
            name: "修改密码",
            path: "/staff/changePassword2"
          }
        ]
      };
    } else {
      return {
        items: [
          {
            icon: "el-icon-view",
            name: "读者注册",
            path: "/staff/readerRegistration"
          },
          {
            icon: "el-icon-menu",
            name: "注销读者",
            path: "/staff/deleteReader"
          },
          {
            icon: "el-icon-menu",
            name: "挂失/解除挂失",
            path: "/staff/loss"
          },
          {
            icon: "el-icon-edit",
            name: "重置读者密码",
            path: "/staff/resetReaderPassword"
          },
          {
            icon: "el-icon-view",
            name: "查看读者信息",
            path: "/staff/viewReader"
          },
          {
            icon: "el-icon-edit",
            name: "修改密码",
            path: "/staff/changePassword2"
          }
        ]
      };
    }
  },
    mounted () {
        /**
         * 判定用户是否越权
         * if true 判定越权
         */
        if (!this.$store.getters.user.identity || this.$store.getters.user.username ) {
            //清除token
            localStorage.removeItem("eleToken");
            //设置vuex store
            this.$store.dispatch("clearCurrentState");
            //跳转
            this.$router.push("/staff/login");
            this.$message.error('权限不足');
        }
    }
};
</script>
<style scoped>
.menu_page {
  position: fixed;
  top:0;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 0;
}

.el-menu {
  padding-top: 71px;
  border: none;
}

.fa-margin {
  margin-right: 5px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}

.el-menu-vertical-demo {
  width: 35px;
}

.el-submenu .el-menu-item {
  min-width: 180px;
}

a {
  text-decoration: none;
}
</style>
