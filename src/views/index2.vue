<template>
  <div style="width: 100%; height: 100%;margin-top:100px">
    <titan-table :data="tableData" :columns="tableColumns" :config="{
      merge: ['gender'],
    }" :table="{
        stripe: true,
        highlightCurrentRow: true,
      }" :table-column="{
        align: 'center',
        headerAlign: 'center',
      }" :pagination="{
        layout: 'slot, -> , prev, pager, next, jumper, sizes, total',
        total,
        pageSize,
      }" @current-change="handleCurrentChange" @page-current-change="handlePageChange" @size-change="handleSizeChange"
      v-model:currentPage="currentPage">
      <template #pagination>
        <span>Guess Page Game</span>
      </template>
      <template #empty>
        <span>Guess Page Game</span>
      </template>
    </titan-table>
  </div>
</template>

<script setup lang="jsx">
import { ref, computed } from 'vue';

const currentPage = ref(1);
const pageSize = ref(10);
const customHeader = ref("年龄");
const cache = ref({});

const tableData = computed(() => {
  const res = [];
  for (let idx = 0; idx < 30; idx++) {
    res.push({
      name: "aile" + idx,
      age: idx,
      gender: idx < 10 ? "male" : "female",
      hobby: ["html", "css", "js"],
      isEdit: false,
    });
  }
  return res;
});

const total = computed(() => tableData.value.length);

const tableColumns = computed(() => [
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "custom_hidden",
    label: "自定义隐藏",
    show: () => false,
  },
  {
    prop: "age",
    formatter: (row, column, value) => {
      if (value || value === 0) {
        return value + "岁";
      }
    },
    renderHeader: () => (
      <el-input v-model={customHeader.value}  />
    ),
  },
  {
    prop: "gender",
    label: "性别",
    render: (ctx) => {
      const genderNameMap = { male: "男生", female: "女生" };
      if (ctx.row.gender) {
        return (
          <el-tag
            type={ctx.row.gender === "male" ? "danger" : "success"}
          >
            {genderNameMap[ctx.row.gender]}
          </el-tag>
        );
      }
    },
  },
  {
    prop: "hobby",
    label: "兴趣",
    render: (ctx) => {
      if (ctx.row.isEdit) {
        const options = [
          {
            name: "前端",
            id: "front",
            children: [
              { name: "HTML", id: "html" },
              { name: "JavaScript", id: "js" },
              { name: "CSS", id: "css" },
            ],
          },
          {
            name: "后端",
            id: "back",
            children: [
              { name: "JAVA", id: "java" },
              { name: "Golang", id: "golang" },
              { name: "Python", id: "python" },
            ],
          },
        ];
        const cascaderProps = {
          options,
          props: {
            checkStrictly: true,
            label: "name",
            value: "id",
            multiple: true,
            emitPath: false,
          },
          clearable: true,
          filterable: true,
        };
        return <el-cascader {...cascaderProps} v-model={ctx.row.hobby} />;
      }

      if (!ctx.row.hobby || !ctx.row.hobby.length) return;

      const hobbyList = ctx.row.hobby.map((item) => (
        <el-tag style="margin-right: 5px;">
          {item}
        </el-tag>
      ));
      return <div>{hobbyList}</div>;
    },
  },
  {
    prop: "operate",
    label: "操作",
    align: "center",
    headerAlign: "center",
    render: (ctx) => {
      const handleEdit = () => {
        cache.value[ctx.row.name] = JSON.parse(JSON.stringify(ctx.row));
        ctx.row.isEdit = true;
      };
      const handleCancel = () => {
        Object.assign(ctx.row, cache.value[ctx.row.name]);
        ctx.row.isEdit = false;
      };
      const handleConfirm = () => {
        setTimeout(() => {
          console.log("修改成功");
          ctx.row.isEdit = false;
        });
      };
      if (!ctx.row.isEdit) {
        return (
          <el-button type="primary"  onClick={handleEdit}>
            编辑
          </el-button>
        );
      }
      return (
        <el-button-group>
          <el-button type="success"  onClick={handleConfirm}>
            保存
          </el-button>
          <el-button type="info"  onClick={handleCancel}>
            取消
          </el-button>
        </el-button-group>
      );
    },
  },
]);

const handleCurrentChange = (val, old) => {
  console.log("row", val, old);
};

const handlePageChange = (val) => {
  console.log("page: ", val);
};

const handleSizeChange = (val) => {
  console.log("size: ", val);
  pageSize.value = val;
  currentPage.value = 1;
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
</style>
