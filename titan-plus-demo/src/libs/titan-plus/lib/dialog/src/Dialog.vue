<template>
  <el-dialog
      v-bind="mergeAttrs"
      :class="calcCustomClass"
      @closed="handleClosed"
  >
    <template #header>
      <slot name="header"/>
    </template>
    <slot/>
    <template v-if="!mergeConfig.hideFooter" #footer>
      <div
          class="titan-dialog__footer"
          :class="[`is-align-${mergeConfig.footerAlign}`]"
      >
        <slot name="footer">
          <el-button
              v-if="mergeConfig.showConfirm"
              :type="mergeConfig.confirmType"
              size="small"
              :loading="mergeConfig.confirmLoading"
              :disabled="mergeConfig.confirmDisabled"
              @click="$emit('confirm')"
          >
            {{ mergeConfig.confirmText }}
          </el-button>
          <el-button
              v-if="mergeConfig.showCancel"
              :type="mergeConfig.cancelType"
              size="small"
              @click="handleCancel"
          >
            {{ mergeConfig.cancelText }}
          </el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="TitanDialog">
import {computed, useAttrs, getCurrentInstance} from 'vue';
import {mergeClass} from '../../../utils';
import {DefaultConfig, DefaultDialogAttrs} from './config';

// 定义 props
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
  class: {
    type: [String, Array, Object],
    default: '',
  },
});

const attrs = useAttrs(); // 获取 $attrs

/* 获取全局属性 */
const instance = getCurrentInstance();
const globalConfig = instance?.appContext.config.globalProperties.$titanDialog;


// 定义 emits
const emit = defineEmits(['cancel', 'confirm', 'update:modelValue', 'closed']);

// 计算属性
const mergeConfig = computed(() => ({
  ...DefaultConfig,
  ...globalConfig.config,
  ...props.config,
}));

const mergeAttrs = computed(() => ({
  ...DefaultDialogAttrs,
  ...globalConfig.attrs,
  ...attrs,
}));

const calcCustomClass = computed(() => mergeClass(
    ['titan-dialog', mergeConfig.value.hideFooter && 'is-hide-footer'],
    props.class
));

// 方法
const handleCancel = async () => {
  if (attrs.onCancel) {
    await emit('cancel');
  } else {
    emit('update:modelValue', false);
  }
};

const handleClosed = () => {
  emit('update:modelValue', false);
  if (attrs.onClosed) {
    emit('closed');
  }
};
</script>

<style scoped>
.titan-dialog :deep(.el-dialog__body) {
  padding: 20px 20px 0;
}

.titan-dialog.is-hide-footer :deep(.el-dialog__body) {
  padding: 20px;
}

.titan-dialog__footer {
  width: 100%;
  display: flex;
}

.titan-dialog__footer.is-align-right {
  justify-content: flex-end;
}

.titan-dialog__footer.is-align-center {
  justify-content: center;
}

.titan-dialog__footer.is-align-left {
  justify-content: flex-start;
}
</style>
