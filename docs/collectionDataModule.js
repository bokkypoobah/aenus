const CollectionData = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="!powerOn || (network.chainId != 1 && network.chainId != 4)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Rinkeby network and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.collections size="sm" block variant="outline-info">ERC-721 Token Collections</b-button>
      <b-collapse id="collections" visible class="my-2">
        <b-card no-body class="border-0" v-if="network.chainId == 1 || network.chainId == 4">
          <b-row>
            <b-col cols="4" class="small">Collections</b-col>
            <b-col class="small truncate" cols="8">{{ Object.keys(collections).length }}</b-col>
          </b-row>
        </b-card>
      </b-collapse>
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
    network() {
      return store.getters['connection/network'];
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    collections() {
      return store.getters['collectionData/collections'];
    },
    // collectionList() {
    //   return store.getters['collectionData/collectionList'];
    // },
    nixRoyaltyEngine() {
      return store.getters['tokenData/nixRoyaltyEngine'];
    },
    tokensData() {
      return store.getters['tokenData/tokensData'];
    },
    tradeData() {
      return store.getters['tokenData/tradeData'];
    },
  },
  methods: {
    async timeoutCallback() {
      logInfo("CollectionData", "timeoutCallback() count: " + this.count);
      this.count++;
      var t = this;
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 600000);
      }
    },
  },
  beforeDestroy() {
    logInfo("CollectionData", "beforeDestroy()");
  },
  mounted() {
    logInfo("CollectionData", "mounted()");
    this.reschedule = true;
    logInfo("CollectionData", "Calling timeoutCallback()");
    this.timeoutCallback();
  },
};


