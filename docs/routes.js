const routes = [{
    path: '/admin',
    component: Admin,
    name: 'Admin',
  }, {
    path: '/weth',
    component: WETH,
    name: 'WETH',
  }, {
    path: '/exchange',
    component: Exchange,
    name: 'Exchange',
  }, {
    path: '/collections',
    component: Collections,
    name: 'Collections',
  }, {
    path: '/docs/:section/:topic',
    component: Docs,
    name: 'Docs',
  }, {
    path: '/:account/:collection',
    component: Collections,
    name: '',
  }, {
    path: '*',
    component: Welcome,
    name: ''
  }
];
