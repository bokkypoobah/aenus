const IPCs = {
  template: `
    <div class="m-0 p-0">
      <b-card no-body no-header class="border-0">
        <b-card no-body class="p-0 mt-1">

          <!--
          <b-tabs card align="left" no-body v-model="settings.tabIndex" active-tab-class="m-0 p-0">
            <b-tab disabled title="Transfers (WIP)" @click="updateURL('transfers');">
            </b-tab>
            <b-tab title="Collection" @click="updateURL('collection');">
            </b-tab>
            <b-tab title="Mint Monitor" @click="updateURL('mintmonitor');">
            </b-tab>
          </b-tabs>
          -->

          <b-card no-body no-header :img-src="settings.tabIndex == 1 && collectionInfo && collectionInfo.metadata && collectionInfo.metadata.bannerImageUrl || ''" img-top class="m-0 p-0 border-0">

            <b-card-body class="m-0 p-1">
              <!-- Main Toolbar -->
              <div class="d-flex flex-wrap m-0 p-0">
                <div v-if="settings.tabIndex == 1" class="mt-1">
                  <b-button size="sm" :pressed.sync="settings.collection.showFilter" variant="link" v-b-popover.hover.top="'Show collection filter'"><span v-if="settings.collection.showFilter"><b-icon-layout-sidebar-inset shift-v="+1" font-scale="1.0"></b-icon-layout-sidebar-inset></span><span v-else><b-icon-layout-sidebar shift-v="+1" font-scale="1.0"></b-icon-layout-sidebar></span></b-button>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1" style="width: 380px;">
                  <b-form-input type="text" size="sm" :value="filter.collection.address" @change="updateCollection('filterUpdate', { collection: { address: $event } })" :disabled="sync.inProgress" debounce="600" v-b-popover.hover.top="'Collection address'" placeholder="{ERC-721 address}"></b-form-input>
                </div>
                <div class="mt-1 pl-1">
                  <b-button size="sm" @click="updateCollection('sync', {})" :disabled="sync.inProgress" variant="primary">Sync IPC Collection</b-button>
                </div>
                <div class="mt-1 flex-grow-1">
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1">
                  <b-button size="sm" :pressed.sync="settings.collection.showInfo" variant="link" v-b-popover.hover.top="'Show collection info'"><span v-if="settings.collection.showInfo"><b-icon-info-circle-fill shift-v="+1" font-scale="1.0"></b-icon-info-circle-fill></span><span v-else><b-icon-info-circle shift-v="+1" font-scale="1.0"></b-icon-info-circle></span></b-button>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1">
                  <b-badge variant="light">{{ collectionInfo && collectionInfo.name || '' }}</b-badge>
                </div>

                <div class="mt-1 flex-grow-1">
                </div>

                <div v-if="settings.tabIndex == 0 || settings.tabIndex == 1 || settings.tabIndex == 2" class="mt-2" style="width: 200px;">
                  <b-progress v-if="sync.inProgress" height="1.5rem" :max="sync.total" :label="'((sync.completed/sync.total)*100).toFixed(2) + %'" show-progress :animated="sync.inProgress" :variant="sync.inProgress ? 'success' : 'secondary'" v-b-popover.hover.top="'Click on the Sync(ing) button to (un)pause'">
                    <b-progress-bar :value="sync.completed">
                      {{ sync.completed + '/' + sync.total + ' ' + ((sync.completed / sync.total) * 100).toFixed(0) + '%' }}
                    </b-progress-bar>
                  </b-progress>
                </div>
                <div v-if="settings.tabIndex == 1 || settings.tabIndex == 2" class="ml-0 mt-1">
                  <b-button v-if="sync.inProgress" size="sm" @click="halt" variant="link" v-b-popover.hover.top="'Halt'"><b-icon-stop-fill shift-v="+1" font-scale="1.0"></b-icon-stop-fill></b-button>
                </div>

                <div class="mt-1 flex-grow-1">
                </div>

                <div v-if="settings.tabIndex == 2" class="mt-2 pl-1">
                  <b-link size="sm" :to="getURL" v-b-popover.hover.top="'Share this link for the same search'" ><font size="-1">Share</font></b-link>
                </div>

                <div class="mt-1 flex-grow-1">
                </div>
                <div class="mt-1 pr-1">
                  <b-form-select size="sm" v-model="settings.collection.sortOption" :options="sortOptions" v-b-popover.hover.top="'Yeah. Sort'"></b-form-select>
                </div>
                <div class="mt-1 pr-1">
                  <font size="-2" v-b-popover.hover.top="'Blah'">{{ filteredSortedCollectionTokens.length }}</font>
                </div>
                <div class="mt-1 pr-1">
                  <b-pagination size="sm" v-model="settings.collection.currentPage" :total-rows="filteredCollectionTokens.length" :per-page="settings.collection.pageSize" style="height: 0;"></b-pagination>
                </div>
                <div class="mt-1 pl-1">
                  <b-form-select size="sm" v-model="settings.collection.pageSize" :options="pageSizes" v-b-popover.hover.top="'Page size'"></b-form-select>
                </div>
                <div v-if="settings.tabIndex == 2" class="mt-1 pl-1">
                  <b-form-select size="sm" v-model="settings.activityMaxItems" :options="activityMaxItemsOptions" v-b-popover.hover.top="'Max items to display'"></b-form-select>
                </div>
              </div>

              <!-- Collection -->
              <b-card no-header no-body class="mt-1">
                <b-table small fixed striped :fields="collectionTokensFields" :items="pagedFilteredCollectionTokens" head-variant="light">
                  <template #cell(token_id)="data">
                    {{ data.item.token_id }}
                  </template>
                  <template #cell(owner)="data">
                    <b-button :id="'popover-target-owner-' + data.item.owner + '-' + data.index" variant="link" class="m-0 p-0">
                      {{ getShortName(data.item.owner) }}
                    </b-button>
                    <b-popover :target="'popover-target-owner-' + data.item.owner + '-' + data.index" placement="right">
                      <template #title>{{ getShortName(data.item.owner, 32) }}</template>
                      <b-link :href="'https://opensea.io/' + data.item.owner" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/accounts/' + data.item.owner" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/user/' + data.item.owner + '/items'" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/address/' + data.item.owner" v-b-popover.hover.bottom="'View in etherscan.io'" target="_blank">
                        EtherScan
                      </b-link>
                    </b-popover>
                  </template>
                  <template #cell(name)="data">
                    {{ data.item.name }}
                  </template>
                  <template #cell(details)="data">
                    <font size="-2">
                      <b-row v-for="(attribute, i) in data.item.attributes" v-bind:key="i" class="m-0 p-0">
                        <b-col cols="2" class="my-0 mx-1 py-0 px-1 text-right">{{ attribute.trait_type }}</b-col>
                        <b-col class="my-0 mx-1 py-0 px-1 "><b>{{ attribute.value }}</b></b-col>
                      </b-row>
                    </font>
                    <!--
                    {{ ipcMap.race[data.item.info.race] }}
                    {{ JSON.stringify(ipcMap) }}
                    <br />
                    {{ JSON.stringify(data.item.info) }}
                    -->
                  </template>
                  <!--
                  <template #cell(attribute_seed)="data">
                    {{ data.item.attribute_seed }}
                  </template>
                  <template #cell(dna)="data">
                    {{ data.item.dna }}
                  </template>
                  <template #cell(experience)="data">
                    {{ data.item.experience }}
                  </template>
                  -->
                  <template #cell(birth)="data">
                    {{ formatTimestamp(data.item.birth) }}
                  </template>

                </b-table>
              </b-card>

            </b-card-body>
          </b-card>
        </b-card>
      </b-card>
    </div>
  `,
  props: ['tab', 'blocks', 'search'],
  data: function() {
    return {
      count: 0,
      reschedule: true,

      settings: {
        tabIndex: 50, // TODO: Delete?
        activityMaxItems: 50,
        collection: {
          showInfo: false,
          showFilter: true,
          sortOption: 'idasc',
          pageSize: 100,
          currentPage: 1
        },
      },

      collectionAttributeFilter: {},
      dailyChartSelectedItems: [],

      sortOptions: [
        { value: 'idasc', text: '▲ Id' },
        { value: 'iddsc', text: '▼ Id' },
      ],

      pageSizes: [
        { value: 10, text: '10' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1k' },
        { value: 2500, text: '2.5k' },
        { value: 10000, text: '10k' },
      ],

      scanBlocksOptions: [
        { value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1k' },
        { value: 5000, text: '5k' },
        { value: 10000, text: '10k' },
      ],

      activityMaxItemsOptions: [
        { value: 10, text: '10' },
        { value: 50, text: '50' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1k' },
        { value: 10000, text: '10k' },
      ],

      collectionTokensFields: [
        { key: 'token_id', label: '#', thStyle: 'width: 5%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'owner', label: 'Owner', thStyle: 'width: 15%;'},
        { key: 'name', label: 'Name', thStyle: 'width: 15%;'},
        { key: 'details', label: 'Details', thStyle: 'width: 50%;'},
        { key: 'birth', label: 'Birth', thStyle: 'width: 15%;'},
      ],

      transfersFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'collection', label: 'Collection', thStyle: 'width: 20%;', sortable: true },
        { key: 'tokenId', label: 'Token Id', thStyle: 'width: 20%;', sortable: true },
        { key: 'from', label: 'From', thStyle: 'width: 20%;', sortable: true },
        { key: 'to', label: 'To', thStyle: 'width: 20%;', sortable: true },
        { key: 'txHash', label: 'Tx Hash', sortable: true, thStyle: 'width: 15%;' },
      ],

      collectionAttributeFields: [
        { key: 'select', label: '', thStyle: 'width: 10%;' },
        { key: 'attributeOption', label: 'Attribute' /*, sortable: true*/ },
        { key: 'attributeTotal', label: 'Count', /*sortable: true,*/ thStyle: 'width: 30%;', thClass: 'text-right', tdClass: 'text-right' },
      ],

      mintMonitorCollectionsFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'contract', label: 'Contract', thStyle: 'width: 25%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'mints', label: 'Mints', thStyle: 'width: 5%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'tokens', label: 'Tokens', thStyle: 'width: 65%;' },
      ],

    }
  },
  computed: {
    powerOn() {
      return store.getters['connection/powerOn'];
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    network() {
      return store.getters['connection/network'];
    },
    config() {
      return store.getters['ipcs/config'];
    },
    filter() {
      return store.getters['ipcs/filter'];
    },
    sync() {
      return store.getters['ipcs/sync'];
    },
    collectionInfo() {
      return store.getters['ipcs/collectionInfo'];
    },
    collectionTokens() {
      return store.getters['ipcs/collectionTokens'];
    },
    ensMap() {
      return store.getters['ipcs/ensMap'];
    },
    ipcMap() {
      return IPCLib.IPCMap;
    },
    collectionTokensAttributesWithCounts() {
      const collator = { };
      for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
        for (let attribute of token.attributes) {
            const key = attribute.key;
            const value = attribute.value;
            if (!collator[key]) {
              collator[key] = {};
            }
            if (!collator[key][value]) {
              collator[key][value] = [token.tokenId];
            } else {
              collator[key][value].push(token.tokenId);
            }
        }
      }
      return collator;
    },
    filteredCollectionTokens() {
      let results = [];
      for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
        results.push(token);
      }

      // if (Object.keys(this.collectionAttributeFilter) == 0) {
      //   for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
      //     results.push(token);
      //   }
      // } else {
      //   let selectedTokenIds = [];
      //   for (const [trait, value] of Object.entries(this.collectionAttributeFilter)) {
      //     let thisTraitTokenIds = [];
      //     for (const selectedValue of Object.keys(value)) {
      //       const tokenIds = this.collectionTokensAttributesWithCounts[trait][selectedValue];
      //       thisTraitTokenIds = [...thisTraitTokenIds, ...tokenIds];
      //     }
      //     if (selectedTokenIds.length == 0) {
      //       selectedTokenIds = thisTraitTokenIds;
      //     } else {
      //       selectedTokenIds = selectedTokenIds.filter(tokenId => thisTraitTokenIds.includes(tokenId));
      //     }
      //   }
      //   results = Object.values(selectedTokenIds).map(tokenId => this.collectionTokens[tokenId]);
      // }
      return results;
    },
    filteredSortedCollectionTokens() {
      let results = this.filteredCollectionTokens;
      if (this.settings.collection.sortOption == 'idasc') {
        results.sort((a, b) => a.token_id - b.token_id);
      } else if (this.settings.collection.sortOption == 'iddsc') {
        results.sort((a, b) => b.token_id - a.token_id);
      }
      return results;
    },
    pagedFilteredCollectionTokens() {
      return this.filteredSortedCollectionTokens.slice((this.settings.collection.currentPage - 1) * this.settings.collection.pageSize, this.settings.collection.currentPage * this.settings.collection.pageSize);
    },
    getURL() {
      let url = '/ipcs/mintmonitor/';
      const startBlockNumber = this.filter.startBlockNumber && parseInt(this.filter.startBlockNumber.toString().replace(/,/g, '')) || null;
      const endBlockNumber = this.filter.endBlockNumber && parseInt(this.filter.endBlockNumber.toString().replace(/,/g, '')) || null;
      if (startBlockNumber != null && endBlockNumber != null) {
        if (startBlockNumber == endBlockNumber) {
          url = url + startBlockNumber + '/';
        } else {
          url = url + startBlockNumber + '-' + endBlockNumber + '/';
        }
      } else {
        url = url + '/';
      }
      if (this.filter.searchString != null && this.filter.searchString.length > 0) {
        url = url + this.filter.searchString;
      }
      return url;
    },
  },
  methods: {
    getShortName(address, length = 16) {
      const addressLower = address.toLowerCase();
      try {
        let name = this.ensMap[addressLower];
        if (name != null) {
          name = name.substring(0, length);
        }
        return name;
      } catch (e) {
        return address.substring(0, length);
      }
    },
    formatTimestamp(ts) {
      if (ts != null) {
        return moment.unix(ts).format("YYYY-MM-DD HH:mm:ss");
      }
      return null;
    },
    getSortedTraitsForCollectionTokensAttributes(category) {
      const results = [];
      for (let attributeKey in this.collectionTokensAttributesWithCounts[category]) {
        const c = this.collectionTokensAttributesWithCounts[category][attributeKey];
        results.push({ attributeOption: attributeKey, attributeTotal: c })
      }
      results.sort((a, b) => b.attributeTotal.length - a.attributeTotal.length);
      return results;
    },
    collectionFilterChange(attribute, option) {
      if (!this.collectionAttributeFilter[attribute]) {
        Vue.set(this.collectionAttributeFilter, attribute, {});
      }
      if (this.collectionAttributeFilter[attribute][option]) {
        Vue.delete(this.collectionAttributeFilter[attribute], option);
        if (Object.keys(this.collectionAttributeFilter[attribute]) == 0) {
          Vue.delete(this.collectionAttributeFilter, attribute);
        }
      } else {
        Vue.set(this.collectionAttributeFilter[attribute], option, true);
      }
    },
    updateURL(where) {
      this.$router.push('/ipcs/' + where);
    },
    async updateCollection(syncMode, filterUpdate) {
      store.dispatch('ipcs/updateCollection', { syncMode, filterUpdate });
    },
    async halt() {
      store.dispatch('ipcs/halt');
    },
    async timeoutCallback() {
      logDebug("IPCs", "timeoutCallback() count: " + this.count);
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
    logDebug("IPCs", "beforeDestroy()");
  },
  mounted() {
    logInfo("IPCs", "mounted() $route: " + JSON.stringify(this.$route.params) + ", props['tab']: " + this.tab + ", props['blocks']: " + this.blocks + ", props['search']: " + this.search);
    if (this.tab == "transfers") {
      this.settings.tabIndex = 0;
    } else if (this.tab == "collection") {
      this.settings.tabIndex = 1;
    } else if (this.tab == "mintmonitor") {
      this.settings.tabIndex = 2;
      let startBlockNumber = null;
      let endBlockNumber = null;
      if (this.blocks != null) {
        if (new RegExp('^[0-9,]+$').test(this.blocks)) {
          startBlockNumber = this.blocks;
          endBlockNumber = this.blocks;
        } else if (new RegExp('^[0-9,]+\s*\-\s*[0-9,]+$').test(this.blocks)) {
          startBlockNumber = this.blocks.replace(/\s*\-.*$/, '');
          endBlockNumber = this.blocks.replace(/^.*\-\s*/, '');
        }
        const filterUpdate = {
          startBlockNumber: ethers.utils.commify(parseInt(startBlockNumber)),
          endBlockNumber: ethers.utils.commify(parseInt(endBlockNumber)),
          searchString: this.search,
        };
        setTimeout(function() {
          store.dispatch('ipcs/monitorMints', { syncMode: 'scan', filterUpdate });
        }, 1000);
      }
    }
    this.reschedule = true;
    logDebug("IPCs", "Calling timeoutCallback()");
    this.timeoutCallback();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const ipcsModule = {
  namespaced: true,
  state: {
    filter: {
      collection: {
        address: null, // "0x31385d3520bced94f77aae104b406994d8f2168c",
        startBlockNumber: 4000000,
      },
      searchString: null,
    },
    sync: {
      inProgress: false,
      error: false,
      total: null,
      completed: null,
    },

    collectionInfo: {},
    collectionTokens: {},
    ensMap: {},
    halt: false,
    params: null,
  },
  getters: {
    filter: state => state.filter,
    sync: state => state.sync,
    collectionInfo: state => state.collectionInfo,
    collectionTokens: state => state.collectionTokens,
    ensMap: state => state.ensMap,
    params: state => state.params,
  },
  mutations: {

    // --- updateCollection() ---
    async updateCollection(state, { syncMode, filterUpdate }) {

      async function processSales(data) {
        // const searchForNamesByTokenIds = data.sales
        //   .map(sale => sale.token.tokenId)
        //   .map(tokenId => "0x" + new BigNumber(tokenId, 10).toString(16));
        // const namesByTokenIds = await fetchNamesByTokenIds(searchForNamesByTokenIds);
        // const saleRecords = [];
        // if (!state.sync.error) {
        //   let count = 0;
        //   const chainId = (store.getters['connection/network'] && store.getters['connection/network'].chainId) || 1;
        //   for (const sale of data.sales) {
        //     // if (count == 0) {
        //     //   logInfo("ipcsModule", "mutations.loadSales().processSales() " + new Date(sale.timestamp * 1000).toLocaleString() + " " + (sale.token.name ? sale.token.name : "(null)") + ", price: " + sale.price + ", from: " + sale.from.substr(0, 10) + ", to: " + sale.to.substr(0, 10));
        //     // }
        //     const name = namesByTokenIds[sale.token.tokenId] ? namesByTokenIds[sale.token.tokenId] : sale.token.name;
        //     saleRecords.push({
        //       chainId: chainId,
        //       contract: ENSADDRESS,
        //       tokenId: sale.token.tokenId,
        //       name: name,
        //       from: sale.from,
        //       to: sale.to,
        //       price: sale.price,
        //       timestamp: sale.timestamp,
        //       tokenId: sale.token.tokenId,
        //       txHash: sale.txHash,
        //       data: sale,
        //     });
        //     count++;
        //   }
        //   await db0.sales.bulkPut(saleRecords).then (function() {
        //   }).catch(function(error) {
        //     console.log("error: " + error);
        //   });
        // }
        // return saleRecords.length;
        return data.tokens.length;
      }

      // --- updateCollection() start ---
      logInfo("ipcsModule", "mutations.updateCollection() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const block = await provider.getBlock("latest");
        const blockNumber = block.number;

        const contractsCollator = {};

        if (filterUpdate != null) {
          state.filter = { ...state.filter, ...filterUpdate };
        }

        state.sync.completed = 0;
        state.sync.error = false;
        state.sync.inProgress = true;

        const ipcHelper = new ethers.Contract(IPCHELPERADDRESS, IPCHELPERABI, provider);
        const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);

        const startId = 1;
        const endId = 1; // TODO 12000;
        const batchSize = 250;

        let fromId = startId;
        let toId;
        const collectionTokens = {};
        const ensMap = {};
        do {
          toId = parseInt(fromId) + batchSize;
          if (toId >= endId) {
            toId = endId;
          }
          console.log("fromId: " + fromId + ", toId: " + toId);
          const ipcData = await ipcHelper.getBulkIpc(fromId, parseInt(toId) + 1);

          const tokenIds = [];
          for (let i = 0; i < ipcData[0].length; i++) {
            const ipcId = parseInt(fromId) + i;
            tokenIds.push(ipcId);
          }
          // console.log("tokenIds: " + JSON.stringify(tokenIds));
          const ownerData = await erc721Helper.ownersByTokenIds(IPCADDRESS, tokenIds);
          // console.log("ownerData: " + JSON.stringify(ownerData));


          for (let i = 0; i < ipcData[0].length; i++) {
            const ipcId = parseInt(fromId) + i;
            console.log(ipcId + " " + ipcData[0][i] + " " + ipcData[1][i] + " " + ipcData[2][i] + " " + ipcData[3][i]);
            const owner = ownerData[0][i] && ownerData[1][i] || null;
            if (owner != null) {
              const lowerOwner = owner.toLowerCase();
              if (!(lowerOwner in ensMap)) {
                ensMap[lowerOwner] = owner;
              }
            }
            const ipc = {
              token_id: ipcId,
              name: ipcData[0][i],
              owner: owner,
              attribute_seed: ipcData[1][i],
              dna: ipcData[2][i],
              experience: parseInt(ipcData[3][i]),
              birth: parseInt(ipcData[4][i]),
            }
            const info = IPCLib.ipc_create_ipc_from_json(ipc);
            console.log("IPCLib.info: " + JSON.stringify(info, null, 2));
            const attributes = [];
            attributes.push({ trait_type: 'race', value: IPCLib.IPCMap.race[info.race] })
            attributes.push({ trait_type: 'subrace', value: IPCLib.IPCMap.subrace[info.subrace] })
            attributes.push({ trait_type: 'gender', value: IPCLib.IPCMap.gender[info.gender] })
            attributes.push({ trait_type: 'height', value: info.height })
            collectionTokens[ipcId] = { ...ipc, info: info, attributes: attributes };
          }
          fromId = toId;
        } while (toId < endId);
        // console.log(JSON.stringify(collectionTokens, null, 0));
        state.collectionTokens = collectionTokens;
        // console.log(JSON.stringify(ensMap, null, 0));

        // console.log("IPCLib.IPCRGBA: " + JSON.stringify(IPCLib.IPCRGBA));

        let addresses = Object.keys(ensMap);
        const ensReverseRecordsContract = new ethers.Contract(ENSREVERSERECORDSADDRESS, ENSREVERSERECORDSABI, provider);
        const ENSOWNERBATCHSIZE = 200; // 500 fails occassionally
        for (let i = 0; i < addresses.length; i += ENSOWNERBATCHSIZE) {
        //   this.processing = "RETRIEVING LIVE ENS REVERSE RECORDS FROM THE ETHEREUM MAINNET: " + ethers.utils.commify(i) + " OF " + ethers.utils.commify(addresses.length);
          const batch = addresses.slice(i, parseInt(i) + ENSOWNERBATCHSIZE);
          const allnames = await ensReverseRecordsContract.getNames(batch);
          // console.log("allnames: " + JSON.stringify(allnames, null, 2));
          // TODO: check for normalised. const validNames = allnames.filter((n) => normalize(n) === n );
          for (let j = 0; j < batch.length; j++) {
            const address = batch[j];
            const name = allnames[j];
            ensMap[address] = name != null && name.length > 0 ? name : address;
            // const normalized = normalize(address);
          }
        }
        ensMap["0x0000000000000000000000000000000000000000".toLowerCase()] = "(null)";
        ensMap["0x000000000000000000000000000000000000dEaD".toLowerCase()] = "(dEaD)";
        ensMap["0x00000000006c3852cbEf3e08E8dF289169EdE581".toLowerCase()] = "(OpenSea:Seaport1.1)";
        ensMap["0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85".toLowerCase()] = "(ENS)";
        ensMap["0x60cd862c9C687A9dE49aecdC3A99b74A4fc54aB6".toLowerCase()] = "(MoonCatRescue)";
        ensMap["0x74312363e45DCaBA76c59ec49a7Aa8A65a67EeD3".toLowerCase()] = "(X2Y2:Exchange)";
        ensMap["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase()] = "(WETH)";
        state.ensMap = ensMap;
        // console.log(JSON.stringify(ensMap, null, 0));

        state.sync.inProgress = false;
      }
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    updateCollection(context, { syncMode, filterUpdate }) {
      logInfo("ipcsModule", "actions.updateCollection() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('updateCollection', { syncMode, filterUpdate });
    },
    halt(context) {
      context.commit('halt');
    },
  },
};
