<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryForm.queryType"
            placeholder="类型"
            @change="handleTypeChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="contributionList"
        stripe
        style="width: 100%"
        size="large"
        v-loading="loading"
        :header-cell-style="{ background: '#d7e4fb' }"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="name" label="游戏id">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
            <el-tag>{{ scope.row.id }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="timeDesc" label="时间"> </el-table-column>
        <el-table-column prop="flagRace" label="跑旗"> </el-table-column>
        <el-table-column prop="culvert" label="水路"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleOpenEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryType: 1,
      loading: false,
      options: [
        {
          label: "全部",
          value: 1,
        },
        {
          label: "未纠正",
          value: 2,
        },
        {
          label: "已纠正",
          value: 3,
        },
      ],
      queryForm: {
        pageSize: 10,
        pageIndex: 1,
        name: "",
        weekStartDate: "",
        queryType: "1",
      },
      memberList: [
        // {
        //   name: "minnanil",
        //   recordList: [
        //     {
        //       timeDesc: "100-100",
        //       flagRace: 0,
        //       culvert: 0
        //     },{
        //       timeDesc: "100-100",
        //       flagRace: 0,
        //       culvert: 1000
        //     }
        //   ]
        // },{
        //   name: "dyalnshadow",
        //   recordList: [
        //     {
        //       timeDesc: "100-100",
        //       flagRace: 0,
        //       culvert: 0
        //     },{
        //       timeDesc: "100-100",
        //       flagRace: 0,
        //       culvert: 1000
        //     }
        //   ]
        // }
      ],
    };
  },
  methods: {
    handleTypeChange(value) {
      this.queryForm.queryType = value;
      this.getFocustList();
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
  },
  created() {
    this.getContributionList(1);
    // this.getRoomStatusDropDown();
    // this.value1 = dayjs().subtract(7, "days").format("YYYY-MM-DD")
  },
};
</script>
<style>
</style>