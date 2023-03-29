<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="家族">
          <el-select v-model="queryForm.guildId" placeholder="请选择家族" @change="handleGuildChange" clearable>
            <el-option v-for="item in guildDropDown" :key="item.value" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
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

    </el-table>
    <div style="display: flex; margin-top: 30px">
      <div class="refresh-btn" @click="getContributionList(1)">
        <i class="el-icon-refresh-right"></i>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryForm.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="10" :hide-on-single-page="false"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  data() {
    return {
      guildDropDown: [],
      contributionList: [],
      queryForm: {
        guildId: null,
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
    getGuildDropDown() {
      this.request
        .post("/miao-api/guild/getGuildDropDown", {})
        .then((response) => {
          let data = response.data;
          this.guildDropDown = data.list;
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    },
    getContributionList(pageIndex) {
      console.log(pageIndex);
      // console.log(this.weekStartDate)
      // var d = datejs(this.value1).fromat("YYYY-MMD-DD")
      // console.log(d)
      this.loading = true;
      // console.log(pageIndex, this.queryForm.pageIndex);
      this.queryForm.pageIndex = pageIndex || this.queryForm.pageIndex;
      this.request
        .post("/miao-api/record/getContributionList", this.queryForm)
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
  },
  created() {
    this.getGuildDropDown();
    this.getContributionList();
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

/* .el-input {
  width: 300px;
} */
</style>