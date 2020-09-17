<template>
  <div class="users-box">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索 -->
      <div class="search">
        <el-col :span="20">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户按钮 -->
          <el-button type="primary" class="add" @click="dialogFormVisible = true">添加用户</el-button>
          <!-- 添加用户弹出层 -->
          <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="addDialogClosed">
            <!-- 添加用户的表单 -->
            <el-form
              :model="addForm"
              label-width="80px"
              :rules="addFormRules"
              class="demo-ruleForm"
              ref="addFormRef"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <!-- 添加用户弹出层的取消和确定按钮 -->
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </div>
      <!-- 用户列表 -->
      <el-table border style="width: 100%;" :data="userList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-button type="text" size="small">
              <el-switch
                v-model="scope.row.mg_state"
                style="display: block"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userStatusChange(scope.row)"
              ></el-switch>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scpoe">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <!-- 修改用户按钮 -->
              <el-button
                size="mini"
                type="primary"
                class="el-icon-edit"
                @click="getUserInfoById(scpoe.row.id)"
                circle
              ></el-button>
            </el-tooltip>
            <!-- 修改用户弹出层 -->
            <el-dialog title="修改用户" :visible.sync="dialogFormVisibleEdit" @close="editDialogClosed">
              <!-- 修改用户的表单 -->
              <el-form
                :model="editForm"
                label-width="80px"
                :rules="addFormRules"
                class="demo-ruleForm"
                ref="editFormRef"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <!-- 修改用户弹出层的取消和确定按钮 -->
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
              </div>
            </el-dialog>
            <i></i>
            <el-tooltip class="item" effect="dark" content="设置角色" placement="top-start">
              <el-button size="mini" type="warning" class="el-icon-setting" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button
                size="mini"
                type="danger"
                class="el-icon-delete"
                @click="openDel(scpoe.row.id)"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
  // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: { query: '', pagenum: 1, pagesize: 3 },
      userList: [],
      total: 0,
      dialogFormVisible: false,
      dialogFormVisibleEdit: false,
      addForm: {
        username: '添加用户名',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '修改用户名',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http('users', { params: this.queryInfo })
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newVal) {
      this.queryInfo.pagesize = newVal
      this.getUserList()
    },
    handleCurrentChange (newVal) {
      this.queryInfo.pagenum = newVal
      this.getUserList()
    },
    async userStatusChange (scope) {
      const { data: res } = await this.$http.put(`users/${scope.id}/state/${scope.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$Message.error('修改用户状态失败!')
      } else {
        return this.$Message.success('修改用户状态成功!')
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听添加用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 确认添加按钮
    addUser () {
      this.$refs.addFormRef.validate(async boo => {
        // 预校验
        if (!boo) { return this.$Message.error('请填写完整信息') }
        // 发送请求(添加用户)
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$Message.error('添加用户失败')
        }
        this.$Message.success('添加用户成功')
        // 重新加载数据
        this.getUserList()
        // 关闭对话框
        this.dialogFormVisible = false
      })
    },
    // 点击修改事件
    async getUserInfoById (id) {
      this.dialogFormVisibleEdit = true
      const { data: res } = await this.$http.get('users/' + id)
      this.editForm = res.data
    },
    // 确认修改按钮
    editUser () {
      this.$refs.editFormRef.validate(async boo => {
        // 预校验
        if (!boo) { return this.$Message.error('请填写完整信息') }
        // 发送请求(添加用户)
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$Message.error('修改用户失败')
        }
        this.$Message.success('修改用户成功')
        // 重新加载数据
        this.getUserList()
        // 关闭对话框
        this.dialogFormVisibleEdit = false
      })
    },
    // 打开删除提示框
    openDel (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(id)
        const { data: res } = await this.$http.delete('users/' + id)
        this.getUserList()
        if (res.meta.status !== 200) {
          return this.Message.error({ message: '删除失败!' })
        }
        console.log(res)
        this.$Message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$Message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
    .add {
      margin-left: 20px;
      margin-bottom: 20px;
    }
  }
  .el-table {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 12px;
  }
}
</style>
