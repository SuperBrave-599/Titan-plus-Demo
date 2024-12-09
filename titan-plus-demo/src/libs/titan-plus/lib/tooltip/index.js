import TitanTooltip from "./src/Tooltip.vue";
import { registerTheme } from "./src/theme.js";
import { checkType } from "../../utils";

TitanTooltip.install = function (app, option = {}) {
  // 检查参数安全
  if (checkType(option) !== "object") {
    throw Error(`Invalid plugin option: Expect object, got ${checkType(option)}!`);
  }
  // 注册主题
  if ({}.hasOwnProperty.call(option, "themes")) {
    registerTheme(option.themes || []);
  }
  // 挂载全局配置
  app.config.globalProperties.$titanTooltip = {
    // config: option.config || {},
    attrs: option.attrs || {},
  };
  // 注册全局组件
  app.component(TitanTooltip.name, TitanTooltip);
};

export default TitanTooltip;
