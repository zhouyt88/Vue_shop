<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片-表格 -->
    <el-card>
      <!-- 添加按钮  -->
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <tree-Table
        show-index
        border
        :expand-type="false"
        :selection-type="false"
        :data="goodsList"
        :columns="columns"
      >
        <!-- 是否有效行 -->
        <template slot="isDeleted" scope="scope">
          <span class="el-icon-success success-icon" v-if="scope.row.cat_deleted == false"></span>
          <span class="el-icon-error error-icon" v-else></span>
        </template>
        <!-- 排序行 -->
        <template slot="isLevel" scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-else type="danger">三级</el-tag>
        </template>
        <!-- 操作行 -->
        <template slot="Operation" scope="scope">
          {{ scope.row.cat_id }}
          <el-button type="primary" size="mini">
            <i class="el-icon-edit"></i>编辑
          </el-button>
          <el-button type="danger" size="mini">
            <i class="el-icon-delete"></i>删除
          </el-button>
        </template>
      </tree-Table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsList.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="goodsList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类弹出层 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="50%" @close="clearCateButton">
      <el-form :model="addForm" :rules="addFormRules" label-width="100px" ref="addCateFormRef">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addForm.cat_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="父类分级:" clearable>
          <el-cascader
            v-model="selectValue"
            :options="addCateList"
            :props="cascaderProps"
            @change="handleChange"
            class="cascaderCalss"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearCateButton">取 消</el-button>
        <el-button type="primary" @click="addCateButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 默认分类源
      addCateList: [],
      // 级联选择框中的数据
      selectValue: '',
      // 级联选择框配置项
      cascaderProps: {
        // 触发状态
        expandTrigger: 'hover',
        // 父子关联节点
        children: 'children',
        // 提交给后台的id
        value: 'cat_id',
        // 给用户看到的数据
        label: 'cat_name',
        checkStrictly: true
      },
      dialogVisible: false,
      // 商品分类列表数据
      goodsList: [],
      // 商品分类查询参数
      categoriesInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 添加的分类名称
      addForm: {
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加商品分类校验规格
      addFormRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 总数
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        prop: 'cat_deleted',
        // 指定为自定义模板
        type: 'template',
        // 自定义模板的名称
        template: 'isDeleted'
      },
      {
        label: '排序',
        prop: 'cat_level',
        // 指定为自定义模板
        type: 'template',
        // 自定义模板的名称
        template: 'isLevel'
      },
      {
        label: '操作',
        // 指定为自定义模板
        type: 'template',
        // 自定义模板的名称
        template: 'Operation'
      }
      ]
    }
  },
  methods: {
    // 获取商品分类列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('categories', { params: this.categoriesInfo })
      this.total = res.data.total
      this.goodsList = res.data.result
    },
    // 分页栏,每页显示几条
    handleSizeChange (newVal) {
      this.categoriesInfo.pagesize = newVal
      this.getGoodsList()
    },
    // 分页栏,当前页
    handleCurrentChange (newVal) {
      this.categoriesInfo.pagenum = newVal
      this.getGoodsList()
    },
    // 级联选择框变化时触发的方法
    handleChange () {
      console.log(this.selectValue)
      // 如果 selectValue 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectValue.length > 0) {
        // 父级分类的Id
        this.addForm.cat_pid = this.selectValue[this.selectValue.length - 1]
        // 为当前分类的等级赋值
        this.addForm.cat_level = this.selectValue.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    async showAddCateDialog () {
      this.dialogVisible = true
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      console.log(res)
      this.addCateList = res.data
    },
    // 确定添加分类的按钮
    addCateButton () {
      console.log(this.addForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) {
          return this.$Message.error('添加分类失败!')
        }
        this.$Message.success('添加分类成功!')
      })
      this.getGoodsList()
      this.$refs.addCateFormRef.resetFields()
      console.log(this.addForm)
      this.clearCateButton()
    },
    clearCateButton () {
      this.dialogVisible = false
      this.$refs.addCateFormRef.resetFields()
      this.selectValue = []
      this.addForm.cat_level = 0
      this.addForm.cat_pid = 0
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style lang="less">
.success-icon {
  color: yellowgreen;
}
.error-icon {
  color: red;
}
.cascaderCalss {
  width: 100%;
}
.el-cascader-panel {
  height: 300px;
}
.zk-table {
  margin-top: 20px;
}
</style>
