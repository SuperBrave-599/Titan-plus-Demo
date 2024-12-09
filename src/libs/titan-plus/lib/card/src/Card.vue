<template>
  <div :style="cardStyle" :class="cardClassList">
    <template v-if="calcTitle">
      <div :class="headerClassList" :style="headerStyleList">
        <slot name="title">
          <!-- 普通标题 -->
          <span v-if="isSimpleTitle" class="title">{{ calcTitle }}</span>
          <!-- 可切换标题 -->
          <el-tabs v-else v-model="state.selectedTab" class="tabs">
            <el-tab-pane v-for="item in calcTitle" :key="item.value" :label="item.label" :name="item.value"/>
          </el-tabs>
        </slot>
        <!-- 右侧slot -->
        <slot name="sub"/>
      </div>
    </template>

    <div v-loading="loading" :class="['titan-card__body', bodyClassList]" :style="bodyStyleList">
      <template v-if="loading || showEmpty">
        <slot name="empty">
          <div class="empty-place">暂无数据</div>
        </slot>
      </template>
      <template v-else>
        <slot :activeTitle="state.selectedTab"/>
      </template>
    </div>
  </div>
</template>

<script setup name="TitanCard">
import {reactive, computed, watch, getCurrentInstance} from 'vue';
import {mergeClass} from '../../../utils';
import {DefaultConfig} from './config';

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: [String, Array],
    default: ''
  },
  lazyLoad: {
    type: Boolean,
    default: false
  },
  showEmpty: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  activeTitle: {
    type: String,
    default: ''
  },
  headerClass: {
    type: [String, Array, Object],
    default: ''
  },
  headerStyle: {
    type: Object,
    default: () => ({})
  },
  bodyClass: {
    type: [String, Array, Object],
    default: ''
  },
  bodyStyle: {
    type: Object,
    default: () => ({})
  }
});
const attrs = useAttrs(); // 获取 $attrs

/* 获取全局属性 */
const instance = getCurrentInstance();
const globalConfig = instance?.appContext.config.globalProperties.$titanCard;

const emit = defineEmits(['change']);

// 定义响应式数据
const state = reactive({selectedTab: ''});

// 计算合并配置
const mergeConfig = computed(() => ({
  ...DefaultConfig,
  ...globalConfig.config,
  ...props.config
}));

// 计算标题
const calcTitle = computed(() => {
  if (isSimpleTitle.value) {
    return props.title;
  }
  return props.title.map(item => ({
    label: item.label || item,
    value: item.value || item
  }));
});

// 简单标题判断
const isSimpleTitle = computed(() => typeof props.title === 'string');

// 计算卡片样式
const cardStyle = computed(() => {
  const {width, height, minHeight} = mergeConfig.value;
  return {
    width,
    height,
    minHeight,
    ...(attrs?.style || {})
  };
});

// 计算卡片类名
const cardClassList = computed(() => mergeClass(
    [
      'titan-card',
      mergeConfig.value.shadow && `is-${mergeConfig.value.shadow}-shadow`
    ],
    attrs?.class
));

// 计算头部类名
const headerClassList = computed(() => mergeClass(
    'titan-card__header',
    mergeConfig.value.headerClass,
    props.headerClass
));

// 计算头部样式
const headerStyleList = computed(() => ({
  ...mergeConfig.value.headerStyle,
  ...props.headerStyle
}));

// 计算身体样式和类名
const bodyClassList = computed(() => mergeClass(
    'titan-card__body',
    mergeConfig.value.bodyClass,
    props.bodyClass
));

const bodyStyleList = computed(() => ({
  ...mergeConfig.value.bodyStyle,
  ...props.bodyStyle
}));

// 监视activeTitle和selectedTab的变化
watch(() => props.activeTitle, val => {
  setActiveTitle(val);
});

watch(() => state.selectedTab, val => {
  emit('change', val);
});

// 初始化函数
const init = () => {
  if (!props.lazyLoad && Array.isArray(calcTitle.value) && calcTitle.value.length) {
    setActiveTitle(calcTitle.value[0].value || calcTitle.value[0].label);
  }
};

// 设置活跃的标签
const setActiveTitle = tab => {
  state.selectedTab = tab;
};

// 初始化
init();
</script>

<style scoped>
.titan-card {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.titan-card.is-always-shadow {
  box-shadow: 0px 0px 14px 2px rgba(43, 43, 43, 0.07);
}

.titan-card.is-hover-shadow:hover,
.titan-card.is-hover-shadow:focus {
  box-shadow: 0px 0px 14px 2px rgba(43, 43, 43, 0.07);
}

.titan-card__header {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 4px 4px 0 0;
}

.titan-card__header .title {
  font-size: 16px;
  color: #333;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.titan-card__header .tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.titan-card__header .tabs :deep(.el-tabs__header .el-tabs__item) {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.titan-card__body {
  position: relative;
  width: 100%;
  height: calc(100% - 40px);
  padding: 10px 18px;
  box-sizing: border-box;
  background: #fff;
}

.titan-card__body .empty-place {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
