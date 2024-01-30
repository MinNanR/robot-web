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
      <el-button type="primary" @click="saveStrategy()">保存</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElNotification } from "element-plus";

export default {
  props: ["strategy", "closeAndRefreshDialog"],
  data() {
    return {
      componentDropDown: [],
      strategyForm: {},
    };
  },
  methods: {
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
    saveStrategy() {
      console.log(this.strategyForm)
      this.request
        .post("/robot/api/strategy/updStrategy", this.strategyForm)
        .then((response) => {
          ElNotification.success({
            title: "操作成功",
            message: response.message,
            showClose: true,
            duration: 2000,
          });
          this.closeAndRefreshDialog()
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
    }
  },
  mounted() {
    this.strategyForm = {
      id: this.strategy.id,
      expression: this.strategy.expression,
      expressionType: this.strategy.expressionType,
      componentName: this.strategy.componentName,
      authMask: this.strategy.authMask,
      strategyName: this.strategy.strategyName,
    };
    this.getComponentList();
  },
};
</script>

<style>
</style>