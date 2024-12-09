<template>
  <el-table-column v-bind="mergeAttrs">
    <template #header="slotProps">
      <titan-render
          v-if="column.renderHeader"
          :scope="slotProps"
          :render="column.renderHeader"
          :cellEmptyText="mergeConfig.cellEmptyText"
      />
      <span v-else>{{ slotProps.column.label }}</span>
    </template>

    <template #default="slotProps">
      <titan-render
          :scope="slotProps"
          :render="column.render"
          :cellEmptyText="mergeConfig.cellEmptyText"
      />
      <template v-if="column.children">
        <titan-column
            v-for="(col, index) in column.children"
            :key="index"
            :column="col"
            :table-column="tableColumn"
        />
      </template>
    </template>
  </el-table-column>
</template>

<script lang="jsx" setup name="TitanColumn">
import {computed, watch, getCurrentInstance} from 'vue';
import TitanRender from './Render.jsx';
import {DefaultTableColumnAttrs} from './config.js';
import {isEmpty} from '../../../utils/index.js';

const props = defineProps({
  mergeConfig: {
    type: Object,
    default: () => ({}),
  },
  column: {
    type: Object,
    default: () => ({}),
  },
  tableColumn: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits();

const cellForced = {
  selection: {
    renderHeader: ({store}) => {
      function isDisabled() {
        return store.states.data.value && store.states.data.value.length === 0;
      }

      return (
          <el-checkbox
              disabled={isDisabled()}
              indeterminate={
                  store.states.selection.value.length > 0 &&
                  !store.states.isAllSelected.value
              }
              onUpdate:modelValue={store.toggleAllSelection}
              modelValue={store.states.isAllSelected.value}
          />
      );
    },
    renderCell: ({row, column, store, $index}) => {
      if (!store) return;
      return (
          <el-checkbox
              modelValue={store.isSelected(row)}
              disabled={
                column.selectable
                    ? !column.selectable.call(null, row, $index)
                    : false
              }
              onChange={() => {
                store.commit('rowSelectedChanged', row);
              }}
              onClick={(event) => event.stopPropagation()}
          />
      );
    },
    sortable: false,
    resizable: false,
  },
  index: {
    renderHeader: ({column}) => column.label || '#',
    renderCell: ({column, $index}) => {
      let i = $index + 1;
      const index = column.index;

      if (typeof index === 'number') {
        i = $index + index;
      } else if (typeof index === 'function') {
        i = index($index);
      }
      return <div>{i}</div>;
    },
    sortable: false,
    resizable: false,
  },
  expand: {
    renderHeader: ({column}) => column.label || '',
    renderCell: ({row, store}) => {
      if (!store) return;
      const classes = ['el-table__expand-icon'];
      if (store.states.expandRows.value.indexOf(row) > -1) {
        classes.push('el-table__expand-icon--expanded');
      }
      const callback = (e) => {
        e.stopPropagation();
        store.toggleRowExpansion(row);
      };
      return (
          <div class={classes} onClick={callback}>
            <i class="el-icon el-icon-arrow-right"/>
          </div>
      );
    },
    sortable: false,
    resizable: false,
    className: 'el-table__expand-column',
  },
};


// 获取全局注册的属性
const instance = getCurrentInstance();
const globalConfig = instance?.appContext.config.globalProperties.$titanTable;

const mergeAttrs = computed(() => {
  const res = {
    ...DefaultTableColumnAttrs,
    ...globalConfig.tableColumn,
    ...props.tableColumn,
    ...props.column,
  };
  ['render', 'renderHeader', 'formatter', 'show'].forEach((key) => {
    delete res[key];
  });
  return res;
});

watch(
    () => props.column,
    () => {
      generateRender();
    },
    {immediate: true}
);

function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');

  const keyArr = path.split('.');
  let i = 0;
  for (i; i < keyArr.length - 1; i++) {
    if (!tempObj && !strict) break;
    const key = keyArr[i];

    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: (tempObj || {})[keyArr[i]],
  };
}

function generateRender() {
  if (props.column.type) {
    props.column.renderHeader = cellForced[props.column.type].renderHeader;
    props.column.render = props.column.render || cellForced[props.column.type].renderCell;
    return;
  }

  if (props.column.formatter) {
    props.column.render = (scope) => {
      const {row, column, $index} = scope;
      if (isEmpty(column)) return;
      const property = column.property;
      const cellValue = property && getPropByPath(row, property, false).v;

      let value = props.column.formatter(row, column, cellValue, $index);
      if (isEmpty(value)) {
        value = props.mergeConfig.cellEmptyText;
      }
      return <span class="titan-table-cell__formatter">{value}</span>;
    };
    return;
  }

  if (!props.column.render) {
    props.column.render = (scope) => {
      let value = scope.row[scope.column.property];
      if (isEmpty(value)) {
        value = props.mergeConfig.cellEmptyText;
      }
      return <span>{value}</span>;
    };
  }
}
</script>

<style>
.titan-table .el-table__body-wrapper .cell.el-tooltip span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  white-space: nowrap;
}
</style>
