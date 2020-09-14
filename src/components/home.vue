<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <a href="/">
          <img src="../assets/59190eb9254959758a986239.gif" alt />
        </a>
        <el-button type="info" plain @click="logout">退出登录</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    logout () {
      // 跳转回登录页面
      this.$router.push('/login')
      // 清除token
      sessionStorage.clear()
    }
  }
}
</script>

<style lang='less'>
.home_container {
  width: 100%;
  height: 100%;
  .el-header {
    background-color: rgb(17, 28, 39);
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      a {
        display: block;
        height: 100%;
        img {
          height: 100%;
        }
      }
    }
  }
}
</style>
