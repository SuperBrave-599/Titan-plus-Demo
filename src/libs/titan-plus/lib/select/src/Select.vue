<template>
  <el-select
      ref="select"
      class="titan-select"
      v-scroll="handleLoadMore"
      v-bind="mergeSelectAttrs"
      :remote="isRemote"
      :remote-method="mergeConfig.remoteMethod ? getRemoteList : remoteMethod"
      :loading="showRemoteLoading"
      @change="handleChange"
  >
    <template #prefix>
      <slot name="prefix"/>
    </template>

    <slot>
      <component
          :is="mergeConfig.tooltipComponent"
          v-for="item in options"
          :key="calcValue(item)"
          v-bind="mergeTooltipAttrs"
          :content="calcLabel(item)"
          :disabled="tooltipDisable(item)"
      >
        <el-option
            :value="calcValue(item)"
            :label="calcLabel(item)"
            :disabled="calcDisabled(item)"
        />
      </component>
    </slot>

    <template #empty>
      <slot name="empty"/>
    </template>
  </el-select>
</template>

<script setup name="TitanSelect">
import {ref, computed, watch, onMounted, onBeforeUnmount, useAttrs, getCurrentInstance} from 'vue';
import isEqual from "./isEqual";
import {DefaultConfig, DefaultSelectAttrs, DefaultTooltipAttrs} from './config.js';

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
  remoteMethod: {
    type: Function,
    default: () => {
    },
  }
});
const attrs = useAttrs(); // 获取 $attrs

/* 获取全局属性 */
const instance = getCurrentInstance();
const globalConfig = instance?.appContext.config.globalProperties.$titanSelect;


const emit = defineEmits(['inited', 'select']);

const options = ref([]);
const remoteLoading = ref(false);
const currentPage = ref(1);
const total = ref(0);
const payload = ref("");
const selectedOptions = ref([]);

const mergeConfig = computed(() => ({
  ...DefaultConfig,
  ...globalConfig.config,
  ...props.config,
}));

const mergeSelectAttrs = computed(() => {

  const res = {
    ...DefaultSelectAttrs,
    ...globalConfig.attrs,
    ...attrs,
    teleported: mergeConfig.value.remoteMethod ? false : attrs.teleported
  };
  delete res.tooltip;
  return res;
});

const mergeTooltipAttrs = computed(() => ({
  ...DefaultTooltipAttrs,
  ...attrs.tooltip,
}));

const isRemote = computed(() => {
  if (mergeConfig.value.onceRequest) return false;
  return !!mergeConfig.value.remoteMethod || mergeSelectAttrs.value.remote;
});

const canLoadMore = computed(() => (
    mergeConfig.value.scrollable &&
    mergeConfig.value.remoteMethod &&
    currentPage.value * mergeConfig.value.pageSize < total.value
));

const showRemoteLoading = computed(() => {
  if (mergeSelectAttrs.value.loading) return true;
  return (currentPage.value === 1 && remoteLoading.value);
});

watch(() => mergeConfig.value.isClear, (val) => {
  if (val) _reset();
});

watch(() => mergeConfig.value.data, (newVal, oldVal) => {
  if (!isEqual(newVal, oldVal)) {
    _updateOptionList(newVal, newVal.length);
  }
});

watch(() => mergeConfig.value.requestParams, (newVal, oldVal) => {
  if (!isEqual(newVal, oldVal)) {
    getRemoteList();
  }
});

onMounted(async () => {
  await init();
  const scrollbar = select.value.$refs.scrollbar || select.value.$refs.scrollbarRef;
  scrollbar.$el.addEventListener("mousewheel", cleanTooltip);
});

onBeforeUnmount(() => {
  const scrollbar = select.value.$refs.scrollbar || select.value.$refs.scrollbarRef;
  scrollbar.$el.removeEventListener("mousewheel", cleanTooltip);
});

