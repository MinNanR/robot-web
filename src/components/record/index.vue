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
          <ul v-infinite-scroll="loadRecord" class="infinite-list" style="overflow: auto">
            <li v-for="record in recordList" :key="record.id" class="infinite-list-item" @click="choseRecord(record.id)">
              {{
                record.timeDesc }}</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="18" :loading="recordLoading">
        <el-row style="height: 70vh" :gutter="10">
          <el-col :span="12">
            <div class="demo-image" v-if="importPageInfo.pageIndex != 0 && importPageInfo.pageList.length > 0">
              <div class="block">
                <el-image style="width: 100%; height: 100%"
                  :src="importPageInfo.pageList[importPageInfo.pageIndex - 1].picUrl" fit="fill" />
              </div>
            </div>
          </el-col>
          <el-col :span="12" v-if="importPageInfo.pageIndex != 0">
            <el-table :data="resultList" stripe style="width: 100%" :max-height="tableHeight" v-loading="tableLoading">
              <!-- <el-table-column prop="name" label="游戏id"> </el-table-column> -->
              <el-table-column v-if="editMode" label="#" width="80">
                <template #default="scope">
                  <el-button type="primary" @click="handleOpenEditDialog(scope.row)" size="small">
                    <el-icon size="12">
                      <Edit />
                    </el-icon>
                  </el-button>
                </template></el-table-column>
              <el-table-column prop="name" label="游戏id">
                <template #default="scope">
                  <span>{{ scope.row.name }}</span>
                  <el-tag v-if="scope.row.status == 2" type="warning">本周新id</el-tag>
                  <el-tag v-if="scope.row.status == 2 && scope.row.corrected == 0" type="danger">未修正</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="culvert" label="水路" width="70"></el-table-column>
              <el-table-column prop="flagRace" label="跑旗" width="70"> </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- <el-divider /> -->
        <el-row style="display: flex;justify-content: center;" v-show="currentRecordId != 0">
          <div>
            <el-pagination background page-size="1" layout="prev, pager, next" :page-count="pageCount" class="mt-4"
              @current-change="handleCurrenthange" v-show="pageCount > 0" />
            <div style="margin-top:10px;">
              <el-button-group class="ml-4">
                <el-button type="primary" :icon="CirclePlus" @click="handleOpenProtectDialog(1)">
                  <el-icon size="16">
                    <CirclePlus />
                  </el-icon> 上传跑旗记录</el-button>
                <el-button type="success" @click="handleOpenProtectDialog(2)">
                  <el-icon size="16">
                    <Edit />
                  </el-icon>
                  编辑跑旗记录</el-button>
                <el-button type="warning" @click="getOmitName()">
                  <el-icon size="16">
                    <Search />
                  </el-icon>
                  检查遗漏名单</el-button>
              </el-button-group>
            </div>

          </div>

        </el-row>
      </el-col>
    </el-row>

    <el-dialog v-model="protectDialog" title="输入保护码">
      <el-form :model="proctedForm" :label-position="'right'">
        <el-form-item label="保护码">
          <el-input v-model="proctedForm.protectCode" autocomplete="off" type="password" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="protectDialog = false">取消</el-button>
          <el-button type="primary" @click="verifyProcetedCode">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="uploadDialog" title="上传跑旗截图" close-on-click-modal="false">
      <el-upload class="upload-demo" :action="uploadUrl" :data="operationInfo">
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

    <el-dialog v-model="editDialog" title="MIAO贡编辑">
      <el-form :model="form" :label-position="'right'">
        <el-form-item label="游戏ID">
          <el-input v-model="editForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="跑旗">
          <el-input v-model="editForm.flagRace" autocomplete="off" />
        </el-form-item>
        <el-form-item label="水路">
          <el-input v-model="editForm.culvert" autocomplete="off" />
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialog = false">取消</el-button>
          <el-button type="primary" @click="saveContribution">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="omitDialog" title="遗漏名单">
      <h3>上周玩家id本周未录入名单</h3>
      <!-- <ul>
        <li v-for="omit in omitList" :key="omit">
        {{ omit }}
        </li>
      </ul> -->
      <div>
        <el-row>
          <el-col :span="4" v-for="omit in omitList" :key="omit">
            <p>{{ omit }}</p>
          </el-col>
        </el-row>

      </div>


      <template #footer>
        <p>请确认以上玩家为已退出家族或遗漏</p>
        <span class="dialog-footer">
          <el-button @click="omitDialog = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import config from '../../utils/config'
