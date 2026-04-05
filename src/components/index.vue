<!--
 * @Author: heweifeng
 * @Date: 2023-10-26 10:47:03
 * @LastEditors: cy
 * @LastEditTime: 2024-04-17 11:48:02
 * @Description: 封装 element 基础表格
-->
<template>
  <el-table
    stripe
    v-bind="$attrs"
    ref="tableRef"
    v-loading="loading"
    :data="tableData"
    class="not-cell-border"
    @selection-change="handleSelectionChange"
    @current-change="handleRadioCurrentChange"
  >
    <template #empty>
      <Empty :loading="loading" />
    </template>
    <el-table-column
      v-if="selection"
      type="selection"
      width="55"
      :reserve-selection="reserveSelection"
      :selectable="isSelectable"
    />
    <el-table-column
      v-for="item in tableConfig"
      :key="item.key"
      :type="item.type"
      :width="item.width"
      :label="item.label"
      :formatter="item.formatter"
      fit
      :align="item.align || align"
      v-bind="item"
    >
      <template #default="scope">
        <template v-if="item.child && item.child.length">
          <el-table-column
            v-for="child in item.child"
            :key="child.key"
            :type="child.type"
            :width="child.width"
            :label="child.label"
            :formatter="child.formatter"
            fit
            :align="child.align || align"
          >
            <template #default="childScope">
              <div
                v-html="
                  child.formatter
                    ? child.formatter(childScope.row)
                    : child.key
                      ? childScope.row[child.key]
                      : childScope.$index + 1
                "
              />
            </template>
          </el-table-column>
        </template>
        <div
          v-else
          v-html="
            item.formatter
              ? item.formatter(scope.row)
              : item.key
                ? scope.row[item.key]
                : scope.$index + 1
          "
        />
      </template>
    </el-table-column>
    <slot></slot>
    <el-table-column
      v-if="$slots.operation"
      :align="align"
      label="操作"
      fit
      class-name="border-left"
      v-bind="operationAttrs"
    >
      <template #default="data">
        <slot name="operation" v-bind="data"></slot>
      </template>
    </el-table-column>
  </el-table>

  <div v-if="currentPage && pageSize && total" class="page-box">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<!-- 使用方式:
    <BaseTable
      :table-config="tableConfig"
      :table-data="tableData"
      :loading="loading"
      :total="total" // 如果不传总条数或者总条数为 0 则不显示分页
      v-model:current-page="query.pageIndex"
      v-model:page-size="query.pageSize"
      @size-change="getData(true)"
      @current-change="getData"
      v-model:selection="selection" // 当有这个属性时，表格显示多选框, 选中的值会双向绑定到此值
      :is-selectable="(row, index) => row" // 判断一行是否可以勾选的函数, 返回值用来决定这一行的 CheckBox 是否可以勾选, 默认返回 true
      align="left" // 可选, 全局设置表格列的对齐方式, 优先级比较低, 默认为 center
      :operation-attrs="{ label: '操作', width: 100 }" // 可选, 操作列的配置
      ...其他 el-table 属性
    >
      // 1.如果最后一列是操作列, 可直接使用操作插槽简化代码
      <template #operation="{ row }">
        <el-button type="primary" text @click="handleShowDialog(row)">
          下载申领表
        </el-button>
      </template>
      // 2.也可使用默认插槽自定义更多列
      <el-table-column
            label="操作"
            fit
            align="center"
            class-name="border-left"
        >
        <template #default="data">
            默认插槽
        </template>
      </el-table-column>
      ...
    </BaseTable> -->
<script setup>
import useScrollerDrag from "@/hooks/useScrollerDrag.js";
defineOptions({
  name: "BaseTable",
});

const props = defineProps({
  // 表格配置,[ { type: "index", label: "序号", width: 60, ...支持 Table-column 所有属性 }, { key: "name", label: "姓名", width: 100,// 可选 formatter: (row) => row.name }]
  tableConfig: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
    required: true,
  },
  // 总条数
  total: {
    type: Number,
    default: 0,
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false,
  },
  // 当前页
  currentPage: {
    type: Number,
    default: 1,
  },
  // 每页条数
  pageSize: {
    type: Number,
    default: 10,
  },
  // 当传入 selection 时，表格显示多选框, 选中的值会双向绑定到此值
  selection: {
    type: [Array, Boolean],
    default: false,
  },
  // 判断一行是否可以勾选的函数, 返回值用来决定这一行的 CheckBox 是否可以勾选, 默认返回 true
  isSelectable: {
    type: Function,
    default: () => true,
  },
  //数据刷新后是否保留选项
  reserveSelection: {
    type: Boolean,
    default: false,
  },
  // 可选，表格列对齐方式, 优先级低于每列的 align, 默认为 center
  align: {
    type: String,
    default: "center",
  },
  // 可选，操作列属性
  operationAttrs: {
    type: Object,
    default: () => ({}),
  },
  drag: {
    type: Boolean,
    default: false,
  },
});
const tableRef = ref(null);
const emit = defineEmits([
  "update:current-page",
  "update:page-size",
  "size-change",
  "current-change",
  "update:selection",
  "radio-current-change",
  "selection-change",
]);

const handleSizeChange = (val) => {
  emit("update:pageSize", val);
  emit("size-change", val);
};

const handleCurrentChange = (val) => {
  emit("update:currentPage", val);
  emit("current-change", val);
};

const handleSelectionChange = (val) => {
  emit("update:selection", val);
  emit("selection-change", val);
};
const handleRadioCurrentChange = (val) => {
  emit("radio-current-change", val);
};
props.drag && useScrollerDrag(tableRef);
defineExpose({
  tableRef,
});
</script>
