import TitanTable from './src/Table.vue';
import {checkType} from '../../utils';

TitanTable.install = function (app, option = {}) {
    // 检查参数安全
    if (checkType(option) !== "object") {
        throw Error(`Invalid plugin option: Expect object, got ${checkType(option)}!`);
    }

    // 挂载全局配置
    app.config.globalProperties.$titanTable = {
        config: option.config || {}, // 特殊配置项
        table: option.table || {}, // <el-table />的属性
        tableColumn: option.tableColumn || {}, // <el-table-column />的属性
        pagination: option.pagination || {} // <el-pagination />的属性
    };

    // 注册全局组件
    app.component(TitanTable.name, TitanTable);
};

export default TitanTable;
