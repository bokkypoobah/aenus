const Welcome = {
  template: `
    <div class="m-0 p-0">

      <b-card no-body header="Welcome" class="border-0" header-class="p-1">
        <b-card no-body class="p-0 mt-1">

          <b-card-body class="p-2">

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
                  Search for <router-link to="/ens/sets/">sets</router-link> like ranges of digits with optional prefix/postfix, e.g., 999Club, 10kClub, or the 24 hour set.
                </li>
                <li>
                  Data source <b-link href="https://thegraph.com/hosted-service/subgraph/ensdomains/ens" target="_blank">ENS Subgraph</b-link> and <b-link href="https://api.reservoir.tools/#/1.%20Order%20Book/getOrdersAllV1" target="_blank">Reservoir API</b-link>.
                </li>
                <li>
                  Use simple search strings in the <code>{regex}</code> fields, or use regular expressions like:
                  <ul>
                    <li>
                      <code>^[0-9]{3}$</code> 3 digits; <code>^0[0-9]{2}$</code> early 3 digits; <code>^([0-9])[0-9]\\1$</code> 3 digit palindromes; <code>^[0-9]{3,5}$</code> for 3 to 5 digits
                    </li>
                    <li>
                      <code>^[0-9]{4}$</code> 4 digits; <code>^00[0-9]{2}$</code> early 4 digits; <code>^([0-9])([0-9])\\2\\1$</code> 4 digit palindromes
                    </li>
                    <li>
                      <code>^[0-9]{5}$</code> 5 digits; <code>^000[0-9]{2}$</code> early 5 digits; <code>^([0-9])([0-9])[0-9]\\2\\1$</code> 5 digit palindromes
                    </li>
                    <li>
                      <code>^([0-9])\\1[0-9]\\1\\1$</code> and <code>^([0-9])([0-9])\\1\\2\\1$</code> 5 digit palindromes with 2 unique digits.
                    </li>
                    <li>
                      <code>^[0-9]{6}$</code> 6 digits; <code>^000[0-9]{3}$</code> early 6 digits; <code>^([0-9])([0-9])([0-9])\\3\\2\\1$</code> 6 digit palindromes
                    </li>
                    <li>
                      <code>^[a-z]{3}$</code> 3 alphas; <code>^([a-z])[a-z]\\1$</code> 3 alpha palindromes
                    </li>
                    <li>
                      <code>^[a-z]{4}$</code> 4 alphas; <code>^([a-z])([a-z])\\2\\1$</code> 4 alpha palindromes
                    </li>
                    <li>
                      <code>^[a-z]{5}$</code> 5 alphas; <code>^([a-z])([a-z])[a-z]\\2\\1$</code> 5 alpha palindromes
                    </li>
                    <li>
                      <code>^[a-z0-9]{5}$</code> 5 alphanums; <code>^([a-z0-9])([a-z0-9])[a-z0-9]\\2\\1$</code> 5 alphanum palindromes
                    </li>
                  </ul>

                </li>
              </ul>

              <h6>CryptoPunks</h6>
              <ul>
                <li>
                  Browse through the <router-link to="/cryptopunks/">CryptoPunks</router-link> collection, filtering by addresses, price ranges or attributes.
                </li>
                <li>
                  Data source <b-link href="https://thegraph.com/hosted-service/subgraph/itsjerryokolo/cryptopunks" target="_blank">Cryptopunks Subgraph</b-link>. Note that the full syncing takes about 5 minutes initially.
                </li>
              </ul>

              <h6>This App</h6>
              <ul>
                <li>
                  Runs in your browser to craft your queries to the data services and summarises the results.
                </li>
                <li>
                  Does not track your usage. However, data, metadata and image retrievals from <b-link href="https://thegraph.com/" target="_blank">The Graph</b-link>, <b-link href="https://api.reservoir.tools/#/1.%20Order%20Book/getOrdersAllV1" target="_blank">Reservoir API</b-link> and GitHub will be logged by these services.
                </li>
                <li>
                  Source code at <b-link href="https://github.com/bokkypoobah/aenus" target="_blank">github.com/bokkypoobah/aenus</b-link>. Feel free to fork and customise.
                </li>
              </ul>

              <h6>Run Locally</h6>
              <ul>
                <li>
                  From your Linux, OS/X (or equivalent) terminal using <b-link href="https://www.npmjs.com/package/anywhere" target="_blank">anywhere</b-link>:

                  <pre class="ml-3 pl-3 my-1 py-1 border">
$ mkdir newfolder
$ chdir newfolder
$ git clone https://github.com/bokkypoobah/aenus.git
$ chdir docs
$ anywhere -h localhost</pre>
                </li>
              </ul>

              <h6>See Also</h6>
              <ul>
                <li>
                  <b-link href="https://bokkypoobah.github.io/ExploringCryptoPunksOnChain/" target="_blank">https://bokkypoobah.github.io/ExploringCryptoPunksOnChain/</b-link>
                </li>
                <li>
                  <b-link href="https://bokkypoobah.github.io/MoonCatExplainer/" target="_blank">https://bokkypoobah.github.io/MoonCatExplainer/</b-link>
                </li>
                <li>
                  <b-link href="https://bokkypoobah.github.io/BestBastardGANPunks/" target="_blank">https://bokkypoobah.github.io/BestBastardGANPunks/</b-link>
                </li>
                <li>
                  <b-link href="https://bokkypoobah.github.io/GlicPixxxSurfer/" target="_blank">https://bokkypoobah.github.io/GlicPixxxSurfer/</b-link>
                </li>
                <li>
                  <b-link href="https://bokkypoobah.github.io/BestLunarToken/" target="_blank">https://bokkypoobah.github.io/BestLunarToken/</b-link>
                </li>
                <li>
                  <b-link href="https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary" target="_blank">BokkyPooBahsDateTimeLibrary</b-link>
                </li>
                <li>
                  <b-link href="https://github.com/bokkypoobah/BokkyPooBahsRedBlackTreeLibrary" target="_blank">BokkyPooBahsRedBlackTreeLibrary</b-link>
                </li>
              </ul>

            </b-card-text>

            <b-card-text class="mt-3">
              This app is built on the technology and/or services provided by
              <b-link href="https://twitter.com/ensdomains" target="_blank">ens.eth</b-link>,
              <b-link href="https://twitter.com/graphprotocol" target="_blank">The Graph</b-link>,
              <b-link href="https://twitter.com/reservoir0x" target="_blank">Reservoir</b-link>,
              <b-link href="https://twitter.com/ethereum" target="_blank">Ethereum</b-link>
              and others. We are not affiliated.
            </b-card-text>
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
