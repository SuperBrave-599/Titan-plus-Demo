import {ElMessage} from 'element-plus';
import {getToken, setToken} from '@/utils/auth';
import router from '@/router';

let notNotify = false;


/**
 * 统一处理响应拦截器
 * @param {object} response 响应数据
 */
export async function handleResponse(response) {
    const newToken = response.headers['refresh-token'];
    if (newToken) setToken(newToken); // 刷新token

    const {data} = response;

    // Object.prototype.toString.call(data) === '[object Blob]' 处理系统资源 和评论导出 数据为blob
    if (typeof data === 'string' || Object.prototype.toString.call(data) === '[object Blob]') {
        return data;
    }
    if (Object.prototype.toString.call(data) === '[object Array]') {
        return {
            total: 1000,
            data
        }
    }


    // 登录信息失效，返回登录界面
    if (data.code === 401) {
        !notNotify && ElMessage.error(data.msg);
        notNotify = true;
        // await store.dispatch('user/resetToken');
        // 如果当前页面不是登录页面, 则跳转到登录页面
        if (router.currentRoute.value.path !== '/login') {
            // 去掉路由的 #/
            const str = window.location.hash.split('#/')[1];
            router.push({name: 'LOGIN', query: {redirect: str}});
        }
        return Promise.reject(data.data);
    }


    // 处理普通状态码，弹出ERROR类型的消息
    if (data.code !== 0 && data.code !== 200) {
        let msg = data.msg || data.message;
        // #5830 bug
        ElMessage({
            message: msg,
            type: 'error',
            showClose: true,
            offset: 60,
            duration: 1000
        });
        return Promise.reject(data.msg);
    }
    // 返回正常数据
    notNotify = false;
    return data;
}


/**
 * 统一处理请求拦截器
 * @param {object} config 请求数据
 */
export function handleRequest(config) {
    config.headers['access-token'] = getToken();
    return config;
}

/**
 * 统一处理请求错误
 * @param {object} error 错误信息
 * @param {boolean} showMessage 是否通知用户错误信息
 */
export function handleError(error, showMessage) {
    // do something with request error
    if (error.message && showMessage) {
        const errMsg = error.response ? `code:${error.response.status}` : `message:${error.message}`;
        ElMessage({
            message: `${i18n.global.t('store["网络请求失败，请稍后重试"]')}(${errMsg})`,
            type: 'error',
            showClose: true,
            offset: 60,
            duration: 1000
        });
    }
    return Promise.reject(error);
}

