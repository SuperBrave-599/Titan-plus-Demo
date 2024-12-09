<template>
  <el-form-item
      v-bind="mergeAttrs"
      :prop="propPath"
      :required="isRequired"
      :class="[
      'titan-form-item',
      calcLabelPosition && `is-label-${calcLabelPosition}`,
      column.class,
      (column.renderLabel || showCustomLabel) && 'is-hide-hex',
    ]"
  >
    <!-- Label -->
    <template v-if="column.renderLabel || showCustomLabel" #label>
      <span
          v-if="column.renderLabel"
          :class="['titan-form-item__label-wrap', isRequired && 'is-required']"
          :style="labelStyle"
      >
        <render
            :form="form"
            :root="root"
            :render="column.renderLabel"
            :scope="{ itemIndex }"
            :merge-config="mergeConfig"
        />
      </span>
      <span
          v-if="!column.renderLabel && showCustomLabel"
          :class="['titan-form-item__label-wrap', isRequired && 'is-required']"
          :style="labelStyle"
      >
        {{ column.label }}
      </span>
    </template>

    <!-- render children -->
    <section
        v-if="column.children"
        :class="['titan-form-item__object',
        column.children && !column.children.length && 'is-empty',
      ]"
    >
      <template v-if="column.layout">
        <el-row v-bind="column.layout">
          <template v-for="(col, index) in objectColumns" :key="index">
            <el-col :span="getColSpan(col)" v-bind="col.layout">
              <titan-form-item
                  :column="col"
                  :form="form[column.prop]"
                  :root="root"
                  :parent-full-prop="propPath"
                  :item-index="itemIndex"
                  :merge-config="mergeConfig"
                  :merge-form-attrs="mergeFormAttrs"
                  :merge-form-item-attrs="mergeFormItemAttrs"
              />
            </el-col>
          </template>
        </el-row>
      </template>
      <template v-else>
        <titan-form-item
            v-for="(col, index) in objectColumns"
            :key="index"
            :column="col"
            :form="form[column.prop]"
            :root="root"
            :parent-full-prop="propPath"
            :item-index="itemIndex"
            :merge-config="mergeConfig"
            :merge-form-attrs="mergeFormAttrs"
            :merge-form-item-attrs="mergeFormItemAttrs"
        />
      </template>
    </section>

    <!-- render array items -->
    <section
        v-else-if="column.items"
        :class="[
        'titan-form-item__array',
      ]"
    >
      <div
          v-for="(value, index) in form[column.prop]"
          :key="index"
          class="array-item"
      >
        <div class="array-item__content">
          <template v-if="column.layout">
            <el-row v-bind="column.layout">
              <el-col
                  v-for="(col, idx) in column.items(value, root)"
                  :key="idx"
                  v-bind="col.layout"
                  :span="getColSpan(col)"
              >
                <titan-form-item
                    v-if="!col.show || col.show(form[column.prop], root, index)"
                    :key="index + '-' + idx"
                    :column="col"
                    :form="value"
                    :root="root"
                    :parent-full-prop="getParentPropForArray(index)"
                    :item-index="index"
                    :merge-config="mergeConfig"
                    :merge-form-attrs="mergeFormAttrs"
                    :merge-form-item-attrs="mergeFormItemAttrs"
                />
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <template v-for="(col, idx) in column.items(value, root)">
              <titan-form-item
                  v-if="!col.show || col.show(form[column.prop], root, index)"
                  :key="index + '-' + idx"
                  :column="col"
                  :form="value"
                  :root="root"
                  :parent-full-prop="getParentPropForArray(index)"
                  :item-index="index"
                  :merge-config="mergeConfig"
                  :merge-form-attrs="mergeFormAttrs"
                  :merge-form-item-attrs="mergeFormItemAttrs"
              />
            </template>
          </template>
          <i class="array-item__index">{{ index + 1 }}</i>
        </div>
        <el-tooltip content="删除" :open-delay="1000">
          <el-icon
              class="array-item__delete el-icon-close"
              :class="[disabled && 'is-disabled']"
              @click="handleDeleteItem(index)"
          >
            <Close/>
          </el-icon>
        </el-tooltip>
      </div>
      <div class="array-add" :class="[disabled && 'is-disabled']">
        <el-button
            :icon="
            {}.hasOwnProperty.call(column, 'buttonClass')
              ? column.buttonClass
              : 'plus'
          "
            :disabled="disabled"
            @click="handleAddItem"
        >
          {{ column.buttonText || "新增" }}
        </el-button>
      </div>
    </section>

    <!-- render components -->
    <template v-else>
      <div class="titan-form-item__render">
        <render
            :form="form"
            :root="root"
            :render="column.render"
            :scope="{ itemIndex }"
            :merge-config="mergeConfig"
        />
      </div>
    </template>

    <!-- render error -->
    <template v-if="column.renderError" v-slot:error="error">
      <render
          :form="form"
          :root="root"
          :render="column.renderError"
          :scope="{ ...error, itemIndex }"
          :merge-config="mergeConfig"
      />
    </template>
  </el-form-item>
