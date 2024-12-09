<template>
  <el-input
    ref="input"
    v-bind="mergeAttrs"
    :style="calcStyle"
    :class="[$attrs['show-word-limit'] && 'show-word-limit']"
    @change="handleChange"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
  </el-input>
</template>

<script setup name="TitanInput">
import { computed, useAttrs, ref ,getCurrentInstance} from 'vue';
import { DefaultConfig, DefaultInputAttrs } from './config';

// 定义 props
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['change', 'update:value']);
const attrs = useAttrs(); // 获取 $attrs

/* 获取全局属性 */
const instance = getCurrentInstance();
const globalConfig = instance?.appContext.config.globalProperties.$titanInput;



const input = ref(null); // 引用输入框

// 计算属性
const mergeConfig = computed(() => ({
  ...DefaultConfig,
  ...globalConfig.config,
  ...props.config,
}));

const mergeAttrs = computed(() => ({
  ...DefaultInputAttrs,
  ...globalConfig.attrs,
  ...attrs,
}));

const calcStyle = computed(() => {
  const style = {};
  if (mergeConfig.value.width) style.width = mergeConfig.value.width;
  return style;
});

// 方法
const handleChange = (val) => {
  if (mergeConfig.value.lazyTrim) {
    val = val.trim();
    emit('update:value', val);
  }
  emit('change', val);
};

// 方法: 聚焦
const focus = () => {
  input.value.focus();
};

// 方法: 失焦
const blur = () => {
  input.value.blur();
};

// 方法: 选择
const select = () => {
  input.value.select();
};
</script>

<style scoped>
.show-word-limit.el-textarea :deep(.el-input__count) {
  line-height: 14px;
}

.show-word-limit.el-input.el-input--suffix > :deep(.el-input__inner) {
  padding-right: 85px;
}

.show-word-limit.el-input > :deep(.el-input__inner) {
  padding-right: 65px;
}
</style>
