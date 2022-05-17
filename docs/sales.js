const Sales = {
  template: `
    <div class="mt-5 pt-3 pl-1 pr-1">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="false && (!powerOn || network.chainId != 1)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Ethereum mainnet and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="ENS Name Sales" class="border-0" header-class="p-0">

        <b-card no-body class="p-0 mt-1">

          <b-card-body class="m-1 p-1">
            <b-button size="sm" @click="doit( { type: 'fullsync' } );" :disabled="searchMessage != null" variant="primary">{{ searchMessage ? searchMessage : 'Retrieve Latest 50 Sales'}}</b-button>
            <span v-if="searchMessage != null">
              <b-button size="sm" @click="halt" variant="primary">Halt</b-button>
            </span>
          </b-card-body>
          <b-card-body class="m-1 p-1">
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
  data: function () {
    return {
      count: 0,
      reschedule: true,

      settings: {
        sortOption: 'nameasc',
        randomise: false,

        resultsPageSize: 100,
        resultsCurrentPage: 1,

        imageSize: '240',

        resultsTabIndex: 0,
      },

      searchOptions: [
        { value: 'exact', text: 'Exact Name' },
        { value: 'contains', text: 'Name Contains' },
        { value: 'startswith', text: 'Name Starts With' },
        { value: 'endswith', text: 'Name Ends With' },
      ],

      pageSizes: [
        { value: 10, text: '10/P' },
        { value: 100, text: '100/P' },
        { value: 500, text: '500/P' },
        { value: 1000, text: '1,000/P' },
        { value: 2145, text: '2,145/P' },
        { value: 66666, text: 'ALL' },
      ],

      setOptions: [
        { value: 'digit9', text: 'Digits 0 to 9 [prefix/postfix required for min 3 length]' },
        { value: 'digit99', text: 'Digits 00 to 99, [prefix/postfix required for min 3 length]' },
        { value: 'digit999', text: 'Digits 000 to 999 [Club999]' },
        { value: 'digit9999', text: 'Digits 0000 to 9999 [Club10k]' },
        { value: 'digit99999', text: 'Digits 00000 to 99999 [Club100k]' },
        { value: 'digit999999', text: 'Digits 000000 to 999999' },
        { value: 'digit9999999', text: 'Digits 0000000 to 9999999' },
        { value: 'digit99999999', text: 'Digits 00000000 to 99999999' },
        { value: 'hours', text: 'Hours 00h00 to 23h59' },
      ],

      imageSizeOptions: [
        { value: '93', text: '93%' },
        { value: '115', text: '115%' },
        { value: '240', text: '240%' },
        { value: '300', text: '300%' },
        { value: '500', text: '500%' },
        { value: '750', text: '750%' },
        { value: '1000', text: '1,000%' },
        { value: '1500', text: '1,500%' },
        { value: '3000', text: '3,000%' },
        { value: '6000', text: '6,000%' },
        { value: '12000', text: '12,000%' },
      ],

      results: [],

      sortOptions: [
        { value: 'nameasc', text: 'Name Ascending' },
        { value: 'namedsc', text: 'Name Descending' },
        { value: 'priceasc', text: 'Price Ascending' },
        { value: 'pricedsc', text: 'Price Descending' },
        { value: 'expiryasc', text: 'Expiry Ascending' },
        { value: 'expirydsc', text: 'Expiry Descending' },
        { value: 'registrationasc', text: 'Registration Ascending' },
        { value: 'registrationdsc', text: 'Registration Descending' },
        { value: 'lengthname', text: 'Length Ascending, Name Ascending' },
        { value: 'random', text: 'Random' },
      ],

      resultsFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;' },
        { key: 'image', label: 'Image', thStyle: 'width: 10%;', sortable: false },
        { key: 'name', label: 'Name', thStyle: 'width: 30%;', sortable: false },
        { key: 'registrant', label: 'Registrant/Controller/Resolved Address', thStyle: 'width: 35%;', sortable: false },
        { key: 'expiryDate', label: 'Expiry/Registration (UTC)', thStyle: 'width: 20%;', sortable: false },
      ],
      summaryFields: [
        { key: 'names', label: 'Names' },
      ],
      ownersFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;' },
        { key: 'registrant', label: 'Registrant', thStyle: 'width: 30%;' },
        { key: 'length', label: '#Names', thStyle: 'width: 5%;' },
        { key: 'names', label: 'Names', thStyle: 'width: 60%;' },
      ],

      // saleRecords.push({
      //   chainId: chainId,
      //   contract: ENSADDRESS,
      //   tokenId: sale.token.tokenId,
      //   name: name,
      //   from: sale.from,
      //   to: sale.to,
      //   price: sale.price,
      //   timestamp: sale.timestamp,
      //   // data: sale,
      // });

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
    searchResults() {
      return store.getters['search/results'];
    },
    unregistered() {
      return store.getters['search/unregistered'];
    },
    searchMessage() {
      return store.getters['search/message'];
    },
    groups() {
      return store.getters['config/groups'];
    },
    prices() {
      return store.getters['search/prices'];
    },
    sales() {
      return store.getters['sales/sales'];
    },

    groupOptions() {
      const results = [];
      if (this.groups) {
        if (this.coinbase) {
          results.push({ value: null, text: "Current account (" + this.coinbase + ")" });
        } else {
          results.push({ value: null, text: "Connect your web3 wallet & create your groups in Config" });
        }
        let i = 0;
        for (const group of this.groups) {
          results.push({ value: i++, text: group.name });
        }
      }
      return results;
    },
    filteredResults() {
      const results = this.settings.randomise ? [] : [];
      const regex = this.settings.filter != null && this.settings.filter.length > 0 ? new RegExp(this.settings.filter, 'i') : null;
      const priceFrom = this.settings.priceFrom && parseFloat(this.settings.priceFrom) > 0 ? parseFloat(this.settings.priceFrom) : null;
      const priceTo = this.settings.priceTo && parseFloat(this.settings.priceTo) > 0 ? parseFloat(this.settings.priceTo) : null;

      if (regex == null && priceFrom == null && priceTo == 0) {
        for (result of Object.values(this.searchResults)) {
          results.push(result);
        }
      } else {
        for (result of Object.values(this.searchResults)) {
          let include = true;
          if (regex && !regex.test(result.labelName)) {
            include = false;
          }
          if (include && (priceFrom || priceTo)) {
            const price = this.prices[result.tokenId] && this.prices[result.tokenId].floorAskPrice;
            if (price) {
              if (priceFrom && price < priceFrom) {
                include = false;
              } else if (priceTo && price > priceTo) {
                include = false;
              }
            } else {
              include = false;
            }
          }
          if (include) {
            results.push(result);
          }
        }
      }

      if (this.settings.sortOption == 'nameasc') {
        results.sort(function (a, b) {
            return ('' + a.labelName).localeCompare(b.labelName);
        })
      } else if (this.settings.sortOption == 'namedsc') {
        results.sort(function (a, b) {
            return ('' + b.labelName).localeCompare(a.labelName);
        })
      } else if (this.settings.sortOption == 'priceasc') {
        results.sort((a, b) => {
          const pricea = this.prices[a.tokenId] ? this.prices[a.tokenId].floorAskPrice : null;
          const priceb = this.prices[b.tokenId] ? this.prices[b.tokenId].floorAskPrice : null;
          if (pricea == priceb) {
            return ('' + a.labelName).localeCompare(b.labelName);
          } else if (pricea != null && priceb == null) {
            return -1;
          } else if (pricea == null && priceb != null) {
            return 1;
          } else {
            return pricea - priceb;
          }
        });
      } else if (this.settings.sortOption == 'pricedsc') {
        results.sort((a, b) => {
          const pricea = this.prices[a.tokenId] ? this.prices[a.tokenId].floorAskPrice : null;
          const priceb = this.prices[b.tokenId] ? this.prices[b.tokenId].floorAskPrice : null;
          if (pricea == priceb) {
            return ('' + a.labelName).localeCompare(b.labelName);
          } else if (pricea != null && priceb == null) {
            return -1;
          } else if (pricea == null && priceb != null) {
            return 1;
          } else {
            return priceb - pricea;
          }
        });
      } else if (this.settings.sortOption == 'expiryasc') {
        results.sort((a, b) => {
          return a.expiryDate - b.expiryDate;
        });
      } else if (this.settings.sortOption == 'expirydsc') {
        results.sort((a, b) => {
          return b.expiryDate - a.expiryDate;
        });
      } else if (this.settings.sortOption == 'registrationasc') {
        results.sort((a, b) => {
          return a.registrationDate - b.registrationDate;
        });
      } else if (this.settings.sortOption == 'registrationdsc') {
        results.sort((a, b) => {
          return b.registrationDate - a.registrationDate;
        });
      } else if (this.settings.sortOption == 'lengthname') {
        results.sort((a, b) => {
          if (a.length == b.length) {
            return ('' + a.labelName).localeCompare(b.labelName);
          } else {
            return a.length - b.length;
          }
        });
      } else {
        results.sort(() => {
          return Math.random() - 0.5;
        });
      }
      return results;
    },
    pagedFilteredResults() {
      return this.filteredResults.slice((this.settings.resultsCurrentPage - 1) * this.settings.resultsPageSize, this.settings.resultsCurrentPage * this.settings.resultsPageSize);
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
    formatBuyOrSell(buyOrSell) {
      return BUYORSELLSTRING[buyOrSell];
    },
    formatAnyOrAll(anyOrAll) {
      return ANYORALLSTRING[anyOrAll];
    },
    formatOrderStatus(orderStatus) {
      return ORDERSTATUSSTRING[orderStatus];
    },
    formatDate(d) {
      if (d == 0) {
        return "(no expiry)";
      } else {
        if (new RegExp('^[0-9]+$').test(d)) {
          return new Date(parseInt(d) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''); // .substring(4);
        } else {
          return new Date(d).toDateString().substring(4);
        }
      }
    },
    formatTimestamp(ts) {
      return new Date(ts * 1000).toLocaleString();
    },

    setPowerOn() {
      store.dispatch('connection/setPowerOn', true);
      localStorage.setItem('powerOn', true);
      var t = this;
      setTimeout(function() {
        t.statusSidebar = true;
      }, 1500);
    },

    async doit(options) {
      console.log("doit: " + JSON.stringify(options));
      store.dispatch('sales/doit', options);
    },

    async halt() {
      store.dispatch('search/halt');
    },

    async timeoutCallback() {
      logDebug("Sales", "timeoutCallback() count: " + this.count);

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
    logDebug("Sales", "beforeDestroy()");
  },
  mounted() {
    logInfo("Sales", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("Sales", "Calling timeoutCallback()");
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
      segmentsPerDay: 2,
      retrieveLastDays: 1,
      deleteBeforeDays: 3,
      collections: [0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85],
      reservoirSalesV3BatchSize: 50,
    },
    sales: [],
    message: null,
    halt: false,
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    sales: state => state.sales,
    message: state => state.message,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    // --- doit() ---
    async doit(state, options) {
      // --- doit() functions start ---
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
          .map(function(sale) { return sale.token.tokenId; })
          .map(function(tokenId) { return "0x" + new BigNumber(tokenId, 10).toString(16); });
        const namesByTokenIds = await fetchNamesByTokenIds(searchForNamesByTokenIds);
        let count = 0;
        const saleRecords = [];
        const chainId = (store.getters['connection/network'] && store.getters['connection/network'].chainId) || 1;
        for (const sale of data.sales) {
          if (count == 0) {
            logInfo("salesModule", "mutations.doit().processSales() " + new Date(sale.timestamp * 1000).toLocaleString() + " " + (sale.token.name ? sale.token.name : "(null)") + ", price: " + sale.price + ", from: " + sale.from.substr(0, 10) + ", to: " + sale.to.substr(0, 10));
          }
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
      }
      async function fetchSales(startTimestamp, endTimestamp) {
        logInfo("salesModule", "mutations.doit().fetchSales() - " + startTimestamp.toLocaleString() + " - " + endTimestamp.toLocaleString());
        const url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85&limit=" + state.config.reservoirSalesV3BatchSize + "&startTimestamp=" + parseInt(startTimestamp / 1000) + "&endTimestamp="+ parseInt(endTimestamp / 1000);
        let continuation = null;
        do {
          let url1;
          if (continuation == null) {
            url1 = url;
          } else {
            url1 = url + "&continuation=" + continuation;
          }
          const data = await fetch(url1)
            .then(response => response.json());
          await processSales(data);
          continuation = data.continuation;
        } while (continuation != null);
      }
      // --- doit() functions end ---

      // --- doit() start ---
      logInfo("salesModule", "mutations.doit() - ----- options: " + JSON.stringify(options) + ", queue: " + JSON.stringify(state.executionQueue) + " @ " + new Date().toLocaleString() + " -----");

      const db0 = new Dexie("aenusdb");
      db0.version(1).stores({
        // nftData: '&tokenId,asset,timestamp',
        sales: '[chainId+contract+tokenId],chainId,contract,tokenId,name,from,to,price,timestamp',
      });
      const now = new Date();
      const earliestEntry = await db0.sales.orderBy("timestamp").first();
      const earliestDate = earliestEntry ? new Date(earliestEntry.timestamp * 1000) : null;
      const latestEntry = await db0.sales.orderBy("timestamp").last();
      const latestDate = latestEntry ? new Date(latestEntry.timestamp * 1000) : null;
      logInfo("salesModule", "mutations.doit() - db: " + (earliestDate ? earliestDate.toLocaleString() : '(null)') + " to " + (latestDate ? latestDate.toLocaleString() : '') + " @ " + now.toLocaleString());

      const segmentStart = new Date();
      segmentStart.setHours(parseInt(segmentStart.getHours() / state.config.segmentsPerDay) * state.config.segmentsPerDay, 0, 0, 0);
      const retrieveLastDate = new Date(segmentStart.getTime() - state.config.retrieveLastDays * MILLISPERDAY);
      const deleteBeforeDate = new Date(segmentStart.getTime() - state.config.deleteBeforeDays * MILLISPERDAY);
      logInfo("salesModule", "mutations.doit() - segmentStart: " + segmentStart.toLocaleString() + ", retrieveLastDate: " + retrieveLastDate.toLocaleString() + ", deleteBeforeDate: " + deleteBeforeDate.toLocaleString());

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
      while (to > retrieveLastDate && !state.halt) {
        if (!(from.toLocaleString() in dates)) {
          let processFrom = from;
          const processTo = to;
          if (processFrom == segmentStart) {
            if (processFrom < latestDate) {
              processFrom = latestDate;
            }
          }
          logInfo("salesModule", "mutations.doit() - processing " + new Date(processFrom).toLocaleString() + " - " + new Date(processTo).toLocaleString());
          await fetchSales(processFrom, processTo);
          if (from != segmentStart && !state.halt) {
            dates[from.toLocaleString()] = true;
          }
        }
        to = from;
        from = new Date(from.getTime() - MILLISPERDAY/state.config.segmentsPerDay);
      }
      localStorage.dates = JSON.stringify(dates);
      logInfo("salesModule", "mutations.doit() - processed dates: " + JSON.stringify(Object.keys(dates)));

      // Retrieve results as filtered
      const salesFromDB = await db0.sales.orderBy("timestamp").reverse().toArray();
      const saleRecords = [];
      let count = 0;
      for (const sale of salesFromDB) {
        // if (count == 0) {
        //   logInfo("salesModule", "mutations.doit() - results " + JSON.stringify(sale));
        // }
        const name = /*namesByTokenIds[sale.token.tokenId] ? namesByTokenIds[sale.token.tokenId] :*/ sale.name;
        saleRecords.push({
          name: name,
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
      state.message = null;
      state.halt = false;

      db0.close();
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    async execWeb3( { state, commit, rootState }, { count } ) {
      // logInfo("salesModule", "actions.execWeb3() - count: " + count);
      commit('doit', { action: "refresh" } );
    },
    doit(context, options) {
      logInfo("salesModule", "actions.doit() - options: " + JSON.stringify(options));
      context.commit('doit', options);
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
