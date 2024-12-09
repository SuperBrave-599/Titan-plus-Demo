<template>
  <div ref="titanTableRef" class="titan-table">
    <section class="titan-table__main" :style="{ padding: mergeConfig.tablePadding + 'px' }">
      <el-table ref="elTableRef" v-bind="mergeTableAttrs" :data="data"
                :span-method="mergeConfig.merge ? mergeMethod : mergeConfig.spanMethod">
        <template v-for="(item, index) in columns" :key="index">
          <titan-column v-if="!item.show || item.show()" :column="item" :table-column="tableColumn"
                        :merge-config="mergeConfig"/>
        </template>
        <template #append>
          <slot name="append"/>
        </template>
        <template #empty>
          <slot name="empty"/>
        </template>
      </el-table>
    </section>
    <section v-if="pagination" class="titan-table__footer"
             :style="{ marginTop: mergeConfig.paginationMarginTop + 'px' }">
      <el-pagination ref="elPagination" v-bind="mergePaginationAttrs">
        <slot name="pagination"/>
      </el-pagination>
    </section>
  </div>
</template>

<script setup lang="jsx" name="TitanTable">
import {ref, computed, watch, onMounted, onBeforeUnmount, useAttrs, getCurrentInstance} from 'vue';
import TitanColumn from "./Column.vue";
import debounce from "./debounce";
import {
  DefaultConfig,
  DefaultPaginationAttrs,
  DefaultTableAttrs,
} from "./config.js";

const PAGER_HEIGHT = 40;

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => ([]),
  },
  config: {
    type: Object,
    default: () => ({}),
  },
  table: {
    type: Object,
    default: () => ({}),
  },
  tableColumn: {
    type: Object,
    default: () => ({}),
  },
  pagination: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['page-current-change',]);
const attrs = useAttrs(); // 获取 $attrs

/* 获取全局属性 */
const instance = getCurrentInstance();
const globalConfig = instance?.appContext.config.globalProperties.$titanTable;


const titanTableRef = ref(null);
const elTableRef = ref(null);
const mergeLine = ref({});
const mergeIndex = ref({});
const tableHeight = ref(null);

const mergeConfig = computed(() => ({
  ...DefaultConfig,
  ...globalConfig.config,
  ...props.config,
}));

const mergeTableAttrs = computed(() => ({
  ...DefaultTableAttrs,
  ...globalConfig.table,
  ...attrs,
  ...props.table,
  [mergeConfig.value.heightMode]: `${tableHeight.value}px`,
}));

const mergePaginationAttrs = computed(() => ({
  ...DefaultPaginationAttrs,
  ...globalConfig.pagination,
  ...attrs,
  ...props.pagination,
  onCurrentChange: onPaginationCurrentChange,
}));

const dataLength = computed(() => props.data.length);

watch(() => mergeConfig.value.merge, () => {
  getMergeArr(props.data);
});
watch(dataLength, () => {
  getMergeArr(props.data);
});
watch(() => props.pagination, () => {
  resize(true);
});

const resize = (immediate) => {
  const _resizeHeight = () => {
    const total = titanTableRef.value?.clientHeight;
    const inside = mergeConfig.value.tablePadding * 2;
    let result = total - inside;
    if (props.pagination) {
      const paginationHeight = PAGER_HEIGHT + mergeConfig.value.paginationMarginTop;
      result -= paginationHeight;
    }
    tableHeight.value = result;
  };

  if (immediate) {
    _resizeHeight();
    return;
  }

  debounce(() => {
    _resizeHeight();
  }, 700)();
};

const onPaginationCurrentChange = (currentPage) => {
  elTableRef.value.$el.scrollTop = 0;
  elTableRef.value.setCurrentRow();
  emit("page-current-change", currentPage);
};

const getMergeArr = (tableData) => {
  if (!mergeConfig.value.merge) return;
  mergeLine.value = {};
  mergeIndex.value = {};
  mergeConfig.value.merge.forEach((item) => {
    tableData.forEach((data, i) => {
      if (i === 0) {
        mergeIndex.value[item] = mergeIndex.value[item] || [];
        mergeIndex.value[item].push(1);
        mergeLine.value[item] = 0;
      } else if (data[item] === tableData[i - 1][item]) {
        mergeIndex.value[item][mergeLine.value[item]] += 1;
        mergeIndex.value[item].push(0);
      } else {
        mergeIndex.value[item].push(1);
        mergeLine.value[item] = i;
      }
    });
  });
};

const mergeMethod = ({column, rowIndex}) => {
  const index = mergeConfig.value.merge.indexOf(column.property);
  if (index > -1) {
    const _row = mergeIndex.value[mergeConfig.value.merge[index]][rowIndex];
    const _col = _row > 0 ? 1 : 0;
    return {
      rowspan: _row,
      colspan: _col,
    };
  }
};

onMounted(() => {
  getMergeArr(props.data);
  resize(true);
  window.addEventListener("resize", resize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
});

// Expose methods for external usage
const clearSelection = () => elTableRef.value.clearSelection();
const toggleRowSelection = (row, selected) => elTableRef.value.toggleRowSelection(row, selected);
const toggleAllSelection = () => elTableRef.value.toggleAllSelection();
const toggleRowExpansion = (row, expanded) => elTableRef.value.toggleRowExpansion(row, expanded);
const setCurrentRow = (row) => elTableRef.value.setCurrentRow(row);
const clearSort = () => elTableRef.value.clearSort();
const clearFilter = (columnKey) => elTableRef.value.clearFilter(columnKey);
const doLayout = () => elTableRef.value.doLayout();
const sort = (prop, order) => elTableRef.value.sort(prop, order);

defineExpose({
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  toggleRowExpansion,
  setCurrentRow,
  clearSort,
  clearFilter,
  doLayout,
  sort,
});
</script>

<style scoped>
.titan-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.titan-table__main {
  width: 100%;
}

.titan-table__footer {
  width: 100%;
  height: 40px;
  background-color: #fff;
  padding: 5px 10px;
  box-sizing: border-box;
}
</style>
