## titan-plus/avatar

### Intro 简介

`titan-plus/avatar` 是一款 Avatar 头像组件，基于 `Vue3` 和 `ElementPlus` 进行的二次封装。

- 采用 `$attrs` 接收参数和监听事件，无缝对接 `element-plus` 中的 `Avatar` 文档，上手快。
- 支持安装时个性化配置

### Options 配置项

#### 全局配置项

配置项内容可在全局引入时设置，下表所列属性可在 `main.js` 中安装组件时进行统一配置：

|       参数       | 数据类型 | 默认值 | 可选值 |                                 说明                                 |
| :--------------: | :------: | :----: | :----: | :-------------------------------------------------------------------: |
| **config** |  Object  |   -   |   -   |                     [Config 配置项](#config-配置项)                     |
| **attrs** |  Object  |   -   |   -   | [ElAvatar Props](https://element-plus.gitee.io/#/zh-CN/component/avatar) |

#### config 配置项

|       参数       | 数据类型 |                          默认值                          |               说明               |
| :--------------: | :------: | :------------------------------------------------------: | :------------------------------: |
| labelPlaceholder |  string  |                         Unknown                         |  当图片读取失败时显示的默认标签  |
|  labelFormatter  | function |          name => name.slice(0, 2).toUpperCase()          |          标签格式化函数          |
|    labelStyle    |  object  | { fontSize: '16px';`<br>` backgroundColor: '#3381D0' } |             标签样式             |
|   srcFormatter   | function |                           ...                           |          src格式化函数          |
|       size       |  string  |                            -                            | avatar尺寸，统一设置width/height |

### Attributes/Props 属性

**支持 `ElementPlus` 中 [Avatar](https://element-plus.org/#/zh-CN/component/Avatar) 的所有属性：`icon` / `size` / `shape` / `src` / `srcSet` / `all` / `fit` 等**，此处仅展示额外属性：

|  参数  | 数据类型 | 默认值 |                说明                |
| :----: | :------: | :----: | :--------------------------------: |
| label |  string  |   -   |     当图片读取失败时显示的字符     |
|  src  |  string  |   -   |     图像来源，支持网址和base64     |
| config |  object  |   -   | 配置项，字段同全局config配置项相同 |

### Slot 插槽

**支持 `ElementPlus` 中 [Avatar](https://element-plus.org/#/zh-CN/component/Avatar) 的所有插槽**

### Events 事件

**支持 `ElementPlus` 中 [Avatar](https://element-plus.org/#/zh-CN/component/Avatar) 的所有自定义事件**

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
import TitanPlus from 'titan-plus'
app.use(TitanPlus , {
  avatar: {
    attrs: {
      fit: 'cover',
    },
    config: {
      labelPlaceholder: '未知姓名',
      labelStyle: {
        fontSize: '20px',
        backgroundColor: 'red'
      },
      labelFormatter: name => name.slice(0, 1).toUpperCase()
    }
  }
})

// or 按需引入
import TitanAvatar from 'titan-plus/lib/avatar'
app.use(TitanAvatar, {
    attrs: {
      fit: 'cover',
    },
    config: {
      labelPlaceholder: '未知姓名',
      labelStyle: {
        fontSize: '20px',
        backgroundColor: 'red'
      },
      labelFormatter: name => name.slice(0, 1).toUpperCase()
    }
})

```

- 标准使用方式

```ts
/**
 * template使用示例
*/
<titan-avatar
  :label="username"
  fit="cover"
  :config="{
    size: 40
    labelPlaceholder: '未知姓名'
  }"
/>

/**
 * or JSX
 */
<titan-avatar
  label={this.username}
  fit="cover"
  config={{
    size: 40,
    labelPlaceholder: '未知姓名'
  }}
/>
```
