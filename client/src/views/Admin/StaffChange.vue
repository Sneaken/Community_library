<template>
  <div class="form_container">
    <el-form
      :model="Form"
      status-icon
      :rules="rules"
      ref="Form"
      label-width="80px"
    >
      <el-form-item label="身份证号" prop="value">
        <el-select v-model="Form.value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职位" prop="value2">
        <el-select v-model="Form.value2" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" class="submit_btn"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "DeleteReader",
  data() {
    return {
      options: [],
      Form: {
        value: "",
        value2: ""
      },
      options2: [
        { value: "前台服务", label: "前台服务" },
        { value: "图书管理", label: "图书管理" }
      ],
      rules: {
          value: [{required: true, message: "请选择", trigger: "blur"}],
          value2: [{required: true, message: "请选择", trigger: "blur"}]
      }
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$axios.get("/api/admin/findStaff").then(res => {
        if (res.data.success) {
          res.data.data.forEach(item => {
            this.options.push({
              value: item.id_number,
              label: item.id_number
            });
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    submitForm() {
      this.$refs["Form"].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/admin/staffChange", {
              id_number: this.Form.value,
              identity: this.Form.value2
            })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.Form.value = "";
                this.Form.value2 = "";
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

<style scoped>
.form_container {
  width: 500px;
  margin: 100px auto;
}
</style>
