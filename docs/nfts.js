const NFTs = {
  template: `
    <div class="m-0 p-0">
      <b-card no-body no-header class="border-0">
        <b-card no-body class="p-0 mt-1">
          <b-tabs card align="left" no-body v-model="settings.tabIndex" active-tab-class="m-0 p-0">
            <b-tab title="Collection" @click="updateURL('collection');">
            </b-tab>
            <b-tab title="Mint Monitor" @click="updateURL('mintmonitor');">
            </b-tab>
          </b-tabs>

          <b-card no-body no-header :img-src="collectionInfo && collectionInfo.metadata && collectionInfo.metadata.bannerImageUrl" img-top class="m-0 p-0 border-0">

            <b-card-body class="m-0 p-1">
              <!-- Main Toolbar -->
              <div class="d-flex flex-wrap m-0 p-0">
                <div v-if="settings.tabIndex == 0" class="mt-1" style="width: 380px;">
                  <b-form-input type="text" size="sm" :value="filter.collection.address" @change="updateCollectionFilter('collection.address', $event)" debounce="600" v-b-popover.hover.bottom="'Collection address'" placeholder="{ERC-721 contract 0xaddy}"></b-form-input>
                </div>
                <div v-if="settings.tabIndex == 0" class="mt-1 pl-1">
                  <b-dropdown size="sm"  variant="link" toggle-class="text-decoration-none" no-caret>
                    <template #button-content>
                      ▼ <span class="sr-only">Presets</span>
                    </template>
                    <b-dropdown-item @click="filter.collection.address = '0x31385d3520bced94f77aae104b406994d8f2168c'">Bastard GAN Punks V2</b-dropdown-item>
                    <b-dropdown-item @click="filter.collection.address = '0xc3f733ca98e0dad0386979eb96fb1722a1a05e69'">MoonCats</b-dropdown-item>
                    <b-dropdown-item @click="filter.collection.address = '0x282bdd42f4eb70e7a9d9f40c8fea0825b7f68c5d'">CryptoPunks V1 (wrapped)</b-dropdown-item>
                    <b-dropdown-item @click="filter.collection.address = '0x42069abfe407c60cf4ae4112bedead391dba1cdb'">CryptoDickButts</b-dropdown-item>
                  </b-dropdown>
                </div>
                <div v-if="settings.tabIndex == 0" class="mt-1 pl-1">
                  <b-button size="sm" @click="updateCollection('sync')" :disabled="sync.inProgress || !powerOn || network.chainId != 1" variant="primary">Sync</b-button>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1" style="max-width: 170px;">
                  <b-form-input type="text" size="sm" :value="filter.searchString" @change="updateMintMonitorFilter('searchString', $event)" debounce="600" v-b-popover.hover.bottom="'Search by collection symbol, name or address'" placeholder="🔍 {symbol|name|addy}"></b-form-input>
                </div>

                <div class="mt-1 flex-grow-1">
                </div>

                <div v-if="settings.tabIndex == 1" class="mt-1 pl-1">
                  <b-form-select size="sm" :value="filter.scanBlocks" :options="scanBlocksOptions" @change="updateMintMonitorFilter('scanBlocks', $event)" :disabled="sync.inProgress" v-b-popover.hover.bottom="'Number of blocks to scan'"></b-form-select>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1 pl-1">
                  <b-button size="sm" @click="monitorMints('scanLatest')" :disabled="sync.inProgress || !powerOn || network.chainId != 1" variant="primary" style="min-width: 80px; ">{{ 'Scan Latest ' + filter.scanBlocks + ' Blocks' }}</b-button>
                </div>

                <div class="mt-1 flex-grow-1">
                </div>

                <div v-if="settings.tabIndex == 0 || settings.tabIndex == 1" class="mt-2" style="width: 200px;">
                  <b-progress v-if="sync.inProgress" height="1.5rem" :max="sync.total" :label="'((sync.completed/sync.total)*100).toFixed(2) + %'" show-progress :animated="sync.inProgress" :variant="sync.inProgress ? 'success' : 'secondary'" v-b-popover.hover.bottom="'Click on the Sync(ing) button to (un)pause'">
                    <b-progress-bar :value="sync.completed">
                      {{ sync.completed + '/' + sync.total + ' ' + ((sync.completed / sync.total) * 100).toFixed(0) + '%' }}
                    </b-progress-bar>
                  </b-progress>
                </div>
                <div v-if="settings.tabIndex == 0 || settings.tabIndex == 1" class="ml-0 mt-1">
                  <b-button v-if="sync.inProgress" size="sm" @click="halt" variant="link" v-b-popover.hover.bottom="'Halt'"><b-icon-stop-fill shift-v="+1" font-scale="1.0"></b-icon-stop-fill></b-button>
                </div>

                <div class="mt-1 flex-grow-1">
                </div>

                <div v-if="settings.tabIndex == 1" class="mt-1">
                  <b-button size="sm" :pressed.sync="settings.datetimeToolbar" variant="link" v-b-popover.hover.bottom="'Select by UTC date & time'"><span v-if="settings.datetimeToolbar"><b-icon-calendar3-fill shift-v="+1" font-scale="1.0"></b-icon-calendar3-fill></span><span v-else><b-icon-calendar3 shift-v="+1" font-scale="1.0"></b-icon-calendar3></span></b-button>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1" style="max-width: 100px;">
                  <b-form-input type="text" size="sm" :value="filter.startBlockNumber" @change="updateMintMonitorFilter('startBlockNumber', $event)" debounce="600" v-b-popover.hover.bottom="'Search from block number'" placeholder="from"></b-form-input>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1">
                  -
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1" style="max-width: 100px;">
                  <b-form-input type="text" size="sm" :value="filter.endBlockNumber" @change="updateMintMonitorFilter('endBlockNumber', $event)" debounce="600" v-b-popover.hover.bottom="'Search to block number'" placeholder="to"></b-form-input>
                </div>

                <div v-if="settings.tabIndex == 1" class="mt-1 pl-1">
                  <b-button size="sm" @click="monitorMints('scan')" :disabled="sync.inProgress || !powerOn || network.chainId != 1 || filter.startBlockNumber == null || filter.endBlockNumber == null" variant="primary" style="min-width: 80px; ">Scan</b-button>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-2 pl-1">
                  <b-link size="sm" :to="getURL" v-b-popover.hover.bottom="'Share this link for the same search'" ><font size="-1">Share</font></b-link>
                </div>

                <div class="mt-1 flex-grow-1">
                </div>
                <div v-if="settings.tabIndex == 0" class="mt-1 pr-1">
                  <b-form-select size="sm" v-model="settings.collection.sortOption" :options="sortOptions" v-b-popover.hover.bottom="'Yeah. Sort'"></b-form-select>
                </div>
                <div v-if="settings.tabIndex == 0" class="mt-1 pr-1">
                  <font size="-2" v-b-popover.hover.bottom="'Blah'">{{ filteredSortedCollectionTokens.length }}</font>
                </div>
                <div v-if="settings.tabIndex == 0" class="mt-1 pr-1">
                  <b-pagination size="sm" v-model="settings.collection.currentPage" :total-rows="filteredSortedCollectionTokens.length" :per-page="settings.collection.pageSize" style="height: 0;"></b-pagination>
                </div>
                <div v-if="settings.tabIndex == 0" class="mt-1 pl-1">
                  <b-form-select size="sm" v-model="settings.collection.pageSize" :options="pageSizes" v-b-popover.hover.bottom="'Page size'"></b-form-select>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1 pl-1">
                  <b-form-select size="sm" v-model="settings.activityMaxItems" :options="activityMaxItemsOptions" v-b-popover.hover.bottom="'Max items to display'"></b-form-select>
                </div>
              </div>

              <!-- Sync Toolbar -->
              <div v-if="settings.datetimeToolbar" class="d-flex flex-wrap justify-content-center m-0 p-0 pb-1">
                <div class="mt-1 pr-1">
                  <b-calendar v-model="settings.dateFrom" @context="calendarUpdated('dateFrom', $event)"></b-calendar>
                </div>
                <div class="mt-1">
                  <b-time v-model="settings.timeFrom" @context="calendarUpdated('timeFrom', $event)"></b-time>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1">
                  -
                </div>
                <div class="mt-1 pr-1">
                  <b-calendar v-model="settings.dateTo" @context="calendarUpdated('dateTo', $event)"></b-calendar>
                </div>
                <div class="mt-1 pr-1">
                  <b-time v-model="settings.timeTo" @context="calendarUpdated('timeTo', $event)"></b-time>
                </div>
                <!--
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
                -->
              </div>

              <!-- Collection -->
              <div v-if="settings.tabIndex == 0">
                <b-card no-header no-body class="mt-1">

                  <b-card-group deck class="m-1 p-0">
                    <div v-for="token in pagedFilteredCollectionTokens">
                      <b-card body-class="p-0" header-class="p-1" img-top class="m-1 p-0 border-0" style="max-width: 7rem;">
                        <b-avatar rounded size="7rem" :src="token.image"></b-avatar>
                        <b-card-text class="text-right">
                          <div class="d-flex justify-content-between m-0 p-0">
                            <div>
                              <font size="-1">
                                <b-badge variant="light" v-b-popover.hover.bottom="'blah'">{{ token.tokenId }}</b-badge>
                              </font>
                            </div>
                            <!--
                            <div class="flex-grow-1">
                              <font v-if="secondsOld(event.timestamp) < 3600" size="-1">
                                <b-badge variant="dark" v-b-popover.hover.bottom="formatTimestamp(event.timestamp)">{{ formatTerm(event.timestamp) }}</b-badge>
                              </font>
                              <font v-else-if="secondsOld(event.timestamp) > 86400" size="-1">
                                <b-badge variant="light" v-b-popover.hover.bottom="formatTimestamp(event.timestamp)">{{ formatTerm(event.timestamp) }}</b-badge>
                              </font>
                              <font v-else size="-1">
                                <b-badge variant="secondary" v-b-popover.hover.bottom="formatTimestamp(event.timestamp)">{{ formatTerm(event.timestamp) }}</b-badge>
                              </font>
                            </div>
                            -->
                            <div class="flex-grow-1">
                            </div>
                            <div>
                              <!--
                              <font size="-1">
                                <b-badge :variant="(activity.type == 'Sales') ? 'success' : ((activity.type == 'Asks') ? 'primary' : 'warning')" v-b-popover.hover.bottom="formatETH(event.amount)">{{ formatETHShort(event.amount) }}</b-badge>
                              </font>
                              -->
                            </div>
                          </div>
                        </b-card-text>
                      </b-card>
                    </div>
                  </b-card-group>


                  <!--


                  <b-table small striped hover :items="filteredCollectionTokens" table-class="w-100" class="m-1 p-1">
                  </b-table>
                  <b-table small striped hover :fields="mintMonitorCollectionsFields" :items="filteredCollectionTokens" table-class="w-100" class="m-1 p-1">
                  <b-form-group label-cols="4" label-size="sm" label="Name" label-align="right" class="mb-2">
                    <b-form-input type="text" size="sm" :value="collectionInfo && collectionInfo.name || ''" readonly></b-form-input>
                  </b-form-group>
                  {{ filteredCollectionTokens }}
                  <b-form-group label-cols="4" label-size="sm" label="Description" label-align="right" class="mb-2">
                    <b-form-textarea size="sm" :value="collectionInfo && collectionInfo.metadata && collectionInfo.metadata.description || ''" readonly rows="3" max-rows="10"></b-form-textarea>
                  </b-form-group>
                  -->
                  <b-card-text>
                    <!--
                    {{ collectionInfo }}
                    <b-form-input type="text" size="sm" @change="recalculate('searchTokenId')" v-model.trim="settings.searchTokenId" debounce="600" placeholder="🔍 ID1, ID2-ID3, ..." class="mb-2"></b-form-input>
                    <b-form-input type="text" size="sm" @change="recalculate('searchAccount')" v-model.trim="settings.searchAccount" debounce="600" placeholder="🔍 ENS1, ADDY2, ..." class="mb-2"></b-form-input>
                    <b-form-input type="text" size="sm" @change="recalculate('searchLyrics')" v-model.trim="settings.searchLyrics" debounce="600" placeholder="🔍 LYRICS" class="mb-2"></b-form-input>
                    <b-form-checkbox @change="recalculate('searchForSaleOnly')" v-model.trim="settings.searchForSaleOnly" debounce="600">For Sale Only (coming)</b-form-checkbox>
                    -->
                  </b-card-text>
                </b-card>
              </div>

              <!-- Mint Monitor -->
              <div v-if="settings.tabIndex == 1">
                <b-alert size="sm" :show="!powerOn || network.chainId != 1" variant="primary" class="m-0 mt-1">
                  Please connect to the Ethereum mainnet with a web3-enabled browser. Click the [Power] button on the top right.
                </b-alert>

                <b-alert size="sm" :show="powerOn && network.chainId == 1" dismissible variant="danger" class="m-0 mt-1">
                  Be careful when interacting with unverified contracts and signing messages on dodgy websites!
                </b-alert>

                <b-table small striped hover :fields="mintMonitorCollectionsFields" :items="mintMonitorCollectionsData" table-class="w-100" class="m-1 p-1">
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
        datetimeToolbar: false,
        dateFrom: null,
        timeFrom: null,
        dateTo: null,
        timeTo: null,
        activityMaxItems: 50,
        collection: {
          sortOption: 'idasc',
          pageSize: 100,
          currentPage: 1
        }
      },

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
    collectionInfo() {
      return store.getters['nfts/collectionInfo'];
    },
    collectionTokens() {
      return store.getters['nfts/collectionTokens'];
    },
    mintMonitorCollections() {
      return store.getters['nfts/mintMonitorCollections'];
    },
    filteredCollectionTokens() {
      const results = [];
      for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
        results.push(token);
      }
      return results;
    },
    filteredSortedCollectionTokens() {
      let results = this.filteredCollectionTokens;
      if (this.settings.collection.sortOption == 'idasc') {
        results.sort((a, b) => a.tokenId - b.tokenId);
      } else if (this.settings.collection.sortOption == 'iddsc') {
        results.sort((a, b) => b.tokenId - a.tokenId);
      }
      return results;
    },
    pagedFilteredCollectionTokens() {
      return this.filteredSortedCollectionTokens.slice((this.settings.collection.currentPage - 1) * this.settings.collection.pageSize, this.settings.collection.currentPage * this.settings.collection.pageSize);
    },
    mintMonitorCollectionsData() {
      const searchStrings = this.filter.searchString && this.filter.searchString.length > 0 && this.filter.searchString.split(/[, \t\n]+/).map(s => s.toLowerCase().trim()) || null;
      const results = [];
      for (const [contract, collection] of Object.entries(this.mintMonitorCollections)) {
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
      if (this.mintMonitorCollections && (address in this.mintMonitorCollections)) {
        const collection = this.mintMonitorCollections[address];
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
    updateMintMonitorFilter(field, value) {
      logInfo("NFTs", "updateMintMonitorFilter: " + field + " => " + JSON.stringify(value));
      const filterUpdate = {};
      filterUpdate[field] = value;
      store.dispatch('nfts/updateMintMonitorFilter', filterUpdate);
    },
    async calendarUpdated(field, context) {
      logInfo("NFTs", "calendarUpdated - field: " + field + ", context: " + JSON.stringify(context));
      if (field == 'dateFrom' && this.settings.dateFrom != null && this.settings.dateTo == null) {
        this.settings.dateTo = this.settings.dateFrom;
      }
      if ((field == 'dateFrom' || field == 'timeFrom') && this.settings.dateFrom != null && this.settings.timeFrom != null) {
        logInfo("NFTs", "calendarUpdated - dateFrom: " + this.settings.dateFrom + ", timeFrom: " + this.settings.timeFrom);
        const fromTimestamp = moment.utc(this.settings.dateFrom + ' ' + this.settings.timeFrom).unix();
        const data = await fetch(BLOCKTIMESTAMPSUBGRAPHURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: BLOCKTIMESTAMPAFTERQUERY,
            variables: { timestamp: fromTimestamp },
          })
        }).then(handleErrors)
          .then(response => response.json());
        if (data && data.data && data.data.blocks && data.data.blocks.length == 1) {
          const filterUpdate = { startBlockNumber: ethers.utils.commify(data.data.blocks[0].number) };
          store.dispatch('nfts/updateMintMonitorFilter', filterUpdate);
        }
      }
      if ((field == 'dateTo' || field == 'timeTo') && this.settings.dateTo != null && this.settings.timeTo != null) {
        logInfo("NFTs", "calendarUpdated - dateTo: " + this.settings.dateTo + ", timeTo: " + this.settings.timeTo);
        const toTimestamp = moment.utc(this.settings.dateTo + ' ' + this.settings.timeTo).unix();
        const data = await fetch(BLOCKTIMESTAMPSUBGRAPHURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: BLOCKTIMESTAMPAFTERQUERY,
            variables: { timestamp: toTimestamp },
          })
        }).then(handleErrors)
          .then(response => response.json());
        if (data && data.data && data.data.blocks && data.data.blocks.length == 1) {
          const filterUpdate = { endBlockNumber: ethers.utils.commify(data.data.blocks[0].number) };
          store.dispatch('nfts/updateMintMonitorFilter', filterUpdate);
        }
      }
    },
    async monitorMints(syncMode) {
      store.dispatch('nfts/monitorMints', { syncMode, configUpdate: null, filterUpdate: null });
    },
    updateCollectionFilter(field, value) {
      logInfo("NFTs", "updateCollectionFilter: " + field + " => " + JSON.stringify(value));
      const filterUpdate = {};
      if (field == 'collection.address') {
        filterUpdate['collection'] = { address: value };
      } else {
        filterUpdate[field] = value;
      }
      store.dispatch('nfts/updateCollectionFilter', filterUpdate);
    },
    async updateCollection(syncMode) {
      store.dispatch('nfts/updateCollection', { syncMode, configUpdate: null, filterUpdate: null });
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
    if (this.tab == "collection") {
      this.settings.tabIndex = 0;
    } else if (this.tab == "mintmonitor") {
      this.settings.tabIndex = 1;
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
    }
    this.reschedule = true;
    logDebug("NFTs", "Calling timeoutCallback()");
    this.timeoutCallback();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const nftsModule = {
  namespaced: true,
  state: {
    filter: {
      collection: {
        address: null, // "0x31385d3520bced94f77aae104b406994d8f2168c",
        startBlockNumber: 4000000,
      },
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

    collectionInfo: {},
    collectionTokens: {},
    mintMonitorCollections: {},
    halt: false,
    params: null,
  },
  getters: {
    filter: state => state.filter,
    sync: state => state.sync,
    collectionInfo: state => state.collectionInfo,
    collectionTokens: state => state.collectionTokens,
    mintMonitorCollections: state => state.mintMonitorCollections,
    params: state => state.params,
  },
  mutations: {

    // --- updateCollection() ---
    async updateCollection(state, { syncMode, configUpdate, filterUpdate }) {

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
        //     //   logInfo("nftsModule", "mutations.loadSales().processSales() " + new Date(sale.timestamp * 1000).toLocaleString() + " " + (sale.token.name ? sale.token.name : "(null)") + ", price: " + sale.price + ", from: " + sale.from.substr(0, 10) + ", to: " + sale.to.substr(0, 10));
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
      logInfo("nftsModule", "mutations.updateCollection() - syncMode: " + syncMode + ", configUpdate: " + JSON.stringify(configUpdate) + ", filterUpdate: " + JSON.stringify(filterUpdate));
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const block = await provider.getBlock("latest");
        const blockNumber = block.number;

        const contractsCollator = {};

        if (filterUpdate != null) {
          state.filter = { ...state.filter, ...filterUpdate };
        }

        state.sync.completed = 0;
        state.sync.inProgress = true;

        let url = "https://api.reservoir.tools/collection/v2?id=" + state.filter.collection.address;
        // logInfo("nftsModule", "mutations.updateCollection() - url: " + url);
        const collectionInfo = await fetch(url)
          .then(handleErrors)
          .then(response => response.json())
          .catch(function(error) {
             console.log("ERROR - updateDBFromAPI: " + error);
             state.sync.error = true;
             return [];
          });
        state.collectionInfo = collectionInfo && collectionInfo.collection || {};
        // console.log("state.collectionInfo: " + JSON.stringify(state.collectionInfo, null, 2));

        state.sync.total = collectionInfo && collectionInfo.collection && collectionInfo.collection.tokenCount || 0;
        // state.sync.total = 5;

        let totalRecords = 0;
        let continuation = null;
        let tokens = {};
        do {
          let url = "https://api.reservoir.tools/tokens/details/v4?contract=" + state.filter.collection.address +
            "&limit=20" +
            (continuation != null ? "&continuation=" + continuation : '');
          // logInfo("nftsModule", "mutations.updateCollection() - url: " + url);
          const data = await fetch(url)
            .then(handleErrors)
            .then(response => response.json())
            .catch(function(error) {
               console.log("ERROR - updateDBFromAPI: " + error);
               state.sync.error = true;
               return [];
            });
          // console.log(JSON.stringify(data, null, 2));

          if (data && data.tokens) {
            // console.log(JSON.stringify(data.tokens, null, 2));
            // console.log(JSON.stringify(data.tokens[0], null, 2));
            for (const record of data.tokens) {
              const token = record.token;
              tokens[token.tokenId] = {
                tokenId: token.tokenId,
                owner: token.owner,
                name: token.name,
                description: token.description,
                attributes: token.attributes,
                image: token.image,
              };
            }
          }

          // console.log(JSON.stringify(tokens, null, 2));


          let numberOfRecords = state.sync.error ? 0 : await processSales(data);
          // let numberOfRecords = state.sync.error ? 0 : data.tokens.length;
          totalRecords += numberOfRecords;
          continuation = data.continuation;
          state.sync.completed = totalRecords;
          if (state.sync.total < totalRecords) {
            state.sync.total = totalRecords;
          }
        } while (continuation != null && !state.halt && !state.sync.error /*&& totalRecords < state.sync.total*/);

        state.collectionTokens = tokens;

        if (false) {

          // let continuation = null;
          // do {
          //   let url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" +
          //     "&limit=" + state.constants.reservoirSalesV3BatchSize +
          //     "&startTimestamp=" + processFrom +
          //     "&endTimestamp="+ processTo +
          //     (continuation != null ? "&continuation=" + continuation : '');
          //   // logInfo("nftsModule", "mutations.loadSales() - url: " + url);
          //   // logInfo("nftsModule", "mutations.loadSales() - Retrieving records for " + new Date(processFrom).toLocaleString() + " to " + new Date(processTo).toLocaleString());
          //   const data = await fetch(url)
          //     .then(handleErrors)
          //     .then(response => response.json())
          //     .catch(function(error) {
          //        console.log("ERROR - updateDBFromAPI: " + error);
          //        state.sync.error = true;
          //        return [];
          //     });
          //   let numberOfRecords = state.sync.error ? 0 : await processSales(data);
          //   totalRecords += numberOfRecords;
          //   continuation = data.continuation;
          //   state.sync.processing = moment.unix(processFrom).utc().format("DDMMM") + ': ' + totalRecords;
          // } while (continuation != null && !state.halt && !state.sync.error);



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
          // const batchSize = 25;
          let toBlock = endBlockNumber;
          do {
            let batchSize;
            // Aug 1 2021
            if (toBlock < 12936340) {
              batchSize = 250;
            } else {
              batchSize = 25;
            }
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
            // console.log("updateCollection - events: " + JSON.stringify(events.slice(0, 1)));
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
                contractsCollator[contract].push(transfer);
              }
            }
            toBlock -= batchSize;
            state.sync.completed = endBlockNumber - toBlock;
          } while (toBlock > startBlockNumber && !state.halt);
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
          state.mintMonitorCollections = collections;
        }
        }
        state.sync.inProgress = false;
      }
    },

    // --- monitorMints() ---
    async monitorMints(state, { syncMode, configUpdate, filterUpdate }) {
      // --- monitorMints() start ---
      logInfo("nftsModule", "mutations.monitorMints() - syncMode: " + syncMode + ", configUpdate: " + JSON.stringify(configUpdate) + ", filterUpdate: " + JSON.stringify(filterUpdate));
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const block = await provider.getBlock("latest");
        const blockNumber = block.number;

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
          // const batchSize = 25;
          let toBlock = endBlockNumber;
          do {
            let batchSize;
            // Aug 1 2021
            if (toBlock < 12936340) {
              batchSize = 250;
            } else {
              batchSize = 25;
            }
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
                contractsCollator[contract].push(transfer);
              }
            }
            toBlock -= batchSize;
            state.sync.completed = endBlockNumber - toBlock;
          } while (toBlock > startBlockNumber && !state.halt);
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
          state.mintMonitorCollections = collections;
        }
        state.sync.inProgress = false;
      }
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    updateCollectionFilter(context, filterUpdate) {
      logInfo("nftsModule", "filterUpdates.updateCollectionFilter() - filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('updateCollection', { syncMode: 'updateFilter', configUpdate: null, filterUpdate });
    },
    updateCollection(context, { syncMode, configUpdate, filterUpdate }) {
      logInfo("nftsModule", "actions.updateCollection() - syncMode: " + syncMode + ", configUpdate: " + JSON.stringify(configUpdate) + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('updateCollection', { syncMode, configUpdate, filterUpdate } );
    },
    updateMintMonitorFilter(context, filterUpdate) {
      logInfo("nftsModule", "filterUpdates.updateMintMonitorFilter() - filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('monitorMints', { syncMode: 'updateFilter', configUpdate: null, filterUpdate });
    },
    monitorMints(context, { syncMode, configUpdate, filterUpdate }) {
      logInfo("nftsModule", "actions.monitorMints() - syncMode: " + syncMode + ", configUpdate: " + JSON.stringify(configUpdate) + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('monitorMints', { syncMode, configUpdate, filterUpdate } );
    },
    halt(context) {
      context.commit('halt');
    },
  },
};
