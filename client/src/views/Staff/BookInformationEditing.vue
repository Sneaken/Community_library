<template>
  <div class="form_container">
    <el-form
      :model="bookInfoForm"
      status-icon
      :rules="rules"
      ref="bookInfoForm"
      label-width="100px"
      class="registerForm"
    >
      <el-form-item label="索书号" prop="ssh">
        <el-input
          type="text"
          v-model="bookInfoForm.ssh"
          placeholder="请输入索书号进行查询"
          @keyup.enter.native="findBook"
          :disabled="checked"
        ></el-input>
      </el-form-item>
      <el-form-item label="正题名" prop="ztm">
        <el-input
          v-model="bookInfoForm.ztm"
          placeholder="请输入正题名"
        ></el-input>
      </el-form-item>
      <el-form-item label="责任者" prop="zrz">
        <el-input
          v-model="bookInfoForm.zrz"
          placeholder="请输入责任者"
        ></el-input>
      </el-form-item>
      <el-form-item label="ISBN" prop="isbn">
        <el-input
          type="text"
          v-model="bookInfoForm.isbn"
          placeholder="请输入ISBN号"
          :disabled="checked"
        ></el-input>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input
          type="text"
          v-model="bookInfoForm.price"
          placeholder="请输入单价"
        ></el-input>
      </el-form-item>
      <el-form-item label="出版方" prop="cbs">
        <el-input
          type="text"
          v-model="bookInfoForm.cbs"
          placeholder="请输入出版方"
        ></el-input>
      </el-form-item>
      <el-form-item label="出版时间" prop="datestr">
        <el-input
          type="text"
          v-model="bookInfoForm.datestr"
          placeholder="请输入出版时间"
          maxlength="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="内容简介" prop="content">
        <el-input
          type="textarea"
          autosize
          v-model="bookInfoForm.content"
          placeholder="请输入内容简介"
        ></el-input>
      </el-form-item>
      <el-form-item label="图书页数" prop="pages">
        <el-input
          type="text"
          v-model="bookInfoForm.pages"
          placeholder="请输入图书页数"
        ></el-input>
      </el-form-item>
      <el-form-item label="图书数量" prop="reserve">
        <el-input-number
          v-model="bookInfoForm.reserve"
          controls-position="right"
          :min="1"
          :max="5"
        ></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="findBook" class="submit_btn"
          >查询</el-button
        >
        <el-button
          type="primary"
          @click="submitForm('bookInfoForm')"
          class="submit_btn"
          >提交</el-button
        >
        <el-button @click="resetForm('bookInfoForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "BookInformationEditing",
  data() {
    const validateDate = (rule, value, callback) => {
      const reg = /^[1-2][0-9]{3}$/;
      if (
        !reg.test(value) ||
        parseInt(value) > new Date().getFullYear() ||
        parseInt(value) < 1900
      ) {
        callback(new Error("请正确输入年份"));
      }
      callback();
    };
    const validatePage = (rule, value, callback) => {
      const reg = /^[1-9][0-9]*页?$/;
      if (!reg.test(value)) {
        callback(new Error("请正确输入"));
      }
      callback();
    };
    const validateISBN = (rule, value, callback) => {
      function isISBN(str) {
        const isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/;
        const isbn13Maybe = /^(?:[0-9]{13})$/;
        const factor = [1, 3];
        let version =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : "";
        version = String(version);
        if (!version) {
          return isISBN(str, 10) || isISBN(str, 13);
        }
        const sanitized = str.replace(/[\s-]+/g, "");
        let checksum = 0;
        let i;
        if (version === "10") {
          if (!isbn10Maybe.test(sanitized)) {
            return false;
          }
          for (i = 0; i < 9; i++) {
            checksum += (i + 1) * sanitized.charAt(i);
          }
          if (sanitized.charAt(9) === "X") {
            checksum += 10 * 10;
          } else {
            checksum += 10 * sanitized.charAt(9);
          }
          if (checksum % 11 === 0) {
            return !!sanitized;
          }
        } else if (version === "13") {
          if (!isbn13Maybe.test(sanitized)) {
            return false;
          }
          for (i = 0; i < 12; i++) {
            checksum += factor[i % 2] * sanitized.charAt(i);
          }
          if (sanitized.charAt(12) - ((10 - (checksum % 10)) % 10) === 0) {
            return !!sanitized;
          }
        }
        return false;
      }
      if (!isISBN(value)) {
        callback(new Error("请正确输入ISBN"));
      }
      callback();
    };
    return {
      checked: false,
      bookInfoForm: {
        ssh: "",
        sub_id: "",
        ztm: "",
        zrz: "",
        isbn: "",
        price: "",
        cbs: "",
        datestr: "",
        content: "",
        pages: "",
        reserve: 1
      },
      rules: {
        ssh: [{ required: true, message: "索书号不能为空", trigger: "blur" }],
        sub_id: [
          { required: true, message: "分类名不能为空", trigger: "blur" }
        ],
        ztm: [{ required: true, message: "正题名不能为空", trigger: "blur" }],
        zrz: [{ required: true, message: "责任者不能为空", trigger: "blur" }],
        isbn: [
          { required: true, message: "ISBN不能为空", trigger: "blur" },
          { validator: validateISBN, trigger: "blur" }
        ],
        datestr: [
          { required: true, message: "出版时间不能为空", trigger: "blur" },
          { validator: validateDate, trigger: "blur" }
        ],
        price: [{ required: true, message: "单价不能为空", trigger: "blur" }],
        cbs: [{ required: true, message: "出版方不能为空", trigger: "blur" }],
        pages: [
          { required: true, message: "页码不能为空", trigger: "blur" },
          { validator: validatePage, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    findBook() {
      this.$axios
        .post("/api/staff/findBook", { ssh: this.bookInfoForm.ssh })
        .then(res => {
          if (res.data.success) {
            this.checked = true;
            this.bookInfoForm = res.data.data[0];
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/staff/findBook", this.bookInfoForm)
            .then(res => {
              if (res.data.success) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                this.$message.error(res.data.msg);
              }
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.checked=false;
    }
  }
};
</script>

<style scoped>
.form_container {
  width: 1000px;
  margin: 0 auto;
}
</style>
