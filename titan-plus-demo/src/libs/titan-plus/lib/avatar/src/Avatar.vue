<template>
  <el-avatar
      class="titan-avatar"
      v-bind="mergeAttrs"
      :src="avatarSrc"
      :style="avatarStyle"
  >
    <slot>
      <span class="titan-avatar__label" :style="mergeConfig.labelStyle">
        {{ mergeConfig.labelFormatter(label || mergeConfig.labelPlaceholder) }}
      </span>
    </slot>
  </el-avatar>
</template>

<script setup name="TitanAvatar">
import {computed, useAttrs, getCurrentInstance} from 'vue';
import {DefaultConfig, DefaultAvatarAttrs} from './config';

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  src: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  }
});

const attrs = useAttrs(); // 获取 $attrs

/* 获取全局属性 */
const instance = getCurrentInstance();
const globalConfig = instance?.appContext.config.globalProperties.$titanAvatar;


// mergeConfig 计算属性
const mergeConfig = computed(() => ({
  ...DefaultConfig,
  ...globalConfig.config,
  ...props.config
}));

// mergeAttrs 计算属性
const mergeAttrs = computed(() => ({
  ...DefaultAvatarAttrs,
  ...globalConfig.attrs,
  ...attrs
}));

// avatarSrc 计算属性
const avatarSrc = computed(() => mergeConfig.value.srcFormatter(props.src));

// avatarStyle 计算属性
const avatarStyle = computed(() => {
  if (!mergeConfig.value.size) {
    return attrs.style || {};
  }
  return {
    width: mergeConfig.value.size + 'px',
    height: mergeConfig.value.size + 'px',
    ...(attrs.style || {})
  };
});

</script>

<style scoped>
.titan-avatar .titan-avatar__label {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
}
</style>
