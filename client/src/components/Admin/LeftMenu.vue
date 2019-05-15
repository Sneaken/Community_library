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
    return {
      items: [
        {
          icon: "el-icon-view",
          name: "职员注册",
          path: "/admin/staffRegistration"
        },
        {
          icon: "el-icon-menu",
          name: "职员注销",
          path: "/admin/deleteStaff"
        },
        {
          icon: "el-icon-menu",
          name: "职员变更",
          path: "/admin/staffChange"
        },
        {
          icon: "el-icon-view",
          name: "图书馆信息",
          path: "/admin/libraryInformation",
          children: [
            { path: "/admin/informationDevelopment", name: "信息制定" },
            { path: "/admin/informationModification", name: "信息修改" }
          ]
        },
        {
          icon: "el-icon-edit",
          name: "修改密码",
          path: "/admin/changePassword"
        }
      ]
    };
  }
};
</script>
<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}

.el-menu {
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
