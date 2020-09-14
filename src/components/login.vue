<template>
  <div class="login">
    <div class="login_box">
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form class="form" :model="formmsg" :rules="loginRules" ref="ruleForm">
        <!-- //账号 -->
        <el-form-item prop="username">
          <el-input type="text" prefix-icon="el-icon-user-solid" v-model="formmsg.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="formmsg.password"></el-input>
        </el-form-item>
        <el-form-item class="buts">
          <el-button @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formmsg: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return this.$Message.warning({ message: '警告哦，账号或密码格式错误' })
        const { data: res } = await this.$http.post('login', this.formmsg)
        if (res.meta.status === 200) {
          this.$Message({
            showClose: true,
            message: '登录成功!',
            type: 'success'
          })
          // 存token
          sessionStorage.setItem('token', res.data.token)
          return this.$router.push('/home')
        }
        this.$Message({
          showClose: true,
          message: '登录失败!',
          type: 'error'
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="less" scope>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  //flex布局来居中单个的子元素
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  .login_box {
    /* 定位居中 */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 2px 3px 8px rgba(255, 255, 255, 0.6);
    .logo {
      /* 定位居中 */
      /* 定位居中 */
      position: absolute;
      top: -60px;
      left: 0;
      right: 0;
      margin: auto;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background-color: #ccc;
      overflow: hidden;
      border: 8px solid #ffffff;
      box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.4);
      img {
        width: 100%;
        /* 定位居中 */
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
    }
    .form {
      /* 定位居中 */
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
      width: 100%;
      padding: 0 30px;
      .buts {
        float: right;
      }
    }
  }
}
</style>
