<template>
  <div class="content">
    <div style="display: flex;width:100%;justify-content: space-between">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="查询关键字">
          <el-input
            v-model="queryForm.keyword"
            placeholder="词条关键字"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getStrategyList(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="addStrategyDialog = true">添加</el-button>
      </div>
    </div>
    <el-table
      :data="strategyList"
      stripe
      style="width: 100%"
      size="large"
      v-loading="loading"
      :header-cell-style="{ background: '#d7e4fb' }"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="strategyName" label="策略名称"> </el-table-column>
      <el-table-column label="匹配类型">
        <template #default="scope">
          <span>{{
            scope.row.expressionType == 1 ? "全匹配" : "正则匹配"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expression" label="匹配表达式"> </el-table-column>
      <el-table-column prop="componentName" label="消息处理组件">
      </el-table-column>
      <el-table-column prop="authMask" label="权限掩码"> </el-table-column>
      <el-table-column label="是否启用" width="100">
        <template #default="scope">
          <span>{{ scope.row.enabled == 1 ? "启用" : "禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="referStrategy(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.enabled != 1"
            link
            size="small"
            type="success"
            @click="updateStrategyEnable(scope.row)"
            >启用</el-button
          >
          <el-button
            v-else
            link
            size="samll"
            type="danger"
            @click="updateStrategyEnable(scope.row)"
            >禁用</el-button
          >
          <el-button
            link
            size="small"
            icon="Top"
            @click="modifyOrdinal(scope.row, 1)"
            :style="
              scope.row.ordinal == 1
                ? 'visibility: hidden'
                : 'visibility: visible'
            "
          ></el-button>
          <el-button
            link
            size="small"
            icon="Bottom"
            @click="modifyOrdinal(scope.row, 2)"
            :style="
              scope.$index == strategyList.length - 1 &&
              (strategyList.length < queryForm.pageSize ||
                queryForm.pageIndex * queryForm.pageSize == total)
                ? 'visibility: hidden'
                : 'visibility: visible'
            "
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; margin-top: 30px">
      <div class="refresh-btn" @click="getQuestionList(1)">
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
      v-model="strategyInfoDialog"
      style="500px;"
      destroy-on-close
      width="90%"
      @closed="onDialogClosed"
    >
      <strategyInfo
        :strategy="strategyInfo"
        :closeAndRefreshDialog="closeAndRefreshDialog"
      />
    </el-dialog>
    <el-dialog
      v-model="addStrategyDialog"
      style="500px;"
      destroy-on-close
      width="90%"
      @closed="onDialogClosed"
    >
      <addStrategy :closeAndRefreshDialog="closeAndRefreshAddDialog" />
    </el-dialog>
  </div>
</template>

<script>
import strategyInfo from "./strategyInfo.vue";
import addStrategy from "./addStrategy.vue";
import { ElNotification } from "element-plus";

export default {
  components: {
    strategyInfo,
    addStrategy,
  },
  data() {
    return {
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
        loading: false,
      },
      strategyList: [],
      strategyInfoDialog: false,
      addStrategyDialog: false,
      strategyInfo: {},
      isDataModify: false,
    };
  },
  methods: {
    getStrategyList(pageIndex) {
      this.loading = true;
      this.queryForm.pageIndex = pageIndex || this.queryForm.pageIndex;
      this.request
        .post("/robot/api/strategy/getStrategyList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.strategyList = data.list;
          this.total = data.totalCount;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    },
    handleSizeChange(value) {
      this.queryForm.pageSize = value;
      this.getStrategyList(1);
    },
    handleCurrentChange(value) {
      this.getStrategyList(value);
    },
    referStrategy(row) {
      this.strategyInfo = row;
      this.isDataModify = false;
      this.strategyInfoDialog = true;
    },
    closeAndRefreshDialog() {
      this.strategyInfoDialog = false;
      this.getStrategyList(1);
    },
    closeAndRefreshAddDialog() {
      this.addStrategyDialog = false;
      this.getStrategyList(1);
    },
    updateStrategyEnable(row) {
      let id = row.id;
      let currentStatus = row.enabled == 1;
      let updateForm = {
        id: id,
        enabled: !currentStatus ? 1 : 0,
      };
      this.request
        .post("/robot/api/strategy/updateStrategyEnable", updateForm)
        .then((response) => {
          ElNotification.success({
            title: "操作成功",
            message: response.message,
            showClose: true,
            duration: 2000,
          });
          this.getStrategyList(1);
        })
        .catch((err) => {
          ElNotification.error({
            title: "操作失败",
            message: err,
            showClose: true,
            duration: 2000,
          });
        });
    },
    modifyOrdinal(row, modifyType) {
      let updateForm = {
        id: row.id,
        modifyType: modifyType,
      };
      this.request
        .post("/robot/api/strategy/modifyStrategyOrdinal", updateForm)
        .then((response) => {
          ElNotification.success({
            title: "操作成功",
            message: response.message,
            showClose: true,
            duration: 2000,
          });
          this.getStrategyList(null);
        })
        .catch((err) => {
          ElNotification.error({
            title: "操作失败",
            message: err,
            showClose: true,
            duration: 2000,
          });
        });
    },
  },
  mounted() {
    this.getStrategyList(1);
  },
};
</script>

<style>
</style>