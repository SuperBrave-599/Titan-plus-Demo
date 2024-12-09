<template>
  <div class="main">
    <div>
    <titan-avatar :src="src" :label="username" fit="cover" :config="{
      size: 100,
      labelPlaceholder: '未知姓名'
    }" />
  </div>

  <div style="width: 500px;height:500px">
    <titan-card :title="['11', '222']" width="200px" :loading="loading" :class="{
      'show-class': true,
      'hide-class': false,
    }" 
    activeTitle="11"
    header-class="biubiu" style="background-color: red; border: 1px solid">
      <template #sub>
        <el-button type="primary">反转地球</el-button>
      </template>
      <div >
        2222
      </div>
    </titan-card>
  </div>

  <div v-loading="loading" style="width: 200px;height:200px">
    <titan-placement :loading="loading" :empty="!list.length && !loading"  />

  </div>
  <div>
    <el-button @click="getList" type="primary">点击</el-button>
  </div>
  <div>
    <titan-dialog title="biaoti" v-model="showDialog" @open="handleOpen">
      <div>内容</div>
    </titan-dialog>
    <el-button @click="handleClickShowDialog">点击弹框出现</el-button>
  </div>

  <div>
    <titan-input v-model="inputValue">
      <template #suffix>
        <el-icon class="el-input__icon">
          <calendar />
        </el-icon>
      </template>
    </titan-input>
  </div>

  <div>
    <titan-select 
    v-model="selectValue"
    clearable 
    filterable
    :allow-create="true"
    style="width: 240px"
    :config='{
      remoteMethod: SystemAPI.getList,
      scrollable: true,
      label:"title",
      value:"id",
      pageField:"_page",
      sizeField:"_limit",
      respFormatter:(option)=>{return option}
    }'
    ></titan-select>


 <el-select
      v-model="value11"
      placeholder="Select"
      style="width: 240px"
    :allow-create="true"
    filterable

    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>

  <div>
  
    <titan-tooltip
  content="皮肤名为kitty，在theme.js中进行配置"
  max-width="100px"
  effect="kitty"
>
  <el-button
    type="primary"
  >
    TitanTooltip
  </el-button>
</titan-tooltip>
  </div>


  <!-- <div style="width: 100%;height:500px">
    <titan-table
        ref="table"
        v-loading="loading"
        :columns="tableColumns"
        :data="[]"
        :table="{
          stripe: true,
          highlightCurrentRow: true
        }"
        :pagination="{
          total: totalCount,
          pageSize
        }"
        v-model:currentPage="currentPage"
      />
  </div> -->
  </div>
</template>

<script setup name="login" lang="jsx">
import { ref, reactive } from 'vue';
import { SystemAPI } from '@/api/modules/user';
const value11 = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

const selectValue=ref(null)
const inputValue = ref('123')
const list = reactive([])
const loading = ref(false)
const getList = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false
  }, 3000);
}
const username = ref('11')
const src = ref('http://localhost:3031/fldl-public-use/prod/account/photo/2023-12-29/ea12a0a8-75c6-426d-aa1e-90314f85b7a4.jpg')

const showDialog = ref(false)
const handleClickShowDialog = () => {
  showDialog.value = true
}
const handleOpen = () => {
  console.log(2222);

}







const currentPage = ref(1)
const pageSize = ref(20)
const tableData = ref([])
const totalCount = ref(0)
const tableColumns = computed(() => {
  return [
    {
      prop: "name",
      label:'任务名称',
      sortable: 'custom',
      render: (ctx) => (
        <titan-tooltip content={ctx.row.name}>
          <span class='task-name'>{ctx.row.name}</span>
        </titan-tooltip>
      )
    },
    {
      label:'创建人',
      prop: 'userName',
      sortable: 'custom',
      render: (ctx) => (
          <titan-tooltip content={ctx.row.userName}>
            <span>{ctx.row.userName}</span>
          </titan-tooltip>
        )
    },
  ];
})
</script>
<style lang="scss" >
.main{
  height: 100%;;
}
</style>
