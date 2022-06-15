const CryptoPunks = {
  template: `
    <div class="m-0 p-0">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="false && (!powerOn || network.chainId != 1)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Ethereum mainnet and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="CryptoPunks" class="border-0" header-class="p-0">

        <b-card no-body class="p-0 mt-1">
          <b-card-body class="m-1 p-1">
            <div>
              <b-sidebar id="sidebar-1" width="360px" title="Filter By Attributes" right shadow no-header-close header-class="m-0 p-0">
                <template v-slot:title="{ hide }">
                  <div class="d-flex flex-row justify-content-between m-0 p-0" style="height: 37px;">
                    <div class="m-0 p-0">
                      <b-button size="sm" variant="link" class="m-0 p-0" v-b-popover.hover="'Close sidebar'" @click="hide"><b-icon-x shift-v="-1" font-scale="1.7"></b-icon-x></b-button>
                    </div>
                    <div class="m-0 p-0 pl-4">
                      Filter By Attributes
                    </div>
                  </div>
                </template>
                <div class="px-1 py-2">
                  <div v-for="(attributeKey, attributeIndex) in Object.keys(attributes).sort()" v-bind:key="attributeIndex">
                    <b-card body-class="p-0" header-class="m-0 p-0 pl-2" footer-class="p-1" class="m-3 p-0">
                      <template #header>
                        <span variant="secondary" class="small truncate">
                          {{ slugToTitle(attributeKey) }}
                        </span>
                      </template>
                      <font size="-2">
                        <b-table small fixed striped sticky-header="200px" :fields="attributeFields" :items="getSortedValuesForAttribute(attributeKey)" head-variant="light">
                          <template #cell(select)="data">
                            <b-form-checkbox :checked="(attributeFilter[attributeKey] && attributeFilter[attributeKey].attributeOption) ? 1 : 0" value="1" @change="filterChange(attributeKey, data.item.attributeOption)"></b-form-checkbox>
                          </template>
                          <template #cell(attributeOption)="data">
                            {{ slugToTitle(data.item.attributeOption) }}
                          </template>
                        </b-table>
                      </font>
                    </b-card>
                  </div>
                </div>
              </b-sidebar>
            </div>
            <div class="d-flex flex-wrap m-0 p-0" style="min-height: 37px;">
              <div class="mt-2" style="max-width: 150px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.searchString" debounce="600" v-b-popover.hover.bottom="'Filter by list of punkIds'" placeholder="🔍 id1 id2-id3 ..."></b-form-input>
              </div>
              <div class="mt-2 pl-2" style="max-width: 150px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.searchAccount" debounce="600" v-b-popover.hover.bottom="'Filter by list of owner addresses'" placeholder="🔍 0x12... ..."></b-form-input>
              </div>
              <div class="mt-2 pl-2" style="max-width: 80px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.priceFrom" debounce="600" v-b-popover.hover.bottom="'ETH from'" placeholder="min"></b-form-input>
              </div>
              <div class="mt-2">
                -
              </div>
              <div class="mt-2 pr-2" style="max-width: 80px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.priceTo" debounce="600" v-b-popover.hover.bottom="'ETH to'" placeholder="max"></b-form-input>
              </div>
              <div class="mt-2 pr-1 flex-grow-1">
              </div>

              <div class="mt-2 pl-1">
                <b-dropdown v-if="message == null" split size="sm" text="Sync" @click="loadPunks(false)" variant="primary" v-b-popover.hover.bottom="'Partial Sync'">
                  <b-dropdown-item @click="loadPunks(true)">Full Sync</b-dropdown-item>
                  <!-- <b-dropdown-item @click="searchLogs()">Search Event Logs (WIP)</b-dropdown-item> -->
                </b-dropdown>
                <b-button v-if="message != null" size="sm" @click="halt" variant="primary" v-b-popover.hover.bottom="'Halt'" >{{ message }}</b-button>
              </div>
              <div class="mt-2 pr-1 flex-grow-1">
              </div>

              <div class="mt-2 pl-1">
                <font size="-2">{{ filteredSortedResults.length }}</font>
              </div>
              <div class="mt-2 pl-1">
                <b-pagination size="sm" v-model="settings.currentPage" :total-rows="filteredSortedResults.length" :per-page="settings.pageSize"></b-pagination>
              </div>

              <div class="mt-2 pr-1 flex-grow-1">
              </div>
              <div class="mt-2 pr-1">
                <b-form-select size="sm" v-model="settings.sortOption" :options="sortOptions" class="w-100"></b-form-select>
              </div>
              <div class="mt-2 pr-1">
                <!-- <b-button size="sm" :pressed.sync="settings.randomise" @click="settings.sortOption = 'random'; " variant="link" v-b-popover.hover.bottom="'Randomise'"><b-icon-arrow-clockwise shift-v="-1" font-scale="1.4"></b-icon-arrow-clockwise></b-button> -->
                <b-button size="sm" :pressed.sync="settings.randomise" @click="settings.sortOption = 'random'; " variant="link" v-b-popover.hover.bottom="'Randomise'"><b-icon-shuffle shift-v="-1" font-scale="1.2"></b-icon-shuffle></b-button>
              </div>

              <div class="mt-2 pl-1">
                <b-form-select size="sm" v-model="settings.pageSize" :options="pageSizes" v-b-popover.hover.bottom="'Page size'"></b-form-select>
              </div>
              <div class="mt-2 pl-1">
                <b-button size="sm" v-b-toggle.sidebar-1 variant="link" v-b-popover.hover.bottom="'Filter by Attributes'"><b-icon-filter-right shift-v="-1" font-scale="1.4"></b-icon-filter-right></b-button>
              </div>
            </div>

            <b-table small striped hover :fields="resultsFields" :items="pagedFilteredResults" table-class="w-100" class="mt-0">
              <template #cell(punkId)="data">
                <b-link :href="'https://cryptopunks.app/cryptopunks/details/' + data.item.punkId" v-b-popover.hover.bottom="'View in original website'" target="_blank">
                  {{ data.item.punkId }}
                </b-link>
              </template>
              <template #cell(image)="data">
                <b-link :href="'https://cryptopunks.app/cryptopunks/details/' + data.item.punkId" v-b-popover.hover.bottom="'View in original website'" target="_blank">
                  <b-img-lazy width="100%" :src="'images/punks/punk' + data.item.punkId.toString().padStart(4, '0') + '.png'" style="background-color: #638596"/>
                </b-link>
              </template>
              <template #cell(owner)="data">
                <b-link :href="'https://cryptopunks.app/cryptopunks/accountInfo?account=' + data.item.owner" v-b-popover.hover.bottom="'View in original website'" target="_blank">
                  {{ data.item.owner }}
                </b-link>
              </template>
              <template #head(bid)="data">
                <b-form-checkbox v-model="settings.filterBid" v-b-popover.hover.bottom="'Filter by bids'" >Bid</b-form-checkbox>
              </template>
              <template #cell(bid)="data">
                <span v-if="data.item.bid.amount" v-b-popover.hover.bottom="formatTimestamp(data.item.bid.timestamp)">
                  {{ formatETH(data.item.bid.amount) }}
                </span>
              </template>
              <template #head(ask)="data">
                <b-form-checkbox v-model="settings.filterAsk" v-b-popover.hover.bottom="'Filter by asks'" >Ask</b-form-checkbox>
              </template>
              <template #cell(ask)="data">
                <span v-if="data.item.ask.amount" v-b-popover.hover.bottom="formatTimestamp(data.item.ask.timestamp)">
                  {{ formatETH(data.item.ask.amount) }}
                </span>
              </template>
              <template #head(last)="data">
                <b-form-checkbox v-model="settings.filterLast" v-b-popover.hover.bottom="'Filter by last prices'" >Last</b-form-checkbox>
              </template>
              <template #cell(last)="data">
                <span v-if="data.item.last.amount" v-b-popover.hover.bottom="formatTimestamp(data.item.last.timestamp)">
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
  props: ['search', 'topic'],
  data: function () {
    return {
      count: 0,
      reschedule: true,
      settings: {
        searchString: null,
        searchAccount: null,
        priceFrom: null,
        priceTo: null,
        filterPriceBy: false,
        filterBid: false,
        filterAsk: true,
        filterLast: false,
        currentPage: 1,
        pageSize: 100,
        sortOption: 'latestsale',
        randomise: false,
        // imageSize: '240',
      },

      sortOptions: [
        { value: 'idasc', text: 'Id Ascending' },
        { value: 'iddsc', text: 'Id Descending' },
        { value: 'bidasc', text: 'Bid Ascending' },
        { value: 'biddsc', text: 'Bid Descending' },
        { value: 'askasc', text: 'Ask Ascending' },
        { value: 'askdsc', text: 'Ask Descending' },
        { value: 'lastasc', text: 'Last Price Ascending' },
        { value: 'lastdsc', text: 'Last Price Descending' },
        { value: 'latestbid', text: 'Latest Bid' },
        { value: 'earliestbid', text: 'Earliest Bid' },
        { value: 'latestask', text: 'Latest Ask' },
        { value: 'earliestask', text: 'Earliest Ask' },
        { value: 'latestsale', text: 'Latest Sale' },
        { value: 'earliestsale', text: 'Earliest Sale' },
        { value: 'latestactivity', text: 'Latest Activity' },
        { value: 'earliestactivity', text: 'Earliest Activity' },
        { value: 'random', text: 'Random' },
      ],

      pageSizes: [
        { value: 10, text: '10' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1,000' },
        { value: 2500, text: '2,500' },
        { value: 10000, text: '(all)' },
      ],

      attributeFilter: {},
      attributeFields: [
        { key: 'select', label: '', thStyle: 'width: 10%;' },
        { key: 'attributeOption', label: 'Attribute' /*, sortable: true*/ },
        { key: 'attributeTotal', label: 'Count', /*sortable: true,*/ thStyle: 'width: 30%;', thClass: 'text-right', tdClass: 'text-right' },
      ],

      resultsFields: [
        { key: 'punkId', label: 'Id', thStyle: 'width: 10%;' },
        { key: 'image', label: '', thStyle: 'width: 10%;' },
        { key: 'owner', label: 'Owner', thStyle: 'width: 30%;' },
        { key: 'bid', label: 'Bid', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'ask', label: 'Ask', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'last', label: 'Last', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'timestamp', label: 'Latest Activity', thStyle: 'width: 20%;', thClass: 'text-right', tdClass: 'text-right' },
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
      return this.filteredSortedResults.slice((this.settings.currentPage - 1) * this.settings.pageSize, this.settings.currentPage * this.settings.pageSize);
    },
    filteredResults() {
      const priceFrom = this.settings.priceFrom && parseFloat(this.settings.priceFrom) >= 0 ? parseFloat(this.settings.priceFrom) : null;
      const priceTo = this.settings.priceTo && parseFloat(this.settings.priceTo) >= 0 ? parseFloat(this.settings.priceTo) : null;

      let data = this.settings.randomise ? this.results.slice(0) : this.results.slice(0);
      let stage1Data = data;

      if (this.settings.searchString != null && this.settings.searchString.length > 0) {
        const searchTokenIds = this.settings.searchString.split(/[, \t\n]+/).map(function(s) { return s.trim(); });
        stage1Data = [];
        for (s of searchTokenIds) {
          var range = s.match(/(\d+)-(\d+)/)
          if (range != null) {
            for (let i = parseInt(range[1]); i <= parseInt(range[2]); i++) {
              if (i <= data.length && data.length > 0) {
                stage1Data.push(data[i]);
              }
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
        // console.log("settings: " + JSON.stringify(this.settings));
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

      let stage3Data = stage2Data;
      if (this.settings.searchAccount != null && this.settings.searchAccount.length > 0) {
        const searchAccounts = this.settings.searchAccount.split(/[, \t\n]+/).map(function(s) { return s.toLowerCase(); });
        stage3Data = [];
        for (let d of stage2Data) {
          // const ensName = owner == null ? null : this.ensMap[owner];
          for (searchAccount of searchAccounts) {
            if (d.owner.includes(searchAccount)) {
              stage3Data.push(d);
              break;
            // } else if (ensName != null && ensName.includes(s)) {
            //   stage3Data.push(d);
            //   break;
            }
          }
        }
      }
      // console.log("stage3Data.length: " + stage3Data.length);

      function getAttribute(data1, category) {
        for (let attributeIndex in data1.attributes) {
          const attribute = data1.attributes[attributeIndex];
          if (attribute.trait_type == category) {
            return attribute.value;
          }
        }
        return null;
      }

      let results = [];
      for (let i in stage3Data) {
        const d = stage3Data[i];
        let include = true;
        for (const [key, value] of Object.entries(this.attributeFilter)) {
          const attributeValue = getAttribute(d, key);
          if (!value[attributeValue]) {
            include = false;
            break;
          }
        }
        if (include) {
          results.push(d);
        }
      }
      return results;
    },
    filteredSortedResults() {
      let results = this.filteredResults.slice(0);
      if (this.settings.sortOption == 'idasc') {
        results.sort((a, b) => {
          return a.punkId - b.punkId;
        });
      } else if (this.settings.sortOption == 'iddsc') {
        results.sort((a, b) => {
          return b.punkId - a.punkId;
        });
      } else if (this.settings.sortOption == 'bidasc') {
        results.sort((a, b) => {
          const pricea = a.bid.amount ? a.bid.amount : null;
          const priceb = b.bid.amount ? b.bid.amount : null;
          if (pricea == priceb) {
            return a.punkId - b.punkId;
          } else if (pricea != null && priceb == null) {
            return -1;
          } else if (pricea == null && priceb != null) {
            return 1;
          } else {
            return pricea - priceb;
          }
        });
      } else if (this.settings.sortOption == 'biddsc') {
        results.sort((a, b) => {
          const pricea = a.bid.amount ? a.bid.amount : null;
          const priceb = b.bid.amount ? b.bid.amount : null;
          if (pricea == priceb) {
            return a.punkId - b.punkId;
          } else if (pricea != null && priceb == null) {
            return -1;
          } else if (pricea == null && priceb != null) {
            return 1;
          } else {
            return priceb - pricea;
          }
        });
      } else if (this.settings.sortOption == 'askasc') {
        results.sort((a, b) => {
          const pricea = a.ask.amount ? a.ask.amount : null;
          const priceb = b.ask.amount ? b.ask.amount : null;
          if (pricea == priceb) {
            return a.punkId - b.punkId;
          } else if (pricea != null && priceb == null) {
            return -1;
          } else if (pricea == null && priceb != null) {
            return 1;
          } else {
            return pricea - priceb;
          }
        });
      } else if (this.settings.sortOption == 'askdsc') {
        results.sort((a, b) => {
          const pricea = a.ask.amount ? a.ask.amount : null;
          const priceb = b.ask.amount ? b.ask.amount : null;
          if (pricea == priceb) {
            return a.punkId - b.punkId;
          } else if (pricea != null && priceb == null) {
            return -1;
          } else if (pricea == null && priceb != null) {
            return 1;
          } else {
            return priceb - pricea;
          }
        });
      } else if (this.settings.sortOption == 'lastasc') {
        results.sort((a, b) => {
          const pricea = a.last.amount ? a.last.amount : null;
          const priceb = b.last.amount ? b.last.amount : null;
          if (pricea == priceb) {
            return a.punkId - b.punkId;
          } else if (pricea != null && priceb == null) {
            return -1;
          } else if (pricea == null && priceb != null) {
            return 1;
          } else {
            return pricea - priceb;
          }
        });
      } else if (this.settings.sortOption == 'lastdsc') {
        results.sort((a, b) => {
          const pricea = a.last.amount ? a.last.amount : null;
          const priceb = b.last.amount ? b.last.amount : null;
          if (pricea == priceb) {
            return a.punkId - b.punkId;
          } else if (pricea != null && priceb == null) {
            return -1;
          } else if (pricea == null && priceb != null) {
            return 1;
          } else {
            return priceb - pricea;
          }
        });
      } else if (this.settings.sortOption == 'latestbid') {
        results.sort((a, b) => {
          const timestampa = a.bid.timestamp ? a.bid.timestamp : null;
          const timestampb = b.bid.timestamp ? b.bid.timestamp : null;
          if (timestampa == timestampb) {
            return a.punkId - b.punkId;
          } else if (timestampa != null && timestampb == null) {
            return -1;
          } else if (timestampa == null && timestampb != null) {
            return 1;
          } else {
            return timestampb - timestampa;
          }
        });
      } else if (this.settings.sortOption == 'earliestbid') {
        results.sort((a, b) => {
          const timestampa = a.bid.timestamp ? a.bid.timestamp : null;
          const timestampb = b.bid.timestamp ? b.bid.timestamp : null;
          if (timestampa == timestampb) {
            return a.punkId - b.punkId;
          } else if (timestampa != null && timestampb == null) {
            return -1;
          } else if (timestampa == null && timestampb != null) {
            return 1;
          } else {
            return timestampa - timestampb;
          }
        });
      } else if (this.settings.sortOption == 'latestask') {
        results.sort((a, b) => {
          const timestampa = a.ask.timestamp ? a.ask.timestamp : null;
          const timestampb = b.ask.timestamp ? b.ask.timestamp : null;
          if (timestampa == timestampb) {
            return a.punkId - b.punkId;
          } else if (timestampa != null && timestampb == null) {
            return -1;
          } else if (timestampa == null && timestampb != null) {
            return 1;
          } else {
            return timestampb - timestampa;
          }
        });
      } else if (this.settings.sortOption == 'earliestask') {
        results.sort((a, b) => {
          const timestampa = a.ask.timestamp ? a.ask.timestamp : null;
          const timestampb = b.ask.timestamp ? b.ask.timestamp : null;
          if (timestampa == timestampb) {
            return a.punkId - b.punkId;
          } else if (timestampa != null && timestampb == null) {
            return -1;
          } else if (timestampa == null && timestampb != null) {
            return 1;
          } else {
            return timestampa - timestampb;
          }
        });
      } else if (this.settings.sortOption == 'latestsale') {
        results.sort((a, b) => {
          const timestampa = a.last.timestamp ? a.last.timestamp : null;
          const timestampb = b.last.timestamp ? b.last.timestamp : null;
          if (timestampa == timestampb) {
            return a.punkId - b.punkId;
          } else if (timestampa != null && timestampb == null) {
            return -1;
          } else if (timestampa == null && timestampb != null) {
            return 1;
          } else {
            return timestampb - timestampa;
          }
        });
      } else if (this.settings.sortOption == 'earliestsale') {
        results.sort((a, b) => {
          const timestampa = a.last.timestamp ? a.last.timestamp : null;
          const timestampb = b.last.timestamp ? b.last.timestamp : null;
          if (timestampa == timestampb) {
            return a.punkId - b.punkId;
          } else if (timestampa != null && timestampb == null) {
            return -1;
          } else if (timestampa == null && timestampb != null) {
            return 1;
          } else {
            return timestampa - timestampb;
          }
        });
      } else if (this.settings.sortOption == 'latestactivity') {
        results.sort((a, b) => {
          const timestampa = a.timestamp ? a.timestamp : null;
          const timestampb = b.timestamp ? b.timestamp : null;
          if (timestampa == timestampb) {
            return a.punkId - b.punkId;
          } else if (timestampa != null && timestampb == null) {
            return -1;
          } else if (timestampa == null && timestampb != null) {
            return 1;
          } else {
            return timestampb - timestampa;
          }
        });
      } else if (this.settings.sortOption == 'earliestactivity') {
        results.sort((a, b) => {
          const timestampa = a.timestamp ? a.timestamp : null;
          const timestampb = b.timestamp ? b.timestamp : null;
          if (timestampa == timestampb) {
            return a.punkId - b.punkId;
          } else if (timestampa != null && timestampb == null) {
            return -1;
          } else if (timestampa == null && timestampb != null) {
            return 1;
          } else {
            return timestampa - timestampb;
          }
        });
      } else {
        results.sort(() => {
          return Math.random() - 0.5;
        });
      }

      return results;
    },
    attributes() {
      const collator = {};
      for (const d of this.results) {
        for (let attribute of d.attributes) {
          const traitType = attribute.trait_type;
          const value = attribute.value;
          if (!collator[traitType]) {
            collator[traitType] = {};
          }
          if (!collator[traitType][value]) {
            collator[traitType][value] = 1;
          } else {
            collator[traitType][value]++;
          }
        }
      }
      return collator;
    },
  },
  methods: {
    slugToTitle(slug) {
      var words = slug.split("-");
      return words.map(function(word) {
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
      }).join(' ');
    },
    getSortedValuesForAttribute(category) {
      const results = [];
      for (let attributeKey in this.attributes[category]) {
        const c = this.attributes[category][attributeKey];
        results.push({ attributeOption: attributeKey, attributeTotal: c })
      }
      results.sort(function(a, b) {
        return b.attributeTotal - a.attributeTotal;
      });
      return results;
    },
    filterChange(attribute, option) {
      if (!this.attributeFilter[attribute]) {
        Vue.set(this.attributeFilter, attribute, {});
      }
      if (this.attributeFilter[attribute][option]) {
        Vue.delete(this.attributeFilter[attribute], option);
        if (Object.keys(this.attributeFilter[attribute]) == 0) {
          Vue.delete(this.attributeFilter, attribute);
        }
      } else {
        Vue.set(this.attributeFilter[attribute], option, true);
      }
      // this.attributeFilter = this.attributeFilter;
      console.log("filterChange: " + JSON.stringify(this.attributeFilter));
      // this.recalculate('filterChange');
    },
    formatETH(e) {
      if (e) {
        try {
          const float = ethers.utils.formatEther(e);
          if ((float != 0 && float < 0.001) || float > 10000000) {
            return parseFloat(float);
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
    async searchLogs() {
      if (!this.powerOn || this.network.chainId != 1) {
        alert("Connect to web3 using the power button on the top right, in a web3 enabled browser");
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const balance = await provider.getBalance(this.coinbase);
        // console.log("searchLogs - balance: " + ethers.utils.formatEther(balance));
        const cryptoPunksMarket = new ethers.Contract(CRYPTOPUNKSMARKETADDRESS, CRYPTOPUNKSMARKETABI, provider);
        // const totalSupply = await cryptoPunksMarket.totalSupply();
        // console.log("searchLogs - totalSupply: " + totalSupply);
        const block = store.getters['connection/block'];
        // console.log("searchLogs - block: " + JSON.stringify(block));
        if (block) {
          // const blockNumber = block.number;
          console.log("searchLogs - block.number: " + block.number);

          // const lookback = 100000;
          // const filter = {
          //   address: CRYPTOPUNKSMARKETADDRESS, // [NIXADDRESS, weth.address],
          //   fromBlock: CRYPTOPUNKSMARKETDEPLOYMENTBLOCK, // blockNumber - lookback,
          //   toBlock: parseInt(CRYPTOPUNKSMARKETDEPLOYMENTBLOCK) + 5000, // blockNumber,
          //   topics: [[
          //     '0x8a0e37b73a0d9c82e205d4d1a3ff3d0b57ce5f4d7bccf6bac03336dc101cb7ba', //  Assign (index_topic_1 address to, uint256 punkIndex)
          //     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', //  Transfer (index_topic_1 address from, index_topic_2 address to, uint256 value)
          //     '0x05af636b70da6819000c49f85b21fa82081c632069bb626f30932034099107d8', //  PunkTransfer (index_topic_1 address from, index_topic_2 address to, uint256 punkIndex)
          //     '0x3c7b682d5da98001a9b8cbda6c647d2c63d698a4184fd1d55e2ce7b66f5d21eb', //  PunkOffered (index_topic_1 uint256 punkIndex, uint256 minValue, index_topic_2 address toAddress)
          //     '0x5b859394fabae0c1ba88baffe67e751ab5248d2e879028b8c8d6897b0519f56a', //  PunkBidEntered (index_topic_1 uint256 punkIndex, uint256 value, index_topic_2 address fromAddress)
          //     '0x6f30e1ee4d81dcc7a8a478577f65d2ed2edb120565960ac45fe7c50551c87932', //  PunkBidWithdrawn (index_topic_1 uint256 punkIndex, uint256 value, index_topic_2 address fromAddress)
          //     '0x58e5d5a525e3b40bc15abaa38b5882678db1ee68befd2f60bafe3a7fd06db9e3', //  PunkBought (index_topic_1 uint256 punkIndex, uint256 value, index_topic_2 address fromAddress, index_topic_3 address toAddress)
          //     '0xb0e0a660b4e50f26f0b7ce75c24655fc76cc66e3334a54ff410277229fa10bd4', //  PunkNoLongerForSale (index_topic_1 uint256 punkIndex)
          //   ]],
          // };
          // const events = await provider.getLogs(filter);
          // console.log("searchLogs - events: " + JSON.stringify(events));

          const db0 = new Dexie("aenuspunkeventsdb");
          db0.version(1).stores({
            // nftData: '&tokenId,asset,timestamp',
            // events: '&punkId,owner,claimer,timestamp,*traits',
            events: '[blockNumber+logIndex],blockNumber',
          });

          const earliestEntry = await db0.events.orderBy("blockNumber").first();
          const latestEntry = await db0.events.orderBy("blockNumber").last();
          let total = await db0.events.orderBy("blockNumber").count();
          logInfo("CryptoPunks", "searchLogs() - earliestEntry.blockNumber: " + (earliestEntry == null ? null : earliestEntry.blockNumber));
          logInfo("CryptoPunks", "searchLogs() - latestEntry.blockNumber: " + (latestEntry == null ? null : latestEntry.blockNumber));
          logInfo("CryptoPunks", "searchLogs() - total: " + total);

          // TODO: Work on this code if the subgraph is unavailable
          if (true) {
            let fromBlock = (latestEntry != null) ? parseInt(latestEntry.blockNumber) + 1 : CRYPTOPUNKSMARKETDEPLOYMENTBLOCK;
            let count = 0;
            let blocks = 5000; // Cater for the assignment of 10k punks at the start
            do {
              let toBlock = parseInt(fromBlock) + blocks;
              if (toBlock > block.number) {
                toBlock = block.number;
              }
              const filter = {
                address: CRYPTOPUNKSMARKETADDRESS, // [NIXADDRESS, weth.address],
                fromBlock: fromBlock,
                toBlock: toBlock,
                topics: null,
              };
              const events = await provider.getLogs(filter);
              await db0.events.bulkPut(events).then (function() {
              }).catch(function(error) {
                console.log("error: " + error);
              });
              total = parseInt(total) + events.length;
              if (count % 20 == 0) {
                logInfo("CryptoPunks", "searchLogs(): " + fromBlock + " " + total);
              }
              fromBlock = parseInt(fromBlock) + blocks;
              blocks = 25000;
              count++;
            } while (fromBlock < block.number);
          }
          logInfo("CryptoPunks", "searchLogs() - total: " + total);

          // db0.events.orderBy('blockNumber').uniqueKeys(function (keysArray) {
          //   console.log(JSON.stringify(keysArray));
          // });
          const blockNumbers = await db0.events.orderBy('[blockNumber+logIndex]').toArray(); // .uniqueKeys();
          // logInfo("CryptoPunks", "searchLogs() - blockNumbers: " + JSON.stringify(blockNumbers));
          logInfo("CryptoPunks", "searchLogs() - blockNumbers.length: " + blockNumbers.length);

          // count = 0;
          // for (blockNumber of blockNumbers) {
          //   const block = await provider.getBlock(blockNumber);
          //   if (count % 20 == 0) {
          //     logInfo("CryptoPunks", "searchLogs() - count: " + count + ", blockNumber: " + blockNumber + " " + new Date(block.timestamp * 1000).toLocaleString());
          //   }
          //   count++;
          // }

          db0.close();
        }
      }
    },
    async loadPunks(fullSync) {
      store.dispatch('cryptoPunks/loadPunks', fullSync);
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
    logInfo("CryptoPunks", "mounted() $route: " + JSON.stringify(this.$route.params) + ", props['search']: " + this.search + ", props['topic']: " + this.topic);
    if (this.search == "ids") {
      this.settings.searchString = this.topic;
    } else if (this.search == "owned") {
      this.settings.searchAccount = this.topic;
    }
    store.dispatch('cryptoPunks/loadPunks', false);
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
      currency: 'USD',
    },
    filter: {
      searchString: "^[0-9]*$",
      priceFrom: 0.01,
      priceTo: 12.34,
    },
    punks: [],
    exchangeRates: {},
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
    exchangeRates: state => state.exchangeRates,
    results: state => state.results,
    sales: state => state.sales,
    message: state => state.message,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    async loadPunks(state, fullSync) {
      logInfo("cryptoPunksModule", "mutations.loadPunks() - fullSync: " + fullSync);
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
          if (debug) {
            console.log("processPunks: " + JSON.stringify(punk, null, 2));
          }
          const attributes = [];
          const traits = [];
          for (let trait of punk.metadata.traits) {
            const attribute = traitsLookup[trait.id];
            if (attribute) {
              attributes.push({ trait_type: attribute, value: trait.id });
              traits.push(trait.id);
            } else {
              console.log("Punk " + punk.id + " not categorised " + trait.id);
            }
          }
          const events = [];
          let latestTimestamp = 0;
          const sortedEvents = punk.events.sort(function (a, b) {
            if (a.blockNumber == b.blockNumber) {
              return a.logNumber - b.logNumber;
              // return ('' + a.type).localeCompare(b.type);
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
              logNumber: event.logNumber,
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
              bidder = null;
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
                bidder = null;
                // console.log("HERE");
              }
              ask = null;
              // askTimestamp = null; // Workaround as order of events in the same block is unknown - use the subgraph currentAsk
              sale = event.amount;
              saleTimestamp = event.timestamp;
            } else if (event.type == "TRANSFER") {
              if (bidder == event.to.id) {
                bid = null;
                bidTimestamp = null;
                bidder = null;
              }
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
          let latestTimestamp = parseInt(latestRecord.timestamp) - 2 * 60 * 60;
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

      async function fetchExchangeRates() {
        // TODO: Use toTs={timestamp} when > 2000 days - https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistoday
        const days = parseInt((new Date() - new Date("2017-07-22")) / (24 * 60 * 60 * 1000));
        const url = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=ETH&tsym=" + state.config.currency + "&limit=" + days;
        // logInfo("cryptoPunksModule", "mutations.loadPunks().fetchLatestEvents() url: " + url);
        const data = await fetch(url)
          .then(response => response.json())
          .catch(function(e) {
            console.log("error: " + e);
          });
        const results = {};
        for (day of data.Data.Data) {
          results[day.time] = day.close;
        }
        return results;
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
            attributes: PUNKATTRIBUTES[punk.punkId],
          });
        }
        state.results = records;
        // console.log(JSON.stringify(records, null, 2));
      }

      // --- loadPunks() start ---
      logInfo("cryptoPunksModule", "mutations.loadPunks() start");
      state.message = "Syncing";
      const debug = null; // [9863];

      if (fullSync) {
        logInfo("cryptoPunksModule", "mutations.loadPunks() fullSync - deleting db");
        Dexie.delete("aenuspunksdb");
      }

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

      // state.exchangeRates = await fetchExchangeRates();
      // logInfo("cryptoPunksModule", "mutations.loadPunks() exchangeRates: " + JSON.stringify(state.exchangeRates).substring(0, 60) + " ...");

      const latestEventPunkIds = debug ? debug : await fetchLatestEvents();
      logInfo("cryptoPunksModule", "mutations.loadPunks() latestEventPunkIds: " + JSON.stringify(latestEventPunkIds));

      let totalRecords = 0;
      if (latestEventPunkIds != null) {
        for (let i = 0; i < latestEventPunkIds.length && !state.halt; i += CRYPTOPUNKSSUBGRAPHBATCHSIZE) {
          const batch = latestEventPunkIds.slice(i, parseInt(i) + CRYPTOPUNKSSUBGRAPHBATCHSIZE);
          // console.log("batch: " + JSON.stringify(batch));
          let numberOfRecords = await fetchPunksByIds(batch);
          // console.log( [...batch] );
          totalRecords += numberOfRecords;
          state.message = "Punks: " + totalRecords;
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
            state.message = "Punks: " + totalRecords;
          }
          result = generator.next();
        }
        if (count > 0){
          // console.log( [...batch] );
          let numberOfRecords = await fetchPunksByIds(batch);
          totalRecords += numberOfRecords;
          state.message = "Punks: " + totalRecords;
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
    loadPunks(context, fullSync) {
      // logInfo("cryptoPunksModule", "actions.loadPunks() - fullSync: " + fullSync);
      context.commit('loadPunks', fullSync);
    },
    halt(context) {
      // logInfo("cryptoPunksModule", "actions.halt()");
      context.commit('halt');
    },
  },
};
