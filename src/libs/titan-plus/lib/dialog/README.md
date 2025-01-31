## titan-plus/dialog

### Intro 简介

`titan-plus/dialog` 是一款对话框组件，基于 `Vue3` 和 `ElementPlus` 进行的二次封装。

- 采用 `$attrs` 接收参数和监听事件，无缝对接 `element-plus` 中的 `Dialog` 文档，上手快。
- 支持安装时个性化配置

### Options 配置项

#### 全局配置项

配置项内容可在全局引入时设置，下表所列属性可在 `main.js` 中安装组件时进行统一配置：

|       参数       | 数据类型 | 默认值 | 可选值 |                                 说明                                 |
| :--------------: | :------: | :----: | :----: | :-------------------------------------------------------------------: |
| **config** |  Object  |   -   |   -   |                     [Config 配置项](#config-配置项)                     |
| **attrs** |  Object  |   -   |   -   | [ElDialog Props](https://element-plus.gitee.io/#/zh-CN/component/dialog) |

#### config 配置项

|      参数      | 数据类型 | 默认值 |               可选值               |         说明         |
| :-------------: | :------: | :----: | :---------------------------------: | :------------------: |
|   showConfirm   | Boolean | false |             true/false             | 是否展示【确定】按钮 |
|   showCancel   | Boolean |  true  |             true/false             | 是否展示【关闭】按钮 |
| confirmLoading | Boolean | false |             true/false             | 【确定】按钮加载状态 |
| confirmDisabled | Boolean | false |             true/false             | 【确定】按钮禁用状态 |
|   confirmText   |  String  |  确定  |                  -                  | 【确定】按钮文字内容 |
|   confirmType   |  String  | right | primary/success/default/danger/info | 【确定】按钮样式类型 |
|   cancelText   |  String  |  关闭  |                  -                  | 【关闭】按钮文字内容 |
|   cancelType   |  String  | right | primary/success/default/danger/info | 【关闭】按钮样式类型 |
|   hideFooter   | Boolean | false |             true/false             | 是否隐藏底部按钮区域 |
|   footerAlign   |  String  | right |          left/center/right          | 底部按钮区域对齐方式 |

### Attributes/Props 属性

**支持 `ElementPlus` 中 [Dialog](https://element-plus.org/#/zh-CN/component/Dialog) 的所有属性：`visible` / `title` / `width` / `fullscreen` / `top` / `modal` / `modal-append-to-body` 等**，此处仅展示额外属性：

|  参数  | 数据类型 | 默认值 |             说明             |
| :----: | :------: | :----: | :--------------------------: |
| config |  object  |   -   | [Config 配置项](#config-配置项) |

### Slot 插槽

**支持 `ElementPlus` 中 [Dialog](https://element-plus.org/#/zh-CN/component/Dialog) 的所有插槽**

### Events 事件

支持全部 `el-dialog` 方法，仅展示新增事件，其余事件详见 [Element Doc Dialog #Dialog Events](https://element-plus.org/#/zh-CN/component/dialog)

| 事件名 |         说明         | 参数 |
| :-----: | :------------------: | :--: |
| confirm | 点击【确定】按钮事件 |  无  |
| cancel | 点击【关闭】按钮事件 |  无  |

### Quick Start 快速开始

注意：由于 `TitanPlus` 是基于 `ElementPlus` 进行的二次开发，因此需全局引入 ElementPlus 组件后方可正常使用

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
  dialog: {
    config: {
      cancelText: '取消',
      cancelType: 'danger',
      showConfirm: true,
      confirmType: 'success'
    },
    attrs: {
      width: '90%'
    }
  },
});

// or 按需引入
import TitanDialog from 'titan-plus/lib/dialog';
app.use(TitanDialog, {
  config: {
    cancelText: '取消',
    cancelType: 'danger',
    showConfirm: true,
    confirmType: 'success'
  },
  attrs: {
    width: '90%'
  }
});
```

- 标准使用方式

```ts
/**
 * template使用示例
*/
<titan-dialog
  title='示例弹窗标题'
  v-model='showDialog'
  :config="{
    showConfirm: true,
    confirmText: 'Confirm',
    showCancel: true,
    cancelText: 'Cancel',
    footerAlign: 'center'
  }"
  @confirm="handleConfirm"
/>

/**
 * jsx使用示例
*/
<titan-dialog
  title='示例弹窗标题'
  v-model={showDialog}
  config={{
    showConfirm: true,
    confirmText: 'Confirm',
    showCancel: true,
    cancelText: 'Cancel',
    footerAlign: 'center'
  }}
  onConfirm={() => {
    console.log('confirm')
  }}
/>
```
