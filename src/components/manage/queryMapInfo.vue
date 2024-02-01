<template>
  <div>
    <el-form
      :label-position="left"
      label-width="100px"
      :model="strategyForm"
      style="max-width: 460px"
    >
      <el-form-item label="快捷字">
        <el-input v-model="queryMapForm.queryContent" />
      </el-form-item>
      <el-form-item label="查询地址">
        <el-input v-model="queryMapForm.queryUrl" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveQueryMap()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["queryMap", "saveData"],
  data() {
    return {
      queryMapForm: {},
    };
  },
  methods: {
    saveQueryMap() {
      this.saveData(this.queryMapForm);
    },
  },
  mounted() {
    console.log(this.queryMap)
    this.queryMapForm = {
      id: this.queryMap.id,
      queryContent: this.queryMap.queryContent,
      queryUrl: this.queryMap.queryUrl,
    };
  },
};
</script>

<style>
</style>