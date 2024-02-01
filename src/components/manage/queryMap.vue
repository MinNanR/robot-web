<template>
  <div class="content">
    <div style="display: flex; width: 100%; justify-content: space-between">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="查询关键字">
          <el-input
            v-model="queryForm.keyword"
            placeholder="快捷关键字"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getQueryMapList(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          type="primary"
          @click="addQueryMapDialog = true;"
          >添加</el-button
        >
      </div>
    </div>
    <el-table
      :data="queryMapList"
      stripe
      style="width: 100%"
      size="large"
      v-loading="loading"
      :header-cell-style="{ background: '#d7e4fb' }"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="queryContent" label="快捷字" width="150">
      </el-table-column>
      <el-table-column prop="queryUrl" label="查询地址模板"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="showUpdateDilog(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
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
    <el-dialog
      v-model="addQueryMapDialog"
      style="500px;"
      destroy-on-close
      width="90%"
    >
      <queryMapInfo :queryMap="{}" :saveData="addQueryMap" />
    </el-dialog>
    <el-dialog
      v-model="updateQueryMapDialog"
      style="500px;"
      destroy-on-close
      width="90%"
    >
      <queryMapInfo :queryMap="queryMap" :saveData="updateQueryMap" />
    </el-dialog>
  </div>
</template>

<script>
import { ElNotification } from "element-plus";
import queryMapInfo from "./queryMapInfo.vue";

export default {
  components: {
    queryMapInfo,
  },
  data() {
    return {
      loading: false,
      queryMapList: [],
      taotal: 0,
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
      },
      queryMap: {},
      addQueryMapDialog: false,
      updateQueryMapDialog: false,
    };
  },
  methods: {
    getQueryMapList(pageIndex) {
      this.loading = true;
      this.queryForm.pageIndex = pageIndex || this.queryForm.pageIndex;
      this.request
        .post("/robot/api/character/getQueryMapList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.queryMapList = data.list;
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
      this.getQueryMapList(1);
    },
    handleCurrentChange(value) {
      this.getQueryMapList(value);
    },
    addQueryMap(queryMapForm) {
      this.request
        .post("/robot/api/character/addQueryMap", queryMapForm)
        .then((response) => {
          ElNotification.success({
            title: "操作成功",
            message: response.message,
            showClose: true,
            duration: 2000,
          });
          this.addQueryMapDialog = false;
          this.getQueryMapList(1);
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
    updateQueryMap(queryMapForm) {
      this.request
        .post("/robot/api/character/updQueryMap", queryMapForm)
        .then((response) => {
          ElNotification.success({
            title: "操作成功",
            message: response.message,
            showClose: true,
            duration: 2000,
          });
          this.updateQueryMapDialog = false;
          this.getQueryMapList(1);
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
    showAddDialog(row) {
      this.queryMap = row;
      this.addQueryMapDialog = true;
    },
    showUpdateDilog(row) {
      this.queryMap = row;
      this.updateQueryMapDialog = true;
    },
  },
  mounted() {
    this.getQueryMapList(1);
  },
};
</script>

<style>
</style>