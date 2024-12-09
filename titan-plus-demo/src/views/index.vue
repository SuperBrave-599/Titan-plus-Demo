<template>
<div class="content">
  <titan-form
    ref="titanFormRef"
    :model="form"
    :columns="column"
    :rules="rules"
    size="small"
    label-width="100px"
    empty-text="--"
  />
  <index1></index1>
  <index2></index2>
</div>
</template>

<script lang="jsx" setup>
import index1 from './index1'
import index2 from './index2'

import { ref, computed } from 'vue';

const titanFormRef = ref(null);


const form = ref({
  name: 'titan',
  age: 18,
  gender: 'male',
  hobby: ['html', 'css', 'js'],
  time: {
    start: new Date().getTime(),
    end: new Date().getTime()
  },
  skill: [
    {
      name: 'math',
      point: 90
    }
  ]
});

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
};

const column = computed(() => [
  {
    prop: 'name',
    label: '姓名'
  },
  {
    prop: 'custom_hidden',
    label: '自定义隐藏',
    show: (form, root) => false
  },
  {
    prop: 'gender',
    label: '性别',
    class: 'gender-icon',
    formatter: (form, root) => {
      const genderNameMap = { male: '男生', female: '女生' };
      return genderNameMap[form.gender];
    }
  },
  {
    prop: 'age',
    renderLabel: (form, root) => <span style='color: red;'>年龄</span>,
    renderError: (form, root, { error }) => (
      <span style='color: blue'>{error}</span>
    ),
    rules: [
      { required: true, message: '请输入年龄', trigger: 'blur' },
      { type: 'number', min: 1, message: 'hahaha', trigger: 'blur' }
    ],
    render: (form, root) => (
      <el-input-number
        v-model={form.age}
        onChange={handleChange}
        max={20}
        label='描述文字'
      />
    )
  },
  {
    prop: 'hobby',
    label: '兴趣',
    render: (form, root) => {
      const options = [
        {
          name: '前端',
          id: 'front',
          children: [
            { name: 'HTML', id: 'html' },
            { name: 'JavaScript', id: 'js' },
            { name: 'CSS', id: 'css' }
          ]
        },
        {
          name: '后端',
          id: 'back',
          children: [
            { name: 'JAVA', id: 'java' },
            { name: 'Golang', id: 'golang' },
            { name: 'Python', id: 'python' }
          ]
        }
      ];
      const cascaderProps = {
        options,
        props: {
          checkStrictly: true,
          label: 'name',
          value: 'id',
          multiple: true,
          emitPath: false
        },
        clearable: true,
        filterable: true
      };
      return (
        <el-cascader {...cascaderProps} v-model={form.hobby} />
      );
    }
  },
  {
    prop: 'time',
    label: '活动时间',
    layout: {
      type: 'flex',
      align: 'middle',
      justify: 'start'
    },
    children: [
      {
        prop: 'start',
        label: '开始时间',
        layout: {
          span: 10
        },
        render: (form, root) => (
          <el-date-picker v-model={form.start} />
        )
      },
      {
        prop: 'end',
        label: '结束时间',
        layout: {
          span: 10,
          offset: 1
        },
        render: (form, root) => (
          <el-date-picker v-model={form.end} />
        )
      }
    ]
  },
  {
    prop: 'skill',
    label: '能力评级',
    items: (form, root) => [
      {
        prop: 'name',
        label: '名称',
        render: (form, root) => (
          <el-input v-model={form.name} />
        )
      },
      {
        prop: 'point',
        label: '评分',
        value: 80,
        render: (form, root, { itemIndex }) => (
          <el-input-number v-model={form.point} />
        )
      }
    ]
  }
]);

function handleChange(val) {
  titanFormRef.value.validateField('age', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(val);
  });
}
</script>
<style lang="scss" scoped>
  .content{
    height: 100%;
    overflow-y: scroll;
  }
</style>
