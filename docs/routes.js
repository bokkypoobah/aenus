const routes = [{
    path: '/ens/:search/:topic?',
    component: Search,
    name: 'Search',
  }, {
    path: '/enssales/',
    component: Sales,
    name: 'Sales',
  }, {
    path: '/cryptopunks/:search?',
    component: CryptoPunks,
    name: 'CryptoPunks',
  }, {
    path: '/config',
    component: Config,
    name: 'Config',
  }, {
    path: '*',
    component: Welcome,
    name: ''
  }
];
