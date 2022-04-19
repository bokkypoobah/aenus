const NixData = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="!powerOn || (network.chainId != 1 && network.chainId != 4)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Rinkeby network and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.nix_contract size="sm" block variant="outline-info">Nix Exchange</b-button>
      <b-collapse id="nix_contract" visible class="my-2">
        <b-card no-body class="border-0" v-if="network.chainId == 1 || network.chainId == 4">
          <b-row>
            <b-col cols="4" class="small">Nix</b-col>
            <b-col class="small truncate" cols="8">
              <b-link :href="network.explorer + 'address/' + network.nixAddress + '#code'" class="card-link" target="_blank">{{ network.nixAddress == null ? '' : (network.nixAddress.substring(0, 20) + '...') }}</b-link>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Nix Helper</b-col>
            <b-col class="small truncate" cols="8">
              <b-link :href="network.explorer + 'address/' + network.nixHelperAddress + '#code'" class="card-link" target="_blank">{{ network.nixHelperAddress == null ? '' : (network.nixHelperAddress.substring(0, 20) + '...') }}</b-link>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Royalty Engine</b-col>
            <b-col class="small truncate" cols="8">
              <b-link :href="network.explorer + 'address/' + network.royaltyEngineAddress + '#code'" class="card-link" target="_blank">{{ network.royaltyEngineAddress == null ? '' : (network.royaltyEngineAddress.substring(0, 20) + '...') }}</b-link>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Tokens</b-col>
            <b-col class="small truncate" cols="8">{{ Object.keys(tokensData).length }}</b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Trades</b-col>
            <b-col class="small truncate" cols="8">{{ Object.keys(nixTrades).length }}</b-col>
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
    tokensData() {
      return store.getters['nixData/tokensData'];
    },
    nixTrades() {
      return store.getters['nixData/nixTrades'];
    },
  },
  methods: {
    async timeoutCallback() {
      logInfo("NixData", "timeoutCallback() count: " + this.count);
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
    logInfo("NixData", "beforeDestroy()");
  },
  mounted() {
    logInfo("NixData", "mounted()");
    this.reschedule = true;
    logInfo("NixData", "Calling timeoutCallback()");
    this.timeoutCallback();
  },
};


