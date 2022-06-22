const ENSSales = {
  template: `
    <div class="m-0 p-0">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="false && (!powerOn || network.chainId != 1)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Ethereum mainnet and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body no-header class="border-0">
        <b-card no-body class="p-0 mt-1">
          <!--
          <b-tabs card align="left" no-body active-tab-class="m-0 p-0" v-model="settings.tabIndex">
            <b-tab title="Summary" @click="updateURL('summary');">
            </b-tab>
            <b-tab title="List" @click="updateURL('list');">
            </b-tab>
          </b-tabs>
          -->

          <!--
          <b-card-body class="m-1 p-1">
            <b-button size="sm" @click="doit( { type: 'fullsync' } );" variant="primary">Retrieve Latest 50 Sales</b-button>
            <span v-if="searchMessage != null">
              <b-button size="sm" @click="halt" variant="primary">Halt</b-button>
            </span>
            <b-button size="sm" @click="doit( { action: 'startService' } );" variant="primary">Start Service</b-button>
            <b-button size="sm" @click="doit( { action: 'stopService' } );" variant="primary">Stop Service</b-button>
          </b-card-body>
          -->
          <b-card-body class="m-1 p-1">
            <div class="d-flex flex-wrap m-0 p-0" style="min-height: 37px;">
              <div class="mt-2 pr-4">
                <b-form-input type="text" size="sm" :value="filter.searchString" @change="updateFilter('searchString', $event)" debounce="600" placeholder="🔍 {regex}"></b-form-input>
              </div>
              <div class="mt-2 pr-4">
                <b-form-input type="text" size="sm" :value="filter.searchAccounts" @change="updateFilter('searchAccounts', $event)" debounce="600" placeholder="🔍 0x12... ..."></b-form-input>
              </div>
              <div class="mt-2 pr-1" style="max-width: 80px;">
                <b-form-input type="text" size="sm" :value="filter.priceFrom" @change="updateFilter('priceFrom', $event)" debounce="600" placeholder="min"></b-form-input>
              </div>
              <div class="mt-2 pr-1">
                -
              </div>
              <div class="mt-2 pr-2" style="max-width: 80px;">
              <b-form-input type="text" size="sm" :value="filter.priceTo" @change="updateFilter('priceTo', $event)" debounce="600" placeholder="max"></b-form-input>
              </div>
              <div class="mt-2 pr-1 flex-grow-1">
              </div>
              <div class="mt-2 pr-1">
                <b-dropdown v-if="message == null" split size="sm" text="Sync" @click="loadSales('partial')" variant="primary" v-b-popover.hover.bottom="'Partial Sync'">
                  <b-dropdown-item @click="loadSales('full')">Full Sync</b-dropdown-item>
                </b-dropdown>
                <b-button v-if="message != null" size="sm" @click="halt" variant="primary" v-b-popover.hover.bottom="'Halt'" >{{ message }}</b-button>
              </div>
              <div class="mt-2 pr-1 flex-grow-1">
              </div>
              <div class="mt-2 pl-1">
                <font size="-2" v-b-popover.hover.bottom="formatTimestamp(earliestEntry) + ' to ' + formatTimestamp(latestEntry)">{{ filteredSortedSales.length }}</font>
              </div>
              <div class="mt-2 pl-1">
                <b-pagination size="sm" v-model="settings.currentPage" :total-rows="filteredSortedSales.length" :per-page="settings.pageSize"></b-pagination>
              </div>
              <div class="mt-2 pl-1">
                <b-form-select size="sm" v-model="settings.pageSize" :options="pageSizes" v-b-popover.hover.bottom="'Page size'"></b-form-select>
              </div>
            </div>
            <b-table small striped hover :fields="salesFields" :items="pagedFilteredSortedSales" table-class="w-auto" class="mt-0">
              <template #cell(timestamp)="data">
                {{ formatTimestamp(data.item.timestamp) }}
              </template>
              <template #cell(name)="data">
                <b-link :id="'popover-target-name-' + data.index">
                  {{ data.item.name }}
                </b-link>
                <b-popover :target="'popover-target-name-' + data.index" placement="right">
                  <template #title>{{ data.item.name.substring(0, 64) }}:</template>
                  <b-link :href="'https://app.ens.domains/name/' + data.item.name" v-b-popover.hover="'View in app.ens.domains'" target="_blank">
                    ENS
                  </b-link>
                  <br />
                  <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover="'View in opensea.io'" target="_blank">
                    OpenSea
                  </b-link>
                  <br />
                  <b-link :href="'https://looksrare.org/collections/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                    LooksRare
                  </b-link>
                  <br />
                  <b-link :href="'https://x2y2.io/eth/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + data.item.tokenId" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                    X2Y2
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://etherscan.io/enslookup-search?search=' + data.item.name.replace('.eth', '')" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                    EtherScan
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://duckduckgo.com/?q=' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in duckduckgo.com'" target="_blank">
                    DuckDuckGo
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://www.google.com/search?q=' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in google.com'" target="_blank">
                    Google
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://twitter.com/search?q=' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in twitter.com'" target="_blank">
                    Twitter
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://wikipedia.org/wiki/' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in wikipedia.org'" target="_blank">
                    Wikipedia
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://en.wiktionary.org/wiki/' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in wiktionary.org'" target="_blank">
                    Wiktionary
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://thesaurus.yourdictionary.com/' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in thesaurus.yourdictionary.com'" target="_blank">
                    Thesaurus
                  </b-link>
                </b-popover>
              </template>
              <template #cell(from)="data">
                <b-link :id="'popover-target-from-' + data.index">
                  {{ data.item.from.substring(0, 12) }}
                </b-link>
                <b-popover :target="'popover-target-from-' + data.index" placement="right">
                  <template #title>From: {{ data.item.from.substring(0, 12) }}:</template>
                  <b-link :href="'https://opensea.io/' + data.item.from" v-b-popover.hover="'View in opensea.io'" target="_blank">
                    OpenSea
                  </b-link>
                  <br />
                  <b-link :href="'https://looksrare.org/accounts/' + data.item.from" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                    LooksRare
                  </b-link>
                  <br />
                  <b-link :href="'https://x2y2.io/user/' + data.item.from + '/items'" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                    X2Y2
                  </b-link>
                  <br />
                  <b-link :href="'https://etherscan.io/address/' + data.item.from" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                    EtherScan
                  </b-link>
                </b-popover>
              </template>
              <template #cell(to)="data">
                <b-link :id="'popover-target-to-' + data.index">
                  {{ data.item.to.substring(0, 12) }}
                </b-link>
                <b-popover :target="'popover-target-to-' + data.index" placement="right">
                  <template #title>From: {{ data.item.to.substring(0, 12) }}:</template>
                  <b-link :href="'https://opensea.io/' + data.item.to" v-b-popover.hover="'View in opensea.io'" target="_blank">
                    OpenSea
                  </b-link>
                  <br />
                  <b-link :href="'https://looksrare.org/accounts/' + data.item.to" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                    LooksRare
                  </b-link>
                  <br />
                  <b-link :href="'https://x2y2.io/user/' + data.item.to + '/items'" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                    X2Y2
                  </b-link>
                  <br />
                  <b-link :href="'https://etherscan.io/address/' + data.item.to" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                    EtherScan
                  </b-link>
                </b-popover>
              </template>
              <template #cell(txHash)="data">
                <b-link :href="'https://etherscan.io/tx/' + data.item.txHash" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                  {{ data.item.txHash.substring(0, 12) }}
                </b-link>
              </template>
            </b-table>
          </b-card-body>
        </b-card>
      </b-card>
    </div>
  `,
  props: ['search', 'topic'],
  data: function() {
    return {
      count: 0,
      reschedule: true,

      settings: {
        tabIndex: 0,
        // sortOption: 'nameasc',
        // randomise: false,

        pageSize: 100,
        currentPage: 1,

        // imageSize: '240',

        // resultsTabIndex: 0,
      },

      results: [],

      pageSizes: [
        { value: 10, text: '10' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1,000' },
        { value: 2500, text: '2,500' },
        { value: 10000, text: '(all)' },
      ],

      salesFields: [
        { key: 'timestamp', label: 'Timestamp', thStyle: 'width: 20%;' },
        { key: 'name', label: 'Name', thStyle: 'width: 20%;' },
        { key: 'from', label: 'From', thStyle: 'width: 20%;' },
        { key: 'to', label: 'To', thStyle: 'width: 20%;' },
        { key: 'price', label: 'ETH', thStyle: 'width: 20%;' },
        { key: 'txHash', label: 'Tx', thStyle: 'width: 20%;' },
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
    filter() {
      return store.getters['ensSales/filter'];
    },
    sales() {
      return store.getters['ensSales/sales'];
    },
    message() {
      return store.getters['ensSales/message'];
    },
    earliestEntry() {
      let timestamp = null;
      for (const sale of this.sales) {
        if (timestamp == null || timestamp > sale.timestamp) {
          timestamp = sale.timestamp;
        }
      }
      return timestamp;
    },
    latestEntry() {
      let timestamp = null;
      for (const sale of this.sales) {
        if (timestamp == null || timestamp < sale.timestamp) {
          timestamp = sale.timestamp;
        }
      }
      return timestamp;
    },
    filteredSortedSales() {
      let results = this.sales;
      // if (this.settings.ownersSortOption == 'countasc') {
      //   results.sort((a, b) => {
      //     return a.count - b.count;
      //   });
      // } else if (this.settings.ownersSortOption == 'countdsc') {
      //   results.sort((a, b) => {
      //     return b.count - a.count;
      //   });
      // } else {
      //   results.sort(() => {
      //     return Math.random() - 0.5;
      //   });
      // }
      return results;
    },
    pagedFilteredSortedSales() {
      return this.filteredSortedSales.slice((this.settings.currentPage - 1) * this.settings.pageSize, this.settings.currentPage * this.settings.pageSize);
    },
  },
  methods: {
    updateURL(where) {
      this.$router.push('/enssales/' + where);
    },
    formatETH(e) {
      try {
        return e ? ethers.utils.commify(ethers.utils.formatEther(e)) : null;
      } catch (err) {
      }
      return e.toFixed(9);
    },
    formatTimestamp(ts) {
      if (ts != null) {
        return new Date(ts * 1000).toLocaleString();
      }
      return null;
    },
    updateFilter(field, filter) {
      console.log("updateFilter: " + field + " => " + JSON.stringify(filter));
      const filterUpdate = {};
      filterUpdate[field] = filter;
      store.dispatch('ensSales/updateFilter', filterUpdate);
    },
    async loadSales(syncMode) {
      // console.log("loadSales - syncMode: " + syncMode);
      store.dispatch('ensSales/loadSales', syncMode);
    },
    // async doit(action) {
    //   console.log("doit: " + JSON.stringify(action));
    //   store.dispatch('sales/doit', action);
    // },
    async halt() {
      store.dispatch('search/halt');
    },
    async timeoutCallback() {
      logDebug("ENSSales", "timeoutCallback() count: " + this.count);

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
    logDebug("ENSSales", "beforeDestroy()");
  },
  mounted() {
    logInfo("ENSSales", "mounted() $route: " + JSON.stringify(this.$route.params) + ", props['search']: " + this.search + ", props['topic']: " + this.topic);
    if (this.search == "summary") {
      this.settings.tabIndex = 0;
    } else if (this.search == "list") {
      this.settings.tabIndex = 1;
    }
    store.dispatch('ensSales/loadSales', 'mounted');

    this.reschedule = true;
    logDebug("ENSSales", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const ensSalesModule = {
  namespaced: true,
  state: {
    config: {
      background: true,
      segmentsPerDay: 1,
      retrieveLastDays: 7,
      deleteBeforeDays: 7, // merge into above?
      collections: [0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85],
      reservoirSalesV3BatchSize: 50,
    },
    filter: {
      searchString: null,
      searchAccounts: null,
      priceFrom: null,
      priceTo: null,
    },
    sales: [],
    message: null,
    halt: false,
    params: null,
    executing: false,
    db: {
      name: "aenusenssalesdb",
      version: 1,
      definition: {
        // nftData: '&tokenId,asset,timestamp',
        sales: '[chainId+contract+tokenId],chainId,contract,tokenId,name,from,to,price,timestamp',
      },
    },
  },
  getters: {
    config: state => state.config,
    filter: state => state.filter,
    sales: state => state.sales,
    message: state => state.message,
    params: state => state.params,
  },
  mutations: {
    // --- loadSales() ---
    async loadSales(state, { syncMode, filterUpdate }) {
      // --- loadSales() functions start ---
      function processRegistrations(registrations) {
        const results = {};
        for (const registration of registrations) {
          const tokenId = new BigNumber(registration.domain.labelhash.substring(2), 16).toFixed(0);
          results[tokenId] = registration.domain.name;
        }
        return results;
      }
      async function fetchNamesByTokenIds(tokenIds) {
        const data = await fetch(ENSSUBGRAPHURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: ENSSUBGRAPHBBYTOKENIDSQUERY,
            variables: { tokenIds: tokenIds },
          })
        }).then(response => response.json())
          .then(data => processRegistrations(data.data.registrations));
        // console.log(JSON.stringify(data, null, 2));
        return data;
      }
      async function processSales(data) {
        const searchForNamesByTokenIds = data.sales
          .map(sale => sale.token.tokenId)
          .map(tokenId => "0x" + new BigNumber(tokenId, 10).toString(16));
        const namesByTokenIds = await fetchNamesByTokenIds(searchForNamesByTokenIds);
        let count = 0;
        const saleRecords = [];
        const chainId = (store.getters['connection/network'] && store.getters['connection/network'].chainId) || 1;
        for (const sale of data.sales) {
          // if (count == 0) {
          //   logInfo("ensSalesModule", "mutations.loadSales().processSales() " + new Date(sale.timestamp * 1000).toLocaleString() + " " + (sale.token.name ? sale.token.name : "(null)") + ", price: " + sale.price + ", from: " + sale.from.substr(0, 10) + ", to: " + sale.to.substr(0, 10));
          // }
          const name = namesByTokenIds[sale.token.tokenId] ? namesByTokenIds[sale.token.tokenId] : sale.token.name;
          saleRecords.push({
            chainId: chainId,
            contract: ENSADDRESS,
            tokenId: sale.token.tokenId,
            name: name,
            from: sale.from,
            to: sale.to,
            price: sale.price,
            timestamp: sale.timestamp,
            tokenId: sale.token.tokenId,
            txHash: sale.txHash,
            data: sale,
          });
          count++;
        }
        await db0.sales.bulkPut(saleRecords).then (function() {
        }).catch(function(error) {
          console.log("error: " + error);
        });
        return saleRecords.length;
      }
      // async function fetchSales(startTimestamp, endTimestamp) {
      //   logInfo("ensSalesModule", "mutations.loadSales().fetchSales() - " + startTimestamp.toLocaleString() + " - " + endTimestamp.toLocaleString());
      //   const url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85&limit=" + state.config.reservoirSalesV3BatchSize + "&startTimestamp=" + parseInt(startTimestamp / 1000) + "&endTimestamp="+ parseInt(endTimestamp / 1000);
      //   let continuation = null;
      //   do {
      //     let url1;
      //     if (continuation == null) {
      //       url1 = url;
      //     } else {
      //       url1 = url + "&continuation=" + continuation;
      //     }
      //     const data = await fetch(url1)
      //       .then(response => response.json());
      //     await processSales(data);
      //     continuation = data.continuation;
      //   } while (continuation != null);
      // }
      async function updateDBFromAPI() {
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI()");
        const now = moment().unix();
        const earliestEntry = await db0.sales.orderBy("timestamp").first();
        const earliestDate = earliestEntry ? earliestEntry.timestamp : null;
        const latestEntry = await db0.sales.orderBy("timestamp").last();
        const latestDate = latestEntry ? latestEntry.timestamp : null;
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - now: " +
          moment.unix(now).utc().format() + " (" + now + "), " +
          "earliestDate: " + (earliestDate == null ? null : (moment.unix(earliestDate).utc().format() + " (" + earliestDate + ")")) +
          ", latestDate: " + (latestDate == null ? null : (moment.unix(latestDate).utc().format() + " (" + latestDate + ")"))
        );

        const segmentStart = moment.unix(now).utc().startOf('day').unix();
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - segmentStart: " + moment.unix(segmentStart).utc().format() + " (" + segmentStart + ")");

        // const segmentStart = new Date();
        // logInfo("ensSalesModule", "mutations.loadSales() - segmentStart: " + segmentStart.toLocaleString());
        // segmentStart.setHours(parseInt(segmentStart.getHours() / state.config.segmentsPerDay) * state.config.segmentsPerDay, 0, 0, 0);
        // const retrieveLastDate = new Date(segmentStart.getTime() - state.config.retrieveLastDays * MILLISPERDAY);
        const retrieveLastDate = moment.unix(now).utc().startOf('day').subtract(state.config.retrieveLastDays, 'day').unix();
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - retrieveLastDate: " + moment.unix(retrieveLastDate).utc().format() + " (" + retrieveLastDate + ")");
        // const deleteBeforeDate = new Date(segmentStart.getTime() - state.config.deleteBeforeDays * MILLISPERDAY);
        // logInfo("ensSalesModule", "mutations.loadSales() - segmentStart: " + segmentStart.toLocaleString() + ", retrieveLastDate: " + retrieveLastDate.toLocaleString() + ", deleteBeforeDate: " + deleteBeforeDate.toLocaleString());
        // const deleteBeforeDate = moment.unix(now).utc().startOf('day').subtract(state.config.deleteBeforeDays, 'day').unix();
        // logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - deleteBeforeDate: " + moment.unix(deleteBeforeDate).utc().format() + " (" + deleteBeforeDate + ")");

        // Get from start of today
        let to = now;
        let from = segmentStart;
        let dates;
        try {
          dates = JSON.parse(localStorage.ensSalesDates);
          // console.log("dates: " + JSON.stringify(Object.keys(dates)));
        } catch (e) {
          dates = {};
        };
        // DEV
        // dates = {};
        const sales = {};
        let count = 0;
        while (to > retrieveLastDate && !state.halt && count < 7) {
          let totalRecords = 0;
          if (!(from in dates)) {
            let processFrom = from;
            const processTo = to;
            if (processFrom == segmentStart) {
              if (processFrom < latestDate) {
                processFrom = latestDate;
              }
            }
            let continuation = null;
            do {
              let url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" +
                "&limit=" + state.config.reservoirSalesV3BatchSize +
                "&startTimestamp=" + processFrom +
                "&endTimestamp="+ processTo +
                (continuation != null ? "&continuation=" + continuation : '');
              // logInfo("ensSalesModule", "mutations.loadSales() - url: " + url);
              // logInfo("ensSalesModule", "mutations.loadSales() - Retrieving records for " + new Date(processFrom).toLocaleString() + " to " + new Date(processTo).toLocaleString());
              const data = await fetch(url)
                .then(response => response.json());
              let numberOfRecords = await processSales(data);
              totalRecords += numberOfRecords;
              continuation = data.continuation;
            } while (continuation != null);
            if (from != segmentStart && !state.halt) {
              // console.log("dates.push(" + from + ")");
              dates[from] = true;
            }
            if (totalRecords > 0) {
              logInfo("ensSalesModule", "mutations.loadSales() - Retrieved " +  totalRecords + " record(s) for " + moment.unix(processFrom).utc().format() + " to " + moment.unix(processTo).utc().format());
            } else {
              logInfo("ensSalesModule", "mutations.loadSales() - Nothing new");
            }
            count++;
          }
          to = from;
          // from = new Date(from.getTime() - MILLISPERDAY/state.config.segmentsPerDay);
          from = moment.unix(from).utc().subtract(1, 'day').unix();
        }
        localStorage.ensSalesDates = JSON.stringify(dates);
        logInfo("ensSalesModule", "mutations.loadSales() - processed dates: " + JSON.stringify(Object.keys(dates)));
      }
      async function refreshResultsFromDB() {
        const regex = state.filter.searchString != null && state.filter.searchString.length > 0 ? new RegExp(state.filter.searchString, 'i') : null;
        const searchAccounts = state.filter.searchAccounts ? state.filter.searchAccounts.split(/[, \t\n]+/).map(s => s.trim().toLowerCase()) : null;
        const priceFrom = state.filter.priceFrom && parseFloat(state.filter.priceFrom) > 0 ? parseFloat(state.filter.priceFrom) : null;
        const priceTo = state.filter.priceTo && parseFloat(state.filter.priceTo) > 0 ? parseFloat(state.filter.priceTo) : null;
        const salesFromDB = await db0.sales.orderBy("timestamp").reverse().toArray();
        const saleRecords = [];
        let count = 0;
        for (const sale of salesFromDB) {
          let include = true;
          const name = sale.name && sale.name.replace('.eth', '') || null;
          if (regex && !regex.test(name)) {
            include = false;
          }
          if (include && searchAccounts != null) {
            let found = false;
            for (searchAccount of searchAccounts) {
              if (sale.from.includes(searchAccount) || sale.to.includes(searchAccount)) {
                found = true;
                break;
              }
            }
            if (!found) {
              include = false;
            }
          }
          if (include && priceFrom != null) {
            if (sale.price < priceFrom) {
              include = false;
            }
          }
          if (include && priceTo != null) {
            if (sale.price > priceTo) {
              include = false;
            }
          }
          if (include) {
            saleRecords.push({
              name: sale.name,
              from: sale.from,
              to: sale.to,
              price: sale.price,
              timestamp: sale.timestamp,
              tokenId: sale.tokenId,
              txHash: sale.txHash,
            });
            count++;
          }
        }
        state.sales = saleRecords;
      }
      // --- loadSales() functions end ---

      // --- loadSales() start ---
      logInfo("ensSalesModule", "mutations.loadSales() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));

      console.log("filter before: " + JSON.stringify(state.filter));
      if (filterUpdate != null) {
        console.log("updating filter with: " + JSON.stringify(filterUpdate));
        state.filter = { ...state.filter, ...filterUpdate };
        console.log("filter after: " + JSON.stringify(state.filter));
      }

      if (syncMode == 'full') {
        logInfo("ensSalesModule", "mutations.loadSales() - deleting db");
        Dexie.delete("aenusenssalesdb");
        localStorage.ensSalesDates = undefined;
      }

      const db0 = new Dexie("aenusenssalesdb");
      db0.version(1).stores({
        // nftData: '&tokenId,asset,timestamp',
        sales: '[chainId+contract+tokenId],chainId,contract,tokenId,name,from,to,price,timestamp',
      });

      const deleteBeforeDate = moment.utc().startOf('day').subtract(state.config.deleteBeforeDays, 'day').unix();
      logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - deleteBeforeDate: " + moment.unix(deleteBeforeDate).utc().format() + " (" + deleteBeforeDate + ")");
      db0.transaction('rw', db0.sales, function* () {
        var deleteCount = yield db0.sales.where("timestamp").below(deleteBeforeDate).delete();
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - deleted " + deleteCount + " old records");
        const ensSalesDates = JSON.parse(localStorage.ensSalesDates);
        Object.keys(ensSalesDates).forEach(function (timestamp) {
          if (timestamp < deleteBeforeDate) {
            delete ensSalesDates[timestamp];
          }
        });
        localStorage.ensSalesDates = JSON.stringify(ensSalesDates);
      }).catch (e => {
          console.error (e);
      });

      if (syncMode == 'mounted') {
        await refreshResultsFromDB();
      }
      if (syncMode != 'updateFilter') {
        await updateDBFromAPI();
      }
      await refreshResultsFromDB();
      state.message = null;
      state.halt = false;

      db0.close();
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    updateFilter(context, filterUpdate) {
      logInfo("ensSalesModule", "filterUpdates.updateFilter() - filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('loadSales', { syncMode: 'updateFilter', filterUpdate });
    },
    loadSales(context, syncMode) {
      // logInfo("ensSalesModule", "actions.loadSales() - syncMode: " + syncMode);
      context.commit('loadSales', { syncMode: syncMode, filterUpdate: null } );
    },
    halt(context) {
      // logInfo("ensSalesModule", "actions.halt()");
      context.commit('halt');
    },
  },
};


// history.pushState({}, null, `${this.$route.path}#${encodeURIComponent(params)}`);
// history.pushState({}, null, `${this.$route.path}#blah`);

// console.log("navigator.userAgent: " + navigator.userAgent);
// console.log("isMobile: " + (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));
