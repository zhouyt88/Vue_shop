<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提醒 !注意 -->
      <el-alert
        title="添加商品信息!"
        type="info"
        class="el-icon-warning"
        :closable="false"
        center
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="+activeName" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性 3"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 竖型tab栏 -->
      <el-tabs
        tab-position="left"
        v-model="activeName"
        style="height: 200px"
        @tab-click="clickTab"
      >
        <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: '0'
    }
  },
  methods: {
    // 点击tab栏事件
    clickTab () {
      console.log(this.activeName)
    }
  }
}
</script>

<style lang="less">
.el-steps {
  margin: 30px 0;
}
</style>
