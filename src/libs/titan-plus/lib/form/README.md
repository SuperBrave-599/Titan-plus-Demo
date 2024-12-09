## titan-plus/form

### Intro 简介

`titan-plus/form` 是一款表单组件，基于 `Vue3` 和 `ElementPlus` 进行的二次封装，无需繁琐的模板代码，所有的表单配置项均可通过属性传递，使你的代码更干净。

### Feature 特色

- `titan-plus/form` 没有预设表单组件，所有表单组件均通过 `render` 属性传递，通过灵活的 JSX 语法实现高度自定义组件，因此，它非常小巧，不过需要提前安装 `vue` 和 `element-plus` ；
- `titan-plus/form` 底层采用 `$attrs` 接收参数和监听事件，无缝对接 `element-plus` 中的 `Form` 文档板块，上手更快（所有 `<el-form>` 接受的参数 `<aile-form>` 都支持，所有 `<el-form-item>` 接受的参数，column都有相应的字段可以设置，所有的方法、事件和插槽，除了 [Form-Item Methods](https://element-plus.org/#/zh-CN/component/form#form-item-methods)，其他都支持）；
- 针对简单场景，可传递 `formatter` 属性进行格式化输出，在绑定了表单的情况下，可省略 `render` 和 `formatter` 属性，aile-form 会默认返回 `<span>` 标签包裹的表单值，当然，你还可以自定义当前的 `class` ！
- 针对复杂表单，比如你的表单可能是下面这样，`titan-plus/form` 可以满足你！

```javascript
export default {
  data() {
    return {
      form: {
        name: '',
        time: {
          start: '2020/01',
          end: '2020/03'
        },
        hobby: [
          { name: 'basketball', point: 10 },
          { name: 'tea', point: 9 } // 根据需要可以动态增减
        ]
}
```

- 表单需要远程搜索？没问题！
- 更复杂的场景，想使用自定义组件？没问题！
- 表单太庞大，考虑模块化开发，方便复用？没问题！

### Global Options 全局配置项

配置项内容可在全局引入时设置，或者直接使用 `<titan-form  {...options} />` ，需注意：直接使用的优先级高于全局配置

|   参数   | 数据类型 | 默认值 |                                            说明                                            |
| :------: | :------: | :----: | :----------------------------------------------------------------------------------------: |
|  config  |  Object  |   {}   |                                [Config 配置项](#config-配置项)                                |
|   form   |  Object  |   {}   |                [ElForm Props](https://element-plus.org/#/zh-CN/component/form)                |
| formItem |  Object  |   {}   | [ElFormItem Props](https://element-plus.gitee.io/#/zh-CN/component/form#form-item-attributes) |

### Config 配置项

|   参数   | 数据类型 | 默认值 |        说明        |
| :-------: | :------: | :----: | :----------------: |
| emptyText |  String  |  '-'  |     空白占位符     |
|  layout  |  Object  |  null  | ElLayout Row Props |

### Form Attributes 表单属性

仅展示必填项和新增项，其余参数见 [Element Doc Form #Form Attributes](https://element-plus.org/#/zh-CN/component/form)

|   参数   | 数据类型 | 是否必须 | 默认值 | 可选值 |                                            说明                                            |
| :------: | :------: | :------: | :----: | :----: | :----------------------------------------------------------------------------------------: |
|  model  |  Object  |    是    |   -   |   -   |                                 表单数据(使用方式同ElForm)                                 |
| columns |  Array  |    是    |   -   |   -   |                               [表单列配置项](#column-列配置项)                               |
|  config  |  Array  |    是    |   -   |   -   |                                [Config 配置项](#config-配置项)                                |
|   form   |  Array  |    是    |   -   |   -   |                [ElForm Props](https://element-plus.org/#/zh-CN/component/form)                |
| formItem |  Array  |    是    |   -   |   -   | [ElFormItem Props](https://element-plus.gitee.io/#/zh-CN/component/form#form-item-attributes) |

### Form Methods 表单方法

支持全部 `el-form` 方法，详见 [Element Doc Form #Form Methods](https://element-plus.org/#/zh-CN/component/form)

### Form Events 表单事件

支持全部 `el-form` 方法，详见 [Element Doc Form #Form Events](https://element-plus.org/#/zh-CN/component/form)

### Form-Item Methods 表单列方法

暂不支持

### Column 列配置项

仅展示必填项和新增项，其余参数见 [Element Doc Form #Form-column Attributes](https://element-plus.org/#/zh-CN/component/form)

|     参数     |               数据类型               | 是否必须 |                                            说明                                            |
| :-----------: | :-----------------------------------: | :------: | :-----------------------------------------------------------------------------------------: |
|     prop     |                String                |    否    |                           设置表单列的别名(非必须，但是建议设置)                           |
|     label     |                String                |    否    |                         设置表单列的显示标签(非必须，但是建议设置)                         |
|    render    |     Function(form, root) => VNode     |    否    |                                自定义渲染内容,可选返回VNode                                |
|   formatter   |    Function(form, root) => string    |    否    |                               自定义渲染内容，可选返回字符串                               |
|   children   |                 Array                 |    否    |          当数据项类型为[object]时使用,返回column数组,与render/formatter/items互斥          |
|     items     | Function(form, root) => [column, ...] |    否    | 当数据项类型为[array]时使用,可动态增删子节点,返回column数组,与render/formatter/children互斥 |
|  buttonText  |                String                |    否    |                               设置数组表单-添加按钮的文字内容                               |
|  buttonClass  |                String                |    否    |                               设置数组表单-添加按钮的图标类名                               |
| defaultValue |                   -                   |    否    |          当上一级数据项类型为[array]，且传递了[items]属性时使用,可设置数据项初始值          |
|     show     |    Function(form, root) => boolean    |    否    |                                   是否渲染该列，默认渲染                                   |
|    layout    |                Object                |    否    |                    设置布局模式，可传入[el-row]和[el-col]支持的所有属性                    |
|  renderLabel  |      Function(form, root)/VNode      |    否    |                                       自定义标签内容                                       |
|  renderError  |  Function(form, root, {error})/VNode  |    否    |                                自定义表单校验信息的显示方式                                |
|  labelWidth  |                String                |    否    |                     设置当前表单域标签的宽度，例如 '50px'，支持 auto。                     |
| labelPosition |                String                |    否    |                   设置当前表单域标签的位置，可选值：right/center/left/top                   |

### Quick Start 快速开始

注意：由于 `TitanPlus` 是基于 `ElementPlus` 进行的二次开发，因此需全局引入ElementUI组件后方可正常使用

- 引用组件，根据需要可全局引入或者局部引入

```ts
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App)
app.use(ElementPlus)

// 全量引入
import TitanPlus from 'titan-plus'
app.use(TitanPlus, {
  form: {
    config: {
      emptyText: '--'
    },
    form: {
      labelWidth: '80px'
    },
    formItem: {
      required: true
    }
  }
})

// or 按需引入
import TitanForm from 'titan-plus/lib/form'
app.use(TitanForm, {
  config: {
    emptyText: '--'
  },
  form: {
    labelWidth: '80px'
  },
  formItem: {
    required: true
  }
})

```

1. 基础配置示例

- column（表格列配置）: 数组类型，必传
- model（表格变量绑定）：对象类型，必传

```ts
<template>
  <titan-form
    ref="titanFormRef"
    :model="form"
    :columns="column"
    :rules="rules"
    size="small"
    label-width="100px"
    empty-text="--"
  />
</template>

<script lang="jsx" setup>
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

```

2. 模块化开发

以下为原生实现，或者直接查看 **[最佳实践](#最佳实践)**

当表单的复杂度进一步提高，模块化解耦就成了刚需，`aile-plus/form` 的解决方案：本质上是构造 column 数组。

- 根组件示例：`Demo.vue`

```ts
<template>
  <aile-form
    ref="aileFormRef"
    :model="form"
    :column="column"
  />
</template>

<script>
import Location from './Location.js';
import Info from './Info.js';
import mixinUtils from './mixin-utils.js'
export default {
  mixins: [mixinUitls],
  data() {
    return {
      form: {
        name: 'aile',
        location: '',
        gender: 'male',
        hobby: ['html', 'css', 'js']
      }
    };
  },
  computed: {
    column() {
      return [
        {
          prop: 'name',
          label: '姓名'
        },
        Location.call(this, '地区'),
        ...Info.call(this)
      ];
    }
  }
};
</script>
```

- 单模块示例：`Location.js`

```javascript
import { v4 as uuidv4 } from 'uuid';

// 生成随机ID，保存在指定变量下
const location = uuidv4()

/**
 * 远程搜索接口
 * @param {string} name 搜索关键字
 */
async function fetchData(str) {
  if (!str) return;
  try {
    const resp = await this.$api.search(str);
    // this.setValue 双向绑定数据，见后文`mixin.js`
    this.setValue(location, resp.data);
  } catch (err) {
    console.error(err);
    this.setValue(location, []);
  }
}

export default function Location(customLabel) {

  // 初始化列表数据
  fetchData();

  return {
    prop: 'location',
    label: customLabel
    render: (form, root) => {
      // this.getValue 获取双向绑定的数据
      const optionList = (this.getValue(name) || []).map((opt, idx) => (
        <el-option key={idx} label={opt.label} value={opt.value} />
      ));

      return (
        <el-select
          v-model={form.location}
          filterable
          clearable
          remote
          remote-method={fetchData.bind(this)}
        >
          {optionList}
        </el-select>
      )
    }
  };
}
```

看过这些示例，相信聪明的你一定发现了，`render/renderLabel/renderError` 函数中都传递了 `h` 参数，但大部分的场景下函数体内并没有直接使用，那可不可以去掉呢？

在组件的设计中，我尝试过，在 `*.vue` 文件中可以正常使用，但是抽离到 `*.js` 文件的时候就会报错，查阅资料后，在 `vue` 的官网上有这样一段话：

> 将h作为createElement的别名是 Vue 生态系统中的一个通用惯例，实际上也是 JSX 所要求的。从 Vue 的 Babel 插件的3.4.0 版本开始，我们会在以 ES2015 语法声明的含有 JSX 的任何方法和 getter 中 (不是函数或箭头函数中) 自动注入const h = this.$createElement，这样你就可以去掉(h)参数了。对于更早版本的插件，如果h在当前作用域中不可用，应用会抛错。

所以，为了兼容更多的情况，我还原了 `h` 函数，如果你有更好的解决方案，欢迎提PR~

- 组合模块示例：`Info.js`

```javascript
export function Info() {
  return [
      {
        prop: 'gender',
        label: '性别',
        formatter: (form, root) => {
          const genderNameMap = { male: '男生', female: '女生' };
          return genderNameMap[form.gender];
        }
      },
      {
        prop: 'hobby',
        label: '兴趣',
        render: (form, root) => {
          const optionList = ['html', 'css', 'javascript'].map(
            return <el-option label={item} value={item} key={item} />
          )
          return <el-select v-model={form.hobby}>{optionList}</el-select>
        }
      }
  ]
}
```

- 辅助函数：`mixin-utils.js`

```javascript
export default {
  data() {
    return { formFetchData: {} };
  },
  methods: {
    setValue(key, val) {
      this.$set(this.formFetchData, key, val);
    },
    getValue(key) {
      return this.formFetchData[key];
    }
  }
};
```

### 最佳实践

虽然以上通过mixin等方法实现了Form的模块化开发，不过代码量较大，而借助 `AileSelect` 等配套组件，我们将不再需要 `mixin-utils.js` 和手动在 `created` 生命周期内初始化搜索列表逻辑 ，整个过程会变得非常优雅：

- 根组件示例：`Demo.vue`

```ts
<template>
  <aile-form
    ref="aileFormRef"
    :model="form"
    :column="column"
  />
</template>

<script>
import Location from './Location.js';
import Info from './Info.js';
export default {
  data() {
    return {
      form: {
        name: 'aile',
        location: '',
        gender: 'male',
        hobby: ['html', 'css', 'js']
      }
    };
  },
  computed: {
    column() {
      return [
        {
          prop: 'name',
          label: '姓名'
        },
        Location.call(this, '地区'),
        ...Info.call(this)
      ];
    }
  }
};
</script>
```

- 单模块示例：`Location.js`
  使用了 `AileSelect` 后，代码量大幅减少，获取下拉列表的逻辑被封装到了下拉组件内部。

```javascript
import { fetchListAPI } from '@/api'

export default function Location(customLabel) {
  return {
    prop: 'location',
    label: customLabel
    render: (form, root) => (
      return (
        <aile-select
          v-model={form.location}
          filterable
          clearable
          remote
          config={{
            method: fetchListAPI,
            scrollable: true,
            label: 'label',
            value: 'value'
          }}
        />
    )
  };
}
```

- 组合模块示例：`Info.js`

```javascript
export function Info() {
  return [
      {
        prop: 'gender',
        label: '性别',
        formatter: (form, root) => {
          const genderNameMap = { male: '男生', female: '女生' };
          return genderNameMap[form.gender];
        }
      },
      {
        prop: 'hobby',
        label: '兴趣',
        render: (form, root) => (
          <aile-select
            v-model={form.hobby}
            config={{
              data: ['html', 'css', 'javascript']
            }}
          />
        )
      }
  ]
}
```
