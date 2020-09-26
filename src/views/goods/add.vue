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
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 竖型tab栏 -->
      <el-form
        :model="addForm"
        label-position="top"
        label-width="80px"
        :rules="ValidateForm"
        ref="addFormRef"
      >
        <el-tabs
          tab-position="left"
          v-model="activeName"
          :before-leave="beforeLeave"
          @tab-click="handleClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                v-model="addForm.goods_name"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addForm.goods_price"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addForm.goods_weight"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addForm.goods_number"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="cascValue"
                :options="cateList"
                :props="onlineSelectorConfiguration"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="(item, i) in manyData"
              :key="i"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item2, i2) in item.attr_vals"
                  :key="i2"
                  :label="item2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input
                placeholder="请输入内容"
                v-model="item.attr_vals"
              ></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :headers="headers"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              multiple
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器uill-editor -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <div>
              <el-button type="primary" @click="addProductButton"
                >添加商品</el-button
              >
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="提示" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewUrl" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // tab栏/进度栏对应值
      activeName: '0',
      // 添加商品表单值
      addForm: {
        goods_name: '123',
        goods_price: 123,
        goods_weight: 123,
        goods_number: 123,
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 失去光标时验证提示
      ValidateForm: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 级联选择器对应的值
      cascValue: '',
      cateList: [],
      // 连级选择器的配置
      onlineSelectorConfiguration: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 商品参数
      manyData: [],
      // 商品属性
      onlyData: [],
      // 上传图片的请求头
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      // 图片预览框
      previewDialogVisible: false,
      // 图片路径
      previewUrl: ''
    }
  },
  methods: {
    // 级联选择器变化时
    handleChange () {
      if (this.cascValue.length !== 3) {
        this.cascValue = ''
        return
      }
      this.addForm.goods_cat = this.cascValue.join()
    },
    beforeLeave (newTab, oldTab) {
      if (oldTab === '0' && this.cascValue.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 获取级联选择器的分类值
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
    },
    // 点击tab栏时触发
    async handleClick () {
      if (this.activeName === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cascValue[2]}/attributes`, { params: { sel: 'many' } })
        this.manyData = res.data
        this.manyData.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
        })
      } else if (this.activeName === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cascValue[2]}/attributes`, { params: { sel: 'only' } })
        this.onlyData = res.data
        console.log(this.onlyData)
      }
    },
    // 图片预览
    handlePreview (file) {
      this.previewDialogVisible = true
      this.previewUrl = file.response.data.url
      console.log(file)
    },
    // 上传成功
    handleSuccess (file) {
      this.addForm.pics.push({ pic: file.data.tmp_path })
      console.log(this.addForm.pics)
    },
    // 删除
    handleRemove (file) {
      console.log(file.response.data.tmp_path)
      const i = this.addForm.pics.findIndex(item => item.pics === file.response.data.tmp_path)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    // 添加商品按钮
    addProductButton () {
      this.$refs.addFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('请填写商品必填项!')
        }
        const newAddForm = JSON.parse(JSON.stringify(this.addForm))
        // 添加动态参数
        this.manyData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_value
          }
          newAddForm.attrs.push(obj)
        })
        // 添加静态属性
        this.onlyData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_value
          }
          newAddForm.attrs.push(obj)
        })
        // 发送请求
        const { data: res } = await this.$http.post('goods', newAddForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败!')
        }
        this.$message.success(res.meta.msg)
        // 页面跳转
        this.$router.push('/goods')
      })
    }
  },
  // 创建前获取数据
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less">
.el-steps {
  margin: 30px 0;
}
.ql-editor {
  height: 240px !important ;
}
</style>