// 自定义指令
const vScroll = {
  mounted(el, binding) {
    const SELECT_DOWN_DOM = el.querySelector('.el-scrollbar .el-select-dropdown__wrap');

    SELECT_DOWN_DOM.addEventListener('scroll', function () {
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (CONDITION) {
        binding.value();
      }
    });
  }
};


// 初始化组件
async function init() {
  const config = mergeConfig.value;
  if (config.data.length) {
    _updateOptionList(config.data, config.data.length);
    selectedOptions.value = config.data;
  } else if (config.remoteMethod) {
    await getRemoteList();
  } else {
    await remoteMethod();
  }
  emit("inited", options.value);
}

// 计算值、标签、禁用状态等
function calcValue(item) {
  return typeof mergeConfig.value.value === "function"
      ? mergeConfig.value.value(item)
      : item[mergeConfig.value.value];
}

function calcLabel(item) {
  return typeof mergeConfig.value.label === "function"
      ? mergeConfig.value.label(item)
      : item[mergeConfig.value.label];
}

function calcDisabled(item) {
  return typeof mergeConfig.value.disabled === "function"
      ? mergeConfig.value.disabled(item)
      : item[mergeConfig.value.disabled];
}

function tooltipDisable(item) {
  if (typeof mergeConfig.value.showTooltip === "boolean") {
    return !mergeConfig.value.showTooltip;
  } else if (typeof mergeConfig.value.showTooltip === "function") {
    return !mergeConfig.value.showTooltip(item);
  }
}

// 获取远程数据
async function getRemoteList() {
  payload.value = "";
  currentPage.value = 1;
  total.value = 0;
  if (mergeConfig.value.scrollable) {
    await fetchOptionListByScroll();
  } else {
    await fetchOptionListOnce();
  }
}

function _updateOptionList(list, totalCount) {

  const res = mergeConfig.value.respFormatter(list);
  total.value = totalCount || total.value;
  if (!currentPage.value || currentPage.value === 1) {
    options.value = res;
  } else {
    options.value.push(...res);
  }
}

function _reset() {
  options.value = [];
  currentPage.value = 1;
  total.value = 0;
  payload.value = "";
}

async function fetchOptionListOnce() {
  const config = mergeConfig.value;
  if (config.nonEmpty && !payload.value) return;

  const query = {...config.requestParams};
  if (config.queryField && payload.value) {
    query[config.queryField] = payload.value;
  }

  try {
    remoteLoading.value = true;
    const resp = await config.remoteMethod(query);
    _updateOptionList(resp[config.respDataField], resp[config.respTotalField]);
  } catch {
    _reset();
  } finally {
    remoteLoading.value = false;
  }
}

async function fetchOptionListByScroll() {
  const config = mergeConfig.value;
  if (config.nonEmpty && !payload.value) return;

  const query = {
    [config.pageField]: currentPage.value,
    [config.sizeField]: config.pageSize,
    ...config.requestParams,
  };
  if (config.queryField && payload.value) {
    query[config.queryField] = payload.value;
  }

  try {
    remoteLoading.value = true;
    const resp = await config.remoteMethod(query);
    _updateOptionList(resp[config.respDataField], resp[config.respTotalField]);
  } catch {
    _reset();
  } finally {
    remoteLoading.value = false;
  }
}

function handleLoadMore() {
  if (!canLoadMore.value) return;
  currentPage.value++;
  fetchOptionListByScroll();
}

function handleChange(selected) {
  if (Array.isArray(selected)) {
    selectedOptions.value = selected.map(
        (item) =>
            selectedOptions.value.find((opt) => calcValue(opt) === item) ||
            options.value.find((opt) => calcValue(opt) === item)
    );
    emit("select", selectedOptions.value);
  } else {
    emit("select", options.value.find((item) => selected === calcValue(item)));
  }
}

function cleanTooltip() {
  const body = document.body;
  const tooltips = document.getElementsByClassName("el-tooltip__popper");
  while (tooltips.length) {
    body.removeChild(tooltips[0]);
  }
}

const select = ref(null);
</script>
