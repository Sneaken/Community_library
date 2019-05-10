<template>
  <div class="infoShow">
    <el-row>
      <el-col :span="6"><div class="user-item">身份证：</div></el-col>
      <el-col :span="6" :offset="6"><div class="user-item">{{ user.id_number }}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" ><div class="user-item">手机号：</div></el-col>
      <el-col :span="6" :offset="6"><div class="user-item">{{ user.staff_phone }}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" ><div class="user-item">姓名：</div></el-col>
      <el-col :span="6" :offset="6"><div class="user-item">{{ user.name }}</div></el-col>
    </el-row>
    <el-row>
      <el-button type="primary" @click="updateUser">编辑个人资料</el-button>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "infoshow",
        data () {
            return {
                user:{}
            }
        },
        created () {
            this.getProfile ();
        },
        methods: {
            getProfile () {
                this.$axios
                    .get ("/api/staff/getUser")
                    .then (res => {
                        this.user = res.data;
                    })
                    .catch (error => {
                        console.log (error);
                    });
            },
            updateUser(){
                this.$router.push('/staff/updateStaff');
            }
        }
    };
</script>

<style scoped>
  .infoShow {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .user-item {
    position: relative;
    top: 30%;
    padding: 26px;
    font-size: 28px;
    color: #333;
  }
</style>
