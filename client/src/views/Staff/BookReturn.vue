<template>
  <el-form
    :model="ruleForm2"
    status-icon
    :rules="rules2"
    ref="ruleForm2"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="书标号" prop="book_label">
      <el-input
        type="text"
        v-model="ruleForm2.book_label"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm2')"
      >提交
      </el-button
      >
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    export default {
        name: "BookReturn",
        data () {
            return {
                ruleForm2: {
                    book_label: "",
                }
            };
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate (valid => {
                    if (valid) {
                        this.$axios
                            .post ("/api/staff/returningBook", this.ruleForm2)
                            .then (res => {
                                this.results = res.data.results;
                                console.log (res.data);
                                if (res.data.success) {
                                    //归还成功
                                    this.$message ({
                                        message: res.data.msg,
                                        type: "success"
                                    });
                                } else {
                                    this.$message.error (res.data.msg);
                                }
                            });
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

</style>
