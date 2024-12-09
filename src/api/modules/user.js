import http from '@/api/request';
import URL from '../urls';

export class SystemAPI {
    static getList(params) {
        return http.get(URL.system.list, {params});
    }
}
