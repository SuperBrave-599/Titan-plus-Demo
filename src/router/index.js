import { createWebHistory, createRouter,createWebHashHistory } from 'vue-router'
import _ from 'lodash'
/* Layout */


// 公共路由
export const constantRoutes = [
  {
    path: '/',
    name: 'Promotion',
    hidden: true,
    component: () => import('@/views/index'),
    meta: { title: ('router["登录"]') }
  },

]

export const asyncRoutes = [
  

]


// 路由映射表
export const RouteMap = {};

/**
 * 初始化路由映射表
 * @param {object} route 路由信息
 * @param {string} parentPath 父节点的完整路由地址
 */
function initRouteMap(route, parentPath = '') {
  const routeName = route.name;
  const currentPath = (parentPath + '/' + route.path)
    .replace(/\/\//gu, '/')
    .replace(/\/$/u, '');
  if (routeName) {
    RouteMap[routeName] = currentPath;
  }
  if (!_.isEmpty(route.children)) {
    route.children.forEach(item => {
      initRouteMap(item, currentPath);
    });
  }
}

asyncRoutes.forEach(item => initRouteMap(item));

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

export function resetRouter() {
  const newRouter = createRouter({
    // 路由配置
  })
  router.matcher = newRouter.matcher
}

export default router;




