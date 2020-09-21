<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片-表格 -->
    <el-card>
      <!-- 提醒 !注意 -->
      <el-alert
        title="注意: 只允许三级分类设置相关参数!"
        type="warning"
        class="el-icon-warning"
      ></el-alert>
      <!-- 选择商品  联级选择 -->
      <div class="casc_box">
        选择商品分类:
        <el-cascader
          v-model="seleckKeys"
          :options="cateLlist"
          :props="cascaderProps"
          @change="handleChange"
          clearable
        ></el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数/属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="disabledButton"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <!-- 动态参数展开行tag标签 -->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="tagHandleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 编辑按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  slot-scope=""
                  @click="editDialogButton(scope.row)"
                  >编辑</el-button
                >
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamsButton(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加参数/属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="disabledButton"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <!-- 静态属性展开行tag标签 -->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="tagHandleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 编辑按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialogButton(scope.row)"
                  >编辑</el-button
                >
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamsButton(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性的弹出层 -->
    <el-dialog
      :title="'添加' + addText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addHandleClose"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="addText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改修改--编辑编辑--参数/属性的弹出层 -->
    <el-dialog
      :title="'编辑' + addText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="addHandleClose"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="addText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_name: '',
        editId: ''
      },
      addText: '',
      addDialogVisible: false,
      editDialogVisible: false,
      manyData: [],
      onlyData: [],
      // tab里面btn按钮显示
      disabledButton: true,
      activeName: 'many',
      // 联机选择框的数据源
      cateLlist: [],
      // 联机选择框选中的数据
      seleckKeys: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      this.cateLlist = res.data
    },
    // 联机选择器变化时
    handleChange () {
      if (this.seleckKeys.length === 0) {
        this.manyData = this.onlyData = []
      }
      this.getPrarmsList()
    },
    // tab切换时触发
    handleClick (tab, event) {
      this.getPrarmsList()
    },
    // 获取参数属性的方法
    async getPrarmsList () {
      if (this.seleckKeys.length !== 3) {
        return (this.disabledButton = true)
      }
      this.activeName === 'only' ? this.addText = '静态属性' : this.addText = '动态参数'
      this.disabledButton = false
      const { data: res } = await this.$http.get(`categories/${this.seleckKeys[2]}/attributes`, { params: { sel: this.activeName } })

      // 在展开行渲染多个tag标签
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length ? item.attr_vals.split(' ') : []
        item.inputValue = ''
        item.inputVisible = false
      })
      this.activeName === 'only' ? this.onlyData = res.data : this.manyData = res.data
    },
    // 添加参数/属性-弹出层关闭触发
    addHandleClose () {
      this.$refs.ruleForm.resetFields()
    },
    // 确定添加参数/属性事件
    addParams () {
      this.$refs.ruleForm.validate(async boo => {
        if (!boo) {
          return this.$Message.error('请输入必填参数!')
        }
        const { data: res } = await this.$http.post(`categories/${this.seleckKeys[2]}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$Message.error('添加' + this.addText + '失败!')
        }
        this.$Message.success('添加' + this.addText + '成功!')
        // 重新获取参数/属性
        this.getPrarmsList()
        // 关闭弹出层
        this.addDialogVisible = false
      })
    },
    // 删除参数/属性按钮
    async deleteParamsButton (id) {
      console.log(this.seleckKeys[2], id)
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$Message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('categories/' + this.seleckKeys[2] + '/attributes/' + id)
      if (res.meta.status !== 200) {
        return this.$Message.error('删除' + this.addText + '失败!')
      }
      this.$Message.success('删除' + this.addText + '成功!')
      // 重新获取参数/属性
      this.getPrarmsList()
    },
    // 确定编辑修改按钮事件
    editParams () {
      console.log(this.editForm)
      this.$refs.ruleForm.validate(async boo => {
        if (!boo) {
          return this.$Message.error('请输入必填参数!')
        }
        const { data: res } = await this.$http.put(`categories/${this.seleckKeys[2]}/attributes/${this.editForm.editId}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$Message.error('修改' + this.addText + '失败!')
        }
        this.$Message.success('修改' + this.addText + '成功!')
        // 重新获取参数/属性
        this.getPrarmsList()
        // 关闭弹出层
        this.editDialogVisible = false
        this.editForm.attr_name = ''
      })
    },
    // 编辑按钮(弹出对话框)
    editDialogButton (row) {
      console.log(this.editForm)
      this.editForm.editId = row.attr_id
      this.editForm.attr_name = row.attr_name
      this.editDialogVisible = true
    },
    // 展开行tag 新增按钮
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 展开行input框事件
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      // 发送请求的函数
      this.expandRowSendRequest(row, '添加')
    },
    // 删除对应的参数可选项
    tagHandleClose (i, row) {
      row.attr_vals.splice(i, 1)
      // 发送请求的函数
      this.expandRowSendRequest(row, '删除')
    },
    // 展开行发送请求的函数
    async expandRowSendRequest (row, text) {
      const { data: res } = await this.$http.put(
        `categories/${this.seleckKeys[2]}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
      if (res.meta.status !== 200) {
        return this.$Message.error(text + 'tag标签失败!')
      }
      this.$Message.success(text + 'tag标签成功!')
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less">
.casc_box {
  margin: 20px 0 30px 0;
}

.input-new-tag {
  width: 100px !important;
  margin: 0 10px 10px 10px;
  vertical-align: bottom;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
