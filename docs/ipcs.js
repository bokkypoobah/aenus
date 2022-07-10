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
                <div class="mt-1">
                  <b-button size="sm" :pressed.sync="settings.showFilter" variant="link" v-b-popover.hover.top="'Show collection filter'"><span v-if="settings.showFilter"><b-icon-layout-sidebar-inset shift-v="+1" font-scale="1.0"></b-icon-layout-sidebar-inset></span><span v-else><b-icon-layout-sidebar shift-v="+1" font-scale="1.0"></b-icon-layout-sidebar></span></b-button>
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

                <div class="mt-2" style="width: 200px;">
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
              </div>

              <b-row class="m-0 p-0">
                <!-- Collection Filter -->
                <b-col v-if="settings.showFilter" cols="2" class="m-0 p-0 border-0">
                  <b-card no-header no-body class="m-0 p-0 border-0">
                    <b-card-body class="m-0 p-1" style="flex-grow: 1; max-height: 1000px; overflow-y: auto;">
                      <div v-for="(attributeKey, attributeIndex) in Object.keys(collectionTokensAttributesWithCounts).sort()" v-bind:key="attributeIndex">
                        <b-card header-class="m-0 px-2 pt-2 pb-0" body-class="p-0" class="m-0 p-0 border-0">
                          <template #header>
                            <span variant="secondary" class="small truncate">
                              {{ slugToTitle(attributeKey) }}
                            </span>
                          </template>
                          <font size="-2">
                            <b-table small fixed striped sticky-header="200px" :fields="collectionAttributeFields" :items="getSortedTraitsForCollectionTokensAttributes(attributeKey)" head-variant="light">
                              <template #cell(select)="data">
                                <b-form-checkbox size="sm" :checked="(collectionAttributeFilter[attributeKey] && collectionAttributeFilter[attributeKey].attributeOption) ? 1 : 0" value="1" @change="collectionFilterChange(attributeKey, data.item.attributeOption)"></b-form-checkbox>
                              </template>
                              <template #cell(attributeOption)="data">
                                {{ data.item.attributeOption }}
                              </template>
                              <template #cell(attributeTotal)="data">
                                {{ data.item.attributeTotal.length }}
                              </template>
                            </b-table>
                          </font>
                        </b-card>
                      </div>
                    </b-card-body>
                  </b-card>
                </b-col>
                <b-col class="m-0 p-0">
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
                            <b-col cols="2" class="my-0 mx-1 py-0 px-1 text-right">{{ slugToTitle(attribute.trait_type) }}</b-col>
                            <b-col class="my-0 mx-1 py-0 px-1 "><b>{{ attribute.value }}</b></b-col>
                          </b-row>
                        </font>
                      </template>
                      <template #cell(birth)="data">
                        {{ formatTimestamp(data.item.birth) }}
                      </template>
                    </b-table>
                  </b-card>
                </b-col>
              </b-row>
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
        showFilter: true,
        collection: {
          showInfo: false,
          sortOption: 'idasc',
          pageSize: 100,
          currentPage: 1
        },
      },

      collectionAttributeFilter: {},

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

      collectionTokensFields: [
        { key: 'token_id', label: '#', thStyle: 'width: 5%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'owner', label: 'Owner', thStyle: 'width: 15%;'},
        { key: 'name', label: 'Name', thStyle: 'width: 15%;'},
        { key: 'details', label: 'Details', thStyle: 'width: 50%;'},
        { key: 'birth', label: 'Birth', thStyle: 'width: 15%;'},
      ],

      collectionAttributeFields: [
        { key: 'select', label: '', thStyle: 'width: 10%;' },
        { key: 'attributeOption', label: 'Attribute' /*, sortable: true*/ },
        { key: 'attributeTotal', label: 'Count', /*sortable: true,*/ thStyle: 'width: 30%;', thClass: 'text-right', tdClass: 'text-right' },
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
    collectionTokensAttributesWithCounts() {
      const collator = { };
      for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
        for (let attribute of token.attributes) {
            const trait_type = attribute.trait_type;
            const value = attribute.value;
            if (!collator[trait_type]) {
              collator[trait_type] = {};
            }
            if (!collator[trait_type][value]) {
              collator[trait_type][value] = [tokenId];
            } else {
              collator[trait_type][value].push(tokenId);
            }
        }
      }
      // console.log("collectionTokensAttributesWithCounts: " + JSON.stringify(collator, null, 2));
      return collator;
    },
    filteredCollectionTokens() {
      let results = [];
      if (Object.keys(this.collectionAttributeFilter) == 0) {
        for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
          results.push(token);
        }
      } else {
        let selectedTokenIds = [];
        for (const [trait, value] of Object.entries(this.collectionAttributeFilter)) {
          let thisTraitTokenIds = [];
          for (const selectedValue of Object.keys(value)) {
            const tokenIds = this.collectionTokensAttributesWithCounts[trait][selectedValue];
            thisTraitTokenIds = [...thisTraitTokenIds, ...tokenIds];
          }
          if (selectedTokenIds.length == 0) {
            selectedTokenIds = thisTraitTokenIds;
          } else {
            selectedTokenIds = selectedTokenIds.filter(tokenId => thisTraitTokenIds.includes(tokenId));
          }
        }
        results = Object.values(selectedTokenIds).map(tokenId => this.collectionTokens[tokenId]);
      }
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
    slugToTitle(slug) {
      return slugToTitle(slug);
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
      // console.log("collectionFilterChange: " + JSON.stringify(this.collectionAttributeFilter));
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
      section: null,
      completed: null,
      total: null,
      error: false,
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

        state.sync.inProgress = true;
        state.sync.section = "Retrieving prices";
        state.sync.completed = 0;
        state.sync.total = 0;
        state.sync.error = false;

        // sync: {
        //   inProgress: false,
        //   section: null,
        //   completed: null,
        //   total: null,
        //   error: false,
        // },


        // Retrieve prices
        let continuation = null;
        let prices = {};
        do {
          let url = "https://api.reservoir.tools/tokens/bootstrap/v1?contract=" + IPCADDRESS +
            "&limit=500" +
            (continuation != null ? "&continuation=" + continuation : '');
          logInfo("nftsModule", "mutations.updateCollection() - url: " + url);
          const data = await fetch(url)
            .then(handleErrors)
            .then(response => response.json())
            .catch(function(error) {
               console.log("ERROR - updateCollection: " + error);
               state.sync.error = true;
               return [];
            });
          continuation = data.continuation;
          if (data && data.tokens) {
            for (const token of data.tokens) {
              prices[token.tokenId] = { tokenId: token.tokenId, price: token.price, validUntil: token.validUntil, source: token.source };
            }
          }
          state.sync.completed = Object.keys(prices).length;
          state.sync.total = state.sync.completed;
        } while (continuation != null && !state.halt && !state.sync.error /* && totalRecords < 20 && totalRecords < state.sync.total*/);
        console.log(JSON.stringify(prices, null, 2));

        const ipcHelper = new ethers.Contract(IPCHELPERADDRESS, IPCHELPERABI, provider);
        const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);

        const startId = 1;
        const endId = 30; // TODO 12000;
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
          const ownerData = await erc721Helper.ownersByTokenIds(IPCADDRESS, tokenIds);

          for (let i = 0; i < ipcData[0].length; i++) {
            const ipcId = parseInt(fromId) + i;
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
            const attributes = [];
            attributes.push({ trait_type: 'race', value: IPCEnglish.Race[info.race] });
            attributes.push({ trait_type: 'subrace', value: IPCEnglish.Subrace[info.subrace] });
            attributes.push({ trait_type: 'gender', value: IPCEnglish.Gender[info.gender] });
            attributes.push({ trait_type: 'height', value: parseInt(info.height / 12) + '\'' + info.height % 12 + '\"' });
            attributes.push({ trait_type: 'skin-color', value: IPCEnglish.Color[info.skin_color] });
            attributes.push({ trait_type: 'hair-color', value: IPCEnglish.Color[info.hair_color] });
            attributes.push({ trait_type: 'eye-color', value: IPCEnglish.Color[info.eye_color] });
            attributes.push({ trait_type: 'handedness', value: IPCEnglish.Handedness[info.handedness] });

            collectionTokens[ipcId] = { ...ipc, info: info, attributes: attributes };
          }
          fromId = toId;
        } while (toId < endId);
        state.collectionTokens = collectionTokens;

        let addresses = Object.keys(ensMap);
        const ensReverseRecordsContract = new ethers.Contract(ENSREVERSERECORDSADDRESS, ENSREVERSERECORDSABI, provider);
        const ENSOWNERBATCHSIZE = 200; // 500 fails occassionally
        for (let i = 0; i < addresses.length; i += ENSOWNERBATCHSIZE) {
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
