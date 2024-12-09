<template>
  <el-tooltip
      ref="titanTooltip"
      v-bind="mergeAttrs"
      class="titan-tooltip"
      :popper-class="calcPopperClass"
  >
    <template #content>
      <slot name="content"/>
    </template>
    <slot/>
  </el-tooltip>
</template>

<script setup name="TitanTooltip">
import {computed, ref, useAttrs, getCurrentInstance} from 'vue';
import {mergeClass} from '../../../utils/index.js';

// 默认属性
const DefaultProps = {
  placement: 'bottom',
  showAfter: 0
};

// props
const props = defineProps({
  popperClass: {
    type: [String, Array, Object],
    default: ''
  }
});

const attrs = useAttrs(); // 获取 $attrs

/* 获取全局属性 */
const instance = getCurrentInstance();
const globalConfig = instance?.appContext.config.globalProperties.$titanTooltip;


// 计算属性
const mergeAttrs = computed(() => {
  return {
    ...DefaultProps, // 默认属性
    ...globalConfig.attrs,
    ...attrs, // 组件属性
  };
});

const calcPopperClass = computed(() => {
  return mergeClass(['titan-tooltip__popper', props.popperClass]);
});

// 引用
const titanTooltip = ref(null);
</script>
