<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="游戏id">
          <el-input v-model="queryForm.name" placeholder="游戏id">
            <template #append>
              <el-switch v-model="queryForm.queryType" class="mb-2" inline-prompt style="
                    --el-switch-on-color: #13ce66;
                    --el-switch-off-color: #409eff;
                  " active-text="前置匹配" inactive-text="模糊匹配" active-value="1" inactive-value="2" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="时间">
          <div class="block">
            <el-date-picker v-model="queryForm.weekStartDate" type="week" format="YYYY年第w周" value-format="YYYY-MM-DD"
              placeholder="选择周" @change="handleDateChange">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getContributionList(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-upload class="upload-demo" action="http://localhost:8901/uploadContributionPic" multiple
        :before-upload="beforeUpload" :on-change="hanldeFileAdd">
        <el-button type="primary">
          <el-icon size="16">
            <CirclePlus />
          </el-icon>
          上传跑旗截图</el-button>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
      <!-- <el-button type="primary" @click="toAddContribution()">
        录入
      </el-button> -->
    </div>
    <el-table :data="contributionList" stripe style="width: 100%" size="large" v-loading="loading"
      :header-cell-style="{ background: '#d7e4fb' }">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="name" label="游戏id"> </el-table-column>
      <el-table-column prop="timeDesc" label="时间"> </el-table-column>
      <el-table-column prop="flagRace" label="跑旗"> </el-table-column>
      <el-table-column prop="culvert" label="水路"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleOpenEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; margin-top: 30px">
      <div class="refresh-btn" @click="getRoomList()">
        <i class="el-icon-refresh-right"></i>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryForm.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="10" :hide-on-single-page="false"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
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
          <el-button @click="editDialog = false">Cancel</el-button>
          <el-button type="primary" @click="saveContribution">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      contributionList: [],
      queryForm: {
        pageSize: 10,
        pageIndex: 1,
        name: "",
        weekStartDate: "",
        queryType: "1",
      },
      total: 0,
      loading: false,
      weekStartDate: "",
      editDialog: false,
      editForm: {
      },
    };
  },
  methods: {
    getContributionList(pageIndex) {
      console.log(pageIndex);
      // console.log(this.weekStartDate)
      // var d = datejs(this.value1).fromat("YYYY-MMD-DD")
      // console.log(d)
      this.loading = true;
      // console.log(pageIndex, this.queryForm.pageIndex);
      this.queryForm.pageIndex = pageIndex || this.queryForm.pageIndex;
      this.request
        .post("/contribution/getContributionList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.contributionList = data.list;
          this.total = data.totalCount;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    },
    toAddContribution() {
      this.$router.push("/addContribution");
    },
    handleSizeChange(value) {
      this.queryForm.pageSize = value;
      this.getContributionList(1);
    },
    handleCurrentChange(value) {
      this.getContributionList(value);
    },
    handleDateChange(value) {
      console.log(value);
      if (value != null) {
        this.queryForm.weekStartDate = dayjs(value)
          .add(1, "days")
          .format("YYYY-MM-DD");
      }
    },
    beforeUpload() {
      return false;
    },
    hanldeFileAdd(file) {
      console.log(ElMessage);
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = () => {
        var base_64_data = reader.result;
        console.log(base_64_data);
        this.request
          .post("/uploadContributionPic", {
            img: base_64_data,
          })
          .then((response) => {
            let responseData = response.data;
            let inputCount = responseData.inputCount;
            let errorCount = responseData.errorCount;
            let message = `本次跑旗录入数据${inputCount}条`;
            if (errorCount > 0) {
              message = message + `，异常数据${errorCount}条`;
            }
            ElMessage({
              message: message,
              type: "success",
            });
            this.getContributionList(1);
          })
          .catch((error) => {
            console.log(error);
            this.error(error);
            this.loading = false;
          });
      };
      reader.onerror = (err) => {
        console.log(err);
      };
    },
    handleOpenEdit(index, row) {
      // this.$message({
      //   type: "info",
      //   message: "功能未开放",
      // });
      console.log(index, row.id);
      this.editForm = {
        id: row.id,
        name: row.name,
        flagRace: row.flagRace,
        culvert: row.culvert
      }
      this.editDialog = true;
    },
    saveContribution() {
      this.request
        .post("/contribution/editContribution", this.editForm)
        .then((response) => {
          let message = response.message
          ElMessage({
            message: message,
            type: "success",
          });
          this.editDialog = false;
          this.getContributionList(1)
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    }
  },
  created() {
    this.getContributionList(1);
    // this.getRoomStatusDropDown();
    // this.value1 = dayjs().subtract(7, "days").format("YYYY-MM-DD")
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

.el-input {
  width: 300px;
}
</style>