</template>

<script lang="jsx" setup name="TitanFormItem">
import {computed, watch} from 'vue';
import Render from './Render.jsx';
import {getPropByPath} from './utils';

const props = defineProps({
  column: {
    type: Object,
    default: () => ({}),
  },
  form: {
    type: Object,
    default: () => ({}),
  },
  root: {
    type: Object,
    default: () => ({}),
  },
  mergeConfig: {
    type: Object,
    default: () => ({}),
  },
  mergeFormAttrs: {
    type: Object,
    default: () => ({}),
  },
  mergeFormItemAttrs: {
    type: Object,
    default: () => ({}),
  },
  parentPropPath: {
    type: String,
    default: '',
  },
  itemIndex: {
    type: Number,
    default: -1,
  },
});

// Computed properties
const propPath = computed(() => {
  return props.parentPropPath ? `${props.parentPropPath}.${props.column.prop}` : props.column.prop;
});

const mergeAttrs = computed(() => {
  const res = {
    ...props.mergeFormItemAttrs,
    ...props.column,
    prop: propPath.value,
  };
  ['render', 'children', 'items', 'layout'].forEach((key) => {
    delete res[key];
  });
  return res;
});

const objectColumns = computed(() => {
  if (!props.column.children || !Array.isArray(props.column.children)) {
    return [];
  }
  return props.column.children.filter((item) => !item.show || item.show(props.form[props.column.prop], props.root, props.itemIndex));
});

const disabled = computed(() => mergeAttrs.value.disabled || props.mergeFormAttrs.disabled);
const calcLabelWidth = computed(() => props.column.labelWidth || props.mergeFormAttrs.labelWidth);
const calcLabelPosition = computed(() => props.column.labelPosition || props.mergeFormAttrs.labelPosition);

const labelStyle = computed(() => {
  if (['left', 'right', 'center'].includes(calcLabelPosition.value)) {
    return {
      display: 'inline-block',
      width: calcLabelWidth.value,
      textAlign: calcLabelPosition.value,
    };
  }
  return {};
});

const isRequired = computed(() => {
  if (props.column.required) return true;
  const rules = getRules();
  return rules && rules.some((rule) => rule.required);
});

const showCustomLabel = computed(() => {
  return calcLabelWidth.value && Object.prototype.hasOwnProperty.call(props.column, 'label');
});

// Watchers
watch(() => props.column, () => {
  generateRender();
}, {immediate: true});

// Methods
function getRules() {
  let formRules = props.mergeFormAttrs.rules;
  const selfRules = props.column.rules;
  const requiredRule = props.column.required ? [{required: !!props.column.required}] : [];

  const prop = getPropByPath(formRules, props.column.prop || '');
  formRules = formRules ? prop.o[props.column.prop || ''] || prop.v : [];

  return [].concat(selfRules || formRules || []).concat(requiredRule);
}

function generateRender() {
  if (props.column.render) return;

  if (props.column.formatter) {
    props.column.render = (form, root) => {
      let value = props.column.formatter(form, root);
      if (!value && value !== 0) {
        value = props.mergeConfig.emptyText;
      }
      return <span class={[props.column.class]}>{value}</span>;
    };
    return;
  }

  props.column.render = (form) => {
    if (props.column.prop) {
      let value = (form && form[props.column.prop]) || (attrs.value && attrs.value[props.column.prop]);
      if (!value && value !== 0) {
        value = props.mergeConfig.emptyText;
      }
      return <span class={[props.column.class]}>{value}</span>;
    }
    return <span>{props.mergeConfig.emptyText}</span>;
  };
}

