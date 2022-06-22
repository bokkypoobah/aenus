const routes = [{
    path: '/ens/:search?/:topic?',
    component: Search,
    name: 'Search',
    props: true,
  }, {
    path: '/enssales/',
    component: ENSSales,
    name: 'ENSSales',
  }, {
    path: '/cryptopunks/:search?/:topic?',
    component: CryptoPunks,
    name: 'CryptoPunks',
    props: true,
  }, {
    path: '/nfts/',
    component: NFTs,
    name: 'NFTs',
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
