<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索商品 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="searchProducts"
            clearable
            @clear="clearSearchProducts"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="clickTheSearchButton"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('/goods/add')"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格视图 -->
      <el-table :data="goodsList" stripe style="width: 100%" border="">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="90"
        ></el-table-column>
        <el-table-column label="创建时间" width="170">
          <template v-slot="scope">
            {{ scope.row.add_time | dataTime }}
          </template></el-table-column
        >
        <el-table-column label="操作" width="180">
          <!-- 操作列 -->
          <template slot-scope="scope">
            {{ scope.row.goods_id }}
            <!-- 编辑按钮 -->
            <el-button type="primary" class="el-icon-edit"></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              class="el-icon-delete"
              @click="deleteProductButton(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 搜索商品的文字
      searchProducts: '',
      // 获取商品列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品类别总数total
      total: 0,
      //  商品列表的数组
      goodsList: []
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 分页变化--每页显示几条
    handleSizeChange (newVal) {
      this.queryInfo.pagesize = newVal
      this.getGoodsList()
    },
    // 分页变化--在第几页
    handleCurrentChange (newVal) {
      this.queryInfo.pagenum = newVal
      this.getGoodsList()
    },
    // 点击搜索按钮(模糊搜索事件)
    async clickTheSearchButton () {
      this.queryInfo.query = this.searchProducts.trim()
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      // 把搜索的结果给商品列表数组
      this.goodsList = res.data.goods
      this.total = res.data.total
      this.queryInfo.query = ''
    },
    // 清空搜索商品的文字,重新获取商品列表
    clearSearchProducts () {
      this.searchProducts = ''
      this.getGoodsList()
    },
    // 删除商品
    async deleteProductButton (id) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败!')
      }
      this.$message.success('删除商品成功!')
      return this.getGoodsList()
    }
  }
}
</script>

<style lang="less">
.el-pagination {
  margin-top: 20px;
}
</style>
