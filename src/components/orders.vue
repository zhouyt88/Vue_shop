<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="13">
          <!-- 搜索商品 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="searchProducts"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchOrder"
            ></el-button> </el-input
        ></el-col>
      </el-row>
      <!-- 表格视图 -->
      <el-table :data="ordersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="90">
          <template v-slot="scope">
            <el-tag v-if="scope.row.order_pay == '1'">已付款</el-tag
            ><el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80">
        </el-table-column>
        <el-table-column label="下单时间" width="155">
          <template v-slot="scope">
            {{ scope.row.create_time | dataTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              class="el-icon-edit"
              @click="dialogVisible = true"
            ></el-button>
            <!-- 物流信息按钮 -->
            <el-button
              type="success"
              class="el-icon-location-information"
              @click="logisticsInformationButton(scope.row)"
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
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="60%"
      @close="closeEditForm"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="provinceCityDistrict">
          <el-cascader
            v-model="cityArr"
            :options="citydata"
            :props="cityProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmModifyAddressButton"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog
      title="查看物流进度"
      :visible.sync="logisticsDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in activities"
          :key="index"
          icon="el-icon-upload2"
          type="primary"
          size="large"
          :timestamp="item.ftime"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      //  搜索内容
      searchProducts: '',
      //   订单列表
      ordersList: [],
      //   修改地址对话框
      dialogVisible: false,
      logisticsDialogVisible: false,
      // 修改地址的form表单数据
      editForm: {
        provinceCityDistrict: '',
        address: ''
      },
      //   表单验证
      rules: {
        provinceCityDistrict: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      citydata,
      cityProps: { expandTrigger: 'hover', label: 'label', value: 'value', children: 'children' },
      // 储存联机选择的数据
      cityArr: [],
      activities: ''
    }
  },
  methods: {
    //  获取订单数据
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 分页每页显示几条
    handleSizeChange (newVal) {
      this.queryInfo.pagesize = newVal
      this.getOrdersList()
    },
    // 分页页数改变
    handleCurrentChange (newVal) {
      this.queryInfo.pagenum = newVal
      this.getOrdersList()
    },
    searchOrder () {},
    // 物流信息按钮
    async logisticsInformationButton (row) {
      this.logisticsDialogVisible = true
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      this.activities = res.data
      console.log(res)
    },
    // 关闭修改表单层,重置表单
    closeEditForm () {
      this.$refs.ruleForm.resetFields()
    },
    //  级联选择器变化时触发
    handleChange () {
      console.log(this.cityArr)
    },
    // 确认修改地址按钮
    confirmModifyAddressButton () {
      this.$refs.ruleForm.validate(item => {
        if (!item) {
          return this.$Message.error('请填写必填项')
        }
        this.dialogVisible = false
      })
    }
  },
  created () {
    this.getOrdersList()
  }
}
</script>

<style lang="less">
.el-cascader {
  width: 100%;
}
</style>
