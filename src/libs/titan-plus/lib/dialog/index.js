import TitanDialog from './src/Dialog.vue';
import { checkType } from "../../utils";

TitanDialog.install = function(app, option = {}) {
  // 检查参数安全
  if (checkType(option) !== "object") {
    throw Error(`Invalid plugin option: Expect object, got ${checkType(option)}!`);
  }
  // 挂载全局配置
  app.config.globalProperties.$titanDialog = {
    config: option.config || {},
    attrs: option.attrs || {},
  };
  // 注册全局组件
  app.component(TitanDialog.name, TitanDialog);
};

export default TitanDialog;