const nixDataModule = {
  namespaced: true,
  state: {
    nixRoyaltyEngine: null,

    wethData: {},
    collections: {},
    collectionList: [],
    nixTokens: {},
    nixTrades: {},
    nixTradeList: [],

    tokensData: [],
    params: null,
    executing: false,
  },
  getters: {
    nixRoyaltyEngine: state => state.nixRoyaltyEngine,

    wethData: state => state.wethData,
    collections: state => state.collections,
    collectionList: state => state.collectionList,
    nixTokens: state => state.nixTokens,
    nixTrades: state => state.nixTrades,
    nixTradeList: state => state.nixTradeList,

    tokensData: state => state.tokensData,
    balances: state => state.balances,
    params: state => state.params,
  },
  mutations: {
    newCollection(state, data) {
      // logInfo("nixDataModule", "newCollection: " + JSON.stringify(data));
      const collectionKey = data.chainId + '.' + data.address;
      let collection = state.collections[collectionKey];
      if (collection == null) {
        Vue.set(state.collections, collectionKey, {
          chainId: data.chainId,
          address: data.address,
          symbol: data.symbol,
          name: data.name,
          totalSupply: data.totalSupply,
          blockNumber: null,
          timestamp: null,
          tokens: {},
          computedTotalSupply: null,
        });
      }
      const collectionList = [];
      for (const [key, collection] of Object.entries(state.collections)) {
        collectionList.push(collection);
      }
      state.collectionList = collectionList;
    },
    newCollectionTokens(state, data) {
      // logInfo("nixDataModule", "newCollectionTokens: " + JSON.stringify(data));
      const collectionKey = data.chainId + '.' + data.address;
      let collection = state.collections[collectionKey];
      if (collection != null) {
        // logInfo("nixDataModule", "newCollectionTokens B: " + JSON.stringify(state.collections));
        // logInfo("nixDataModule", "newCollectionTokens data.tokens: " + JSON.stringify(data.tokens));
        const tokens = collection.tokens;
        // console.log("tokens: " + JSON.stringify(tokens));
        for (const [tokenId, token] of Object.entries(data.tokens)) {
          // console.log("tokenId: " + tokenId + ", " + token);
          tokens[tokenId] = token;
          // console.log("tokens: " + JSON.stringify(tokens));
        }
        // logInfo("nixDataModule", "newCollectionTokens tokens: " + JSON.stringify(tokens));
        Vue.set(state.collections, collectionKey, {
          chainId: data.chainId,
          address: data.address,
          symbol: collection.symbol,
          name: collection.name,
          totalSupply: collection.totalSupply,
          blockNumber: data.blockNumber,
          timestamp: data.timestamp,
          tokens: tokens,
          computedTotalSupply: Object.keys(tokens).length,
        });
      }
      // logInfo("nixDataModule", "newCollectionTokens A: " + JSON.stringify(state.collections));
      const collectionList = [];
      for (const [key, collection] of Object.entries(state.collections)) {
        collectionList.push(collection);
      }
      state.collectionList = collectionList;
    },
    updateTraitsAndImages(state, data) {
      // logInfo("nixDataModule", "updateTraitsAndImages: " + JSON.stringify(data));
      const collectionKey = data.chainId + '.' + data.address;
      const collection = state.collections[collectionKey];
      if (collection != null) {
        for (const [tokenId, token] of Object.entries(data.traitsAndImages)) {
          const existingToken = collection.tokens[tokenId];
          if (existingToken) {
            existingToken.metadataRetrieved = token.metadataRetrieved;
            existingToken.traits = token.traits;
            existingToken.image = token.image;
            Vue.set(collection.tokens, tokenId, existingToken);
          }
        }
        Vue.set(state.collections, collectionKey, collection);
      }
      const collectionList = [];
      for (const [key, collection] of Object.entries(state.collections)) {
        collectionList.push(collection);
      }
      state.collectionList = collectionList;
    },
    updateNixToken(state, data) {
      // logInfo("nixDataModule", "updateNixToken: " + JSON.stringify(data));
      let token = state.nixTokens[data.tokenIndex];
      if (token == null) {
        const ordersList = [];
        for (const [orderIndex, order] of Object.entries(data.orders)) {
          ordersList.push(order);
        }
        Vue.set(state.nixTokens, data.tokenIndex, {
          tokenIndex: data.tokenIndex,
          token: data.token,
          symbol: data.symbol,
          name: data.name,
          totalSupply: data.totalSupply,
          ordersLength: data.ordersLength,
          executed: data.executed,
          volumeToken: data.volumeToken,
          volumeWeth: data.volumeWeth,
          averageWeth: data.averageWeth,
          orders: data.orders,
          ordersList: ordersList,
        });
        token = state.nixTokens[data.tokenIndex];
      } else {
        token.ordersLength = data.ordersLength;
        token.executed = data.executed;
        token.volumeToken = data.volumeToken;
        token.volumeWeth = data.volumeWeth;
        token.averageWeth = data.averageWeth;
        for (const [orderIndex, order] of Object.entries(data.orders)) {
          if (!token.orders[orderIndex]) {
            token.ordersList.push(order);
          }
          token.orders[orderIndex] = order;
        }
        Vue.set(state.nixTokens, data.tokenIndex, token);
      }
    },
    updateNixTokenOrders(state, data) {
      // logInfo("nixDataModule", "updateNixTokenOrders: " + JSON.stringify(data));
      let token = state.nixTokens[data.tokenIndex];
      if (token != null) {
        for (const [orderIndex, order] of Object.entries(data.orders)) {
          if (!token.orders[orderIndex]) {
            token.ordersList.push(order);
          }
          token.orders[orderIndex] = order;
          // TODO - Compare
          Vue.set(state.nixTokens[data.tokenIndex].orders, orderIndex, order);
        }
        Vue.set(state.nixTokens, data.tokenIndex, token);
      }
    },
    updateNixRoyaltyEngine(state, nixRoyaltyEngine) {
      // logInfo("nixDataModule", "updateNixRoyaltyEngine: " + nixRoyaltyEngine);
      state.nixRoyaltyEngine = nixRoyaltyEngine;
    },
    updateTokensData(state, tokensData) {
      // logInfo("nixDataModule", "updateTokensData: " + JSON.stringify(tokensData));
      state.tokensData = tokensData;
    },
    updateNixTrades(state, tradeData) {
      // logInfo("nixDataModule", "updateNixTrades: " + JSON.stringify(tradeData));
      for (let trade of tradeData) {
        Vue.set(state.nixTrades, trade.tradeIndex, trade);
      }
      const nixTradeList = [];
      for (const [tradeIndex, t] of Object.entries(state.nixTrades)) {
        nixTradeList.push(t);
      }
      state.nixTradeList = nixTradeList;
    },

    updateWETHData(state, data) {
      // logInfo("nixDataModule", "updateWETHData: " + JSON.stringify(data));
      for (const [account, item] of Object.entries(data.wethData)) {
        // console.log("item: " + JSON.stringify(item));
        Vue.set(state.wethData, item.account, item);
      }
      // for (const item of Object.values(data)) {
      //   // logInfo("nixDataModule", "updateWETHData: " + JSON.stringify(item));
      //   console.log("item: " + JSON.stringify(item));
      //   // Vue.set(state.wethData, item.account, item);
      // }
      // const nixTradeList = [];
      // for (const [tradeIndex, t] of Object.entries(state.nixTrades)) {
      //   nixTradeList.push(t);
      // }
      // state.nixTradeList = nixTradeList;
    },
    updateBalances(state, balances) {
      state.balances = balances;
      logDebug("nixDataModule", "updateBalances('" + JSON.stringify(balances) + "')")
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("nixDataModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("nixDataModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, listenersInstalled }) {

      async function getRecentEvents(provider, nix, erc721, weth, blockNumber) {
        logDebug("nixDataModule", "execWeb3.getRecentEvents()");

        // const wethLookback = 50000;
        // const erc721Lookback = 100000;
        // const nixLookback = 80000;
        const wethLookback = 10;
        const erc721Lookback = 10;
        const nixLookback = 10;

        const accounts = {};
        const tokens = {};
        const nixTokens = {};
        const nixOrders = {};
        const nixTrades = {};

        const network = store.getters['connection/network'];

        const nixFilter = {
          address: network.nixAddress,
          fromBlock: blockNumber - nixLookback,
          toBlock: blockNumber,
          topics: [[
            '0xf4c563a3ea86ff1f4275e8c207df0375a51963f2b831b7bf4da8be938d92876c', // TokenAdded(address token, uint256 tokenIndex)
            '0x98294be035c742c5a68ff3c35920bf3c58cba97677569fb8bea1ae14e1e8643d', // OrderAdded(address token, uint256 orderIndex)
            '0x384bb209f0fe774478cff852a38e0ad1152d763f1a10b696be5b14437e594ef4', // OrderExecuted(address indexed token, uint indexed orderIndex, uint indexed tradeIndex, uint[] tokenIds);
          ]],
        };
        const nixEvents = await provider.getLogs(nixFilter);
        for (let j = 0; j < nixEvents.length; j++) {
          const nixEvent = nixEvents[j];
          const parsedLog = nix.interface.parseLog(nixEvent);
          const decodedEventLog = nix.interface.decodeEventLog(parsedLog.eventFragment.name, nixEvent.data, nixEvent.topics);
          // console.log(parsedLog.eventFragment.name + " " + JSON.stringify(decodedEventLog.map((x) => { return x.toString(); })));
          if (parsedLog.eventFragment.name == "TokenAdded") {
            nixTokens[decodedEventLog[1]] = decodedEventLog[0];
          } else if (parsedLog.eventFragment.name == "OrderAdded") {
            if (nixOrders[decodedEventLog[0]] == null) {
              nixOrders[decodedEventLog[0]] = {};
            }
            nixOrders[decodedEventLog[0]][decodedEventLog[1]] = true;
          } else if (parsedLog.eventFragment.name == "OrderExecuted") {
            nixTrades[decodedEventLog[2]] = true;
          }
        }

        const wethFilter = {
          address: network.wethAddress,
          fromBlock: blockNumber - wethLookback,
          toBlock: blockNumber,
          topics: [[
            '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c', // Deposit (index_topic_1 address dst, uint256 wad)
            '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65', // Withdrawal (index_topic_1 address src, uint256 wad)
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer(index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)
            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', // Approval (index_topic_1 address src, index_topic_2 address guy, uint256 wad)
          ]],
        };
        const wethEvents = await provider.getLogs(wethFilter);
        for (let j = 0; j < wethEvents.length; j++) {
          const wethEvent = wethEvents[j];
          const parsedLog = weth.interface.parseLog(wethEvent);
          const decodedEventLog = weth.interface.decodeEventLog(parsedLog.eventFragment.name, wethEvent.data, wethEvent.topics);
          // console.log(parsedLog.eventFragment.name + " " + JSON.stringify(decodedEventLog.map((x) => { return x.toString(); })));
          if (parsedLog.eventFragment.name == "Transfer") {
            accounts[decodedEventLog[0]] = true;
            accounts[decodedEventLog[1]] = true;
          } else if (parsedLog.eventFragment.name == "Deposit" || parsedLog.eventFragment.name == "Withdrawal") {
            accounts[decodedEventLog[0]] = true;
          } else { // Approval
            if (decodedEventLog[1] == network.nixAddress) {
              accounts[decodedEventLog[0]] = true;
            }
          }
        }

        const collectionsConfig = Object.keys(store.getters['collectionData/collectionsConfig']);
        for (collectionConfig of collectionsConfig) {
          const erc721Filter = {
            address: collectionConfig,
            fromBlock: blockNumber - erc721Lookback,
            toBlock: blockNumber,
            topics: [[
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer(index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)
              '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31', // ApprovalForAll (index_topic_1 address owner, index_topic_2 address operator, bool approved)
            ]],
          };
          const erc721Events = await provider.getLogs(erc721Filter);
          for (let j = 0; j < erc721Events.length; j++) {
            const erc721Event = erc721Events[j];
            const parsedLog = erc721.interface.parseLog(erc721Event);
            const decodedEventLog = erc721.interface.decodeEventLog(parsedLog.eventFragment.name, erc721Event.data, erc721Event.topics);
            // console.log(erc721Event.address + " " + parsedLog.eventFragment.name + " " + JSON.stringify(decodedEventLog.map((x) => { return x.toString(); })));
            if (parsedLog.eventFragment.name == "Transfer") {
              accounts[decodedEventLog[0]] = true;
              accounts[decodedEventLog[1]] = true;
              if (tokens[erc721Event.address] == null) {
                tokens[erc721Event.address] = {};
              }
              tokens[erc721Event.address][decodedEventLog[2]] = true;
            } else { // ApprovalForAll
              if (decodedEventLog[1] == network.nixAddress) {
                accounts[decodedEventLog[0]] = true;
              }
            }
          }
        }
        if (Object.keys(nixTokens).length > 0) {
          logInfo("nixDataModule", "execWeb3.getRecentEvents() - nixTokens: " + JSON.stringify(Object.keys(nixTokens)));
        }
        for (let collection of Object.keys(nixOrders)) {
          logInfo("nixDataModule", "execWeb3.getRecentEvents() - nixOrders: " + collection + " - " + Object.keys(nixOrders[collection]));
        }
        if (Object.keys(nixTrades).length > 0) {
          logInfo("nixDataModule", "execWeb3.getRecentEvents() - nixTrades: " + JSON.stringify(Object.keys(nixTrades)));
        }
        if (Object.keys(accounts).length > 0) {
          logInfo("nixDataModule", "execWeb3.getRecentEvents() - accounts: " + JSON.stringify(Object.keys(accounts)));
        }
        for (let collection of Object.keys(tokens)) {
          logInfo("nixDataModule", "execWeb3.getRecentEvents() - tokens: " + collection + " - " + Object.keys(tokens[collection]));
        }
        return { nixTokens, nixOrders, nixTrades, accounts, tokens };
      }

      async function syncCollections(erc721Helper, updates, blockNumber, timestamp) {
        // logInfo("nixDataModule", "execWeb3.syncCollections()");
        const collectionsToSyncHash = {};
        for (const [address, collectionConfig] of Object.entries(store.getters['collectionData/collectionsConfig'])) {
          if (collectionConfig.chainId == store.getters['connection/network'].chainId) {
            if (updates.tokens[address]) {
              collectionsToSyncHash[address] = true;
            } else if (state.collections[collectionConfig.chainId + '.' + collectionConfig.address] == null) {
              collectionsToSyncHash[collectionConfig.address] = true;
            }
          }
        }
        const collectionsToSync = Object.keys(collectionsToSyncHash);
        if (collectionsToSync.length > 0) {
          const enumerableBatchSize = 1000;
          const scanBatchSize = 5000;
          let tokenInfo = null;
          try {
            tokenInfo = await erc721Helper.tokenInfo(collectionsToSync);
            for (let i = 0; i < tokenInfo[0].length; i++) {
              const tokenType = tokenInfo[0][i].toNumber();
              let symbol = null;
              let name = null;
              let totalSupply = null;
              if ((tokenType & MASK_ERC721) == MASK_ERC721) {
                if ((tokenType & MASK_ERC721METADATA) == MASK_ERC721METADATA) {
                  symbol = tokenInfo[1][i];
                  name = tokenInfo[2][i];
                }
                if ((tokenType & MASK_ERC721ENUMERABLE) == MASK_ERC721ENUMERABLE) {
                  totalSupply = tokenInfo[3][i].toString();
                }
              }
              commit('newCollection', {
                chainId: store.getters['connection/network'].chainId,
                address: collectionsToSync[i],
                symbol: symbol,
                name: name,
                totalSupply: totalSupply,
              });
            }
            for (let i = 0; i < tokenInfo[0].length; i++) {
              const tokenType = tokenInfo[0][i].toNumber();
              if ((tokenType & MASK_ERC721) == MASK_ERC721) {
                const collection = state.collections[store.getters['connection/network'].chainId + '.' + collectionsToSync[i]];
                if (!collection || Object.keys(collection.tokens) == 0) {
                  if ((tokenType & MASK_ERC721ENUMERABLE) == MASK_ERC721ENUMERABLE) {
                    logInfo("nixDataModule", "execWeb3.syncCollections() - Initial sync: " + collectionsToSync[i] + " with ERC721Enumerable");
                    const totalSupply = tokenInfo[3][i].toString();
                    for (let j = 0; j < totalSupply; j += enumerableBatchSize) {
                      const to = (j + enumerableBatchSize > totalSupply) ? totalSupply : j + enumerableBatchSize;
                      const ownersInfo = await erc721Helper.ownersByEnumerableIndex(collectionsToSync[i], j, to);
                      const owners = {};
                      for (let k = 0; k < ownersInfo[0].length; k++) {
                        const tokenId = ownersInfo[0][k].toString();
                        owners[tokenId] = { tokenId: tokenId, owner: ownersInfo[1][k] };
                      }
                      const tokens = {};
                      for (const [tokenId, owner] of Object.entries(owners)) {
                        tokens[tokenId] = { tokenId: tokenId, owner: owner.owner, tokenURI: null, metadataRetrieved: false, traits: [], image: null };
                      }
                      commit('newCollectionTokens', {
                        chainId: store.getters['connection/network'].chainId,
                        address: collectionsToSync[i],
                        blockNumber: blockNumber,
                        timestamp: timestamp,
                        tokens: tokens,
                      });
                    }
                  } else {
                    logInfo("nixDataModule", "execWeb3.syncCollections() - Initial sync: " + collectionsToSync[i] + " without ERC721Enumerable");
                    const scanFrom = 0;
                    const scanTo = 6969;
                    var searchTokenIds = generateRange(parseInt(scanFrom), (parseInt(scanTo) - 1), 1);
                    for (let j = 0; j < searchTokenIds.length; j += scanBatchSize) {
                      const batch = searchTokenIds.slice(j, parseInt(j) + scanBatchSize);
                      const ownersInfo = await erc721Helper.ownersByTokenIds(collectionsToSync[i], batch);
                      const owners = {};
                      for (let k = 0; k < ownersInfo[0].length; k++) {
                        if (ownersInfo[0][k]) {
                          const tokenId = batch[k].toString();
                          owners[tokenId] = { tokenId: tokenId, owner: ownersInfo[1][k] };
                        }
                      }
                      const tokens = {};
                      for (const [tokenId, owner] of Object.entries(owners)) {
                        tokens[tokenId] = { tokenId: tokenId, owner: owner.owner, tokenURI: null, metadataRetrieved: false, traits: [], image: null };
                      }
                      commit('newCollectionTokens', {
                        chainId: store.getters['connection/network'].chainId,
                        address: collectionsToSync[i],
                        blockNumber: blockNumber,
                        timestamp: timestamp,
                        tokens: tokens,
                      });
                    }
                  }
                } else {
                  var searchTokenIds = Object.keys(updates.tokens[collectionsToSync[i]]);
                  logInfo("nixDataModule", "execWeb3.syncCollections() - Incremental sync: " + collectionsToSync[i] + " - " + JSON.stringify(searchTokenIds));
                  for (let j = 0; j < searchTokenIds.length; j += scanBatchSize) {
                    const batch = searchTokenIds.slice(j, parseInt(j) + scanBatchSize);
                    const ownersInfo = await erc721Helper.ownersByTokenIds(collectionsToSync[i], batch);
                    const owners = {};
                    for (let k = 0; k < ownersInfo[0].length; k++) {
                      if (ownersInfo[0][k]) {
                        const tokenId = batch[k].toString();
                        owners[tokenId] = { tokenId: tokenId, owner: ownersInfo[1][k] };
                      }
                    }
                    const tokens = {};
                    for (const [tokenId, owner] of Object.entries(owners)) {
                      tokens[tokenId] = { tokenId: tokenId, owner: owner.owner, tokenURI: null };
                    }
                    commit('newCollectionTokens', {
                      chainId: store.getters['connection/network'].chainId,
                      address: collectionsToSync[i],
                      blockNumber: blockNumber,
                      timestamp: timestamp,
                      tokens: tokens,
                    });
                  }
                }
              }
            }
          } catch (e) {
            logError("nixDataModule", "execWeb3.syncCollections() - ERROR - Not ERC-721?: " + e);
          }
        }
      }

      // Sync Nix Tokens based on new Token, and new Orders on existing Tokens
      async function syncNixTokens(provider, nix, nixHelper, erc721Helper, weth, updates, blockNumber, timestamp) {
        // logInfo("nixDataModule", "execWeb3.syncNixTokens() - nixTokens: " + JSON.stringify(Object.keys(updates.nixTokens)));
        // for (let collection of Object.keys(updates.nixOrders)) {
        //   logInfo("nixDataModule", "execWeb3.syncNixTokens() - nixOrders: " + collection + " - " + Object.keys(updates.nixOrders[collection]));
        // }
        const tokensLength = (await nix.getLengths())[0].toNumber();
        const tokenIndexHash = {};
        for (let i = 0; i < tokensLength; i++) {
          if (updates.nixTrades[i]) {
            tokenIndexHash[i] = true;
          } else if (!(i in state.nixTokens)) {
            tokenIndexHash[i] = true;
          } else {
            if (state.nixTokens[i].token in updates.nixOrders) {
              tokenIndexHash[i] = true;
            }
          }
        }
        const tokenIndices = Object.keys(tokenIndexHash);
        var tokensData = [];
        if (tokenIndices.length > 0) {
          logInfo("nixDataModule", "execWeb3.syncNixOrders() - Refreshing Nix Tokens: " + JSON.stringify(tokenIndices));
          const tokens = await nixHelper.getTokens(tokenIndices);
          for (let i = 0; i < tokens[0].length; i++) {
            const token = tokens[0][i];
            const ordersLength = tokens[1][i].toNumber();
            const executed = tokens[2][i].toNumber();
            const volumeToken = tokens[3][i].toNumber();
            const volumeWeth = tokens[4][i];
            const averageWeth = volumeWeth  > 0 ? volumeWeth.div(volumeToken) : null;
            let tokenInfo = null;
            let symbol = null;
            let name = null;
            let totalSupply = null;
            try {
              tokenInfo = await erc721Helper.tokenInfo([token]);
              const tokenType = tokenInfo[0][0].toNumber();
              if ((tokenType & MASK_ERC721) == MASK_ERC721) {
                if ((tokenType & MASK_ERC721METADATA) == MASK_ERC721METADATA) {
                  symbol = tokenInfo[1][0];
                  name = tokenInfo[2][0];
                }
                if ((tokenType & MASK_ERC721ENUMERABLE) == MASK_ERC721ENUMERABLE) {
                  totalSupply = tokenInfo[3][0].toNumber();
                }
              }
            } catch (e) {
            }
            commit('updateNixToken', {
              tokenIndex: tokenIndices[i],
              token: token,
              symbol: symbol,
              name: name,
              totalSupply: totalSupply,
              ordersLength: ordersLength,
              executed: executed,
              volumeToken: volumeToken,
              volumeWeth: volumeWeth,
              averageWeth: averageWeth,
              orders: {},
            });
          }
        }
      }

      async function syncNixOrders(provider, nix, nixHelper, weth, updates, blockNumber, timestamp) {
        // for (let collection of Object.keys(updates.nixOrders)) {
        //   logInfo("nixDataModule", "execWeb3.syncNixOrders() - nixOrders: " + collection + " - " + Object.keys(updates.nixOrders[collection]));
        // }
        // logInfo("nixDataModule", "execWeb3.syncNixOrders() - accounts: " + JSON.stringify(Object.keys(updates.accounts)));
        const tokenIndices = Object.keys(state.nixTokens);
        for (let i = 0; i < tokenIndices.length; i++) {
          const nixToken = state.nixTokens[tokenIndices[i]];
          const token = nixToken.token;
          const ordersIndexHash = {};
          if (token in updates.nixOrders) {
            for (let j = 0; j < nixToken.ordersLength; j++) {
              if (updates.nixOrders[token][j]) {
                ordersIndexHash[j] = true;
              } else if (!(j in nixToken.orders)) {
                ordersIndexHash[j] = true;
              }
            }
          }
          // console.log(JSON.stringify(nixToken));
          for (let j = 0; j < nixToken.ordersLength; j++) {
            const order = nixToken.orders[j];
            if (order) {
              // console.log(j + " " + JSON.stringify(order));
              if (order.maker in updates.accounts) {
                ordersIndexHash[j] = true;
              }
            } else {
              ordersIndexHash[j] = true;
            }
          }

          const orderIndices = Object.keys(ordersIndexHash);
          if (orderIndices.length > 0) {
            logInfo("nixDataModule", "execWeb3.syncNixOrders() - Refreshing Nix Orders: " + JSON.stringify(orderIndices));
            const orders = await nixHelper.getOrders(token, orderIndices);
            const ordersData = [];
            for (let j = 0; j < orders[0].length; j++) {
              const maker = orders[0][j];
              const taker = orders[1][j] == ADDRESS0 ? null : orders[1][j];
              const tokenIds = orders[2][j] == null ? null : orders[2][j].map((x) => { return x.toString(); });
              const price = orders[3][j];
              const data = orders[4][j];
              const buyOrSell = data[0].toNumber();
              const anyOrAll = data[1].toNumber();
              const expiry = data[2].toNumber();
              const tradeCount = data[3].toNumber();
              const tradeMax = data[4].toNumber();
              const royaltyFactor = data[5].toNumber();
              const orderStatus = data[6].toNumber();
              ordersData.push({ orderIndex: orderIndices[j], maker: maker, taker: taker, tokenIds: tokenIds, price: price, buyOrSell: buyOrSell,
                anyOrAll: anyOrAll, expiry: expiry, tradeCount: tradeCount, tradeMax: tradeMax, royaltyFactor: royaltyFactor,
                orderStatus: orderStatus });
            }
            commit('updateNixTokenOrders', {
              tokenIndex: tokenIndices[i],
              token: token,
              orders: ordersData,
            });
          }
        }
      }

      async function syncNixTrades(provider, nix, nixHelper, erc721, weth, updates, blockNumber, timestamp) {

        // event OrderExecuted(address indexed token, uint indexed orderIndex, uint indexed tradeIndex, uint[] tokenIds);
        // TODO - handle removed: true
        async function getOrderExecutedTransaction(tradeIndex, blockNumber, nix) {
          // logInfo("nixDataModule", "syncNixTrades.getOrderExecutedTransaction(" + tradeIndex + ", " + blockNumber + ")");
          let eventFilter = nix.filters.OrderExecuted(null, null, tradeIndex);
          const timestamp = (await provider.getBlock(blockNumber)).timestamp;
          let events = await nix.queryFilter(eventFilter, blockNumber, blockNumber);
          for (let j = 0; j < events.length; j++) {
            const event = events[j];
            const parsedLog = nix.interface.parseLog(event);
            const decodedEventLog = nix.interface.decodeEventLog(parsedLog.eventFragment.name, event.data, event.topics);
            return {
              address: event.address,
              txHash: event.transactionHash,
              txIndex: event.transactionIndex,
              logIndex: event.logIndex,
              blockNumber: event.blockNumber,
              timestamp: timestamp,
              removed: event.removed,
              eventName: parsedLog.eventFragment.name,
              token: decodedEventLog[0],
              orderIndex: decodedEventLog[1].toNumber(),
              tradeIndex: decodedEventLog[2].toNumber(),
              tokenIds: decodedEventLog[3].map((x) => { return x.toNumber(); }),
            };
          }
          return null;
        }

        async function getOrderExecutedEvents(txHash) {
          const results = [];
          const txData = await provider.getTransaction(txHash);
          // console.log("txData: " + JSON.stringify(txData, null, 2));
          const txReceipt = await provider.getTransactionReceipt(txHash);
          for (let j = 0; j < txReceipt.logs.length; j++) {
            const log = txReceipt.logs[j];
            if (log.address == nix.address) {
              const parsedLog = nix.interface.parseLog(log);
              try {
                const decodedEventLog = nix.interface.decodeEventLog(parsedLog.eventFragment.name, log.data, log.topics);
                if (parsedLog.eventFragment.name == 'OrderExecuted') {
                  const functionData = nix.interface.decodeFunctionData('executeOrders', txData.data);
                  // console.log("functionData: " + JSON.stringify(functionData.map((x) => { return x.toString(); }), null, 2));
                  results.unshift({
                    logIndex: log.logIndex,
                    address: log.address,
                    name: 'executeOrders',
                    description: 'executeOrders(' + JSON.stringify(functionData[0].map((x) => { return x.toString(); })) +
                      ', ' + JSON.stringify(functionData[1].map((x) => { return x.toString(); })) +
                      ', ' + JSON.stringify(functionData[2].map((x) => { return x.toString(); })) +
                      ', ' + ethers.utils.formatEther(functionData[3]) +
                      ', ' + functionData[4] +
                      ', ' + functionData[5].replace(ADDRESS0, 'null') + ')',
                    token: decodedEventLog[0],
                    orderIndex: decodedEventLog[1].toNumber(),
                    tradeIndex: decodedEventLog[2].toNumber(),
                    tokenIds: decodedEventLog[3].map((x) => { return x.toNumber(); }),
                  });
                  results.push({
                    logIndex: log.logIndex,
                    address: log.address,
                    name: 'OrderExecuted',
                    description: 'Nix.OrderExecuted(' + decodedEventLog[0].substring(0, 10) + '...' +
                      ', ' + decodedEventLog[1].toNumber() +
                      ', ' + decodedEventLog[2].toNumber() +
                      ', [' + decodedEventLog[3].map((x) => { return x.toNumber(); }) +
                      '])',
                    token: decodedEventLog[0],
                    orderIndex: decodedEventLog[1].toNumber(),
                    tradeIndex: decodedEventLog[2].toNumber(),
                    tokenIds: decodedEventLog[3].map((x) => { return x.toNumber(); }),
                  });
                } else if (parsedLog.eventFragment.name == 'ThankYou') {
                  results.push({
                    logIndex: log.logIndex,
                    address: log.address,
                    name: 'ThankYou',
                    description: 'Nix.ThankYou(' + ethers.utils.formatEther(decodedEventLog[0]) + ')',
                    tip: ethers.utils.formatEther(decodedEventLog[0]),
                  });
                } else {
                  console.log("TODO: " + parsedLog.eventFragment.name);
                }
              } catch (e) {
              }
            } else if (log.address == weth.address) {
              try {
                const parsedLog = weth.interface.parseLog(log);
                const decodedEventLog = weth.interface.decodeEventLog(parsedLog.eventFragment.name, log.data, log.topics);
                if (parsedLog.eventFragment.name == 'Transfer') {
                  results.push({
                    logIndex: log.logIndex,
                    address: log.address,
                    name: 'Transfer',
                    description: 'WETH.Transfer(' + decodedEventLog[0].substring(0, 10) + '...' +
                      ', ' + decodedEventLog[1].substring(0, 10) + '...' +
                      ', ' + ethers.utils.formatEther(decodedEventLog[2]) +
                      ')',
                    from: decodedEventLog[0],
                    to: decodedEventLog[1],
                    tokens: decodedEventLog[2].toString(),
                  });
                } else {
                  console.log("TODO: " + parsedLog.eventFragment.name);
                }
              } catch (e) {
              }
            } else {
              try {
                const parsedLog = erc721.interface.parseLog(log);
                const decodedEventLog = erc721.interface.decodeEventLog(parsedLog.eventFragment.name, log.data, log.topics);
                if (parsedLog.eventFragment.name == 'Transfer') {
                  results.push({
                    logIndex: log.logIndex,
                    address: log.address,
                    name: 'Transfer',
                    description: log.address.substring(0, 10) + '.Transfer(' + decodedEventLog[0].substring(0, 10) + '...' +
                      ', ' + decodedEventLog[1].substring(0, 10) + '...' +
                      ', ' + decodedEventLog[2].toNumber() +
                      ')',
                    from: decodedEventLog[0],
                    to: decodedEventLog[1],
                    tokenId: decodedEventLog[2].toString(),
                  });
                } else if (parsedLog.eventFragment.name == 'Approval') {
                  results.push({
                    logIndex: log.logIndex,
                    address: log.address,
                    name: 'Approval',
                    description: log.address.substring(0, 10) + '.Approval(' + decodedEventLog[0].substring(0, 10) + '...' +
                      ', ' + decodedEventLog[1].substring(0, 10) + '...' +
                      ', ' + decodedEventLog[2].toNumber() +
                      ')',
                    owner: decodedEventLog[0],
                    approved: decodedEventLog[1],
                    tokenId: decodedEventLog[2].toString(),
                  });
                } else {
                  console.log("TODO: " + parsedLog.eventFragment.name);
                }
              } catch (e) {
              }
            }
          }
          return results;
        }

        const tradesLength = (await nix.getLengths())[1].toNumber();
        // logInfo("nixDataModule", "execWeb3.syncNixTrades() - tradesLength: " + tradesLength);
        var tradeData = [];
        const tradeIndexHash = {};
        for (let i = 0; i < tradesLength; i++) {
          if (updates.nixTrades[i]) {
            tradeIndexHash[i] = true;
          } else if (!(i in state.nixTrades)) {
            tradeIndexHash[i] = true;
          }
        }
        const tradeIndices = Object.keys(tradeIndexHash);
        logInfo("nixDataModule", "execWeb3.syncNixTrades() - tradeIndices: " + JSON.stringify(tradeIndices));
        if (tradeIndices.length > 0) {
          // logInfo("nixDataModule", "execWeb3.syncNixOrders() - Refreshing Nix Trades: " + JSON.stringify(tradeIndices));
          const trades = await nixHelper.getTrades(tradeIndices);
          for (let i = 0; i < trades[0].length; i++) {
            const tradeIndex = parseInt(tradeIndices[i]);
            const taker = trades[0][i];
            const royaltyFactor = trades[1][i].toNumber();
            const blockNumber = trades[2][i].toNumber();
            const orders = trades[3][i];
            const tx = await getOrderExecutedTransaction(tradeIndex, blockNumber, nix);
            // logInfo("nixDataModule", "execWeb3.syncNixTrades() - tradeIndex: " + tradeIndex);
            if (tx) {
              const orderExecutedEvents = await getOrderExecutedEvents(tx.txHash);
              tradeData.push({
                tradeIndex: tradeIndex,
                taker: taker,
                royaltyFactor: royaltyFactor,
                blockNumber: blockNumber,
                orders: orders,
                txHash: tx.txHash,
                events: orderExecutedEvents,
              });
            }
            commit('updateNixTrades', tradeData);
          }
        }
      }

      // Sync Nix Tokens based on new Token, and new Orders on existing Tokens
      async function syncWeth(provider, nix, erc721Helper, weth, updates, blockNumber, timestamp) {
        logInfo("nixDataModule", "execWeb3.syncWeth() - accounts: " + JSON.stringify(Object.keys(updates.accounts)));
        const accountsToUpdateHash = {};
        for (const token of Object.values(state.nixTokens)) {
          for (const order of Object.values(token.orders)) {
            if (!state.wethData[order.maker]) {
              accountsToUpdateHash[order.maker] = true;
            }
          }
        }
        for (const account of Object.keys(updates.accounts)) {
          accountsToUpdateHash[account] = true;
        }
        const accountsToUpdate = Object.keys(accountsToUpdateHash);
        const wethInfo = await erc721Helper.getERC20Info(weth.address, accountsToUpdate, nix.address);
        const wethData = {};
        for (let i = 0; i < wethInfo[0].length; i++) {
          wethData[accountsToUpdate[i]] = { account: accountsToUpdate[i], balance: wethInfo[0][i], allowance: wethInfo[1][i] };
        }
        commit('updateWETHData', {
          chainId: store.getters['connection/network'].chainId,
          blockNumber: blockNumber,
          timestamp: timestamp,
          wethData: wethData,
        });
      }

      async function syncTraitsAndImages(updates) {
        logInfo("nixDataModule", "syncTraitsAndImages()" + JSON.stringify(updates));

        for (const [chainIdAddress, collection] of Object.entries(store.getters['nixData/collections'])) {
          // console.log("Processing " + chainIdAddress + JSON.stringify(collection));
          // for (const [tokenId, token] of Object.entries(collection.tokens)) {
          //   console.log("  Processing " + tokenId + " " + JSON.stringify(token));
          // }

          const tokenIds = Object.values(collection.tokens).filter(token => token.metadataRetrieved === false).map(a => a.tokenId);

          const BATCHSIZE = 30; // Max 30
          const DELAYINMILLIS = 500;
          const delay = ms => new Promise(res => setTimeout(res, ms));
          const traitsAndImages = {};
          for (let i = 0; i < tokenIds.length; i += BATCHSIZE) {
            let url = "https://testnets-api.opensea.io/api/v1/assets?asset_contract_address=" + collection.address + "\&order_direction=desc\&limit=50\&offset=0";
            for (let j = i; j < i + BATCHSIZE && j < tokenIds.length; j++) {
              url = url + "&token_ids=" + tokenIds[j];
            }
            console.log("url: " + JSON.stringify(url));
            const data = await fetch(url).then(response => response.json());
            if (data.assets && data.assets.length > 0) {
              for (let assetIndex = 0; assetIndex < data.assets.length; assetIndex++) {
                const asset = data.assets[assetIndex];
                traitsAndImages[asset.token_id] = { metadataRetrieved: true, traits: asset.traits, image: asset.image_url };
              }
            }
            await delay(DELAYINMILLIS);
          }
          // console.log("traitsAndImages: " + JSON.stringify(traitsAndImages));
          commit('updateTraitsAndImages', {
            chainId: store.getters['connection/network'].chainId,
            address: collection.address,
            traitsAndImages: traitsAndImages,
          });
        }
      }

      function recalculate() {
        console.log("Recalculate");
        for (const nixToken of Object.values(state.nixTokens)) {
          // console.log(JSON.stringify(nixToken.orders));
          for (const collection of Object.values(state.collections)) {
            if (collection.address == nixToken.token) {
                const tokenIdsByOwners = {};
                // console.log(JSON.stringify(collection));
                for (const [tokenId, token] of Object.entries(collection.tokens)) {
                  // console.log(JSON.stringify(token));
                  if (token.owner in tokenIdsByOwners) {
                    tokenIdsByOwners[token.owner][tokenId] = true;
                    // tokenIdsByOwners[token.owner].push(tokenId);
                  } else {
                    tokenIdsByOwners[token.owner] = {};
                    tokenIdsByOwners[token.owner][tokenId] = true;
                  }
                }
                // console.log(JSON.stringify(tokenIdsByOwners));

                // Buy Any
                // - [1, 2, 3]
                // - [] -> stored in globalBuys
                //
                // Buy All - Don't have to own. Must have single owner
                // - [1, 2, 3]
                //
                // Sell Any - Must own
                // - [1, 2, 3]
                // - []
                //
                // Sell All - Must own
                // - [1, 2, 3]

                // console.log(JSON.stringify(state.wethData));
                // {
                //   "0x000001f568875F378Bf6d170B790967FE429C81A":{"account":"0x000001f568875F378Bf6d170B790967FE429C81A","balance":{"type":"BigNumber","hex":"0x131b32d4a684e000"},"allowance":{"type":"BigNumber","hex":"0x06aaf7c8516d0c0000"}},
                //   "0x9a36E8C0cc2B57d732d5f0DB237D8601762970A4":{"account":"0x9a36E8C0cc2B57d732d5f0DB237D8601762970A4","balance":{"type":"BigNumber","hex":"0x455c7684fb670000"},"allowance":{"type":"BigNumber","hex":"0x056900d33ca7fc0000"}},
                //   "0x07fb31ff47Dc15f78C5261EEb3D711fb6eA985D1":{"account":"0x07fb31ff47Dc15f78C5261EEb3D711fb6eA985D1","balance":{"type":"BigNumber","hex":"0x0dc7e2f5fddb234e"},"allowance":{"type":"BigNumber","hex":"0x869d529b714a0000"}},
                //   "0x0457F40b63aF465a7a31efCD060095679491a248":{"account":"0x0457F40b63aF465a7a31efCD060095679491a248","balance":{"type":"BigNumber","hex":"0x0186cc6acd4b0000"},"allowance":{"type":"BigNumber","hex":"0x00"}}
                // }

                const globalBuys = {};
                for (const [orderId, order] of Object.entries(nixToken.orders)) {
                  // {"orderIndex":"3","maker":"0x07fb31ff47Dc15f78C5261EEb3D711fb6eA985D1","taker":null,
                  // "tokenIds":["881","947","1361","1479"],"price":{"type":"BigNumber","hex":"0x6a94d74f430000"},
                  // "buyOrSell":1,"anyOrAll":0,"expiry":1672491599,"tradeCount":2,"tradeMax":7,"royaltyFactor":100,
                  // "orderStatus":0}
                  // console.log(JSON.stringify(order));
                  // console.log(JSON.stringify(state.wethData[order.maker]));
                  const makersTokenIds = tokenIdsByOwners[order.maker] == null ? null : Object.keys(tokenIdsByOwners[order.maker]);
                  const expiryString = (order.expiry == 0) ? "No expiry" : (order.expiry == 1) ? "Disabled" : new Date(order.expiry * 1000).toUTCString();
                  const wethBalanceString = state.wethData[order.maker] == null || state.wethData[order.maker].balance == null ? null : ethers.utils.formatEther(state.wethData[order.maker].balance);
                  const wethAllowanceString = state.wethData[order.maker] == null || state.wethData[order.maker].allowance == null ? null : ethers.utils.formatEther(state.wethData[order.maker].allowance);
                  console.log(order.orderIndex + ' ' + BUYORSELLSTRING[order.buyOrSell] + ' ' + ANYORALLSTRING[order.anyOrAll] +
                    " - maker: " + order.maker + ", taker: " + order.taker + ", tokenIds: " + JSON.stringify(order.tokenIds) +
                    ", price: " + ethers.utils.formatEther(order.price) +
                    ", expiry: " + expiryString +
                    ", tradeCount: " + order.tradeCount +
                    ", tradeMax: " + order.tradeMax +
                    ", royaltyFactor: " + order.royaltyFactor +
                    ", orderStatus: " + ORDERSTATUSSTRING[order.orderStatus] +
                    ", makersTokenIds: " + JSON.stringify(makersTokenIds) +
                    ", wethBalance: " + JSON.stringify(wethBalanceString) +
                    ", wethAllowance: " + JSON.stringify(wethAllowanceString)
                  );


                  if (order.orderStatus == ORDERSTATUS_EXECUTABLE) {
                    if (order.buyOrSell == BUYSELL.BUY) {
                      if (order.anyOrAll == ANYORALL.ANY) {
                        if (order.tokenIds.length == 0) {
                          console.log("  Global Buy Any: " + order.maker);
                          globalBuys[order.orderIndex] = order;
                        } else {
                          for (let tokenIdIndex = 0; tokenIdIndex < order.tokenIds.length; tokenIdIndex++) {
                            console.log(order.tokenIds[tokenIdIndex]);
                          }
                        }
                  //       console.log("Buy Any: " + order.maker);
                      } else {
                  //       console.log("Buy All: " + order.maker);
                      }
                    } else {
                  //     if (order.anyOrAll == ANYORALL.ANY) {
                  //       console.log("Sell Any maker: " + order.maker + ", owns: " + JSON.stringify(tokenIdsByOwners[order.maker]));
                  //     } else {
                  //       console.log("Sell All maker: " + order.maker + ", owns: " + JSON.stringify(tokenIdsByOwners[order.maker]));
                  //     }
                    }
                  }
                }
                console.log("globalBuys: " + JSON.stringify(globalBuys));
            }
          }
        }
      }

      logDebug("nixDataModule", "execWeb3() start[" + count + ", " + listenersInstalled + ", " + JSON.stringify(rootState.route.params) + "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        logInfo("nixDataModule", "execWeb3() executing[" + count + ", " + JSON.stringify(rootState.route.params) + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("nixDataModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        const connected = store.getters['connection/connected'];
        const block = store.getters['connection/block'];
        const blockUpdated = store.getters['connection/blockUpdated'];
        if (connected && blockUpdated) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const blockNumber = block ? block.number : await provider.getBlockNumber();
          const timestamp = block ? block.timestamp : await provider.getBlock().timestamp;
          logDebug("nixDataModule", "execWeb3() count: " + count + ", blockUpdated: " + blockUpdated + ", blockNumber: " + blockNumber + ", listenersInstalled: " + listenersInstalled + ", rootState.route.params: " + JSON.stringify(rootState.route.params) + "]");
          const network = store.getters['connection/network'];
          const weth = new ethers.Contract(network.wethAddress, WETHABI, provider);
          const nix = new ethers.Contract(network.nixAddress, NIXABI, provider);
          const nixHelper = new ethers.Contract(network.nixHelperAddress, NIXHELPERABI, provider);
          const erc721Helper = new ethers.Contract(network.erc721HelperAddress, ERC721HELPERABI, provider);
          const erc721 = new ethers.Contract(TESTTOADZADDRESS, TESTTOADZABI, provider);

          const updates = await getRecentEvents(provider, nix, erc721, weth, blockNumber);
          await syncNixTokens(provider, nix, nixHelper, erc721Helper, weth, updates, blockNumber, timestamp);
          await syncCollections(erc721Helper, updates, blockNumber, timestamp);
          await syncNixOrders(provider, nix, nixHelper, weth, updates, blockNumber, timestamp);
          await syncWeth(provider, nix, erc721Helper, weth, updates, blockNumber, timestamp);
          await syncTraitsAndImages(updates);
          await syncNixTrades(provider, nix, nixHelper, erc721, weth, updates, blockNumber, timestamp);
          recalculate();

          if (!state.nixRoyaltyEngine) {
            const nixRoyaltyEngine = await nix.royaltyEngine();
            commit('updateNixRoyaltyEngine', nixRoyaltyEngine);
          }

          // TODO - Capture relevant events, and refresh only the updated orders & trades data
          // Install listeners
          if (!listenersInstalled) {
            logDebug("nixDataModule", "execWeb3() installing listener");
            nix.on("*", (event) => {
              // console.log("nix - event: ", JSON.stringify(event));
              logInfo("nixDataModule", "nix - event: " + JSON.stringify(event));
            });
          }
        }
        commit('updateExecuting', false);
        logDebug("nixDataModule", "execWeb3() end[" + count + "]");
      } else {
        logDebug("nixDataModule", "execWeb3() already executing[" + count + "]");
      }
    },
  },
  // mounted() {
  //   logInfo("nixDataModule", "mounted() $route: " + JSON.stringify(this.$route.params));
  // },
};