const collectionDataModule = {
  namespaced: true,
  state: {
    collectionsConfig: {
      "0x652dc3aa8e1d18a8cc19aef62cf4f03c4d50b2b5": {
        chainId: 4,
        address: "0x652dc3aa8e1d18a8cc19aef62cf4f03c4d50b2b5",
        symbol: "TESTS",
        name: "Tests for Devolution",
        sync: "auto",
        status: null,
        data: {},
      },
      "0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4": {
        chainId: 4,
        address: "0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4",
        symbol: "TESTTOADZ",
        name: "TestToadz",
        sync: "auto",
        status: null,
        data: {},
      },
      "0xab04795fa12aCe45Dd2A2E4A132e4E46B2d4D1B8": {
        chainId: 4,
        address: "0xab04795fa12aCe45Dd2A2E4A132e4E46B2d4D1B8",
        symbol: "TTTT",
        name: "TTTT",
        sync: "auto",
        status: null,
        data: {},
      },
    },
    collections: {},
    collectionList: [],
    nixRoyaltyEngine: null,
    tokensData: [],
    tradeData: [],
    params: null,
    executing: false,
  },
  getters: {
    collectionsConfig: state => state.collectionsConfig,
    collections: state => state.collections,
    collectionList: state => state.collectionList,
    nixRoyaltyEngine: state => state.nixRoyaltyEngine,
    tokensData: state => state.tokensData,
    tradeData: state => state.tradeData,
    balances: state => state.balances,
    params: state => state.params,
  },
  mutations: {
    updateCollection(state, data) {
      logDebug("collectionDataModule", "updateCollection: " + JSON.stringify(data.address));
      const collectionKey = data.chainId + '.' + data.address;
      let collection = state.collections[collectionKey];
      if (collection == null) {
        Vue.set(state.collections, collectionKey, {
          chainId: data.chainId,
          address: data.address,
          symbol: data.symbol,
          name: data.name,
          blockNumber: data.blockNumber,
          timestamp: data.timestamp,
          tokens: data.tokens,
          totalSupply: Object.keys(data.tokens).length,
        });
        collection = state.collections[collectionKey];
      } else {
        collection.blockNumber = data.blockNumber;
        collection.timestamp = data.timestamp;
        // TODO Sync new token info
        // Vue.set(collection, 'tokens', data.tokens);
        // collection.totalSupply = Object.keys(data.tokens).length;
      }
      const collectionList = [];
      for (const [key, collection] of Object.entries(state.collections)) {
        collectionList.push(collection);
      }
      state.collectionList = collectionList;
    },
    updateNixRoyaltyEngine(state, nixRoyaltyEngine) {
      // logInfo("collectionDataModule", "updateNixRoyaltyEngine: " + nixRoyaltyEngine);
      state.nixRoyaltyEngine = nixRoyaltyEngine;
    },
    updateTokensData(state, tokensData) {
      // logInfo("collectionDataModule", "updateTokensData: " + JSON.stringify(tokensData));
      state.tokensData = tokensData;
    },
    updateTradeData(state, tradeData) {
      // logInfo("collectionDataModule", "updateTradeData: " + JSON.stringify(tradeData));
      state.tradeData = tradeData;
    },
    updateBalances(state, balances) {
      state.balances = balances;
      logDebug("collectionDataModule", "updateBalances('" + JSON.stringify(balances) + "')")
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("collectionDataModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("collectionDataModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    async execWeb3({ state, commit, rootState }, { count, listenersInstalled }) {
      logDebug("collectionDataModule", "execWeb3() start[" + count + ", " + listenersInstalled + ", " + JSON.stringify(rootState.route.params) + "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("collectionDataModule", "execWeb3() executing[" + count + ", " + JSON.stringify(rootState.route.params) + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("collectionDataModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        const connected = store.getters['connection/connected'];
        const block = store.getters['connection/block'];
        const blockUpdated = store.getters['connection/blockUpdated'];
        if (false && connected && blockUpdated) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const blockNumber = block ? block.number : await provider.getBlockNumber();
          const timestamp = block ? block.timestamp : await provider.getBlock().timestamp;
          logDebug("collectionDataModule", "execWeb3() count: " + count + ", blockUpdated: " + blockUpdated + ", blockNumber: " + blockNumber + ", listenersInstalled: " + listenersInstalled + ", rootState.route.params: " + JSON.stringify(rootState.route.params) + "]");

          const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
          const collectionList = [];
          for (const [key, collection] of Object.entries(state.collectionsConfig)) {
            if (collection.chainId == store.getters['connection/network'].chainId) {
              const collectionKey = collection.chainId + '.' + collection.address;
              let existingCollection = state.collections[collectionKey];
              if (existingCollection == null) {
                logDebug("collectionDataModule", "execWeb3() - New sync chainId: " + collection.chainId + ", address: " + collection.address);
                let tokenInfo = null;
                try {
                  tokenInfo = await erc721Helper.tokenInfo([collection.address]);
                } catch (e) {
                  console.log("ERROR - Not ERC-721");
                }
                if (tokenInfo && tokenInfo.length == 4 && tokenInfo[0].length == 1) {
                  let tokenType = tokenInfo[0][0].toNumber();
                  let symbol = null;
                  let name = null;
                  let contractTotalSupply = null;
                  const enumerableBatchSize = 1000;
                  const scanBatchSize = 5000;
                  if ((tokenType & MASK_ERC721) == MASK_ERC721) {
                    if ((tokenType & MASK_ERC721METADATA) == MASK_ERC721METADATA) {
                      symbol = tokenInfo[1][0];
                      name = tokenInfo[2][0];
                    }
                    const owners = {};
                    if ((tokenType & MASK_ERC721ENUMERABLE) == MASK_ERC721ENUMERABLE) {
                      contractTotalSupply = tokenInfo[3][0].toString();
                      for (let i = 0; i < contractTotalSupply; i += enumerableBatchSize) {
                        const to = (i + enumerableBatchSize > contractTotalSupply) ? contractTotalSupply : i + enumerableBatchSize;
                        const ownersInfo = await erc721Helper.ownersByEnumerableIndex(collection.address, i, to);
                        for (let j = 0; j < ownersInfo[0].length; j++) {
                          const tokenId = ownersInfo[0][j].toString();
                          owners[tokenId] = { tokenId: tokenId, owner: ownersInfo[1][j] };
                        }
                      }
                    } else {
                      contractTotalSupply = null;
                      const scanFrom = 0;
                      const scanTo = 6969;
                      var searchTokenIds = generateRange(parseInt(scanFrom), (parseInt(scanTo) - 1), 1);
                      for (let i = 0; i < searchTokenIds.length; i += scanBatchSize) {
                        const batch = searchTokenIds.slice(i, parseInt(i) + scanBatchSize);
                        const ownersInfo = await erc721Helper.ownersByTokenIds(collection.address, batch);
                        for (let j = 0; j < ownersInfo[0].length; j++) {
                          if (ownersInfo[0][j]) {
                            const tokenId = batch[j].toString();
                            owners[tokenId] = { tokenId: tokenId, owner: ownersInfo[1][j] };
                          }
                        }
                      }
                    }
                    const tokenIds = Object.keys(owners);
                    const tokenURIs = {};
                    for (let i = 0; i < tokenIds.length; i += scanBatchSize) {
                      const batch = tokenIds.slice(i, parseInt(i) + scanBatchSize);
                      const tokenURIsInfo = await erc721Helper.tokenURIsByTokenIds(collection.address, batch);
                      for (let i = 0; i < tokenURIsInfo[0].length; i++) {
                        if (tokenURIsInfo[0][i]) {
                          tokenURIs[tokenIds[i]] = tokenURIsInfo[1][i];
                        }
                      }
                    }
                    const tokens = {};
                    for (const [tokenId, owner] of Object.entries(owners)) {
                      const tokenURI = tokenURIs[tokenId];
                      tokens[tokenId] = { tokenId: tokenId, owner: owner.owner, tokenURI: tokenURI };
                    }
                    commit('updateCollection', {
                      chainId: collection.chainId,
                      address: collection.address,
                      symbol: collection.symbol,
                      name: collection.name,
                      blockNumber: blockNumber,
                      timestamp: timestamp,
                      tokens: tokens
                    });
                  } else {
                    logError("collectionDataModule", "execWeb3() - address: " + collection.address + " is not an ERC-721 contract");
                  }
                }
              } else {
                const lastBlockNumber = existingCollection.blockNumber;
                const lookback = 100000;
                const filter = {
                  address: collection.address,
                  // address: [NIXADDRESS, weth.address],
                  fromBlock: lastBlockNumber - lookback,
                  toBlock: blockNumber,
                  topics: [[
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer(index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)
                    '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31', // ApprovalForAll (index_topic_1 address owner, index_topic_2 address operator, bool approved)
                    // '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', // Approval (index_topic_1 address src, index_topic_2 address guy, uint256 wad)
                  ]],
                };
                const events = await provider.getLogs(filter);
                const testToadz = new ethers.Contract(TESTTOADZADDRESS, TESTTOADZABI, provider);
                const updatedTokenIdsMap = {};
                const updateApprovals = {};
                for (let j = 0; j < events.length; j++) {
                  const event = events[j];
                  const parsedLog = testToadz.interface.parseLog(event);
                  const decodedEventLog = testToadz.interface.decodeEventLog(parsedLog.eventFragment.name, event.data, event.topics);
                  if (parsedLog.eventFragment.name == "Transfer") {
                    // console.log(parsedLog.eventFragment.name + " " + JSON.stringify(decodedEventLog.map((x) => { return x.toString(); })));
                    updatedTokenIdsMap[decodedEventLog[2]] = true;
                  } else {
                    // console.log(parsedLog.eventFragment.name + " " + JSON.stringify(decodedEventLog.map((x) => { return x.toString(); })));
                    updateApprovals[decodedEventLog[0]] = true;
                  }
                }
                // TODO - Send both below to Nix to handle
                // console.log("updateApprovals: " + JSON.stringify(Object.keys(updateApprovals)));
                const updatedTokenIds = Object.keys(updatedTokenIdsMap);
                // console.log("updatedTokenIds: " + JSON.stringify(updatedTokenIds));
                const scanBatchSize = 5000;
                for (let i = 0; i < updatedTokenIds.length; i += scanBatchSize) {
                  const batch = updatedTokenIds.slice(i, parseInt(i) + scanBatchSize);
                  const ownersInfo = await erc721Helper.ownersByTokenIds(collection.address, batch);
                  for (let j = 0; j < ownersInfo[0].length; j++) {
                    if (ownersInfo[0][j]) {
                      const tokenId = batch[j].toString();
                      // owners[tokenId] = { tokenId: tokenId, owner: ownersInfo[1][j] };
                      // console.log(tokenId + " = " + ownersInfo[1][j]);
                    }
                  }
                }

                commit('updateCollection', {
                  chainId: collection.chainId,
                  address: collection.address,
                  symbol: collection.symbol,
                  name: collection.name,
                  blockNumber: blockNumber,
                  timestamp: timestamp,
                  tokens: collection.tokens
                });
                // logInfo("collectionDataModule", "execWeb3() - Syncing chainId: " + collection.chainId + ", address: " + collection.address + ", lastBlockNumber: " + lastBlockNumber);
              }
            }
          }

          // TODO - Capture relevant events, and refresh only the updated orders & trades data
          // Install listeners
          if (!listenersInstalled) {
            // logInfo("collectionDataModule", "execWeb3() installing listener");
            // nix.on("*", (event) => {
            //   // console.log("nix - event: ", JSON.stringify(event));
            //   logInfo("collectionDataModule", "nix - event: " + JSON.stringify(event));
            // });
          }
        }

        commit('updateExecuting', false);
        logDebug("collectionDataModule", "execWeb3() end[" + count + "]");
      } else {
        logDebug("collectionDataModule", "execWeb3() already executing[" + count + "]");
      }
    },
  },
  // mounted() {
  //   logInfo("collectionDataModule", "mounted() $route: " + JSON.stringify(this.$route.params));
  // },
};
