import { defineConfig } from 'umi';

export default defineConfig({
  dva: {
    immer: true,
    hmr: false,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [
        { path: '/', name: '账单列表', component: '@/pages/billList/index' },
        {
          path: '/statistics',
          name: '账单统计',
          component: '@/pages/billStatistics/index',
        },
      ],
    },
  ],
  fastRefresh: {},
});
