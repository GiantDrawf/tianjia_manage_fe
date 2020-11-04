// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import Routes from './router';

const { NODE_ENV = 'development' } = process.env;
let configs = {};

try {
  configs = require(`./configs/${NODE_ENV}/default.json`);
} catch (err) {
  console.error('Invalid config file.');
  configs = {};
}

export default defineConfig({
  history: { type: 'hash' },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: Routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[NODE_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  define: {
    'process.CONFIG': configs,
  },
});
