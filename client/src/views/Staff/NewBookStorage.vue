<template>
  <div class="form_container">
    <el-form
      :model="bookInfoForm"
      :rules="rules"
      ref="bookInfoForm"
      label-width="100px"
      class="registerForm"
    >
      <el-form-item label="索书号" prop="ssh">
        <el-input
          type="text"
          v-model="bookInfoForm.ssh"
          placeholder="请输入索书号"
        ></el-input>
      </el-form-item>
      <el-form-item label="二级子分类" prop="sub_id">
        <el-input
          type="text"
          v-model="bookInfoForm.sub_id"
          placeholder="二级子分类"
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
        <el-input
          type="text"
          v-model.number="bookInfoForm.reserve"
          placeholder="请输入图书数量"
        ></el-input>
      </el-form-item>
      <!--      elementui上传图片的upload组件-->
      <el-form-item label="图片">
        <input
          type="file"
          name="file"
          accept=".jpg, .jpeg, .png"
          @change="uploadAvatar"
        />
        <!--        <el-upload-->
        <!--          ref="upload"-->
        <!--          action="https://jsonplaceholder.typicode.com/posts/"-->
        <!--          :file-list="fileList"-->
        <!--          :auto-upload="false">-->
        <!--          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
        <!--          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
        <!--        </el-upload>-->
      </el-form-item>
      <el-form-item>
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
  name: "NewBookStorage",
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
    const validateNumber = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/;
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
      file2: null,
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
        price: [
          { required: true, message: "单价不能为空", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],

        cbs: [{ required: true, message: "出版方不能为空", trigger: "blur" }],
        pages: [
          { required: true, message: "页码不能为空", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        reserve: [{ validator: validateNumber, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

          const formData = new FormData();
          if (this.file2) {
            formData.append("file", this.file2, this.file2.name);
            formData.append("ssh", this.bookInfoForm.ssh);
            formData.append("sub_id", this.bookInfoForm.sub_id);
            formData.append("ztm", this.bookInfoForm.ztm);
            formData.append("zrz", this.bookInfoForm.zrz);
            formData.append("isbn", this.bookInfoForm.isbn);
            formData.append("price", this.bookInfoForm.price);
            formData.append("cbs", this.bookInfoForm.cbs);
            formData.append("datestr", this.bookInfoForm.datestr);
            formData.append("content", this.bookInfoForm.content);
            formData.append("pages", this.bookInfoForm.pages);
            formData.append("reserve", this.bookInfoForm.reserve);
            this.$axios
              .post("/api/staff/newBookStorage", formData, {
                headers: { "content-type": "multipart/form-data" }
              })
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
          } else {
            this.$axios
              .post("/api/staff/newBookStorage", this.bookInfoForm)
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
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    uploadAvatar(avatar) {
      this.file2 = avatar.target.files[0];
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
