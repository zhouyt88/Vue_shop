<template>
  <div class="users-box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="search">
        <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-table border style="width: 100%;" :data="userList">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template>
            <el-button type="text" size="small">操作</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: { query: '', pagenum: 1, pagesize: 6 },
      userList: []
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http('users', { params: this.queryInfo })
      this.userList = res.data.users
      console.log(res.data.users)
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style lang="less">
.box-card {
  .search {
    width: 50%;
  }
  .el-table {
    margin-top: 20px;
  }
}
</style>
