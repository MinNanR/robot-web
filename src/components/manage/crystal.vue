<template>
  <div>
    <el-table :data="muleList" show-summary :summary-method="summaried">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column
        prop="muleName"
        label="角色"
        width="150"
      ></el-table-column>
      <el-table-column label="BOSS">
        <template #default="scope">
          <el-popover
            effect="light"
            trigger="hover"
            placement="top"
            width="auto"
            max-width="400"
            v-for="(egg, index) in scope.row.eggs"
            :key="scope.row.muleName + '_' + index"
          >
            <template #default>
              <div>单人蛋钱: {{ formatNumber(egg.value) }}</div>
              <div>
                摊分蛋钱:
                {{ formatNumber(Math.floor(egg.value / egg.partySize)) }}
              </div>
            </template>
            <template #reference>
              <el-tag
                style="
                  margin-right: 10px;
                  margin-bottom: 10px;
                  margin-top: 10px;
                "
              >
                <el-avatar
                  :src="require('@/assets/media/' + egg.label + '.png')"
                  size="small"
                  style="margin-right: 5px; vertical-align: middle"
                ></el-avatar
                >{{ egg.difficulty }}({{ egg.partySize }}人)</el-tag
              >
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="150" label="蛋钱">
        <template #default="scope">
          {{ formatNumber(eggTotal(scope.row.eggs)) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="editMule(scope.row, scope.$index)"
            >编辑</el-button
          >
          <el-button
            link
            type="info"
            size="small"
            @click="copyMule(scope.row, scope.$index)"
            >复制</el-button
          >
          <el-popconfirm
            :title="'确认删除角色' + scope.row.muleName + '吗？'"
            confirm-button-type="danger"
            @confirm="deleteMule(scope.$index)"
          >
            <template #reference>
              <el-button link size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div
      style="
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-top: 10px;
      "
    >
      <div>
        <el-button type="primary" @click="addBossMule"
          ><el-icon size="16" style="margin-right: 3px"><CirclePlus /></el-icon
          >添加</el-button
        >
        <span style="margin-left: 10px; margin-right: 10px">模板添加：</span>
        <el-button type="success" @click="addTemplateMule(0, '13蛋N4M')">
          <el-icon size="16" style="margin-right: 3px"><CirclePlus /></el-icon>
          13蛋N4M</el-button
        >
        <el-button type="success" @click="addTemplateMule(1, '10蛋N4M')">
          <el-icon size="16" style="margin-right: 3px"><CirclePlus /></el-icon>
          10蛋N4M</el-button
        >
        <el-button type="success" @click="addTemplateMule(2, '11蛋水灵露')">
          <el-icon size="16" style="margin-right: 3px"><CirclePlus /></el-icon>
          11蛋水灵露</el-button
        >
      </div>
    </div>
    <div
      style="
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-top: 10px;
        padding-bottom: 10px;
      "
    >
      <div>
        <el-tooltip
          content="总蛋数超过180个或单角色蛋数超过14个时可进行优化，优化方案为选取蛋钱前180个的蛋"
          placement="top"
        >
          <el-button type="danger" @click="optimize()">优化</el-button>
        </el-tooltip>
        <el-button type="success" @click="reset()">还原</el-button>
        <el-button type="primary" @click="saveData()">保存方案</el-button>
      </div>
    </div>
    <el-dialog v-model="bossMuleDialog" destroy-on-close width="90%">
      <bossMule
        :updateMuleList="updateData"
        :closeDialog="closeDialog"
        :operateMule="operateMule"
        :operate="operate"
      />
    </el-dialog>
  </div>
</template>

<script>
import bossMule from "./bossMule.vue";
// import { h } from "vue";
// import { ElAvatar } from "element-plus";

class Crystal {
  constructor(label, value, partySize, difficulty, muleIndex) {
    this.label = label;
    this.partySize = partySize;
    this.value = value;
    this.difficulty = difficulty;
    this.muleIndex = muleIndex;
  }
}

class Mule {
  constructor(muleName) {
    this.muleName = muleName;
    this.crystalList = [];
  }

  addCrystal(crystal) {
    this.crystalList.push(crystal);
  }

  getCrystalList() {
    return this.crystalList;
  }

  getMuleName() {
    return this.muleName;
  }
}

export default {
  components: {
    bossMule,
  },
  data() {
    return {
      bossMuleDialog: false,
      muleList: [
        // {
        //   muleName: "隐月",
        //   eggs: [
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "H麦",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //   ],
        // },
        // {
        //   muleName: "轮椅",
        //   eggs: [
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "H麦",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //     {
        //       label: "C扎",
        //       value: "81000000",
        //       partyCount: 1,
        //     },
        //   ],
        // },
      ],
      operateIndex: 0,
      operateMule: {},
      operate: "",
      preset: [
        [
          {
            label: "血腥女王",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "半半",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "扎昆",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "皮埃尔",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "麦格纳斯",
            value: 95062500,
            partySize: 1,
            difficulty: "困难",
          },
          {
            label: "贝伦",
            value: 105062500,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "帕普拉图斯",
            value: 132250000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "明智光秀",
            value: 144000000,
            partySize: 1,
            difficulty: "普通",
          },
          {
            label: "黛米安",
            value: 169000000,
            partySize: 1,
            difficulty: "普通",
          },
          {
            label: "斯乌",
            value: 162562500,
            partySize: 1,
            difficulty: "普通",
          },
          {
            label: "品克缤",
            value: 64000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "希纳斯",
            value: 72250000,
            partySize: 1,
            difficulty: "普通",
          },
          {
            label: "希拉",
            value: 56250000,
            partySize: 1,
            difficulty: "困难",
          },
        ],
        [
          {
            label: "血腥女王",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "半半",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "扎昆",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "皮埃尔",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "麦格纳斯",
            value: 95062500,
            partySize: 1,
            difficulty: "困难",
          },
          {
            label: "贝伦",
            value: 105062500,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "帕普拉图斯",
            value: 132250000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "明智光秀",
            value: 144000000,
            partySize: 1,
            difficulty: "普通",
          },
          {
            label: "黛米安",
            value: 169000000,
            partySize: 1,
            difficulty: "普通",
          },
          {
            label: "斯乌",
            value: 162562500,
            partySize: 1,
            difficulty: "普通",
          },
        ],
        [
          {
            label: "血腥女王",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "半半",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "扎昆",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "皮埃尔",
            value: 81000000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "麦格纳斯",
            value: 95062500,
            partySize: 1,
            difficulty: "困难",
          },
          {
            label: "贝伦",
            value: 105062500,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "帕普拉图斯",
            value: 132250000,
            partySize: 1,
            difficulty: "混沌",
          },
          {
            label: "明智光秀",
            value: 144000000,
            partySize: 1,
            difficulty: "普通",
          },
          {
            label: "黛米安",
            value: 169000000,
            partySize: 1,
            difficulty: "普通",
          },
          {
            label: "守护天使水灵王",
            value: 171610000,
            partySize: 1,
            difficulty: "普通",
          },
          {
            label: "斯乌",
            value: 162562500,
            partySize: 1,
            difficulty: "普通",
          },
        ],
      ],
    };
  },
  methods: {
    eggTotal(eggs) {
      let sum = 0;
      for (let egg of eggs) {
        sum += Math.floor(egg.value / egg.partySize);
      }
      return sum;
    },
    formatNumber(number) {
      let formatter = new Intl.NumberFormat("en-US");
      return formatter.format(number);
    },
    summaried() {
      let eggCount = 0;
      let totalMeso = 0;
      let muleList = this.muleList;
      for (let mule of muleList) {
        eggCount += mule.eggs.length;
        totalMeso += this.eggTotal(mule.eggs);
      }

      // const node1 = h({
      //   tag: 'div',
      //   text : "总蛋数：" + eggCount
      // })
      return [
        "#",
        "合计",
        "总蛋数：" + eggCount,
        this.formatNumber(totalMeso),
        "",
      ];
    },
    addBossMule() {
      this.operateIndex = this.muleList.length;
      this.bossMuleDialog = true;
      this.operate = "add";
    },
    updateData(mule) {
      this.muleList.splice(this.operateIndex, 1, mule);
      this.saveData();
    },
    closeDialog() {
      this.bossMuleDialog = false;
    },
    editMule(row, index) {
      this.operateMule = row;
      this.operateIndex = index;
      this.operate = "edit";
      this.bossMuleDialog = true;
    },
    deleteMule(index) {
      this.muleList.splice(index, 1);
      this.saveData();
    },
    copyMule(row) {
      this.operateIndex = this.muleList.length;
      const muleName = row.muleName + "_" + this.randomString(6);
      const eggs = row.eggs;
      this.updateData({
        muleName: muleName,
        eggs: eggs,
      });
    },
    randomString(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    addTemplateMule(templateIndex, muleName) {
      this.operateIndex = this.muleList.length;
      muleName = muleName + "_" + this.randomString(6);
      const eggs = this.preset[templateIndex];
      this.updateData({
        muleName: muleName,
        eggs: eggs,
      });
    },
    getMaxProfitSales(mules) {
      // 所有水晶的列表
      let allCrystals = [];
      // 填充所有水晶
      mules.forEach((mule) => {
        allCrystals.push(...mule.getCrystalList());
      });

      // 按照价格从高到低排序
      allCrystals.sort((a, b) => b.value - a.value);

      // 用于存储每个Mule的销售结果
      let saleResults = mules.map((mule) => ({
        mule,
        soldCrystals: [],
        totalValue: 0,
      }));

      let totalSoldCrystals = 0;
      const maxSold = 180;
      const maxCrystalsPerMule = 14;

      // 遍历每个水晶并分配给Mule角色
      for (let crystal of allCrystals) {
        let muleIndex = crystal.muleIndex;
        let result = saleResults[muleIndex];
        if (result.soldCrystals.length >= maxCrystalsPerMule) {
          continue;
        }
        result.soldCrystals.push(crystal);
        result.totalValue += crystal.value;
        totalSoldCrystals++;
        if (totalSoldCrystals >= maxSold) {
          break; // 总数达到180时，结束销售
        }
      }

      return saleResults;
    },
    optimize() {
      let mules = [];
      for (let i = 0; i < this.muleList.length; i++) {
        let mule = this.muleList[i];
        let m = new Mule(mule.muleName);
        for (let egg of mule.eggs) {
          m.addCrystal(
            new Crystal(egg.label, egg.value, egg.partySize, egg.difficulty, i)
          );
        }
        mules.push(m);
      }
      let result = this.getMaxProfitSales(mules);
      let optmizedMuleList = [];
      for (let item of result) {
        let eggs = item.soldCrystals.map((e) => {
          return {
            label: e.label,
            value: e.value,
            partySize: e.partySize,
            difficulty: e.difficulty,
          };
        });
        optmizedMuleList.push({
          muleName: item.mule.muleName,
          eggs: eggs,
        });
      }
      this.muleList = optmizedMuleList;
    },
    reset() {
      let muleListJson = localStorage.getItem("muleList");
      if (muleListJson != null && muleListJson.length > 0) {
        this.muleList = JSON.parse(muleListJson);
      }
    },
    saveData() {
      console.log(JSON.stringify(this.muleList))
      localStorage.setItem("muleList", JSON.stringify(this.muleList));
    },
  },
  mounted() {
    this.reset();
  },
};
</script>

<style>
</style>