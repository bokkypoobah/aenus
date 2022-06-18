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

          <b-card-body class="m-1 p-1">
            <!--
            <b-button size="sm" @click="doit( { type: 'fullsync' } );" variant="primary">Retrieve Latest 50 Sales</b-button>
            <span v-if="searchMessage != null">
              <b-button size="sm" @click="halt" variant="primary">Halt</b-button>
            </span>
            <b-button size="sm" @click="doit( { action: 'startService' } );" variant="primary">Start Service</b-button>
            <b-button size="sm" @click="doit( { action: 'stopService' } );" variant="primary">Stop Service</b-button>
            -->
          </b-card-body>
          <b-card-body class="m-1 p-1">
            <div class="d-flex flex-wrap m-0 p-0" style="min-height: 37px;">
              <div class="mt-2 pr-4">
                <b-form-input type="text" size="sm" :value="filter.searchString" @change="updateFilter('searchString', $event)" debounce="600" placeholder="🔍 {regex}"></b-form-input>
              </div>
              <div class="mt-2 pr-1" style="max-width: 100px;">
                <b-form-input type="text" size="sm" :value="filter.priceFrom" @change="updateFilter('priceFrom', $event)" debounce="600" placeholder="ETH from"></b-form-input>
              </div>
              <div class="mt-2 pr-1">
                -
              </div>
              <div class="mt-2 pr-2" style="max-width: 100px;">
              <b-form-input type="text" size="sm" :value="filter.priceTo" @change="updateFilter('priceTo', $event)" debounce="600" placeholder="ETH to"></b-form-input>
              </div>
              <div class="mt-2 pr-1 flex-grow-1">
              </div>
              <div class="mt-2 pr-1">
                <b-dropdown v-if="message == null" split size="sm" text="Sync" @click="loadSales(false)" variant="primary" v-b-popover.hover.bottom="'Partial Sync'">
                  <b-dropdown-item @click="loadSales(true)">Full Sync</b-dropdown-item>
                </b-dropdown>
                <b-button v-if="message != null" size="sm" @click="halt" variant="primary" v-b-popover.hover.bottom="'Halt'" >{{ message }}</b-button>
              </div>
              <div class="mt-2 pr-1 flex-grow-1">
              </div>
            </div>
            <b-table small striped hover :fields="salesFields" :items="sales" table-class="w-auto" class="mt-1">
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
  data: function() {
    return {
      count: 0,
      reschedule: true,

      settings: {
        // sortOption: 'nameasc',
        // randomise: false,

        // resultsPageSize: 100,
        // resultsCurrentPage: 1,

        // imageSize: '240',

        // resultsTabIndex: 0,
      },

      results: [],

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
    explorer () {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    network() {
      return store.getters['connection/network'];
    },
    filter() {
      return store.getters['sales/filter'];
    },
    sales() {
      return store.getters['sales/sales'];
    },
    message() {
      return store.getters['sales/message'];
    },
  },
  methods: {
    formatETH(e) {
      try {
        return e ? ethers.utils.commify(ethers.utils.formatEther(e)) : null;
      } catch (err) {
      }
      return e.toFixed(9);
    },
    formatTimestamp(ts) {
      return new Date(ts * 1000).toLocaleString();
    },
    updateFilter(field, filter) {
      console.log("updateFilter: " + field + " => " + JSON.stringify(filter));
      store.dispatch('sales/updateFilter', { field, filter} );
    },
    async loadSales(fullSync) {
      // console.log("loadSales - fullSync: " + fullSync);
      store.dispatch('sales/loadSales', fullSync);
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
    logInfo("ENSSales", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("ENSSales", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const salesModule = {
  namespaced: true,
  state: {
    config: {
      background: true,
      segmentsPerDay: 6,
      retrieveLastDays: 14,
      deleteBeforeDays: 3,
      collections: [0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85],
      reservoirSalesV3BatchSize: 50,
    },
    filter: {
      searchString: "^[0-9]*$",
      priceFrom: 0.01,
      priceTo: 12.34,
    },
    sales: [],
    message: null,
    halt: false,
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    config: state => state.config,
    filter: state => state.filter,
    sales: state => state.sales,
    message: state => state.message,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    // --- addToExecutionQueue() ---
    async addToExecutionQueue(state, action) {
      logInfo("salesModule", "mutations.addToExecutionQueue() - executionQueue: " + JSON.stringify(state.executionQueue));
      // TODO - Not working
      if (!state.executionQueue.includes(action)) {
        state.executionQueue.push(action);
      } else {
        logInfo("salesModule", "mutations.addToExecutionQueue() - already existing action: " + JSON.stringify(action) + ", queue: " + JSON.stringify(state.executionQueue));
      }
      logInfo("salesModule", "mutations.addToExecutionQueue() - action: " + JSON.stringify(action) + ", queue: " + JSON.stringify(state.executionQueue));
    },
    // --- loadSales() ---
    async loadSales(state, fullSync) {
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
          //   logInfo("salesModule", "mutations.loadSales().processSales() " + new Date(sale.timestamp * 1000).toLocaleString() + " " + (sale.token.name ? sale.token.name : "(null)") + ", price: " + sale.price + ", from: " + sale.from.substr(0, 10) + ", to: " + sale.to.substr(0, 10));
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
      //   logInfo("salesModule", "mutations.loadSales().fetchSales() - " + startTimestamp.toLocaleString() + " - " + endTimestamp.toLocaleString());
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
        logInfo("salesModule", "mutations.loadSales().updateDBFromAPI()");
        const now = new Date();
        const earliestEntry = await db0.sales.orderBy("timestamp").first();
        const earliestDate = earliestEntry ? new Date(earliestEntry.timestamp * 1000) : null;
        const latestEntry = await db0.sales.orderBy("timestamp").last();
        const latestDate = latestEntry ? new Date(latestEntry.timestamp * 1000) : null;
        // logInfo("salesModule", "mutations.loadSales() - db: " + (earliestDate ? earliestDate.toLocaleString() : '(null)') + " to " + (latestDate ? latestDate.toLocaleString() : '') + " @ " + now.toLocaleString());

        const segmentStart = new Date();
        segmentStart.setHours(parseInt(segmentStart.getHours() / state.config.segmentsPerDay) * state.config.segmentsPerDay, 0, 0, 0);
        const retrieveLastDate = new Date(segmentStart.getTime() - state.config.retrieveLastDays * MILLISPERDAY);
        const deleteBeforeDate = new Date(segmentStart.getTime() - state.config.deleteBeforeDays * MILLISPERDAY);
        // logInfo("salesModule", "mutations.loadSales() - segmentStart: " + segmentStart.toLocaleString() + ", retrieveLastDate: " + retrieveLastDate.toLocaleString() + ", deleteBeforeDate: " + deleteBeforeDate.toLocaleString());

        // Get from start of today
        let to = now;
        let from = segmentStart;
        let dates;
        try {
          dates = JSON.parse(localStorage.dates);
        } catch (e) {
          dates = {};
        };
        // dates = {};
        const sales = {};
        let count = 0;
        while (to > retrieveLastDate && !state.halt && count < 2) {
          let totalRecords = 0;
          if (!(from.toLocaleString() in dates)) {
            let processFrom = from;
            const processTo = to;
            if (processFrom == segmentStart) {
              if (processFrom < latestDate) {
                processFrom = new Date(latestDate.getTime() + 1000);
              }
            }
            let continuation = null;
            do {
              let url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" +
                "&limit=" + state.config.reservoirSalesV3BatchSize +
                "&startTimestamp=" + parseInt(processFrom.getTime() / 1000) +
                "&endTimestamp="+ parseInt(processTo.getTime() / 1000) +
                (continuation != null ? "&continuation=" + continuation : '');
              // logInfo("salesModule", "mutations.loadSales() - url: " + url);
              // logInfo("salesModule", "mutations.loadSales() - Retrieving records for " + new Date(processFrom).toLocaleString() + " to " + new Date(processTo).toLocaleString());
              const data = await fetch(url)
                .then(response => response.json());
              let numberOfRecords = await processSales(data);
              totalRecords += numberOfRecords;
              continuation = data.continuation;
            } while (continuation != null);
            if (from != segmentStart && !state.halt) {
              dates[from.toLocaleString()] = true;
            }
            if (totalRecords > 0) {
              logInfo("salesModule", "mutations.loadSales() - Retrieved " +  totalRecords + " record(s) for " + new Date(processFrom).toLocaleString() + " to " + new Date(processTo).toLocaleString());
            } else {
              logInfo("salesModule", "mutations.loadSales() - Nothing new");
            }
            count++;
          }
          to = from;
          from = new Date(from.getTime() - MILLISPERDAY/state.config.segmentsPerDay);
        }
        localStorage.dates = JSON.stringify(dates);
        // logInfo("salesModule", "mutations.loadSales() - processed dates: " + JSON.stringify(Object.keys(dates)));
      }
      async function refreshResultsFromDB() {
        const salesFromDB = await db0.sales.orderBy("timestamp").reverse().limit(100).toArray();
        const saleRecords = [];
        let count = 0;
        for (const sale of salesFromDB) {
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
        state.sales = saleRecords;
      }
      // --- loadSales() functions end ---

      // --- loadSales() start ---
      // state.executionQueue.push(options);
      logInfo("salesModule", "mutations.loadSales() - fullSync: " + fullSync);

      const db0 = new Dexie("aenusenssalesdb");
      db0.version(1).stores({
        // nftData: '&tokenId,asset,timestamp',
        sales: '[chainId+contract+tokenId],chainId,contract,tokenId,name,from,to,price,timestamp',
      });

      // let execute;
      // do {
      //   execute = state.executionQueue.shift();
      //   if (execute) {
      //     // console.log("    execute: " + JSON.stringify(execute));
      //     // Refresh results from API to DB
      //     if (execute.action == "refresh") {
            await updateDBFromAPI();
          // }
          // // Refresh results from DB to memory
          // if (execute.action == "refresh") {
            await refreshResultsFromDB();
      //     }
      //   }
      // } while (execute != null && !state.halt);
      state.message = null;
      state.halt = false;

      db0.close();
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    // execWeb3( { state, commit, rootState }, { count } ) {
    //   logInfo("salesModule", "actions.execWeb3() - count: " + count);
    //   commit('doit', { action: "refresh" } );
    // },
    updateFilter(context, action) {
      logInfo("salesModule", "actions.updateFilter() - action: " + JSON.stringify(action));
      // context.commit('addToExecutionQueue', action);
    },
    loadSales(context, fullSync) {
      // logInfo("salesModule", "actions.loadSales() - fullSync: " + fullSync);
      context.commit('loadSales', fullSync);
    },
    halt(context) {
      // logInfo("salesModule", "actions.halt()");
      context.commit('halt');
    },
  },
};


// history.pushState({}, null, `${this.$route.path}#${encodeURIComponent(params)}`);
// history.pushState({}, null, `${this.$route.path}#blah`);

// console.log("navigator.userAgent: " + navigator.userAgent);
// console.log("isMobile: " + (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));
