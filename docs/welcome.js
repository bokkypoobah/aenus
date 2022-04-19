const Welcome = {
  template: `
    <div class="mt-5 pt-3">

      <b-card no-body header="Welcome" class="border-0" header-class="p-1">
        <b-card no-body class="border-0 m-0 mt-2">

          <b-card class="my-3" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="!powerOn || (network.chainId != 1 && network.chainId != 4)">
            <b-card-text>
              Please install the MetaMask extension, connect to the Rinkeby network and refresh this page. Then click the [Power] button on the top right.
            </b-card-text>
          </b-card>

          <b-card-body class="p-0">
            <b-card class="mb-2">

              <b-card class="my-3" header-class="warningheader" header="Mainnet Warning" v-if="network.chainId == 1">
                <b-card-text>
                  Please use the Rinkeby Network, as the Mainnet is in alpha.
                </b-card-text>
              </b-card>

              <b-card-text>
                Welcome to the Nix Decentralised ERC-721 Exchange. Check out the menus on the top right. Click on the top left icon to get back here. <b>Status: WIP</b>
              </b-card-text>

              <b-card-text class="mt-5 mb-2">
                <h5>How This Works</h5>
                <ul>
                  <li>
                    <b>Makers</b> add orders to buy or sell NFTs in the Nix exchange at <b-link :href="network.explorer + 'address/' + network.nixAddress + '#code'" target="_blank">{{ network.nixAddress && (network.nixAddress.substring(0, 20) + '...') || '' }}</b-link>. (Exchange -> Orders)
                  </li>
                  <li>
                    <b>Takers</b> execute against one or more orders. (Exchange -> Trades)
                  </li>
                  <li>
                    Payments are made in <b-link :href="network.explorer + 'token/' + network.wethAddress" target="_blank">WETH</b-link> and are netted, so no fancy flash loans are required for complicated buy/sell bulk trades. The taker pays the <b>netAmount</b> in WETH if negative, or receives if positive.
                  </li>
                  <li>
                    The Nix exchange must be approved to transfer the WETH and/or the NFT. (Tokens -> Approval and WETH -> Approval)
                  </li>
                  <li>
                    The NixHelper contract at <b-link :href="explorer + 'address/' + network.nixHelperAddress + '#code'" target="_blank">{{ network.nixHelperAddress && network.nixHelperAddress.substring(0, 20) + '...' || '' }}</b-link> allows this Web3 UI to retrieve the order and trade information in bulk, via the web3 connection.
                  </li>
                  <li>
                    There are no fees on this exchange.
                  </li>
                  <li>
                    Makers and takers are encouraged to add a tip for this developer (in ETH) when executing Nix transactions.
                  </li>
                  <li>
                    There is a parameter when executing Nix transactions for 3rd party integrators to receive a portion of ETH tips sent by makers and takers.
                  </li>
                  <li>
                    There is no backend server for this application to work. Data retrieval is through the web3 connection, and will take time to update.
                  </li>
                </ul>
              </b-card-text>

              <b-card-text class="mt-5 mb-2">
                <h5>Order Type Examples</h5>
                (Buy/Sell, Any/All, [tokenIds], price, tradeMax)
                <ul>
                  <li>
                    Buy up to 5 NFTs from a collection for 0.1 WETH each. (Buy, Any, [], 0.1, 5)
                  </li>
                  <li>
                    Buy up to 2 NFTs with tokenIds [1, 2, 3 or 4] from a collection for 0.1 WETH each. (Buy, Any, [1, 2, 3, 4], 0.1, 2)
                  </li>
                  <li>
                    Buy a bundle of NFTs with tokenIds [1, 2, 3 and 4] from a collection for 0.1 WETH in total. (Buy, All, [1, 2, 3, 4], 0.1, 1)
                  </li>
                  <li>
                    Sell any NFT owned by the seller for 0.1 WETH each. (Sell, Any, [], 0.1, 1)
                  </li>
                  <li>
                    Sell up to 2 of NFTs [1, 2, 3, or 4] for 0.1 WETH each. (Sell, Any, [1, 2, 3, 4], 0.1, 2)
                  </li>
                  <li>
                    Sell a bundle of NFTs with tokenIds [1, 2, 3 and 4] from a collection for 0.1 WETH in total. (Sell, All, [1, 2, 3, 4], 0.1, 1)
                  </li>
                </ul>
              </b-card-text>

              <b-card-text class="mt-5 mb-2">
                <h5>Other Order Details</h5>
                <ul>
                  <li>
                    Orders can only be executed if the <b>expiry</b> is set to 0, or is after than the current time.
                  </li>
                  <li>
                    Orders depend on ownership and approval of the NFTs and WETH, and can become active (and inactive) when these are updated.
                  </li>
                </ul>
              </b-card-text>

              <b-card-text class="mt-5 mb-2">
                <h5>ERC-721 Token Collection Data Retrieval</h5>
                <ul>
                  <li>
                    The ERC721Helper contract at <b-link :href="network.explorer + 'address/' + network.erc721HelperAddress + '#code'" target="_blank">{{ network.erc721HelperAddress && network.erc721HelperAddress.substring(0, 20) + '...' || '' }}</b-link> allows this Web3 UI to retrieve the token ownership and tokenURI information for ERC-721 NFT collections in bulk, via the web3 connection.
                  </li>
                  <li>
                    The tokenURI information for each tokenId within an NFT collection may have an image and/or traits. This can be parsed and used for displaying and filtering.
                  </li>
                </ul>
              </b-card-text>

              <b-card-text class="mt-5 mb-2">
                <h5>Royalties</h5>
                <ul>
                  <li>
                    This exchange uses <b-link href="https://royaltyregistry.xyz/lookup" target="_blank">Manifold's Royalty Engine</b-link> at <b-link :href="explorer + 'address/' + network.nixRoyaltyEngine + '#code'" target="_blank">{{ network.nixRoyaltyEngine && nixRoyaltyEngine.substring(0, 20) + '...' || '' }}</b-link> to compute the royalty payments on NFT sales. Note that there can be different royalty payment rates for different tokenIds within the same collection.
                  </li>
                  <li>
                    Deployers of ERC-721 token collection configure the royalty payment information in the <b-link href="https://royaltyregistry.xyz/configure" target="_blank">Royalty Registry</b-link>.
                  </li>
                  <li>
                    Makers specify a <b>royaltyFactor</b> (in percent, 0 to 1000, or 0x to 10x) when adding orders. Takers specify a royaltyFactor when executing against the orders. The NFT seller's royaltyFactor is multiplied by the royalty payments computed by the Royalty Engine. i.e., sellers pay 0x to 10x the royalty payment recommended by the Royalty Engine configuration.
                  </li>
                </ul>
              </b-card-text>

              <b-card-text class="mt-5 mb-2">
                <h5>Calculating NetAmount</h5>
                <ul>
                  <li>
                    As a taker, if you are selling an NFT, you will receive WETH minus any royalty payments. So selling an NFT for 0.1 WETH with a 1% royalty payment and 100% royaltyFactor will result in a netAmount of 0.0099 WETH. 0.0001 WETH will be paid to the collection owner address.
                  </li>
                </ul>
              </b-card-text>

              <b-card-text class="mt-5 mb-2">
                <h5>Repos</h5>
                <ul>
                  <li>
                    <b-link href="https://github.com/bokkypoobah/Nix" target="_blank">https://github.com/bokkypoobah/Nix</b-link> - smart contracts.
                  </li>
                  <li>
                    <b-link href="https://github.com/bokkypoobah/NixApp" target="_blank">https://github.com/bokkypoobah/NixApp</b-link> - this web3 dapp.
                  </li>
                </ul>
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
    logDebug("Welcome", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("Welcome", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
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
