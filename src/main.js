import { createApp } from "vue";
import App from "./App.vue";
import store from './store'
import router from './router/index'
import './styles/index.scss'; // global css
/* svg */
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css';
import './styles/element.scss';
import _ from 'lodash';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import TitanPlus from "./libs/titan-plus";

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store)
app.use(ElementPlus)

app.use(TitanPlus, {
  form: {
    config: {
      emptyText: "默认文字",
    },
    form: {
      labelWidth: '100px'
    }
  },
  tooltip: {
    attrs: {
      placement: "bottom",
      showAfter: 1000,
      effect: "dark",
    },
    themes: [
      {
        name: 'kitty',
        style: {
          padding: '5px',
          background: '#000',
          borderColor: 'red',
          color: 'skyblue',
          fontSize: '14px'
        }
      }
    ],
  },
  select: {
    attrs: {
      clearable: true,
      filterable: true,
      teleported:false
    },
    config: {
      showTooltip: false,
    }
  },
  dialog: {
    config: {
      cancelText: '取消',
      cancelType: 'info',
      showConfirm: true,
      confirmType: 'primary'
    },
    attrs: {
      width: '90%'
    }
  },
  card: {
    config: {
      headerClass: 'ooooo',
    }
  },
  avatar: {
    attrs: {
      fit: 'cover',
    },
    config: {
      labelPlaceholder: '未知姓名',
      labelStyle: {
        fontSize: '20px',
      },
      labelFormatter: name => name.slice(0, 1).toUpperCase()
    }
  }
})

// 全局注册 'src/schema/custom/' 目录下的表单自定义组件
app.use(router)

app.config.globalProperties._ = _;
window._ = _;

app.component('svg-icon', SvgIcon)


app.mount("#app");
