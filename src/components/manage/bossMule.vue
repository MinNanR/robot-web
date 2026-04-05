<template>
  <el-form :model="formData" label-width="150px" label-position="left">
    <el-form-item label="角色">
      <el-input v-model="muleName" style="width: 200px"></el-input>
    </el-form-item>
    <el-form-item
      v-for="(boss, index) in bosses"
      :key="index"
      style="margin-top: 0px; margin-bottom: 5px"
    >
      <template #label>
        <el-avatar
          :src="require('@/assets/media/' + boss.bossName + '.png')"
          size="small"
          style="margin-right: 5px; vertical-align: middle"
        ></el-avatar>
        {{ boss.bossName }}
      </template>
      <div class="boss-container">
        <span style="width: 300px">
          <el-radio-group
            v-model="formData[boss.bossName]"
            @change="handleChange"
            style="margin-left: 10px"
          >
            <el-radio
              v-for="difficulty in boss.difficultyList"
              :key="difficulty.difficulty"
              :label="difficulty.difficulty"
            >
              {{ difficulty.difficulty }}
            </el-radio>
          </el-radio-group>
        </span>
        <el-input-number
          :max="boss.maxPartySize"
          v-model="boss.partySize"
          with="10px;"
          style="margin-left: 10px"
        ></el-input-number>
        <el-button
          type="danger"
          size="default"
          @click="clearSelection(boss.bossName)"
          :disabled="!formData[boss.bossName]"
          class="clear-button"
        >
          取消选择
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <span class="selected-count" :style="{color : selectedCount > maxSelection ? '#e74c3c' : '#409eff'}">
        已选 {{ selectedCount }}/{{ maxSelection }}
      </span>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  ElForm,
  ElFormItem,
  ElRadioGroup,
  ElRadio,
  ElButton,
} from "element-plus";

