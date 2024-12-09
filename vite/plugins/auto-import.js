import autoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver';

export default function createAutoImport() {
    return autoImport({
        imports: [
            'vue',
            'vue-router',
            'pinia'
        ],
        resolvers: [VantResolver()],
        dts: false
    })
}
