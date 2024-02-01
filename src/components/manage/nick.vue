<template>
  <div class="content">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="用户QQ">
        <el-input
          v-model="queryForm.userId"
          placeholder="QQ号"
          clearable
        />
      </el-form-item>
      <el-form-item label="查询关键字">
       <el-input v-model="queryForm.keyword" placeholder="昵称/角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getNickList(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="nickList"
      stripe
      style="width: 100%"
      size="large"
      v-loading="loading"
      :header-cell-style="{ background: '#d7e4fb' }"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="qq" label="用户QQ"> </el-table-column>
      <el-table-column prop="nick" label="昵称"> </el-table-column>
      <el-table-column prop="character" label="角色名称"> </el-table-column>
    </el-table>
    <div style="display: flex; margin-top: 30px">
      <div class="refresh-btn" @click="getQueryMapList(1)">
        <i class="el-icon-refresh-right"></i>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryForm.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        :hide-on-single-page="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      loading: false,
      nickList: [],
      queryForm: {
        pageSize: 10,
        pageIndex: 1,
        userId:"",
        keyword:""
      },
      total: 0,
    };
  },
  methods: {
    getNickList(pageIndex) {
      this.loading = true;
      this.queryForm.pageIndex = pageIndex || this.queryForm.pageIndex;
      this.request
        .post("/robot/api/character/getNickList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.nickList = data.list;
          this.total = data.totalCount;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          ElNotification.error({
            title: "操作失败",
            message: error,
            showClose: true,
            duration: 2000,
          });
          this.loading = false;
        });
    },
    handleSizeChange(value) {
      this.queryForm.pageSize = value;
      this.getNickList(1);
    },
    handleCurrentChange(value) {
      this.getNickList(value);
    },
  },
  mounted() {
    this.getNickList(1);
  },
};
</script>

<style>
</style>