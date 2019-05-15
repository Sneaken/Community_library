<template>
  <el-form :model="Form" :rules="rules" ref="Form" label-width="100px" class="Form" @submit.native.prevent>
    <el-form-item label="标题" prop="title">
      <el-input v-model="Form.title" @keyup.enter.native="find"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input type="textarea" v-model="Form.content" autosize></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('Form')">修改</el-button>
      <el-button @click="resetForm('Form')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    export default {
        name: "InformationModification",
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
            find() {
                if(this.Form.title){
                    this.$axios
                        .post("/api/admin/findInformation", { title: this.Form.title })
                        .then(res => {
                            console.log (res.data.data);
                            if (res.data.success) {
                                this.Form = res.data.data;
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        });
                }else{
                    return false;
                }

            },
            submitForm (formName) {
                this.$refs[formName].validate (valid => {
                    if (valid) {
                        this.$axios
                            .post ("/api/admin/informationModification", this.Form)
                            .then (res => {
                                if (res.data.success) {
                                    this.$message ({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                    this.resetForm ('Form') ();
                                } else {
                                    this.$message.error (res.data.msg);
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            resetForm (formName) {
                this.$refs[formName].resetFields ();
            }
        }
    }
</script>

<style scoped>
  .Form{
    width: 1000px;
    margin:50px auto;
  }
</style>
