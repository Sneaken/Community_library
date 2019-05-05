<template>
  <div class="infoShow">
    <el-row>
      <el-col :span="6"><div class="user-item">读者证号(身份证)：</div></el-col>
      <el-col :span="6" :offset="6"><div class="user-item">{{ user.id_number }}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" ><div class="user-item">手机号：</div></el-col>
      <el-col :span="6" :offset="6"><div class="user-item">{{ user.phone }}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" ><div class="user-item">姓名：</div></el-col>
      <el-col :span="6" :offset="6"><div class="user-item">{{ user.name }}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" ><div class="user-item">邮箱：</div></el-col>
      <el-col :span="6" :offset="6"><div class="user-item">{{ user.email }}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" ><div class="user-item">押金：</div></el-col>
      <el-col :span="6" :offset="6"><div class="user-item">{{ user.deposit }}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" ><div class="user-item">状态：</div></el-col>
      <el-col :span="6" :offset="6"><div class="user-item">{{ user.status }}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" ><div class="user-item">是否挂失</div></el-col>
      <el-col :span="6" :offset="6">
        <div class="user-item" v-if="user.loss===1">是</div>
        <div class="user-item" v-if="user.loss===0">否</div>
      </el-col>
    </el-row>
    <el-row v-if="user.end_time">
      <el-col :span="6" ><div class="user-item">结束吊销时间：</div></el-col>
      <el-col :span="6" :offset="6"><div class="user-item">{{ user.end_time }}</div></el-col>
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
                    .get ("/api/user/getUser")
                    .then (res => {
                        this.user = res.data;
                    })
                    .catch (error => {
                        console.log (error);
                    });
            },
            updateUser(){
                this.$router.push('/updateUser');
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

  .row-bg {
    width: 100%;
    height: 100%;
  }

  .user span {
    display: block;
    text-align: center;
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
  }

  .user-item {
    position: relative;
    top: 30%;
    padding: 26px;
    font-size: 28px;
    color: #333;
  }
</style>
