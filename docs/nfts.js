const NFTs = {
  template: `
    <div class="m-0 p-0">
      <b-card no-body no-header class="border-0">
        <b-card no-body class="p-0 mt-1">
          <b-tabs card align="left" no-body v-model="settings.tabIndex" active-tab-class="m-0 p-0">
            <b-tab title="Mint Monitor" @click="updateURL('mintmonitor');">
            </b-tab>
            <!--
            <b-tab title="Account" @click="updateURL('account');">
            </b-tab>
            -->
          </b-tabs>

          <b-card-body class="m-0 p-1">
            <!-- Main Toolbar -->
            <div class="d-flex flex-wrap m-0 p-0">
              <div v-if="settings.tabIndex == 0" class="mt-1 pr-1" style="max-width: 170px;">
                <b-form-input type="text" size="sm" :value="filter.searchString" @change="updateMintMonitorFilter('searchString', $event)" debounce="600" v-b-popover.hover.bottom="'Search by collection symbol, name or address'" placeholder="🔍 {symbol|name|addy}"></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1" style="max-width: 150px;">
                <b-form-input type="text" size="sm" :value="filter.searchString" @change="updateFilter('searchString', $event)" debounce="600" v-b-popover.hover.bottom="'Poweruser regex, or simple search string'" placeholder="🔍 {regex}"></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1" style="max-width: 150px;">
                <b-form-input type="text" size="sm" :value="filter.searchAccounts" @change="updateFilter('searchAccounts', $event)" debounce="600" v-b-popover.hover.bottom="'List of account search strings'" placeholder="🔍 0x12... ..."></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1" style="max-width: 80px;">
                <b-form-input type="text" size="sm" :value="filter.priceFrom" @change="updateFilter('priceFrom', $event)" debounce="600" v-b-popover.hover.bottom="'Price from, ETH'" placeholder="min"></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1">
                -
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1" style="max-width: 80px;">
                <b-form-input type="text" size="sm" :value="filter.priceTo" @change="updateFilter('priceTo', $event)" debounce="600" v-b-popover.hover.bottom="'Price to, ETH'" placeholder="max"></b-form-input>
              </div>

              <div class="mt-1 flex-grow-1">
              </div>

              <div v-if="settings.tabIndex == 0" class="mt-1 pr-1">
                <b-form-select size="sm" :value="filter.scanBlocks" :options="scanBlocksOptions" @change="updateMintMonitorFilter('scanBlocks', $event)" :disabled="sync.inProgress" v-b-popover.hover.bottom="'Number of blocks to scan'"></b-form-select>
              </div>

              <div v-if="settings.tabIndex == 0" class="mt-1 pr-1">
                <b-button size="sm" @click="monitorMints('scanLatest')" :disabled="sync.inProgress || !powerOn || network.chainId != 1" variant="primary" style="min-width: 80px; ">{{ 'Scan Latest ' + filter.scanBlocks + ' Blocks' }}</b-button>
              </div>

              <div class="mt-1 flex-grow-1">
              </div>

              <div v-if="settings.tabIndex == 0" class="mt-2" style="width: 200px;">
                <b-progress v-if="sync.inProgress" height="1.5rem" :max="sync.total" :label="'((sync.completed/sync.total)*100).toFixed(2) + %'" show-progress :animated="sync.inProgress" :variant="sync.inProgress ? 'success' : 'secondary'" v-b-popover.hover.bottom="'Click on the Sync(ing) button to (un)pause'">
                  <b-progress-bar :value="sync.completed">
                    {{ sync.completed + '/' + sync.total + ' ' + ((sync.completed / sync.total) * 100).toFixed(0) + '%' }}
                  </b-progress-bar>
                </b-progress>
              </div>

              <div v-if="settings.tabIndex == 0" class="ml-0 mt-1">
                <b-button v-if="sync.inProgress" size="sm" @click="halt" variant="link" v-b-popover.hover.bottom="'Halt'"><b-icon-stop-fill shift-v="+1" font-scale="1.0"></b-icon-stop-fill></b-button>
              </div>

              <div class="mt-1 flex-grow-1">
              </div>

              <div v-if="settings.tabIndex == 0" class="mt-1 pl-1" style="max-width: 100px;">
                <b-form-input type="text" size="sm" :value="filter.startBlockNumber" @change="updateMintMonitorFilter('startBlockNumber', $event)" debounce="600" v-b-popover.hover.bottom="'Search from block number'" placeholder="from"></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1">
                -
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1" style="max-width: 100px;">
                <b-form-input type="text" size="sm" :value="filter.endBlockNumber" @change="updateMintMonitorFilter('endBlockNumber', $event)" debounce="600" v-b-popover.hover.bottom="'Search to block number'" placeholder="to"></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1 pl-1">
                <b-button size="sm" @click="monitorMints('scan')" :disabled="sync.inProgress || !powerOn || network.chainId != 1 || filter.startBlockNumber == null || filter.endBlockNumber == null" variant="primary" style="min-width: 80px; ">Scan</b-button>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-2 pl-1">
                <b-link size="sm" :to="getURL" v-b-popover.hover.bottom="'Share this link for the same search'" ><font size="-1">Share</font></b-link>
              </div>

              <div v-if="settings.tabIndex == 1" class="mt-1 pr-1">
                <b-button size="sm" @click="monitorMints('partial')" :disabled="sync.inProgress || !powerOn || network.chainId != 1" variant="primary" style="min-width: 80px; ">Scan</b-button>
              </div>
              <div class="mt-1 pr-1 flex-grow-1">
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
                <b-input-group class="mb-2" style="height: 0;">
                  <template #append>
                    <b-button size="sm" :pressed.sync="settings.syncToolbar" variant="outline-primary" v-b-popover.hover.bottom="'Sync settings'"><span v-if="settings.syncToolbar"><b-icon-gear-fill shift-v="+1" font-scale="1.0"></b-icon-gear-fill></span><span v-else><b-icon-gear shift-v="+1" font-scale="1.0"></b-icon-gear></span></b-button>
                  </template>
                  <b-button v-if="!sync.inProgress" size="sm" @click="loadSales('partial')" variant="primary" v-b-popover.hover.bottom="'Partial Sync'" style="min-width: 80px; ">Sync</b-button>
                  <b-button v-if="sync.inProgress" size="sm" @click="halt" variant="primary" v-b-popover.hover.bottom="'Halt'" style="min-width: 80px; ">Syncing</b-button>
                </b-input-group>
              </div>
              <div class="mt-1 pr-1 flex-grow-1">
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
                <b-button size="sm" @click="exportSales" :disabled="filteredSortedSales.length == 0" variant="link" v-b-popover.hover.bottom="'Export to CSV for easy import into a spreadsheet'">Export</b-button>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
                <b-form-select size="sm" v-model="settings.sortOption" :options="sortOptions" v-b-popover.hover.bottom="'Yeah. Sort'"></b-form-select>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
                <font size="-2" v-b-popover.hover.bottom="formatTimestamp(earliestEntry) + ' to ' + formatTimestamp(latestEntry)">{{ filteredSortedSales.length }}</font>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
                <b-pagination size="sm" v-model="settings.currentPage" :total-rows="filteredSortedSales.length" :per-page="settings.pageSize" style="height: 0;"></b-pagination>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1">
                <b-form-select size="sm" v-model="settings.pageSize" :options="pageSizes" v-b-popover.hover.bottom="'Page size'"></b-form-select>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1">
                <b-form-select size="sm" v-model="settings.activityMaxItems" :options="activityMaxItemsOptions" v-b-popover.hover.bottom="'Max items to display'"></b-form-select>
              </div>
            </div>

            <!-- Sync Toolbar -->
            <div v-if="settings.syncToolbar" class="d-flex flex-wrap m-0 p-0 pb-1">
              <div class="mt-1 pr-1">
                <b-form-select size="sm" :value="config.period" @change="updateConfig('period', $event)" :options="periods" :disabled="sync.inProgress" v-b-popover.hover.bottom="'Sales history period'"></b-form-select>
              </div>
              <div class="mt-2" style="width: 300px;">
                <b-progress height="1.5rem" :max="sync.daysExpected" :label="'((sync.daysInCache/sync.daysExpected)*100).toFixed(2) + %'" show-progress :animated="sync.inProgress" :variant="sync.inProgress ? 'success' : 'secondary'" v-b-popover.hover.bottom="formatTimestampAsDate(sync.from) + ' - ' + formatTimestampAsDate(sync.to) + '. Click on the Sync(ing) button to (un)pause'">
                  <b-progress-bar :value="sync.daysInCache">
                    {{ (sync.processing ? (sync.processing + ' - ') : '') + sync.daysInCache + '/' + sync.daysExpected + ' ' + ((sync.daysInCache / sync.daysExpected) * 100).toFixed(0) + '%' }}
                  </b-progress-bar>
                </b-progress>
              </div>
              <div class="mt-1 flex-grow-1">
              </div>
              <div class="mt-1 pr-1" style="max-width: 150px;">
                <b-button size="sm" @click="loadSales('clearCache')" variant="primary" v-b-popover.hover.bottom="'Reset application data'">Clear Local Cache</b-button>
              </div>
            </div>

            <b-alert size="sm" :show="!powerOn || network.chainId != 1" variant="primary" class="m-0 mt-1">
              Please connect to the Ethereum mainnet with a web3-enabled browser. Click the [Power] button on the top right.
            </b-alert>

            <!-- Mint Monitor -->
            <div v-if="settings.tabIndex == 0">
              <b-alert size="sm" :show="powerOn && network.chainId == 1" dismissible variant="danger" class="m-0 mt-1">
                Be careful when interacting with unverified contracts and signing messages on dodgy websites!
              </b-alert>

              <b-table small striped hover :fields="collectionsFields" :items="collectionsData" table-class="w-100" class="m-1 p-1">
                <template #cell(index)="data">
                  {{ data.index + 1 }}
                </template>
                <template #cell(contract)="data">
                  <b-button :id="'popover-target-' + data.item.contract" variant="link" class="m-0 p-0">
                    {{ getContractOrCollection(data.item.contract) }}
                  </b-button>
                  <b-popover :target="'popover-target-' + data.item.contract" placement="right">
                    <template #title>{{ getContractOrCollection(data.item.contract) }}</template>
                    <b-link :href="'https://etherscan.io/address/' + data.item.contract + '#code'" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                      Etherscan - Contract Code
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/token/' + data.item.contract" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                      Etherscan - Transfers
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/token/' + data.item.contract + '#balances'" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                      Etherscan - Holders
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/token/tokenholderchart/' + data.item.contract" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                      Etherscan - Holders Chart
                    </b-link>
                  </b-popover>
                </template>
                <template #cell(mints)="data">
                  {{ data.item.mints }}
                </template>
                <template #cell(tokens)="data">
                  <span v-for="(transfer, transferIndex) in data.item.transfers.slice(0, settings.activityMaxItems)">
                    <b-button :id="'popover-target-' + data.item.contract + '-' + transfer.tokenId" variant="link" class="m-0 p-0">
                      <span v-if="transfer.contract == '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'">
                        <b-img :width="'100%'" :src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + transfer.tokenId + '/image'">
                        </b-img>
                      </span>
                      <span v-else>
                        {{ getTokenIdString(transfer.tokenId) }}
                      </span>
                    </b-button>
                    <b-popover :target="'popover-target-' + data.item.contract + '-' + transfer.tokenId" placement="right">
                      <template #title>{{ getContractOrCollection(data.item.contract) }}</template>
                      <b-link :href="'https://opensea.io/assets/' + data.item.contract + '/' + transfer.tokenId" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/collections/' + data.item.contract + '/' + transfer.tokenId" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/eth/' + data.item.contract + '/' + transfer.tokenId" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/tx/' + transfer.txHash" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                        Etherscan - Tx
                      </b-link>
                      <br />
                      <b-link :href="'https://opensea.io/' + transfer.to" v-b-popover.hover.bottom="'View mintoor in OS'" target="_blank">
                        OpenSea - Mintoor Account
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/address/' + transfer.to" v-b-popover.hover.bottom="'View mintoor in Etherscan.io'" target="_blank">
                        Etherscan - Mintoor Account
                      </b-link>
                    </b-popover>
                  </span>
                </template>
              </b-table>
            </div>

          </b-card-body>
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
        tabIndex: 0,
        activityMaxItems: 50,
      },

      dailyChartSelectedItems: [],

      scanBlocksOptions: [
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

      collectionsFields: [
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
      return store.getters['nfts/config'];
    },
    filter() {
      return store.getters['nfts/filter'];
    },
    sync() {
      return store.getters['nfts/sync'];
    },
    transfers() {
      return store.getters['nfts/transfers'];
    },
    collections() {
      return store.getters['nfts/collections'];
    },

    collectionsData() {
      const searchStrings = this.filter.searchString && this.filter.searchString.length > 0 && this.filter.searchString.split(/[, \t\n]+/).map(s => s.toLowerCase().trim()) || null;
      const results = [];
      for (const [contract, collection] of Object.entries(this.collections)) {
        let include = true;
        const symbol = collection.symbol.toLowerCase();
        const name = collection.name.toLowerCase();
        if (searchStrings != null) {
          let found = false;
          for (searchString of searchStrings) {
            if (contract.includes(searchString) || symbol.includes(searchString) || name.includes(searchString)) {
              found = true;
              break;
            }
          }
          if (!found) {
            include = false;
          }
        }
        if (include) {
          results.push({ contract, collection, mints: collection.transfers && collection.transfers.length || null, transfers: collection.transfers });
        }
      }
      results.sort((a, b) => {
        if (a.mints == b.mints) {
          const namea = this.collections && this.collections[a.contract].name || '';
          const nameb = this.collections && this.collections[b.contract].name || '';
          return ('' + namea).localeCompare(nameb);
        } else {
          return b.mints - a.mints;
        }
      });
      return results;
    },
    getURL() {
      let url = '/nfts/mintmonitor/';
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
    getContractOrCollection(address) {
      if (this.collections && (address in this.collections)) {
        const collection = this.collections[address];
        return collection.symbol + ' - ' + collection.name + (collection.totalSupply > 0 ? (' (' + collection.totalSupply + ')') : '');
      }
      return address.substring(0, 12);
    },
    getTokenIdString(tokenId) {
      const str = tokenId.toString();
      if (str.length > 13) {
        return str.substring(0, 10) + '...';
      }
      return str;
    },
    updateURL(where) {
      this.$router.push('/nfts/' + where);
    },
    updateMintMonitorFilter(field, filter) {
      logInfo("NFTs", "updateMintMonitorFilter: " + field + " => " + JSON.stringify(filter));
      const filterUpdate = {};
      filterUpdate[field] = filter;
      store.dispatch('nfts/updateMintMonitorFilter', filterUpdate);
    },
    async monitorMints(syncMode) {
      // logInfo("NFTs", "loadSales - syncMode: " + syncMode);
      store.dispatch('nfts/monitorMints', { syncMode, configUpdate: null, filterUpdate: null });
    },
    async halt() {
      store.dispatch('nfts/halt');
    },

    async timeoutCallback() {
      logDebug("NFTs", "timeoutCallback() count: " + this.count);

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
    logDebug("NFTs", "beforeDestroy()");
  },
  mounted() {
    logInfo("NFTs", "mounted() $route: " + JSON.stringify(this.$route.params) + ", props['tab']: " + this.tab + ", props['blocks']: " + this.blocks + ", props['search']: " + this.search);
    if (this.tab == "mintmonitor") {
      this.settings.tabIndex = 0;
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
        const filterUpdate = {};
        filterUpdate['startBlockNumber'] = ethers.utils.commify(parseInt(startBlockNumber));
        filterUpdate['endBlockNumber'] = ethers.utils.commify(parseInt(endBlockNumber));
        filterUpdate['searchString'] = this.search;
        setTimeout(function() {
          store.dispatch('nfts/monitorMints', { syncMode: 'scan', configUpdate: null, filterUpdate: filterUpdate });
        }, 1000);
      }
    } else if (this.tab == "account") {
      this.settings.tabIndex = 1;
    }

    this.reschedule = true;
    logDebug("NFTs", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const nftsModule = {
  namespaced: true,
  state: {
    filter: {
      searchString: null,
      scanBlocks: 500,
      startBlockNumber: null,
      endBlockNumber: null,
    },
    sync: {
      inProgress: false,
      error: false,
      total: null,
      completed: null,
    },

    collections: {},
    halt: false,
    params: null,
  },
  getters: {
    filter: state => state.filter,
    sync: state => state.sync,
    collections: state => state.collections,
    params: state => state.params,
  },
  mutations: {
    // --- monitorMints() ---
    async monitorMints(state, { syncMode, configUpdate, filterUpdate }) {
      // --- monitorMints() start ---
      logInfo("nftsModule", "mutations.monitorMints() - syncMode: " + syncMode + ", configUpdate: " + JSON.stringify(configUpdate) + ", filterUpdate: " + JSON.stringify(filterUpdate));
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const block = await provider.getBlock("latest");
        const blockNumber = block.number;

        const transfers = [];
        const contractsCollator = {};

        if (filterUpdate != null) {
          state.filter = { ...state.filter, ...filterUpdate };
        }

        let startBlockNumber = null;
        let endBlockNumber = null;
        if (syncMode == 'scan') {
          startBlockNumber = parseInt(state.filter.startBlockNumber.toString().replace(/,/g, ''));
          endBlockNumber = parseInt(state.filter.endBlockNumber.toString().replace(/,/g, ''));
        } else if (syncMode == 'scanLatest') {
          startBlockNumber = blockNumber - state.filter.scanBlocks;
          endBlockNumber = blockNumber;
          state.filter.startBlockNumber = ethers.utils.commify(startBlockNumber);
          state.filter.endBlockNumber = ethers.utils.commify(endBlockNumber);
        }
        console.log("startBlockNumber: " + startBlockNumber + ", endBlockNumber: " + endBlockNumber);
        if (startBlockNumber != null && startBlockNumber <= endBlockNumber) {
          state.sync.completed = 0;
          state.sync.total = endBlockNumber - startBlockNumber;
          state.sync.inProgress = true;
          const batchSize = 25;
          let toBlock = endBlockNumber;
          do {
            let fromBlock = toBlock - batchSize;
            if (fromBlock < startBlockNumber) {
              fromBlock = startBlockNumber;
            }
            // console.log("fromBlock: " + fromBlock + ", toBlock: " + toBlock);
            const filter = {
              // address: CRYPTOPUNKSMARKETADDRESS, // [NIXADDRESS, weth.address],
              fromBlock: fromBlock,
              toBlock: toBlock,
              topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)
                '0x0000000000000000000000000000000000000000000000000000000000000000', // Null address
                null
              ],
            };
            const events = await provider.getLogs(filter);
            // console.log("monitorMints - events: " + JSON.stringify(events.slice(0, 1)));
            for (const event of events) {
              if (!event.removed && event.topics.length == 4) {
                const contract = event.address.toLowerCase();
                const tokenId = event.topics[3] || event.data || null;
                const bnTokenId = tokenId == null ? null : ethers.BigNumber.from(tokenId);
                if (!(contract in contractsCollator)) {
                  contractsCollator[contract] = [];
                }
                const transfer = {
                  contract: contract,
                  from: ADDRESS0,
                  to: '0x' + event.topics[2].substring(26, 66),
                  tokenId: bnTokenId,
                  blockNumber: event.blockNumber,
                  logIndex: event.logIndex,
                  txHash: event.transactionHash,
                };
                transfers.push(transfer);
                contractsCollator[contract].push(transfer);
              }
            }
            toBlock -= batchSize;
            state.sync.completed = endBlockNumber - toBlock;
          } while (toBlock > startBlockNumber && !state.halt);
          transfers.sort((a, b) => {
            if (a.blockNumber == b.blockNumber) {
              return b.logIndex - a.logIndex;
            } else {
              return b.blockNumber - a.blockNumber;
            }
          });
          state.transfers = transfers;
          // Collections
          const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
          const contracts = Object.keys(contractsCollator);
          let tokenInfo = null;
          const collections = {};
          try {
            tokenInfo = await erc721Helper.tokenInfo(contracts);
            for (let i = 0; i < contracts.length; i++) {
              contractsCollator[contracts[i]].sort((a, b) => {
                if (a.blockNumber == b.blockNumber) {
                  return b.logIndex - a.logIndex;
                } else {
                  return b.blockNumber - a.blockNumber;
                }
              });
              collections[contracts[i]] = {
                status: ethers.BigNumber.from(tokenInfo[0][i]).toString(),
                symbol: tokenInfo[1][i],
                name: tokenInfo[2][i],
                totalSupply: ethers.BigNumber.from(tokenInfo[3][i]).toString(),
                transfers: contractsCollator[contracts[i]],
              };
            }
            if ('0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85' in contractsCollator) {
              collections['0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'] = { status: 'todo', symbol: 'ENS', name: 'Ethereum Name Service', totalSupply: 'lots', transfers: contractsCollator['0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'] || [] };
            }
          } catch (e) {
            console.log("ERROR - Not ERC-721");
          }
          state.collections = collections;
        }
        state.sync.inProgress = false;
      }
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    updateMintMonitorFilter(context, filterUpdate) {
      logInfo("nftsModule", "filterUpdates.updateMintMonitorFilter() - filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('monitorMints', { syncMode: 'updateFilter', configUpdate: null, filterUpdate });
    },
    monitorMints(context, { syncMode, configUpdate, filterUpdate }) {
      logInfo("nftsModule", "actions.monitorMints() - syncMode: " + syncMode + ", configUpdate: " + JSON.stringify(configUpdate) + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('monitorMints', { syncMode: syncMode, configUpdate: configUpdate, filterUpdate: filterUpdate } );
    },
    halt(context) {
      context.commit('halt');
    },
  },
};
