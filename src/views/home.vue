<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <a href="#" @click.prevent="resver">
          <img src="../assets/59190eb9254959758a986239.gif" alt />
          <span>电商后台管理系统</span>
        </a>
        <el-button type="info" plain @click="logout">退出登录</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div @click="isCollapse = !isCollapse">| | |</div>
        <el-menu
          background-color="#666c64"
          unique-opened
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="activePath"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu v-for="(item, index) in menulist" :key="item.id" :index="index + ''">
            <template slot="title">
              <i :class="iconobj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
              @click="savePath('/' + subItem.path)"
            >
              <span class="el-icon-menu"></span>
              {{ subItem.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- // 主体内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      iconobj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activePath: '',
      isCollapse: false
    }
  },
  created () {
    this.getMenulist()
    this.activePath = sessionStorage.getItem('savePath')
  },
  methods: {
    logout () {
      // 跳转回登录页面
      this.$router.push('/login')
      // 清除token
      sessionStorage.clear()
    },
    async getMenulist () {
      const { data: res } = await this.$http('menus')
      if (res.meta.status !== 200) {
        return this.$message.console.error('获取数据失败,请稍后重试')
      }
      this.menulist = res.data
    },
    savePath (path) {
      sessionStorage.setItem('savePath', path)
    },
    resver () {
      console.log()
      if (this.$route.path !== '/welcom') {
        console.log(11)
        this.$router.push('/home')
      }
    }
  }
}
</script>

<style lang='less'>
.home_container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .el-header {
    background-color: #545c64;
    padding: 0;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      width: 100%;
      a {
        display: flex;
        height: 100%;
        line-height: 60px;
        text-decoration: none;
        span {
          height: 100%;
          font-size: 30px;
          color: #ffffff;
        }
        img {
          height: 100%;
          margin-right: 30px;
        }
      }
      > button {
        margin-right: 30px;
      }
    }
  }
  .el-aside {
    box-sizing: border-box;
    background-color: #545c64;
    .el-menu {
      width: 100% !important;
      box-sizing: border-box;
      border: 0px;
    }
    .el-submenu {
      width: 100%;
    }
    > div {
      color: #fff;
      cursor: pointer;
      font-size: 20px;
      text-align: center;
    }
    i {
      margin-right: 10px;
    }
  }
  .el-main {
    background-color: #dfdfdf;
  }
}
</style>
