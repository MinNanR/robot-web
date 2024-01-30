<template>
  <div class="content">
    <div style="display: flex; margin-top: 10px">
      <div style="vertical-align: middle">展示群</div>
      <el-checkbox-group v-model="labeList" style="margin-left: 30px">
        <el-checkbox
          v-for="(item, index) in checkList"
          :key="index"
          :label="item.groupId"
          @change="handleCheckChange(index)"
          :checked="item.checked == 1"
        />
      </el-checkbox-group>
    </div>
    <el-table
      :data="answerList"
      stripe
      style="width: 100%; margin-top: 30px"
      size="large"
      v-loading="loading"
      :header-cell-style="{ background: '#d7e4fb' }"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="id" label="答案id" width="150"> </el-table-column>
      <el-table-column label="答案内容" width="500">
        <template #default="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-popconfirm
            title="确认删除这条答案吗？"
            confirm-button-type="danger"
            @confirm="deleteAsnwer(scope.row.id)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <!-- <el-button
            type="danger"
            size="small"
            @click="deleteAsnwer(scope.row.id)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      loading: false,
      answerList: [],
      checkList: [],
      labeList: [],
    };
  },
  props: ["questionId", "closeDialog", "dataModify"],
  methods: {
    getQuestionInfo(questionId) {
      this.loading = true;
      this.request
        .post("/robot/api/question/getQuestionInfo", { id: questionId })
        .then((response) => {
          let data = response.data;
          this.answerList = data.answerList;
          this.checkList = data.checkList;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    },
    handleCheckChange(index) {
      let checked = this.checkList[index].checked == 1;
      this.checkList[index].checked = !checked ? 1 : 0;
      console.log(this.checkList[index].checked);
      this.request
        .post("/robot/api/question/updateCheckGroup", {
          id: this.questionId,
          checkList: this.checkList,
        })
        .then((response) => {
          ElNotification.success({
            title: "操作成功",
            message: response.message,
            showClose: true,
            duration: 2000,
          });
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
    deleteAsnwer(id) {
      this.dataModify();
      this.request
        .post("/robot/api/question/delAnswer", { id: id })
        .then((response) => {
          ElNotification.success({
            title: "操作成功",
            message: response.message,
            showClose: true,
            duration: 2000,
          });
          if (this.answerList.length == 1) {
            this.closeDialog();
          } else {
            this.getQuestionInfo(this.questionId);
          }
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

      // this.request
      //   .post("/robot/api/question/getQuestionInfo", { id: questionId })
      //   .then((response) => {
      //     let data = response.data;
      //     this.answerList = data.answerList;
      //     this.checkList = data.checkList;
      //     this.loading = false;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     this.error(error);
      //     this.loading = false;
      //   });
    },
  },
  mounted() {
    // let id = this.$route.query.id;
    this.getQuestionInfo(this.questionId);
  },
};
</script>

<style>
</style>