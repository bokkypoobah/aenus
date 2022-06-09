const CryptoPunks = {
  template: `
    <div class="mt-5 pt-3 pl-1 pr-1">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="false && (!powerOn || network.chainId != 1)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Ethereum mainnet and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="CryptoPunks" class="border-0" header-class="p-0">

        <b-card no-body class="p-0 mt-1">
          <b-card-body class="m-1 p-1">
            <b-row>
              <b-col sm="6" class="mt-2">
                <font size="-2">
                  {{ message }}
                </font>
                <b-button v-if="message == null" size="sm" @click="search" variant="primary" class="float-right">Sync</b-button>
                <b-button v-if="message != null" size="sm" @click="halt" variant="primary" class="float-right">Halt</b-button>
              </b-col>
            </b-row>

            <!--
            <b-button size="sm" @click="doit( { type: 'fullsync' } );" variant="primary">Retrieve Latest 50 Sales</b-button>
            <span v-if="searchMessage != null">
              <b-button size="sm" @click="halt" variant="primary">Halt</b-button>
            </span>
            <b-button size="sm" @click="doit( { action: 'startService' } );" variant="primary">Start Service</b-button>
            <b-button size="sm" @click="doit( { action: 'stopService' } );" variant="primary">Stop Service</b-button>
            -->
            <div class="d-flex flex-wrap m-0 mt-2 p-0" style="min-height: 37px;">
              <div class="pr-4">
                <b-form-input type="text" size="sm" v-model.trim="settings.searchString" debounce="600" placeholder="🔍 id1, id2-id3, ..."></b-form-input>
              </div>
              <div class="pr-1" style="max-width: 100px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.priceFrom" debounce="600" placeholder="ETH from"></b-form-input>
              </div>
              <div class="pr-1">
                -
              </div>
              <div class="pr-2" style="max-width: 100px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.priceTo" debounce="600" placeholder="ETH to"></b-form-input>
              </div>
              <!--
              <div class="pr-1">
                <b-form-group>
                  <b-form-checkbox-group v-model="settings.filterBid">bid</b-form-checkbox-group>
                  <b-form-checkbox-group v-model="settings.filterAsk">ask</b-form-checkbox-group>
                  <b-form-checkbox-group v-model="settings.filterLast">last</b-form-checkbox-group>
                </b-form-group>

                <b-form-group>
                  <b-form-checkbox-group v-model="settings.filterPriceBy">
                    <b-form-checkbox value="bid">bid</b-form-checkbox>
                    <b-form-checkbox value="ask">ask</b-form-checkbox>
                    <b-form-checkbox value="last">last</b-form-checkbox>
                  </b-form-checkbox-group>
                </b-form-group>

              </div>
              -->
              <div class="pr-1 flex-grow-1">
              </div>
              <div class="pr-1">
                Mid
              </div>
              <div class="pr-1 flex-grow-1">
              </div>
              <div class="pl-1">
                <font size="-2">{{ filteredResults.length }}/10000</font>
              </div>
              <div class="pl-1">
                <b-pagination size="sm" v-model="settings.currentPage" :total-rows="filteredResults.length" :per-page="settings.pageSize"></b-pagination>
              </div>
            </div>

            <b-table small striped hover :fields="resultsFields" :items="pagedFilteredResults" table-class="w-100" class="mt-0">
              <template #cell(punkId)="data">
                <b-link :href="'https://cryptopunks.app/cryptopunks/details/' + data.item.punkId" v-b-popover.hover="'View in original website'" target="_blank">
                  {{ data.item.punkId }}
                </b-link>
              </template>
              <template #cell(image)="data">
                <b-link :href="'https://cryptopunks.app/cryptopunks/details/' + data.item.punkId" v-b-popover.hover="'View in original website'" target="_blank">
                  <b-img-lazy width="100%" :src="'images/punks/punk' + data.item.punkId.toString().padStart(4, '0') + '.png'" style="background-color: #638596"/>
                </b-link>
              </template>
              <template #cell(owner)="data">
                <b-link :href="'https://cryptopunks.app/cryptopunks/accountInfo?account=' + data.item.owner" v-b-popover.hover="'View in original website'" target="_blank">
                  {{ data.item.owner.substring(0, 16) }}
                </b-link>
              </template>
              <template #head(bid)="data">
                <b-form-checkbox v-model="settings.filterBid" v-b-popover.hover="'Filter by bids'" >Bid</b-form-checkbox>
              </template>
              <template #cell(bid)="data">
                <span v-if="data.item.bid.amount" v-b-popover.hover="formatTimestamp(data.item.bid.timestamp)">
                  {{ formatETH(data.item.bid.amount) }}
                </span>
              </template>
              <template #head(ask)="data">
                <b-form-checkbox v-model="settings.filterAsk" v-b-popover.hover="'Filter by asks'" >Ask</b-form-checkbox>
              </template>
              <template #cell(ask)="data">
                <span v-if="data.item.ask.amount" v-b-popover.hover="formatTimestamp(data.item.ask.timestamp)">
                  {{ formatETH(data.item.ask.amount) }}
                </span>
              </template>
              <template #head(last)="data">
                <b-form-checkbox v-model="settings.filterLast" v-b-popover.hover="'Filter by last prices'" >Last</b-form-checkbox>
              </template>
              <template #cell(last)="data">
                <span v-if="data.item.last.amount" v-b-popover.hover="formatTimestamp(data.item.last.timestamp)">
                  {{ formatETH(data.item.last.amount) }}
                </span>
              </template>
              <template #cell(timestamp)="data">
                {{ formatTimestamp(data.item.timestamp) }}
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
        searchString: null,
        priceFrom: 2.02,
        priceTo: null,
        filterPriceBy: false,
        filterBid: false,
        filterAsk: true,
        filterLast: false,
        currentPage: 1,
        pageSize: 100,

        // sortOption: 'nameasc',
        // randomise: false,

        // resultsPageSize: 100,
        // resultsCurrentPage: 1,

        // imageSize: '240',

        // resultsTabIndex: 0,
      },

      resultsFields: [
        { key: 'punkId', label: 'Id', thStyle: 'width: 10%;' },
        { key: 'image', label: '', thStyle: 'width: 10%;' },
        { key: 'owner', label: 'Owner', thStyle: 'width: 30%;' },
        { key: 'bid', label: 'Bid', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'ask', label: 'Ask', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'last', label: 'Last', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'timestamp', label: 'Latest Activity', thStyle: 'width: 20%;' },
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
    results() {
      return store.getters['cryptoPunks/results'];
    },
    message() {
      return store.getters['cryptoPunks/message'];
    },
    pagedFilteredResults() {
      return this.filteredResults.slice((this.settings.currentPage - 1) * this.settings.pageSize, this.settings.currentPage * this.settings.pageSize);
    },
    filteredResults() {
      const priceFrom = this.settings.priceFrom && parseFloat(this.settings.priceFrom) > 0 ? parseFloat(this.settings.priceFrom) : null;
      const priceTo = this.settings.priceTo && parseFloat(this.settings.priceTo) > 0 ? parseFloat(this.settings.priceTo) : null;

      let data = this.results.slice(0);
      let stage1Data = data;

      if (this.settings.searchString != null && this.settings.searchString.length > 0) {
        const searchTokenIds = this.settings.searchString.split(/[, \t\n]+/).map(function(item) { return item.trim(); });
        stage1Data = [];
        for (s of searchTokenIds) {
          var range = s.match(/(\d+)-(\d+)/)
          if (range != null) {
            for (let i = range[1]; i <= range[2]; i++) {
              stage1Data.push(data[i]);
            }
          }
          if (s >= 0 && s < 10000) {
            if (s < data.length) {
              stage1Data.push(data[s]);
            }
          }
        }
      }

      const filterBid = this.settings.filterBid;
      const filterAsk = this.settings.filterAsk;
      const filterLast = this.settings.filterLast;

      let stage2Data = stage1Data;
      if ((priceFrom != null || priceTo != null) && (filterBid || filterAsk || filterLast)) {
        console.log("settings: " + JSON.stringify(this.settings));
        stage2Data = [];
        for (let d of stage1Data) {
          const bid = d.bid.amount ? ethers.utils.formatEther(d.bid.amount) : null;
          const ask = d.ask.amount ? ethers.utils.formatEther(d.ask.amount) : null;
          const last = d.last.amount ? ethers.utils.formatEther(d.last.amount) : null;
          // console.log(d.punkId + " " + bid + " " + ask + " " + last);
          if (
            (priceFrom == null ||
              (
                (filterBid && bid != null && bid >= priceFrom) ||
                (filterAsk && ask != null && ask >= priceFrom) ||
                (filterLast && last != null && last >= priceFrom))
              ) &&
            (priceTo == null ||
              (
                (filterBid && bid != null && bid <= priceTo) ||
                (filterAsk && ask != null && ask <= priceTo) ||
                (filterLast && last != null && last <= priceTo))
              )
            ) {
            stage2Data.push(d);
          }
        }
      }

      return stage2Data;
    },
  },
  methods: {
    formatETH(e) {
      if (e) {
        try {
          const float = ethers.utils.formatEther(e);
          if (float != 0 && float < 0.001) {
            return "< 0.001"
          } else if (float > 10000000) {
            return "> 10,000,000"
          } else {
            return ethers.utils.commify(float);
          }
        } catch (err) {
        }
      }
      return null;
      try {
        const float = ethers.utils.formatEther(e);
        return e ? ethers.utils.commify(float) : null;
      } catch (err) {
      }
      return e.toFixed(9);
    },
    formatTimestamp(ts) {
      return new Date(ts * 1000).toLocaleString();
    },
    async search() {
      // console.log("search");
      // const data = await fetch(ENSSUBGRAPHURL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     query: ENSSUBGRAPHNAMEQUERY,
      //     variables: { labelNames: ["bokky"] },
      //   })
      // }).then(response => response.json());
      // console.log(JSON.stringify(data));
        // .then(data => processRegistrations(data.data.registrations))
        // .then(data => console.log(JSON.stringify(data.data.registrations)))
        // .catch(function(e) {
        //   console.log("error: " + e);
        // });
      store.dispatch('cryptoPunks/loadPunks');
    },
    async doit(action) {
      console.log("doit: " + JSON.stringify(action));
      store.dispatch('sales/doit', action);
    },
    async halt() {
      store.dispatch('search/halt');
    },
    async timeoutCallback() {
      logDebug("CryptoPunks", "timeoutCallback() count: " + this.count);

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
    logDebug("CryptoPunks", "beforeDestroy()");
  },
  mounted() {
    logInfo("CryptoPunks", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("CryptoPunks", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const cryptoPunksModule = {
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
    punks: [],
    tempPunks: [],
    results: [],
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
    punks: state => state.punks,
    results: state => state.results,
    sales: state => state.sales,
    message: state => state.message,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    async loadPunks(state, options) {
      function* getBatch(records, batchsize = CRYPTOPUNKSSUBGRAPHBATCHSIZE) {
        while (records.length) {
          yield records.splice(0, batchsize);
        }
      }
      function* generateRange(from, to) {
        // logInfo("cryptoPunksModule", "mutations.loadPunks().generateRange() - from: " + from + ", to: " + to);
        for (let i = from; i <= to; i++) {
          yield i;
        }
      }
      async function processPunks(punks) {
        const records = [];
        for (const punk of punks) {
          // if (debug && debug.includes(punk.id)) {
          if (debug) {
            console.log("processPunks: " + JSON.stringify(punk, null, 2));
          }
          const attributes = [];
          const traits = [];
          for (let trait of punk.metadata.traits) {
            // console.log(JSON.stringify(trait.id, null, 2));
            const attribute = traitsLookup[trait.id];
            // console.log(trait.id + " => " + attribute);
            if (attribute) {
              if (attribute == trait.id) {
                attributes.push({ trait_type: attribute, value: true });
              } else {
                attributes.push({ trait_type: attribute, value: trait.id });
              }
              traits.push(trait.id);
            } else {
              console.log("Punk " + punk.id + " not categorised " + trait.id);
            }
          }
          const events = [];
          let latestTimestamp = 0;
          const sortedEvents = punk.events.sort(function (a, b) {
            // return a.blockNumber - b.blockNumber;
            if (a.blockNumber == b.blockNumber) {
              return ('' + a.type).localeCompare(b.type);
            } else {
              return a.blockNumber - b.blockNumber;
            }
          });
          if (debug && sortedEvents.length >= 100) {
            console.log(punk.id + " - sortedEvents.length: " + sortedEvents.length);
          }
          if (debug) {
            console.log(punk.id + " - sortedEvents: " + JSON.stringify(sortedEvents, null, 2));
          }
          let bid = null;
          let bidTimestamp = null;
          let bidder = null;
          let ask = null;
          let askTimestamp = null;
          let sale = null;
          let saleTimestamp = null;

          for (let event of sortedEvents) {
            if (debug) {
              console.log("event: " + JSON.stringify(event, null, 2));
            }
            events.push({
              from: event.from && event.from.id || null,
              to: event.to && event.to.id || null,
              amount: event.amount || null,
              type: event.type,
              blockNumber: event.blockNumber,
              blockHash: event.blockHash,
              txHash: event.txHash,
              timestamp: event.timestamp,
            });
            if (event.timestamp > latestTimestamp) {
              latestTimestamp = event.timestamp;
            }
            if (event.type == "BID_CREATED") {
              bid = event.amount;
              bidTimestamp = event.timestamp;
              bidder = event.from && event.from.id || null;
            } else if (event.type == "BID_REMOVED") {
              bid = null;
              bidTimestamp = null;
            } else if (event.type == "ASK_CREATED") {
              ask = event.amount;
              askTimestamp = event.timestamp;
            } else if (event.type == "ASK_REMOVED") {
              ask = null;
              // askTimestamp = null; // Workaround as order of events in the same block is unknown - use the subgraph currentAsk
            } else if (event.type == "SALE") {
              if (bid != null && bidder == event.to.id) {
                // L180 - Check for the case where there is a bid from the new owner and refund it.
                bid = null;
                bidTimestamp = null;
                // console.log("HERE");
              }
              ask = null;
              // askTimestamp = null; // Workaround as order of events in the same block is unknown - use the subgraph currentAsk
              sale = event.amount;
              saleTimestamp = event.timestamp;
            } else {
            }
          }

          // const currentBid = punk.currentBid && punk.currentBid.open && punk.currentBid.amount || null;
          const currentAsk = punk.currentAsk && punk.currentAsk.open && punk.currentAsk.amount || null;
          // if ((currentBid != null && bid == null) || (currentBid == null && bid != null)) {
          //   console.log(punk.id + " - currentBid: " + currentBid + " does not match calculated bid: " + bid + " @ " + bidTimestamp + " " + (bidTimestamp != null ? new Date(bidTimestamp * 1000).toLocaleString() : ''));
          // }
          // Events within the same block data cannot be sorted without the event logIndex data. Use the subgraph currentAsk
          // if ((currentAsk != null && ask == null) || (currentAsk == null && ask != null)) {
          //   console.log(punk.id + " - currentAsk: " + currentAsk + " does not match calculated ask: " + ask + " @ " + askTimestamp + " " + (askTimestamp != null ? new Date(askTimestamp * 1000).toLocaleString() : ''));
          // }
          // console.log(punk.id + " - mismatch sale: " + sale + " @ " + saleTimestamp + " " + (saleTimestamp != null ? new Date(saleTimestamp * 1000).toLocaleString() : ''));

          records.push({
            punkId: parseInt(punk.id),
            owner: punk.owner && punk.owner.id || null,
            claimer: punk.assignedTo && punk.assignedTo.id || null,
            timestamp: latestTimestamp,
            traits: traits,
            // transferedTo: punk.transferedTo && punk.transferedTo.id || null,
            // purchasedBy: punk.purchasedBy && punk.purchasedBy.id || null,
            wrapped: punk.wrapped,
            bid: { amount: bid, timestamp: bidTimestamp },
            ask: { amount: currentAsk, timestamp: currentAsk ? askTimestamp : null },
            last: { amount: sale, timestamp: saleTimestamp },
            attributes: attributes,
            events: events,
          });
        }
        // console.log("records: " + JSON.stringify(records));
        await db0.punks.bulkPut(records).then (function() {
        }).catch(function(error) {
          console.log("error: " + error);
        });
        return records.length;
      }
      async function fetchPunksByIds(batch) {
        // console.log( [...batch] );
        const data = await fetch(CRYPTOPUNKSSUBGRAPHURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: CRYPTOPUNKSPUNKBYIDSQUERY,
            variables: { ids: batch },
          })
        }).then(response => response.json())
          .catch(function(e) {
            console.log("error: " + e);
          });
        if (debug) {
          console.log(JSON.stringify(data, null, 2));
        }
        if (data && data.data && data.data.punks && data.data.punks.length > 0) {
          return await processPunks(data.data.punks);
        }
        return 0;
      }
      async function fetchLatestEvents() {
        const results = {};
        const latestRecord = await db0.punks.orderBy("timestamp").last();
        if (latestRecord != null) {
          let latestTimestamp = parseInt(latestRecord.timestamp) - 6 * 60 * 60;
          let data;
          do {
            logInfo("cryptoPunksModule", "mutations.loadPunks().fetchLatestEvents() latestTimestamp: " + new Date(latestTimestamp * 1000).toLocaleString() + " = " + latestTimestamp);
            data = await fetch(CRYPTOPUNKSSUBGRAPHURL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                query: CRYPTOPUNKSEVENTSBYTIMESTAMPQUERY,
                variables: { timestamp_gt: latestTimestamp },
              })
            }).then(response => response.json())
              .catch(function(e) {
                console.log("error: " + e);
              });

            if (debug) {
              console.log(JSON.stringify(data, null, 2));
            }
            for (let event of data.data.events) {
              if (event.nft) {
                // console.log(JSON.stringify(event, null, 2));
                results[event.nft.id] = true;
              }
              latestTimestamp = parseInt(event.timestamp);
              // logInfo("cryptoPunksModule", "mutations.loadPunks().fetchLatestEvents() event.timestamp: " + new Date(event.timestamp * 1000).toLocaleString() + " = " + event.timestamp);
            }
            // console.log(JSON.stringify(data.data.events, null, 2));
          } while (data && data.data && data.data.events && data.data.events.length != 0);
          return Object.keys(results).map(function(id) { return parseInt(id); });
        }
        return null;
      }

      async function refreshResultsFromDB() {
        // const punks = await db0.punks.orderBy("timestamp").reverse().limit(100).toArray();
        const punks = await db0.punks.orderBy("punkId").toArray();
        const records = [];
        for (const punk of punks) {
          records.push({
            punkId: punk.punkId,
            owner: punk.owner,
            // claimer: punk.claimer,
            timestamp: punk.timestamp,
            // traits: punk.traits,
            // wrapped: punk.wrapped,
            bid: punk.bid,
            ask: punk.ask,
            last: punk.last,
            // attributes: punk.attributes,
          });
        }
        state.results = records;
        // console.log(JSON.stringify(records, null, 2));
      }

      // --- loadPunks() start ---
      logInfo("cryptoPunksModule", "mutations.loadPunks() start");
      state.message = "Syncing";
      const debug = null; // [4576]; // [4000]; // null; // [9863];

      // Dexie.delete("aenuspunksdb");

      const db0 = new Dexie("aenuspunksdb");
      db0.version(1).stores({
        // nftData: '&tokenId,asset,timestamp',
        punks: '&punkId,owner,claimer,timestamp,*traits',
      });

      const traitsLookup = {};
      for (const [attribute, traits] of Object.entries(PUNKTRAITS)) {
        for (trait of traits) {
          // const title = trait.replace(/-/g, ' ').replace(/\b[a-z]/g, function() { return arguments[0].toUpperCase(); }).replace('3d', '3D').replace('Vr', 'VR');
          // console.log(attribute + " - " + trait + " " + title);
          traitsLookup[trait] = attribute;
        }
      }

      const latestEventPunkIds = debug ? debug : await fetchLatestEvents();
      logInfo("cryptoPunksModule", "mutations.loadPunks() latestEventPunkIds: " + JSON.stringify(latestEventPunkIds));

      let totalRecords = 0;
      if (latestEventPunkIds != null) {
        for (let i = 0; i < latestEventPunkIds.length && !state.halt; i += CRYPTOPUNKSSUBGRAPHBATCHSIZE) {
          const batch = latestEventPunkIds.slice(i, parseInt(i) + CRYPTOPUNKSSUBGRAPHBATCHSIZE);
          console.log("batch: " + JSON.stringify(batch));
          let numberOfRecords = await fetchPunksByIds(batch);
          // console.log( [...batch] );
          totalRecords += numberOfRecords;
          state.message = "Retrieved " + totalRecords;
        }
      } else {
        let from = 0;
        let to = parseInt(from) + 9999;
        let generator = generateRange(from, to);
        // console.log( [...generator] );
        let count = 0;
        let result = generator.next();
        let batch = [];
        while (!result.done && !state.halt) {
          batch.push(result.value);
          count++;
          if (count >= CRYPTOPUNKSSUBGRAPHBATCHSIZE) {
            let numberOfRecords = await fetchPunksByIds(batch);
            // console.log( [...batch] );
            totalRecords += numberOfRecords;
            count = 0;
            batch = [];
            state.message = "Retrieved " + totalRecords;
          }
          result = generator.next();
        }
        if (count > 0){
          // console.log( [...batch] );
          let numberOfRecords = await fetchPunksByIds(batch);
          totalRecords += numberOfRecords;
          state.message = "Retrieved " + totalRecords;
        }
      }
      logInfo("cryptoPunksModule", "mutations.loadPunks() refreshing from db");
      await refreshResultsFromDB();
      state.message = null;
      state.halt = false;
      db0.close();
      logInfo("cryptoPunksModule", "mutations.loadPunks() end");
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    loadPunks(context) {
      logInfo("cryptoPunksModule", "actions.loadPunks()");
      context.commit('loadPunks');
    },
    halt(context) {
      // logInfo("cryptoPunksModule", "actions.halt()");
      context.commit('halt');
    },
  },
};
