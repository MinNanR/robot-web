<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="queryForm.queryType" placeholder="类型" @change="handleTypeChange">
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
    <el-table
      :data="memberList"
      stripe
      style="width: 100%"
      size="large"
      v-loading="loading"
      :header-cell-style="{ background: '#d7e4fb' }"
    >
      <el-table-column type="expand">
        <template #default="props">
          <div>
            <div v-for="item in props.row.recordList" :key="item.id">
              <p>{{item.timeDesc}}:  {{item.flagRace}} / {{item.culvert}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="name" label="游戏id"> </el-table-column>
    </el-table>
    <!-- <div style="display: flex; margin-top: 30px">
      <div class="refresh-btn" @click="getRoomList()">
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
    </div> -->
  </div>
</template>

<script>
// import dayjs from "dayjs";

export default {
  data() {
    return {
      queryType: 1,
      options: [
        {
          label: "双蛋人",
          value: 1,
        },
        {
          label: "优化对象",
          value: 2,
        },
        {
          label: "2W4预备",
          value: 3,
        },
      ],
      queryForm: {
        queryType: 1
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
      ]
    };
  },
  methods: {
    getFocustList() {
      // console.log(this.weekStartDate)
      // var d = datejs(this.value1).fromat("YYYY-MMD-DD")
      // console.log(d)
      this.loading = true;
      // console.log(pageIndex, this.queryForm.pageIndex);
      this.request
        .post("/contribution/getFocusMemberList", this.queryForm)
        .then((response) => {
          let data = response.data;
          let memberMap = data.memberList;
          this.memberList = []
          for (let member in memberMap){
            let recordList = memberMap[member]
            this.memberList.push({
              "name": member,
              "recordList": recordList
            })
          }
          // this.memberList = data.memberList;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    },
    // getHouseDropDown() {
    //   this.request
    //     .post("/house/getHouseDropDown", {})
    //     .then((response) => {
    //       this.houseDropDown = response.data;
    //       if (this.houseDropDown.length > 0) {
    //         this.$nextTick(() => {
    //           this.queryForm.houseId = this.houseDropDown[0].id;
    //           this.getRoomList();
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       this.houseDropDown = [];
    //       console.log(error);
    //     });
    // },
    // getRoomStatusDropDown() {
    //   this.request
    //     .post("/room/getRoomStatusDropDown", {})
    //     .then((response) => {
    //       this.roomStatusDropDown = response.data;
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    // toAddRoom() {
    //   this.$router.push("/addRoom");
    // },
    // toUpdateRoom(index, id) {
    //   this.$router.push({ path: "/updateRoom", query: { id: id } });
    // },
    // toReferRoom(index, id) {
    //   this.$router.push({ path: "/roomInfo", query: { id: id } });
    // },
    // handleRoomStatusChange(val) {
    //   if (val === "") {
    //     this.queryForm.status = null;
    //   }
    // },
    handleTypeChange(value) {
      this.queryForm.queryType = value
      this.getFocustList()
    },
    // deleteRoom() {
    //   this.$message({
    //     type: "info",
    //     message: "功能未开放",
    //   });
    // },
  },
  created() {
    this.getFocustList()
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
</style>