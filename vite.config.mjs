import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import { VantResolver } from '@vant/auto-import-resolver';
// https://vitejs.dev/config/
export default defineConfig(({ mode, command })=>{
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV,VITE_APP_SERVER_HOST,VITE_APP_LOCAL_PORT,VITE_APP_SERVER_PORT } = env
  return {
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: [
      vueJsx(),
      ...createVitePlugins(env, command === 'build'),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      port: VITE_APP_LOCAL_PORT,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/api': {
          target: `${VITE_APP_SERVER_HOST}:${VITE_APP_SERVER_PORT}`,
          changeOrigin: true,
          ws: true,
          rewrite: (p) => { return p.replace(/^\/api/, '')
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/mixins/utils.scss" as *;`,
        },
      },
    },
  }
})