function getParentPropForArray(idx) {
  return `${propPath.value}.${idx}`;
}

function _getNewArrayItem(obj, column) {
  column.forEach((it) => {
    if (Object.prototype.hasOwnProperty.call(it, 'children')) {
      obj[it.prop] = {};
      _getNewArrayItem(obj[it.prop], it.children);
    } else if (Object.prototype.hasOwnProperty.call(it, 'item')) {
      obj[it.prop] = [];
    } else {
      obj[it.prop] = Object.prototype.hasOwnProperty.call(it, 'defaultValue') ? it.defaultValue : undefined;
    }
  });
  return obj;
}

function handleAddItem() {
  let item = {};
  const column = props.column.items(props.form, props.root);
  item = _getNewArrayItem(item, column);
  props.form[props.column.prop].push(item);
}

function handleDeleteItem(idx) {
  props.form[props.column.prop].splice(idx, 1);
}

function getColSpan(col) {
  const defaultSpan = Math.floor(24 / ((props.column.children || props.column.items(props.form[props.column.prop], props.root)).length));
  return col.layout && col.layout.span ? col.layout.span : defaultSpan;
}
</script>


<style scoped>
.titan-form-item__object {
  border: 1px solid #eee;
  background-color: #f4f4f5;
  border-radius: 4px;
  padding: 24px 20px;
  box-sizing: border-box;
  display: inline-block;
  width: 100%;
  height: 100%;
}

.titan-form-item__object > .el-form-item:not(:last-of-type) {
  margin-bottom: 22px;
}

.titan-form-item__object.is-empty {
  padding: 0;
}

.titan-form-item__array .array-item {
  display: flex;
  border: 1px solid #efefef;
  background-color: #fff;
  margin-bottom: 10px;
  padding: 24px 20px;
  box-sizing: border-box;
  position: relative;
  border-radius: 4px;
}

.titan-form-item__array .array-item__content {
  flex: 1;
}

.titan-form-item__array .array-item__content > .el-form-item:not(:last-of-type) {
  margin-bottom: 22px;
}

.titan-form-item__array .array-item__content > .el-form-item:last-of-type {
  margin-bottom: 0;
}

.titan-form-item__array .array-item__index {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: gray;
  background: #eee;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
}

.titan-form-item__array .array-item__delete {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #f0595a;
  right: 20px;
  cursor: pointer;
}

.titan-form-item__array .array-item__delete.is-disabled {
  display: none;
  pointer-events: none;
}

.titan-form-item__array .array-add {
  width: 100%;
  display: flex;
}

.titan-form-item__array .array-add.is-disabled {
  display: none;
}

.titan-form-item :deep(.el-form-item__label) {
  display: flex;
}

.titan-form-item__label-wrap {
  box-sizing: border-box;
  padding: 0 5px;
}

.titan-form-item.is-label-right,
.titan-form-item.is-label-left {
  display: flex;
  flex-direction: row;
}

/* .titan-form-item.is-label-right ::v-deep .el-form-item__label,
.titan-form-item.is-label-left ::v-deep .el-form-item__label {
  max-height: 40px;
} */

.titan-form-item.is-label-right
:deep(.el-form-item__label .titan-form-item__label-wrap.is-required::before),
.titan-form-item.is-label-left
:deep(.el-form-item__label .titan-form-item__label-wrap.is-required::before) {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.titan-form-item.is-hide-hex.is-label-right :deep(.el-form-item__label::before),
.titan-form-item.is-hide-hex.is-label-left :deep(.el-form-item__label::before) {
  display: none;
}

.titan-form-item.is-label-right :deep(.el-form-item__content),
.titan-form-item.is-label-left :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 1;
}

.titan-form-item.is-label-top {
  display: flex;
  flex-direction: column;
}

.titan-form-item.is-label-top :deep(.el-form-item__content) {
  margin-left: 0 !important;
}

.titan-form-item.is-label-top > :deep(.el-form-item__label) {
  width: auto;
  align-self: baseline;
}

.titan-form-item.is-label-right > :deep(.el-form-item__label) {
  text-align: right !important;
}

.titan-form-item.is-label-left > :deep(.el-form-item__label) {
  text-align: left !important;
}

.titan-form-item__render {
  width: 100%;
}
</style>
./utils.js
