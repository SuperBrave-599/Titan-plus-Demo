## titan-plus/input

### Intro 简介

`titan-plus/input` 是一款 Input 组件，基于 `Vue3` 和 `ElementPlus` 进行的二次封装，可以根据需要配置宽度，是否默认开启清空（clearable）、input内容改变后清除前后空格（lazyTrim）

- `titan-plus/input` 完美适配 `element-plus` 中的 `Input` 文档板块
- 支持安装时个性化配置

### Options 配置项

#### 全局配置项

配置项内容可在全局引入时设置，或者直接使用 `<titan-input {...options} />` ，需注意：直接使用的优先级高于全局配置

下表所列属性可在 `main.js` 中安装组件时进行统一配置：

|       参数       | 数据类型 | 默认值 | 可选值 |     说明     |
| :--------------: | :------: | :----: | :----: | :-----------: |
| **config** |  Object  |   {}   |   —   |   特殊配置   |
| **attrs** |  Object  |   {}   |   —   | ElInput Props |

#### config 配置项

|   参数   | 数据类型 | 默认值 |   可选值   |                  说明                  |
| :------: | :------: | :----: | :--------: | :-------------------------------------: |
|  width  |  string  |   -   |     -     |          输入框宽度（如 100%）          |
| lazyTrim | boolean | false | true/false | 是否在Input触发change事件前进行trim处理 |

### AileInput Attributes 属性

**支持 `ElementPlus` 中 [Input](https://element-plus.org/#/zh-CN/component/input) 的所有属性：`type` / `value/v-model` / `maxlength` / `minlength` / `show-word-limit` / `placeholder` / `clearable` 等**，此处仅展示额外属性：

|  参数  | 数据类型 | 默认值 |                说明                |
| :----: | :------: | :----: | :--------------------------------: |
| config |  object  |   -   | 配置项，字段同全局config配置项相同 |

### Slot 插槽

**支持 `ElementPlus` 中 [Input](https://element-plus.org/#/zh-CN/component/input) 的所有插槽**

### Events 事件

**支持 `ElementPlus` 中 [Input](https://element-plus.org/#/zh-CN/component/input) 的所有自定义事件**

### Quick Start 快速开始

注意：由于 `TitanPlus` 是基于 `ElementPlus` 进行的二次开发，因此需全局引入ElementPlus组件后方可正常使用

- 引入模块并初始化配置

```ts
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App)
app.use(ElementPlus)

// 全量引入
import TitanPlus from 'aile-plus'
app.use(TitanPlus , {
  input: {
    attrs: {
      clearable: true,
    },
    config: {
      lazyTrim: true,
      width: '100%'
    }
  }
})

// or 按需引入
import TitanInput from 'titan-plus/lib/input'
app.use(AileInput, {
  attrs: {
    clearable: true,
  },
  config: {
    lazyTrim: true,
    width: '100%'
  }
})

```

- 标准使用方式

```ts
/**
 * template使用示例
*/
<titan-input
  v-model="value"
  clearable
  :config="{
    width: '100%',
    lazyTrim: true
  }"
/>

/**
 * or JSX
 */
<titan-input
  v-model={value}
  clearable
  config={{
    width: '100%',
    lazyTrim: true
  }}
/>
```
