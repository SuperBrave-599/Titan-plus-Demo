<template>
  <div v-if="state !== 'hide'" class="titan-placement" :class="`titan-placement--${state}`" :style="calcStyle">
    <template v-if="state === 'init'">
      <slot name="init">
        <div class="titan-placement__img">
          <template v-if="mergeConfig.initImageSrc">
            <img :src="mergeConfig.initImageSrc" class="img" :style="imageStyle"/>
          </template>
        </div>
        <div class="titan-placement__desc">
          {{ mergeConfig.initText }}
        </div>
      </slot>
    </template>
    <template v-if="state === 'empty'">
      <slot name="empty">
        <div class="titan-placement__img">
          <template v-if="mergeConfig.emptyImageSrc">
            <img :src="mergeConfig.emptyImageSrc" class="img" :style="imageStyle"/>
          </template>
        </div>
        <div class="titan-placement__desc">
          {{ mergeConfig.emptyText }}
        </div>
      </slot>
    </template>
  </div>
</template>

<script setup name="TitanPlacement">
import {ref, computed, watch, onMounted, getCurrentInstance} from 'vue';
import {DefaultConfig} from './config';

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
  empty: {
    required: true,
    type: Boolean,
    default: undefined,
  },
  loading: {
    type: Boolean,
    default: undefined,
  },
  width: {
    type: String,
    default: undefined,
  },
  height: {
    type: String,
    default: undefined,
  },
});

const state = ref('');

/* 获取全局属性 */
const instance = getCurrentInstance();
const globalConfig = instance?.appContext.config.globalProperties.$titanCard;


const mergeConfig = computed(() => {
  return {
    ...DefaultConfig,
    ...globalConfig.config,
    ...props.config,
  };
});

const calcStyle = computed(() => {
  return {
    width: props.width || mergeConfig.value.width,
    height: props.height || mergeConfig.value.height,
  };
});

const imageStyle = computed(() => {
  return {
    width: mergeConfig.value.imageWidth,
    height: mergeConfig.value.imageHeight,
  };
});

const changeState = () => {
  if (props.empty) {
    state.value = 'empty';
  } else {
    state.value = 'hide';
  }
}

watch(
    () => props.loading,
    (newVal, oldVal) => {
      if (newVal === true) {
        state.value = 'loading';
      }
      if (newVal === false && oldVal === true) {
        changeState();
      }
    },
    {immediate: true}
);

watch(
    () => props.empty,
    () => {
      changeState();
    },
    {immediate: true}
);

onMounted(() => {
  if (props.loading !== undefined) {
    state.value = 'init';
  } else {
    changeState();
  }
});


</script>

<style scoped>
.titan-placement {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.5);
}

.titan-placement__img {
  margin-bottom: 10px;
}

.titan-placement__img .img {
  font-size: 76px;
  width: 100%;
  height: 100%;
}
</style>
