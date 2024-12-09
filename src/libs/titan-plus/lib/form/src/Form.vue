<template>
  <el-form ref="elFormRef" v-bind="mergeFormAttrs" :model="model" :class="['titan-form']">
    <template v-if="mergeConfig.layout">
      <el-row v-bind="mergeConfig.layout">
        <el-col v-for="(item, idx) in filteredColumns" :key="idx" v-bind="item.layout || {}" :span="getColSpan(item)">
          <titan-form-item :column="item" :form="model" :root="model" :merge-config="mergeConfig"
                           :merge-form-attrs="mergeFormAttrs" :merge-form-item-attrs="mergeFormItemAttrs"/>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <template v-for="(item, idx) in filteredColumns" :key="idx">
        <titan-form-item :column="item" :form="model" :root="model" :merge-config="mergeConfig"
                         :merge-form-attrs="mergeFormAttrs" :merge-form-item-attrs="mergeFormItemAttrs"/>
      </template>
    </template>
  </el-form>
</template>

<script setup lang="jsx" name="TitanForm">
import {ref, computed, useAttrs, getCurrentInstance} from 'vue';
import TitanFormItem from "./FormItem.vue";
import {
  DefaultConfig,
  DefaultFormAttrs,
  DefaultFormItemAttrs,
} from "./config";

const props = defineProps({
  model: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  config: {
    type: Object,
    default: () => ({}),
  },
  form: {
    type: Object,
    default: () => ({}),
  },
  formItem: {
    type: Object,
    default: () => ({}),
  },
});

const attrs = useAttrs(); // 获取 $attrs

/* 获取全局属性 */
const instance = getCurrentInstance();
const globalConfig = instance?.appContext.config.globalProperties.$titanForm;

const elFormRef = ref(null);


const mergeConfig = computed(() => ({
  ...DefaultConfig,
  ...globalConfig.config,
  ...props.config,
}));

const mergeFormAttrs = computed(() => ({
  ...DefaultFormAttrs,
  ...globalConfig.form,
  ...props.form,
  ...attrs,
}));

const mergeFormItemAttrs = computed(() => ({
  ...DefaultFormItemAttrs,
  ...globalConfig.formItem,
  ...props.formItem,
  ...attrs,
}));

const filteredColumns = computed(() =>
    props.columns.filter(item => !item.show || item.show(props.model, props.model))
);


const validate = (cb) => {
  return elFormRef.value.validate(cb);
};

const validateField = (props, cb) => {
  return elFormRef.value.validateField(props, cb);
};

const resetFields = () => {
  return elFormRef.value.resetFields();
};

const clearValidate = (props) => {
  return elFormRef.value.clearValidate(props);
};
defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate
});

const getColSpan = (col) => {
  if (col.layout && col.layout.span) {
    return col.layout.span;
  }
  if (!props.columns.length) {
    return 24;
  }
  return Math.floor(24 / props.columns.length);
};
</script>

<style scoped>
.titan-form.el-form--inline {
  display: flex;
}

.titan-form.el-form--inline :deep(.titan-form-item__object) {
  display: flex;
  padding: 0;
  background: transparent;
  border: none;
}
</style>
