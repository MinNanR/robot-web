<template>
  <div class="content">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="查询关键字">
        <el-input
          v-model="queryForm.content"
          placeholder="词条关键字"
          clearable
        />
      </el-form-item>
      <el-form-item label="群号">
        <el-select v-model="queryForm.groupId" placeholder="所属群号" clearable>
          <el-option
            v-for="(item, index) in serviceGroup"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getQuestionList(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="questionList"
      stripe
      style="width: 100%"
      size="large"
      v-loading="loading"
      :header-cell-style="{ background: '#d7e4fb' }"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="content" label="词条内容"> </el-table-column>
      <el-table-column prop="groupId" label="所属群号"> </el-table-column>
      <el-table-column prop="answerCount" label="答案数量"> </el-table-column>
      <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
      <el-table-column prop="updater" label="更新人"> </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="referQuestion(scope.row)"
            >详情</el-button
          >
          <el-popconfirm
            :title="'确认删除词条' + scope.row.content + '吗？'"
            confirm-button-type="danger"
            @confirm="deleteQuestion(scope.row.id)"
          >
            <template #reference>
              <el-button link size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
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
      v-model="questionInfoDialog"
      :title="questionContent"
      style="500px;"
      destroy-on-close
      width="90%"
      @closed="onDialogClosed"
    >
      <questionInfo
        :questionId="questionId"
        :closeDialog="closeDialog"
        :dataModify="dataModify"
      />
    </el-dialog>
  </div>
</template>

<script>
import questionInfo from "./questionInfo.vue";
import { ElNotification } from "element-plus";

export default {
  components: {
    questionInfo,
  },
  data() {
    return {
      loading: false,
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
        content: "",
        groupId: "",
      },
      questionList: [],
      questionId: 0,
      questionContent: "",
      questionInfoDialog: false,
      serviceGroup: [],
      isDataModify: false,
      // questionList:[{
      //   "id": 523,
      //   "content": "test",
      //   "share": false,
      //   "groupId": "931437070",
      //   "answerCount": 1,
      //   "answer": null
      // },
      // {
      //   "id": 522,
      //   "content": "胖虎不在",
      //   "share": false,
      //   "groupId": "931437070",
      //   "answerCount": 1,
      //   "answer": null
      // },
      // {
      //   "id": 521,
      //   "content": "爬塔攻略",
      //   "share": false,
      //   "groupId": "931437070",
      //   "answerCount": 1,
      //   "answer": null
      // },
      // {
      //   "id": 520,
      //   "content": "脚丫",
      //   "share": false,
      //   "groupId": "667082876",
      //   "answerCount": 1,
      //   "answer": null
      // },
      // {
      //   "id": 519,
      //   "content": "laji",
      //   "share": true,
      //   "groupId": "931437070",
      //   "answerCount": 1,
      //   "answer": null
      // },
      // {
      //   "id": 518,
      //   "content": "吃屎人",
      //   "share": false,
      //   "groupId": "667082876",
      //   "answerCount": 7,
      //   "answer": null
      // },
      // {
      //   "id": 517,
      //   "content": "爆破水路",
      //   "share": false,
      //   "groupId": "913621346",
      //   "answerCount": 1,
      //   "answer": null
      // },
      // {
      //   "id": 516,
      //   "content": "潜能",
      //   "share": true,
      //   "groupId": "931437070",
      //   "answerCount": 1,
      //   "answer": null
      // },
      // {
      //   "id": 515,
      //   "content": "qmq",
      //   "share": false,
      //   "groupId": "667082876",
      //   "answerCount": 1,
      //   "answer": null
      // },
      // {
      //   "id": 514,
      //   "content": "badeling",
      //   "share": false,
      //   "groupId": "667082876",
      //   "answerCount": 1,
      //   "answer": null
      // }]
    };
  },
  methods: {
    getQuestionList(pageIndex) {
      this.loading = true;
      this.queryForm.pageIndex = pageIndex || this.queryForm.pageIndex;
      this.request
        .post("/robot/api/question/getQuestionList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.questionList = data.list;
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
      this.getQuestionList(1);
    },
    handleCurrentChange(value) {
      this.getQuestionList(value);
    },
    referQuestion(row) {
      // this.$router.push({ path: "/questionInfo", query: { id: id } });
      this.questionId = row.id;
      this.questionContent = row.content;
      this.isDataModify = false;
      this.questionInfoDialog = true;
    },
    getServiceGroup() {
      this.request
        .post("/robot/api/question/getServiceGroup")
        .then((response) => {
          let data = response.data;
          this.serviceGroup = data;
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
    closeDialog() {
      this.questionInfoDialog = false;
    },
    dataModify() {
      this.isDataModify = true;
    },
    onDialogClosed() {
      if (this.isDataModify) {
        this.getQuestionList(1);
      }
      this.isDataModify = false;
    },
    deleteQuestion(id) {
      this.request
        .post("/robot/api/question/delQuestion", { id: id })
        .then((response) => {
          ElNotification.success({
            title: "操作成功",
            message: response.message,
            showClose: true,
            duration: 2000,
          });
          this.getQuestionList(1);
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          ElNotification.error({
            title: "操作失败",
            message: error,
            showClose: true,
            duration: 2000,
          });
        });
    },
  },
  mounted() {
    this.getServiceGroup();
    this.getQuestionList(1);
  },
};
</script>

<style>
</style>