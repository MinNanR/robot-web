<template>
  <div class="content">
    <el-row style="height: 80vh" :gutter="20">
      <el-col :span="5">
        <div style="margin-right: 10px">
          <el-select v-model="guildQueryForm.guildId" placeholder="家族" @change="handleGuildChange">
            <el-option v-for="item in guildDropDown" :key="item.value" :label="item.label" :value="item.id" />
          </el-select>
        </div>
        <div>
          <ul v-infinite-scroll="loadData" class="infinite-list" style="overflow: auto">
            <li v-for="record in recordList" :key="record.id" class="infinite-list-item" @click="choseRecord(record.id)">
              {{
                record.timeDesc }}</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="18" :loading="recordLoading">
        <el-row style="height: 70vh">
          <el-col :span="12">
            截图
          </el-col>
          <el-col :span="12">
            识别结果
          </el-col>
        </el-row>
        <!-- <el-divider /> -->
        <el-row style="display: flex;justify-content: center;" v-show="currentRecordId != 0">
          <div>
            <el-pagination background page-size="1" layout="prev, pager, next" :total="pageCount" class="mt-4" />
            <div style="margin-top:10px;">
              <el-button type="primary" @click="proctedDialog = true">
                <el-icon size="16">
                  <CirclePlus />
                </el-icon>
                上传跑旗截图</el-button>
            </div>
          </div>

        </el-row>
      </el-col>
    </el-row>

    <el-dialog v-model="proctedDialog" title="输入保护码">
      <el-form :model="proctedForm" :label-position="'right'">
        <el-form-item label="保护码">
          <el-input v-model="proctedForm.protectCode" autocomplete="off" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="proctedDialog = false">取消</el-button>
          <el-button type="primary" @click="verifyProcetedCode">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="uploadDialog" title="上传跑旗截图">
      <el-upload class="upload-demo" action="http://localhost:8901/miao-api/record/uploadPic" :data="operationInfo">
        <el-button type="primary">
          <el-icon size="16">
            <CirclePlus />
          </el-icon>
          上传跑旗截图</el-button>
      </el-upload>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeUploadDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import md5 from "js-md5";

export default {
  data() {
    return {
      guildDropDown: [{}],
      guildQueryForm: {
        guildId: "",
        pageIndex: 1,
        pageSize: 20
      },
      recordList: [],
      currentRecordId: 0,
      haveMore: false,
      guildLoading: false,
      recordLoading: false,
      pageCount: 0,
      proctedDialog: false,
      uploadDialog: false,
      proctedForm: {
        protectCode: "",
      },
      operationInfo: {
        token: ""
      }
    };
  },
  methods: {
    getGuildDropDown() {
      this.guildLoading = true;
      this.request
        .post("/miao-api/guild/getGuildDropDown", {})
        .then((response) => {
          let data = response.data;
          this.guildDropDown = data.list;
          this.guildLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    },
    getImportRecordList() {
      if (!this.haveMore) {
        return
      }
      this.request
        .post("/miao-api/record/getImportRecordList", this.guildQueryForm)
        .then((response) => {
          let data = response.data;
          let list = data.list;
          this.recordList = this.recordList.concat(list)
          this.haveMore = this.recordList.length != data.totalCount
          this.guildLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    },
    handleGuildChange(val) {
      this.guildQueryForm.guildId = val;
      this.guildQueryForm.pageIndex = 1;
      this.haveMore = true;
      this.currentRecordId = 0;
      this.recordList = [];
      this.getImportRecordList();
    },
    loadData() {
      this.guildQueryForm.pageIndex += 1
      this.getImportRecordList()
    },
    choseRecord(recordId) {
      console.log(recordId)
      this.currentRecordId = recordId;
    },
    verifyProcetedCode() {
      this.proctedForm.id = this.currentRecordId
      let submitForm = {
        protectCode: md5(this.proctedForm.protectCode),
        id: this.currentRecordId
      }
      //验证密码正确性
      this.request
        .post("/miao-api/record/verifyProtectCode", submitForm)
        .then((response) => {
          let data = response.data;
          let result = data.result
          if (result) {
            this.proctedDialog = false;
            this.uploadDialog = true;
            this.operationInfo.token = data.token
          } else {
            ElMessage({
              message: "保护码错误",
              type: "error",
            });
          }
          // this.recordList = this.recordList.concat(list)
          // this.haveMore = this.recordList.length != data.totalCount
          // this.guildLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });

    },
    closeUploadDialog() {
      this.uploadDialog = false
      //刷新页面
    }
  },

  created() {
    this.getGuildDropDown();
  },
};
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding-bottom: 10px;
}

/* 
.el-input {
  width: 300px;
} */

.infinite-list {
  height: 70vh;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  background: var(--el-color-primary-light-9);
  margin: 5px;
  /* color: var(--el-color-primary); */
  cursor: pointer;
}


.infinite-list .infinite-list-item+.list-item {
  margin-top: 10px;
}
</style>