import md5 from "js-md5";

export default {
  data() {
    return {
      uploadUrl: "",
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
      protectDialog: false,
      uploadDialog: false,
      proctedForm: {
        protectCode: "",
      },
      operationInfo: {
        token: ""
      },
      importPageInfo: {
        pageList: [],
        pageIndex: 0,
      },
      pageCount: 0,
      resultList: [],
      tableHeight: 0,
      tableLoading: false,
      operation: 0,
      editMode: false,
      editDialog: false,
      editForm: {
      },
      omitList: [],
      omitDialog: false
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
    loadRecord() {
      this.guildQueryForm.pageIndex += 1
      this.getImportRecordList()
    },
    choseRecord(recordId) {
      this.currentRecordId = recordId;
      this.editMode = false
      this.operationInfo.token = ""
      this.getRecordPageList();
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
            this.protectDialog = false;
            this.operationInfo.token = data.token
            if (this.operation == 1) {
              this.uploadDialog = true;
            } else {
              this.editMode = true;
            }
            this.proctedForm.protectCode = ""
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
      this.getRecordPageList();
      //刷新页面
    },
    getRecordPageList() {
      this.pageIndex = 0
      this.importPageInfo.pageList = []
      this.resultList = []
      this.pageCount = 0
      this.request
        .post("/miao-api/record/getRecordPageList", {
          id: this.currentRecordId
        })
        .then((response) => {
          let data = response.data;
          let list = data.list
          if (list != null) {
            this.importPageInfo.pageList = list
            this.importPageInfo.pageIndex = 1
            this.pageCount = data.totalCount
            let pageId = list[0].id
            this.getContributionResult(pageId)
          } else {
            // ElMessage({
            //   message: "保护码错误",
            //   type: "error",
            // });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getContributionResult(id) {
      this.resultList = []
      this.tableLoading = true
      this.request
        .post("/miao-api/record/getContributionResult", {
          id: id
        })
        .then((response) => {
          let data = response.data;
          let list = data.list
          if (list != null) {
            this.resultList = list
          }
          this.tableLoading = false
        })
        .catch((error) => {
          console.log(error);
          this.tableLoading = false
        });
    },
    handleCurrenthange(val) {
      if (this.importPageInfo.pageList.length == 0) {
        return
      }
      let pageId = this.importPageInfo.pageList[val - 1].id
      this.importPageInfo.pageIndex = val
      this.getContributionResult(pageId)
    },
    handleOpenProtectDialog(operation) {
      this.operation = operation
      if (this.operationInfo.token != null && this.operationInfo.token != "") {
        if (this.operation == 1) {
          this.uploadDialog = true;
        } else {
          this.editMode = true;
        }
        return
      }
      this.protectDialog = true
    },
    handleOpenEditDialog(row) {
      this.editForm = {
        id: row.id,
        name: row.name,
        flagRace: row.flagRace,
        culvert: row.culvert,
        token: this.operationInfo.token
      }
      this.editDialog = true;
    },
    saveContribution() {
      this.request
        .post("/miao-api/record/updateContribution", this.editForm)
        .then((response) => {
          let message = response.message
          ElMessage({
            message: message,
            type: "success",
          });
          this.editDialog = false;
          let pageId = this.importPageInfo.pageList[this.importPageInfo.pageIndex - 1].id
          this.getContributionResult(pageId)
        })
        .catch((error) => {
          console.log(error);
          ElMessage({
            message: error,
            type: "error",
          });
          this.loading = false;
        });
    },
    getOmitName() {
      this.omitList = []
      this.request
        .post("/miao-api/record/getOmitName", {
          id: this.currentRecordId
        })
        .then((response) => {
          let data = response.data
          let list = data.list
          this.omitList = list
          this.omitDialog = true
        })
        .catch((error) => {
          console.log(error);
          ElMessage({
            message: error,
            type: "error",
          });
          this.loading = false;
        });
    }
  },

  created() {
    this.getGuildDropDown();
  },
  mounted() {
    this.tableHeight = document.body.clientHeight * 0.6 + "px"
    this.uploadUrl = `${config.baseUrl}/miao-api/record/uploadPic`
  }
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