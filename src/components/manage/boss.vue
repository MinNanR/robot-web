<template>
  <div class="content">
    <div style="display: flex; width: 100%; justify-content: space-between">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="查询关键字">
          <el-input
            v-model="queryForm.keyword"
            placeholder="BOSS名称或昵称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getBossList(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="openAddDialog">新增</el-button>
      </div>
    </div>
    <el-table
      :data="bossList"
      stripe
      style="width: 100%"
      size="large"
      v-loading="loading"
      :header-cell-style="{ background: '#d7e4fb' }"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="bossName" label="BOSS名称"> </el-table-column>
      <el-table-column prop="level" label="等级"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="openEditDialog(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; margin-top: 30px">
      <div class="refresh-btn" @click="getBossList(1)">
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
      v-model="bossInfoDialog"
      :title="dialogTitle"
      destroy-on-close
      width="90%"
      @closed="onDialogClosed"
    >
      <bossInfo
        :bossId="bossId"
        :mode="dialogMode"
        :closeDialog="closeDialog"
        :dataModify="dataModify"
      />
    </el-dialog>
  </div>
</template>

<script>
import bossInfo from "./bossInfo.vue";
import { ElNotification } from "element-plus";

export default {
  components: {
    bossInfo,
  },
  data() {
    return {
      loading: false,
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
      },
      bossList: [],
      total: 0,
      bossId: null,
      bossInfoDialog: false,
      dialogTitle: "",
      dialogMode: "edit",
      isDataModify: false,
    };
  },
  methods: {
    getBossList(pageIndex) {
      this.loading = true;
      this.queryForm.pageIndex = pageIndex || this.queryForm.pageIndex;
      this.request
        .post("/robot/api/boss/getBossList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.bossList = data.list;
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
      this.getBossList(1);
    },
    handleCurrentChange(value) {
      this.getBossList(value);
    },
    openAddDialog() {
      this.dialogMode = "add";
      this.dialogTitle = "新增BOSS";
      this.bossId = null;
      this.isDataModify = false;
      this.bossInfoDialog = true;
    },
    openEditDialog(row) {
      this.dialogMode = "edit";
      this.dialogTitle = `BOSS详情 - ${row.bossName}`;
      this.bossId = row.id;
      this.isDataModify = false;
      this.bossInfoDialog = true;
    },
    closeDialog() {
      this.bossInfoDialog = false;
    },
    dataModify() {
      this.isDataModify = true;
    },
    onDialogClosed() {
      if (this.isDataModify) {
        this.getBossList(1);
      }
      this.isDataModify = false;
    },
  },
  mounted() {
    this.getBossList(1);
  },
};
</script>

<style>
</style>
