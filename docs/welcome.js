const Welcome = {
  template: `
    <div class="m-0 p-0">

      <b-card no-body header="Welcome" class="border-0" header-class="p-1">
        <b-card no-body class="border-0 m-0 mt-2">

          <!--
          <b-card class="my-3" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="!powerOn || (network.chainId != 1 && network.chainId != 4)">
            <b-card-text>
              Please install the MetaMask extension, connect to the Rinkeby network and refresh this page. Then click the [Power] button on the top right.
            </b-card-text>
          </b-card>
          -->

          <b-card-body class="p-0">
            <b-card class="mb-2">

              <!--
              <b-card class="my-3" header-class="warningheader" header="Mainnet Warning" v-if="network.chainId == 1">
                <b-card-text>
                  Please use the Rinkeby Network, as the Mainnet is in alpha.
                </b-card-text>
              </b-card>
              -->

              <b-card-text class="mt-2">
                <i>aenus advanced ENS and NFT utilities</i> (work in progress) will simplify some of your Ethereum blockchain operations.
              </b-card-text>

              <b-card-text class="mt-3">
                <h6>Ethereum Name Service</h6>
                <ul>
                  <li>
                    Search <router-link to="/ens/names/">names</router-link>, or names that <router-link to="/ens/contains/">contain</router-link>, <router-link to="/ens/startswith/">start with</router-link> or <router-link to="/ens/endswith/">end with</router-link> terms.
                  </li>
                  <li>
                    Search names including those <router-link to="/ens/owned/">owned</router-link> by the same registrants.
                  </li>
                  <li>
                    Search <router-link to="/ens/groups/">groups</router-link> of accounts configured in the <router-link to="/config/">Config</router-link> page.
                  </li>
                  <li>
                    Search for <router-link to="/ens/sets/">sets</router-link> like ranges of digits with optional prefix/postfix, e.g., 999Club, 10kClub, or the 24 hour set
                  </li>
                </ul>

                <h6>This App</h6>
                <ul>
                  <li>
                    Runs in your browser to crafts your queries to the data services and summarises the results.
                  </li>
                  <li>
                    Does not track your usage. If run from GitHub, retrival of this the app pages, and related (NFT) images will be logged.
                  </li>
                  <li>
                    Data service providers <b-link href="https://thegraph.com/" target="_blank">The Graph</b-link> (ENS and CryptoPunks subgraph queries) and <b-link href="https://api.reservoir.tools/#/1.%20Order%20Book/getOrdersAllV1" target="_blank">Reservoir API</b-link> (price data) will log your queries.
                  </li>
                  <li>
                    Source code at <b-link href="https://github.com/bokkypoobah/aenus" target="_blank">https://github.com/bokkypoobah/aenus</b-link>. Feel free to fork and customise.
                  </li>
                </ul>

                <h6>Run Locally</h6>
                <ul>
                  <li>
                    From your Linux, OS/X (or equivalent terminal) using <b-link href="https://www.npmjs.com/package/anywhere" target="_blank">anywhere</b-link>:

                    <pre class="ml-3 pl-3 my-1 py-1 w-50 border">
$ mkdir newfolder
$ chdir newfolder
$ git clone https://github.com/bokkypoobah/aenus.git
$ chdir docs
$ anywhere -h localhost</pre>
                  </li>
                </ul>

                <!--
                <ul>
                  <li>
                    <b>Makers</b> add orders to buy or sell NFTs in the Nix exchange at <b-link :href="network.explorer + 'address/' + network.nixAddress + '#code'" target="_blank">{{ network.nixAddress && (network.nixAddress.substring(0, 20) + '...') || '' }}</b-link>. (Exchange -> Orders)
                  </li>
                </ul>
                -->
              </b-card-text>

              <b-card-text class="mt-3">
                This app is built on the technology and/or services provided by
                <b-link href="https://twitter.com/ensdomains" target="_blank">ens.eth</b-link>,
                <b-link href="https://twitter.com/graphprotocol" target="_blank">The Graph</b-link>,
                <b-link href="https://twitter.com/reservoir0x" target="_blank">Reservoir</b-link>,
                <b-link href="https://twitter.com/ethereum" target="_blank">Ethereum</b-link>
                and others. We are not affiliated.
              </b-card-text>

              <b-card-text class="mt-5">
                Enjoy. <i>aenus advanced ENS and NFT utilities</i> (c) Bok Consulting Pty Ltd 2022.
              </b-card-text>
            </b-card>
          </b-card-body>
        </b-card>
      </b-card>
    </div>
  `,
  data: function () {
    return {
      count: 0,
      reschedule: true,
    }
  },
  computed: {
    powerOn() {
      return store.getters['connection/powerOn'];
    },
    explorer () {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    network() {
      return store.getters['connection/network'];
    },
  },
  methods: {
    async timeoutCallback() {
      logDebug("Welcome", "timeoutCallback() count: " + this.count);

      this.count++;
      var t = this;
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 15000);
      }
    },
  },
  beforeDestroy() {
    logDebug("Welcome", "beforeDestroy()");
  },
  mounted() {
    logInfo("Welcome", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("Welcome", "Calling timeoutCallback()");
    this.timeoutCallback();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const welcomeModule = {
  namespaced: true,
  state: {
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    deQueue(state) {
      logDebug("welcomeModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("welcomeModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("welcomeModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
  },
};
