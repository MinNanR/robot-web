<template>
  <div>
    <el-form
      :label-position="left"
      label-width="100px"
      :model="strategyForm"
      style="max-width: 460px"
    >
      <el-form-item label="策略名称">
        <el-input v-model="strategyForm.strategyName" />
      </el-form-item>
      <el-form-item label="匹配类型">
        <el-radio-group v-model="strategyForm.expressionType">
          <el-radio :label="1">全匹配</el-radio>
          <el-radio :label="2">正则匹配</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="匹配表达式">
        <el-input v-model="strategyForm.expression" />
      </el-form-item>
      <el-form-item label="使用组件">
        <el-select
          v-model="strategyForm.componentName"
          class="m-2"
          placeholder="选择使用的处理组件"
        >
          <el-option
            v-for="item in componentDropDown"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="权限掩码">
        <el-input v-model.number="strategyForm.authMask"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addStrategy()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElNotification } from "element-plus";

export default {
  props: ["closeAndRefreshDialog"],
  data() {
    return {
      strategyForm: {
        expression: "",
        expressionType: 1,
        componentName: "",
        authMask: 0,
        strategyName: "",
      },
      componentDropDown: [],
    };
  },
  methods: {
    addStrategy() {
      this.request
        .post("/robot/api/strategy/addStrategy", this.strategyForm)
        .then((response) => {
          ElNotification.success({
            title: "操作成功",
            message: response.message,
            showClose: true,
            duration: 2000,
          });
          this.closeAndRefreshDialog();
        })
        .catch((err) => {
          ElNotification.error({
            title: "操作失败",
            message: err,
            showClose: true,
            duration: 2000,
          });
        });
    },
    getComponentList() {
      this.request
        .post("/robot/api/strategy/getComponentDropDown", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.componentDropDown = data;
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getComponentList();
  },
};
</script>

<style>
</style>