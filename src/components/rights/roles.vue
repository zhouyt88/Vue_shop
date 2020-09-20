<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片-权限表格 -->
    <el-card>
      <el-button type="primary">添加用户</el-button>
      <el-table border style="width: 100%" :data="rolesList" stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <!-- 插槽 -->
          <template slot-scope="scope">
            <el-row
              :class="[ 'bbtm',index1==0? 'btop' : '' ]"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="6">
                <el-tag
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <span class="el-icon-caret-right"></span>
              </el-col>
              <el-col :span="18">
                <el-row
                  :class="[ index2==0? '' : 'btop' ]"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      closable
                      type="warning"
                      :disable-transitions="false"
                      @close="handleClose(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <span class="el-icon-caret-right"></span>
                  </el-col>
                  <el-col :span="15">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      type="danger"
                      :disable-transitions="false"
                      @close="delRightsClose(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色" width="120"></el-table-column>
        <el-table-column prop="roleDesc" label="职位" width="150"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">修改</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-share" @click="showRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限的对话框 -->
      <el-dialog
        :title="showRoleName+'的权限分配'"
        :visible.sync="dialogVisible"
        width="50%"
        @close="DialogClosed"
      >
        <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          :default-checked-keys="expandedKeys"
          :props="treeProps"
          default-expand-all
          ref="TreeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="showNewRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      dialogVisible: false,
      // 权限列表数据
      rightsList: [],
      // 树形结构的配置
      treeProps: {
        // 标准属性是哪个节点
        children: 'children',
        // 用户看到的文字
        label: 'authName'
      },
      expandedKeys: [],
      showRoleName: '',
      id: ''
    }
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      this.rolesList = res.data
    },
    // 点击删除标签事件
    async delRightsClose (role, rightId) {
      const result = await this.$confirm('此操作将永久删除该权限，是否继续？，', '提示', {
        confirmButtonText: '确定',
        canceButtonText: '确定',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$Message.info('已取消删除')
      }
      console.log(role.id, rightId)
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$Message.error('删除指定权限失败!')
      }
      console.log(res)
      this.$Message.success('删除指定权限成功!')
      role.children = res.data
    },
    // 点击分配权限的按钮事件
    async showRightsDialog (arr) {
      this.expandedKeys = []
      console.log(arr)
      this.showRoleName = arr.roleName
      this.id = arr.id
      this.dialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$Message.error('获取权限失败!')
      }
      this.rightsList = res.data
      // 调用获取权限树的函数
      this.expandedTree(arr)
    },
    // 获取权限树的函数
    expandedTree  (data) {
      // 递归写法
      // 判断data里面是否有children,没有就讲data.id添加入expandedKeys数组
      if (!data.children) {
        return this.expandedKeys.push(data.id)
      }
      // 否则将进入data.children遍历,再次调用expandedTree该函数
      data.children.forEach(item => {
        return this.expandedTree(item)
      })
      // this.expandedKeys = []
      // for循环写法
      // for (var i = 0; i < data.length; i++) {
      //   if (data[i].children) {
      //     for (let k = 0; k < data[i].children.length; k++) {
      //       if (data[i].children[k].children) {
      //         for (let y = 0; y < data[i].children[k].children.length; y++) {
      //           // 循环data的数据，把对应要展开的节点id放入展开的数组中
      //           this.expandedKeys.push(data[i].children[k].children[y].id)
      //         }
      //       } else {
      //         continue
      //       }
      //     }
      //   } else {
      //     continue
      //   }
      // }
    },
    // 关闭修改权限对话框的时候置空expandedKeys数组
    DialogClosed () {
      // this.expandedKeys = []
    },
    // 确定修改权限的的按钮事件
    async showNewRights () {
      this.dialogVisible = false
      const arr1 = this.$refs.TreeRef.getCheckedKeys()
      const arr2 = this.$refs.TreeRef.getHalfCheckedKeys()
      const str3 = arr1.concat(arr2).join(',')
      // 向数据库发送更新数据
      const { data: res } = await this.$http.post(`roles/${this.id}/rights`, { rids: str3 })
      if (res.meta.status !== 200) {
        return this.$Message.error('修改权限失败!')
      }
      this.$Message.success('修改权限成功!')
      //  重新获取权限数据
      this.getRolesList()
    }
  },
  created () {
    this.getRolesList()
  }

}
</script>

<style leng="less">
.el-table {
  margin-top: 20px;
}
.sonson {
  margin-left: 120px;
}
.el-tag {
  margin: 10px;
}
.el-row {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.btop {
  border-top: 1px solid #ccc;
}
.bbtm {
  border-bottom: 1px solid #ccc;
}
</style>
