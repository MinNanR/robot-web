<template>
  <div>
    <el-form
      :model="bossForm"
      label-width="120px"
      label-position="left"
      style="max-width: 600px"
    >
      <el-form-item label="BOSS名称">
        <el-input v-model="bossForm.bossName" />
      </el-form-item>
      <el-form-item label="等级">
        <el-input v-model="bossForm.level" />
      </el-form-item>
      <el-form-item label="血量">
        <el-input v-model="bossForm.hp" />
      </el-form-item>
      <el-form-item label="物理防御">
        <el-input v-model="bossForm.physicalDefense" />
      </el-form-item>
      <el-form-item label="魔法防御">
        <el-input v-model="bossForm.magicalDefense" />
      </el-form-item>
      <el-form-item label="元素减伤">
        
        <el-switch
          v-model="bossForm.elementReduction"
          active-text="有"
          inactive-text="无"
        />
      </el-form-item>
      <el-form-item label="ARC">
        <el-input v-model="bossForm.arc" />
      </el-form-item>
      <el-form-item label="AUT">
        <el-input v-model="bossForm.aut" />
      </el-form-item>
      <el-form-item label="重进间隔">
        <el-input v-model="bossForm.reenterInterval" />
      </el-form-item>
      <el-form-item label="领取限制">
        <el-input v-model="bossForm.claimLimit" />
      </el-form-item>
      <el-form-item label="奖励">
        <el-input v-model="bossForm.reward" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-select
          v-model="bossForm.nicknames"
          multiple
          filterable
          allow-create
          default-first-option
          collapse-tags
          placeholder="输入后回车"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) in nicknameOptions"
            :key="item + '-' + index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveBoss">保存</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElNotification } from "element-plus";

export default {
  props: ["bossId", "mode", "closeDialog", "dataModify"],
  data() {
    return {
      bossForm: {
        id: null,
        bossName: "",
        hp: "",
        level: "",
        physicalDefense: "",
        magicalDefense: "",
        elementReduction: false,
        arc: "",
        aut: "",
        reenterInterval: "",
        claimLimit: "",
        reward: "",
        nicknames: [],
      },
    };
  },
  computed: {
    nicknameOptions() {
      return Array.from(new Set(this.bossForm.nicknames || []));
    },
  },
  methods: {
    getBossInfo() {
      if (!this.bossId) {
        return;
      }
      this.request
        .post("/robot/api/boss/getBossInfo", { id: this.bossId })
        .then((response) => {
          let data = response.data;
          this.bossForm = {
            id: data.id,
            bossName: data.bossName || "",
            hp: data.hp || "",
            level: data.level || "",
            physicalDefense:
              data.physicalDefense === null || data.physicalDefense === undefined
                ? ""
                : data.physicalDefense,
            magicalDefense:
              data.magicalDefense === null || data.magicalDefense === undefined
                ? ""
                : data.magicalDefense,
            elementReduction: Boolean(data.elementReduction),
            arc: data.arc || "",
            aut: data.aut || "",
            reenterInterval: data.reenterInterval || "",
            claimLimit: data.claimLimit || "",
            reward:
              data.reward === null || data.reward === undefined
                ? ""
                : data.reward,
            nicknames: data.nicknames || [],
          };
        })
        .catch((error) => {
          console.log(error);
          ElNotification.error({
            title: "操作失败",
            message: error,
            showClose: true,
            duration: 2000,
          });
        });
    },
    saveBoss() {
      const isAdd = this.mode === "add";
      const url = isAdd ? "/robot/api/boss/addBoss" : "/robot/api/boss/updBoss";
      const payload = { ...this.bossForm };
      if (isAdd) {
        delete payload.id;
      }
      this.request
        .post(url, payload)
        .then((response) => {
          ElNotification.success({
            title: "操作成功",
            message: response.message,
            showClose: true,
            duration: 2000,
          });
          this.dataModify();
          this.closeDialog();
        })
        .catch((error) => {
          console.log(error);
          ElNotification.error({
            title: "操作失败",
            message: error,
            showClose: true,
            duration: 2000,
          });
        });
    },
  },
  mounted() {
    if (this.mode === "edit") {
      this.getBossInfo();
    }
  },
};
</script>

<style>
</style>
