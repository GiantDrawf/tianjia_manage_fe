export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          // 根目录，默认重定向至欢迎页
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            hideInMenu: true,
            component: './Welcome',
          },
          // 文章管理
          {
            name: 'article',
            path: '/article',
            icon: 'picture',
            authority: ['admin', 'tianjia'],
            component: './article/',
          },
          // 新建或编辑文章
          {
            name: 'editArticle',
            path: '/article/edit/:aid?',
            authority: ['admin', 'tianjia'],
            hideInMenu: true,
            component: './article/create/',
          },
          // 模块管理
          {
            name: 'module',
            path: '/module',
            icon: 'picture',
            authority: ['admin', 'tianjia'],
            component: './module/',
          },
          // 新建或编辑模块
          {
            name: 'editModule',
            path: '/module/edit/:mid?',
            authority: ['admin', 'tianjia'],
            hideInMenu: true,
            component: './module/create',
          },
          // 消息管理
          {
            name: 'notice',
            path: '/notice',
            icon: 'message',
            authority: ['admin', 'tianjia'],
            component: './notice',
          },
          // 用户管理
          {
            name: 'usermanagement',
            path: '/usermanagement',
            icon: 'user',
            authority: ['admin'],
            component: './user/management',
          },
          // 登记管理
          {
            name: 'checkinmanagement',
            path: '/checkinmanagement',
            icon: 'check-square',
            authority: ['admin'],
            component: './checkIn',
          },
          // 抖音热门
          {
            name: 'douyin',
            path: '/douyin',
            icon: 'bar-chart',
            authority: ['admin', 'douyin'],
            routes: [
              {
                name: 'videos',
                path: '/douyin/videos',
                icon: 'video-camera',
                component: './douyin/videos',
              },
              {
                name: 'users',
                path: '/douyin/users',
                icon: 'user',
                component: './douyin/users',
              },
            ],
          },
          // 定时任务
          {
            name: 'scheduledTask',
            path: '/scheduledTask',
            icon: 'schedule',
            authority: ['admin', 'taskManager'],
            component: './scheduledTask',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
