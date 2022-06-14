const routes = [{
    path: '/ens/:search?/:topic?',
    component: Search,
    name: 'Search',
    props: true,
  }, {
    path: '/enssales/',
    component: Sales,
    name: 'Sales',
  }, {
    path: '/cryptopunks/:search?/:topic?',
    component: CryptoPunks,
    name: 'CryptoPunks',
    props: true,
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
