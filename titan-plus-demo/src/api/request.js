import axios from 'axios';
import URL from '@/api/urls';
import router from '@/router';
import {handleResponse, handleError, handleRequest} from './handle-interceptors';

class Service {
    constructor(config) {
        this.config = config;
        this.service = undefined;
        this.whiteList = [];
        this.httpStore = new Map();
        return this._init();
    }

    _init() {


        // 使用 import.meta.env.VITE_APP_BASE_API 作为默认 baseURL
        const defaultBaseURL = import.meta.env.VITE_APP_BASE_API;
        const domainName = window.location.hostname;

        // 根据 hostname 动态设置 baseURL
        if (domainName.indexOf("prom-cdn.xtl10.fun") > -1) {
            this.config.baseURL = "http://47.109.21.59:888";
        } else if (domainName.indexOf("another-domain.example") > -1) {
            this.config.baseURL = "http://47.109.21.59:889";
        } else {
            this.config.baseURL = defaultBaseURL;
        }


        this.service = axios.create(this.config);


        // request interceptor
        this.service.interceptors.request.use(
            config => handleRequest(config),
            error => handleError(error)
        );

        // 响应拦截器
        this.service.interceptors.response.use(
            response => handleResponse(response),
            error => handleError(error, true)
        );


        return this.service;
    }

    clear() {
        this.httpStore.forEach(source => {
            source.cancel();
        });
        this.httpStore.clear();
    }
}

// create an axios instance
const service = new Service({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // baseURL: '/permission_proxy',
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 30000
});

export default service;
