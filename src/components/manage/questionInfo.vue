<template>
  <div class="content">
    <!-- <div style="display: flex; margin-top: 10px">
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
    </div> -->
    <div style="display: flex; margin-top: 10px">
      <el-form
        label-width="100px"
        style="max-width: 700px"
      >
        <el-form-item label="展示群">
          <el-checkbox-group v-model="checkGroupIdList">
            <el-checkbox
              v-for="(item, index) in checkList"
              :key="item.groupId"
              :label="item.groupId"
              @change="handleCheckChange(index)"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="展示群掩码">
          <el-input
            v-model="groupMask"
            type="number"
            @input="onGroupMaskChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveQuestion()">保存</el-button>
        </el-form-item>
      </el-form>
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
import { ref } from "vue";

export default {
  data() {
    return {
      loading: false,
      checkGroupIdList: [],
      answerList: [],
      checkList: [],
      labeList: [],
      groupMask: 0,
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
          let checkGroupIdList = []
          for(let c of data.checkList) {
            console.log(c)
            if(c.checked == 1) {
              checkGroupIdList.push(c.groupId)
            }
          }
          this.checkGroupIdList = ref(checkGroupIdList)
          this.checkList = data.checkList;
          // this.checkList = data.checkList
          // newCheckList = [];
          // for (let c of data.checkList) {
          //   this.checkList.push({

          //   });
          // }
          this.groupMask = data.groupMask;
          this.loading = false;
          console.log(this.checkList);
          console.log(this.checkGroupIdList)
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    },
    handleCheckChange(index) {
      //当前是否选中状态
      let checked = this.checkList[index].checked == 1;
      this.checkList[index].checked = !checked ? 1 : 0;
      let groupId = this.checkList[index].groupId

      console.log(!checked);
      if (!checked) {
        //当前未选中，修改为选中
        this.checkGroupIdList.push(groupId);
        this.groupMask = this.groupMask | (1 << index);
      } else {
        //当前选终，修改为未选中
        this.checkGroupIdList = this.checkGroupIdList.filter(item => item !== groupId)
        let c = reverseCode(1 << index);
        this.groupMask = this.groupMask & c;
      }
      console.log(this.checkGroupIdList)
      // console.log(this.checkList[index].checked);

    },
    onGroupMaskChange() {
      let checkGroupIdList = []
      for (let i = 0; i < this.checkList.length; i++) {
        let checked = (this.groupMask & (1 << i)) != 0 ? 1 : 0;
        this.checkList[i].checked = checked;
        if(checked) {
          checkGroupIdList.push(this.checkList[i].groupId)
        }
      }
      this.checkGroupIdList = ref(checkGroupIdList)
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
    saveQuestion() {
      this.request
        .post("/robot/api/question/updateCheckGroup", {
          id: this.questionId,
          groupMask: this.groupMask
          // checkList: this.checkList,
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
  },
  mounted() {
    // let id = this.$route.query.id;
    this.getQuestionInfo(this.questionId);
  },
};

function fillBefore(str, fillChar, length) {
  const fillLength = length - str.length;
  if (fillLength < 0) {
    return str;
  }
  return fillChar.repeat(fillLength) + str;
}

function reverseCode(num) {
  let numString = fillBefore(num.toString(2), "0", 8);
  numString = numString
    .replaceAll("0", "2")
    .replaceAll("1", "0")
    .replaceAll("2", "1");
  return parseInt(numString, 2);
}
</script>

<style>
</style>