export default {
  props: ["updateMuleList", "closeDialog", "operateMule", "operate"],
  components: {
    ElForm,
    ElFormItem,
    ElRadioGroup,
    ElRadio,
    ElButton,
  },
  data() {
    return {
      formData: {}, // 用于保存用户的选择
      maxSelection: 14, // 最大允许选择的 Boss 数量
      selectedCount: 0, // 当前已选中的数量,
      muleName: "",
    };
  },
  computed: {
    bosses() {
      return [
        {
          bossName: "扎昆",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "扎昆",
              difficulty: "混沌",
              reward: 81000000,
            },
          ],
        },
        {
          bossName: "麦格纳斯",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "麦格纳斯",
              difficulty: "困难",
              reward: 95062500,
            },
          ],
        },
        {
          bossName: "希拉",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "希拉",
              difficulty: "困难",
              reward: 56250000,
            },
          ],
        },
        {
          bossName: "帕普拉图斯",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "帕普拉图斯",
              difficulty: "混沌",
              reward: 132250000,
            },
          ],
        },
        {
          bossName: "皮埃尔",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "皮埃尔",
              difficulty: "混沌",
              reward: 81000000,
            },
          ],
        },
        {
          bossName: "半半",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "半半",
              difficulty: "混沌",
              reward: 81000000,
            },
          ],
        },
        {
          bossName: "血腥女王",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "血腥女王",
              difficulty: "混沌",
              reward: 81000000,
            },
          ],
        },
        {
          bossName: "贝伦",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "贝伦",
              difficulty: "混沌",
              reward: 105062500,
            },
          ],
        },
        {
          bossName: "品克缤",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "品克缤",
              difficulty: "混沌",
              reward: 64000000,
            },
          ],
        },
        {
          bossName: "希纳斯",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "希纳斯",
              difficulty: "普通",
              reward: 72250000,
            },
            {
              name: "希纳斯",
              difficulty: "简单",
              reward: 45562500,
            },
          ],
        },
        {
          bossName: "斯乌",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "斯乌",
              difficulty: "极限",
              reward: 1397500000,
            },
            {
              name: "斯乌",
              difficulty: "困难",
              reward: 444675000,
            },
            {
              name: "斯乌",
              difficulty: "普通",
              reward: 162562500,
            },
          ],
        },
        {
          bossName: "黛米安",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "黛米安",
              difficulty: "困难",
              reward: 421875000,
            },
            {
              name: "黛米安",
              difficulty: "普通",
              reward: 169000000,
            },
          ],
        },
        {
          bossName: "守护天使水灵王",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "守护天使水灵王",
              difficulty: "混沌",
              reward: 600578125,
            },
            {
              name: "守护天使水灵王",
              difficulty: "普通",
              reward: 231673500,
            },
          ],
        },
        {
          bossName: "露西德",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "露西德",
              difficulty: "困难",
              reward: 504000000,
            },
            {
              name: "露西德",
              difficulty: "普通",
              reward: 253828125,
            },
            {
              name: "露西德",
              difficulty: "简单",
              reward: 237009375,
            },
          ],
        },
        {
          bossName: "威尔",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "威尔",
              difficulty: "困难",
              reward: 621810000,
            },
            {
              name: "威尔",
              difficulty: "普通",
              reward: 279075000,
            },
            {
              name: "威尔",
              difficulty: "简单",
              reward: 246744750,
            },
          ],
        },
        {
          bossName: "至暗魔晶",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "至暗魔晶",
              difficulty: "混沌",
              reward: 563945000,
            },
            {
              name: "至暗魔晶",
              difficulty: "普通",
              reward: 297675000,
            },
          ],
        },
        {
          bossName: "觉醒希拉",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "觉醒希拉",
              difficulty: "困难",
              reward: 762105000,
            },
            {
              name: "觉醒希拉",
              difficulty: "普通",
              reward: 581880000,
            },
          ],
        },
        {
          bossName: "亲卫队长敦凯尔",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "亲卫队长敦凯尔",
              difficulty: "困难",
              reward: 667920000,
            },
            {
              name: "亲卫队长敦凯尔",
              difficulty: "普通",
              reward: 316875000,
            },
          ],
        },
        {
          bossName: "神选者塞伦",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "神选者塞伦",
              difficulty: "极限",
              reward: 4235000000,
            },
            {
              name: "神选者塞伦",
              difficulty: "困难",
              reward: 1096562500,
            },
            {
              name: "神选者塞伦",
              difficulty: "普通",
              reward: 889021875,
            },
          ],
        },
        {
          bossName: "监视者卡尔洛斯",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "监视者卡尔洛斯",
              difficulty: "极限",
              reward: 5200000000,
            },
            {
              name: "监视者卡尔洛斯",
              difficulty: "困难",
              reward: 2600000000,
            },
            {
              name: "监视者卡尔洛斯",
              difficulty: "普通",
              reward: 1300000000,
            },
            {
              name: "监视者卡尔洛斯",
              difficulty: "简单",
              reward: 937500000,
            },
          ],
        },
        {
          bossName: "最初的对决者",
          maxPartySize: 3,
          partySize: 1,
          difficultyList: [
            {
              name: "最初的对决者",
              difficulty: "极限",
              reward: 5880000000,
            },
            {
              name: "最初的对决者",
              difficulty: "困难",
              reward: 2940000000,
            },
            {
              name: "最初的对决者",
              difficulty: "普通",
              reward: 1365000000,
            },
            {
              name: "最初的对决者",
              difficulty: "简单",
              reward: 985000000,
            },
          ],
        },
        {
          bossName: "卡琳",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "卡琳",
              difficulty: "极限",
              reward: 6026000000,
            },
            {
              name: "卡琳",
              difficulty: "困难",
              reward: 2990000000,
            },
            {
              name: "卡琳",
              difficulty: "普通",
              reward: 1506500000,
            },
            {
              name: "卡琳",
              difficulty: "简单",
              reward: 1031250000,
            },
          ],
        },
        {
          bossName: "林波",
          maxPartySize: 3,
          partySize: 1,
          difficultyList: [
            {
              name: "林波",
              difficulty: "困难",
              reward: 5350000000,
            },
            {
              name: "林波",
              difficulty: "普通",
              reward: 3000000000,
            },
          ],
        },
        {
          bossName: "巴德里克斯",
          maxPartySize: 3,
          partySize: 1,
          difficultyList: [
            {
              name: "巴德里克斯",
              difficulty: "困难",
              reward: 2800000000,
            },
            {
              name: "巴德里克斯",
              difficulty: "普通",
              reward: 4200000000,
            },
          ],
        },
        {
          bossName: "浓姬",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "浓姬",
              difficulty: "普通",
              reward: 81000000,
            },
          ],
        },
        {
          bossName: "明智光秀",
          maxPartySize: 6,
          partySize: 1,
          difficultyList: [
            {
              name: "明智光秀",
              difficulty: "普通",
              reward: 144000000,
            },
          ],
        },
      ];
    },
  },
  methods: {
    // 格式化奖励显示
    formatReward(value) {
      return value.toLocaleString();
    },
    // 更新已选数量
    handleChange() {
      this.selectedCount = Object.values(this.formData).filter(Boolean).length;
    },
    // 判断是否禁用难度选项
    isDifficultyDisabled() {
      // 禁用规则：已达到最大选择数量，且该Boss尚未选择难度
      // return (
      //   this.selectedCount >= this.maxSelection && !this.formData[bossName]
      // );
      return false;
    },
    // 清除选择
    clearSelection(bossName) {
      // this.$set(this.formData, bossName, null); // 清除选择
      this.formData[bossName] = null;
      this.handleChange(); // 更新已选数量
    },
    // 提交表单
    submitForm() {
      let formData = this.formData;
      let cur = 0;
      let eggs = [];
      for (let item in formData) {
        while (this.bosses[cur].bossName != item) {
          cur = (cur + 1) % this.bosses.length;
        }
        let difficulty = formData[item];
        for (let d of this.bosses[cur].difficultyList) {
          if (difficulty == d.difficulty) {
            eggs.push({
              label: item,
              value: d.reward,
              partySize: this.bosses[cur].partySize,
              difficulty: difficulty,
            });
            break;
          }
        }
      }
      this.updateMuleList({
        muleName: this.muleName,
        eggs: eggs,
      });
      this.closeDialog();
    },
  },
  mounted() {
    if (this.operate == "edit") {
      let opeateMule = this.operateMule;
      let cur = 0;
      for (let b of opeateMule.eggs) {
        this.formData[b.label] = b.difficulty;
        while (this.bosses[cur].bossName != b.label) {
          cur = (cur + 1) % this.bosses.length;
        }
        this.bosses[cur].partySize = b.partySize;
      }
      this.muleName = opeateMule.muleName;
      this.selectedCount = opeateMule.eggs.length;
    }
  },
};
</script>

<style scoped>
.boss-container {
  margin-bottom: 5px;
}

.boss-container .el-radio-group {
  width: 300px;
}
.clear-button {
  margin-left: 10px;
}
.selected-count {
  margin-left: 20px;
  font-weight: bold;
}
</style>
