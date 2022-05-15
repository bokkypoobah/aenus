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
            <b-table small striped hover :items="sales" table-class="w-auto" thead-class="hidden_header" class="mt-1">
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
        searchTabIndex: 0,
        searchString: null,
        searchCommonRegistrants: false,
        searchType: 'exact',
        selectedGroup: null,
        selectedSet: 'digit999',
        filter: null,
        priceFrom: null,
        priceTo: null,
        sortOption: 'nameasc',
        randomise: false,

        resultsPageSize: 100,
        resultsCurrentPage: 1,

        imageSize: '240',

        resultsTabIndex: 0,

        setAttributes: {
          'hours': {
            type: 'hours',
            from: 0,
            to: 23,
            step: 1,
            length: 2,

            from2: 0,
            to2: 59,
            step2: 1,
            separator: 'h',
          },
          'digit9': {
            type: 'digits',
            from: 0,
            to: 9,
            step: 1,
            length: 1,
            regex: null,
            palindrome: false,
            prefix: null,
            postfix: null,
          },
          'digit99': {
            type: 'digits',
            from: 0,
            to: 99,
            step: 1,
            length: 2,
            regex: null,
            palindrome: false,
            prefix: null,
            postfix: null,
          },
          'digit999': {
            type: 'digits',
            from: 0,
            to: 999,
            step: 1,
            length: 3,
            regex: null,
            palindrome: false,
            prefix: null,
            postfix: null,
          },
          'digit9999': {
            type: 'digits',
            from: 0,
            to: 9999,
            step: 1,
            length: 4,
            regex: null,
            palindrome: false,
            prefix: null,
            postfix: null,
          },
          'digit99999': {
            type: 'digits',
            from: 0,
            to: 9999,
            step: 1,
            length: 5,
            regex: null,
            palindrome: false,
            prefix: null,
            postfix: null,
          },
          'digit999999': {
            type: 'digits',
            from: 0,
            to: 9999,
            step: 1,
            length: 6,
            regex: null,
            palindrome: false,
            prefix: null,
            postfix: null,
          },
          'digit9999999': {
            type: 'digits',
            from: 0,
            to: 9999,
            step: 1,
            length: 7,
            regex: null,
            palindrome: false,
            prefix: null,
            postfix: null,
          },
          'digit99999999': {
            type: 'digits',
            from: 0,
            to: 9999,
            step: 1,
            length: 8,
            regex: null,
            palindrome: false,
            prefix: null,
            postfix: null,
          },
        },
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
    sales: [],
    tempSales: [],
    db0: null,
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
    // --- Doit ---
    async doit(state, options) {
      async function fetchSales(startTimestamp, endTimestamp) {
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
          console.log(JSON.stringify(data, null, 2));
          return data;
        }
        async function processSales(data) {
          console.log("processSales - state.db0 before");
          console.table(state.db0);
          if (state.db0 == null) {
            state.db0 = new Dexie("aenusdb");
            state.db0.version(1).stores({
              // nftData: '&tokenId,asset,timestamp',
              sales: '[chainId+contract+tokenId],chainId,contract,tokenId,name,from,to,price,timestamp',
              // tokenURIs: '[chainId+contract+tokenId],chainId,contract,tokenId,tokenURI,timestamp',
            });
          }
          console.log("processSales - state.db0 after");
          console.table(state.db0);

          if (data.sales && data.sales.length > 0) {
            console.log(JSON.stringify(data.sales[0], null, 2));
          }
          const searchForNamesByTokenIds = data.sales
            // .filter(function (sale) { return sale.token.name == null ; })
            .map(function(sale) { return sale.token.tokenId; })
            .map(function(tokenId) { return "0x" + new BigNumber(tokenId, 10).toString(16); });
          // console.log("searchForNamesByTokenIds: " + JSON.stringify(searchForNamesByTokenIds));

          const namesByTokenIds = await fetchNamesByTokenIds(searchForNamesByTokenIds);
          // console.log("namesByTokenIds: " + JSON.stringify(namesByTokenIds));

          let count = 0;
          const saleRecords = [];
          const chainId = 1; // store.getters['connection/network'].chainId`;
          for (const sale of data.sales) {
            if (count == 0) {
              console.log(sale.token.tokenId.substring(0, 20) + ", name: " + (sale.token.name ? sale.token.name : "(null)") + ", price: " + sale.price + ", from: " + sale.from.substr(0, 10) + ", to: " + sale.to.substr(0, 10) + ", timestamp: " + new Date(sale.timestamp * 1000).toUTCString());
              console.log(JSON.stringify(sale, null, 2));
            }
            const name = namesByTokenIds[sale.token.tokenId];
            state.tempSales.push( { name: name, from: sale.from, to: sale.to, price: sale.price, timestamp: sale.timestamp, tokenId: sale.token.tokenId } );
            saleRecords.push({
              chainId: chainId,
              contract: ENSADDRESS,
              tokenId: sale.token.tokenId,
              name: name,
              from: sale.from,
              to: sale.to,
              price: sale.price,
              timestamp: sale.timestamp,
              data: sale,
            });
            count++;
          }
          // await state.db0.sales.bulkPut(saleRecords).then (function() {
          // }).catch(function(error) {
          //   console.log("error: " + error);
          // });
        }

        // --- fetchSales() start ---
        logInfo("salesModule", "mutations.fetchSales() - startTimestamp: " + new Date(startTimestamp * 1000).toUTCString() + ", endTimestamp: " + new Date(endTimestamp * 1000).toUTCString());
        const url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85&limit=50";
        await fetch(url)
          .then(response => response.json())
          .then(data => processSales(data));;
      }

      // --- doit() start ---
      logInfo("salesModule", "mutations.doit() - options: " + JSON.stringify(options) + " @ " + new Date().toUTCString());

      // get prices
      // let keys = Object.keys(state.results);
      const GETPRICEBATCHSIZE = 50;
      // records = 0;
      const sales = {};
      const DELAYINMILLIS = 500;
      let completed = false;
      let startTimestamp = new Date()/1000 - SECONDSPERHOUR;
      let endTimestamp = new Date()/1000;
      while (!completed && !state.halt) {
        await fetchSales(startTimestamp, endTimestamp);
        completed = true;
      }

      // for (let i = 0; i < keys.length && !state.halt; i += GETPRICEBATCHSIZE) {
      //   const batch = keys.slice(i, parseInt(i) + GETPRICEBATCHSIZE);
      //   let url = "https://api.reservoir.tools/tokens/v4?";
      //   let separator = "";
      //   for (let j = 0; j < batch.length; j++) {
      //     const record = state.results[batch[j]];
      //     url = url + separator + "tokens=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85%3A" + record.tokenId;
      //     separator = "&";
      //   }
      //   const data = await fetch(url).then(response => response.json());
      //   records = records + data.tokens.length;
      //   state.message = "Reservoir prices " + records;
      //   // console.log(JSON.stringify(data, null, 2));
      //   for (price of data.tokens) {
      //     prices[price.tokenId] = {
      //       floorAskPrice: price.floorAskPrice,
      //       source: price.source,
      //       name: price.name,
      //     };
      //   }
      //   await delay(DELAYINMILLIS);
      // }
      state.sales = state.tempSales;
      state.tempSales = [];
      state.message = null;
      state.halt = false;

    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    doit(context, options) {
      logInfo("salesModule", "actions.doit() - options: " + JSON.stringify(options));
      context.commit('doit', options);
    },
    scan(context, options) {
      // logInfo("salesModule", "actions.scan() - options: " + JSON.stringify(options));
      context.commit('scan', options);
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
