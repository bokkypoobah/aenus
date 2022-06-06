const routes = [{
    path: '/config',
    component: Config,
    name: 'Config',
  }, {
    path: '/docs',
    component: Docs,
    name: 'Docs',
  }, {
    path: '/transactions',
    component: Transactions,
    name: 'Transactions',
  }, {
    path: '/sales',
    component: Sales,
    name: 'Sales',
  }, {
    path: '/cryptopunks',
    component: CryptoPunks,
    name: 'CryptoPunks',
  }, {
    path: '/search',
    component: Search,
    name: 'Search',
  // }, {
  //   path: '/admin',
  //   component: Admin,
  //   name: 'Admin',
  // }, {
  //   path: '/weth',
  //   component: WETH,
  //   name: 'WETH',
  // }, {
  //   path: '/exchange',
  //   component: Exchange,
  //   name: 'Exchange',
  // }, {
  //   path: '/collections',
  //   component: Collections,
  //   name: 'Collections',
  // }, {
  //   path: '/docs/:section/:topic',
  //   component: Docs,
  //   name: 'Docs',
  // }, {
  //   path: '/:account/:collection',
  //   component: Collections,
  //   name: '',
  }, {
    path: '*',
    component: Search,
    name: ''
  }
];
