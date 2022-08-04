const Umswap = {
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
          <b-alert size="sm" :show="!powerOn || network.chainId != 1" variant="primary" class="m-1">
            Please connect to the Ethereum mainnet with a web3-enabled browser. Click the [Power] button on the top right.
          </b-alert>
          <b-alert size="sm" :show="powerOn && network.chainId == 1" dismissible variant="danger" class="m-1">
            Warning - Umswap v0.8.8 testing! Please use low value wallets when interacting on this site, initially. There is an <b-link :href="'https://twitter.com/BokkyPooBah/status/1553875661248270337'" target="_blank">OG 2017 MoonCat bug bounty</b-link> on the unaudited contracts.
          </b-alert>

          <b-card no-body no-header :img-src="settings.tabIndex == 1 && collectionInfo && collectionInfo.metadata && collectionInfo.metadata.bannerImageUrl || ''" img-top class="m-0 p-0 border-0">

            <b-card-body class="m-0 p-1">
              <b-card header="UmswapFactory" class="mt-2">
                <b-row>
                  <b-col cols="2" class="text-right">
                    UmswapFactory:
                  </b-col>
                  <b-col>
                    <b-link :href="'https://etherscan.io/address/' + umswapFactory.address + '#code'" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                      {{ umswapFactory.address }}
                    </b-link>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="2" class="text-right">
                  </b-col>
                  <b-col class="mt-1">
                    <b-button size="sm" @click="updateCollection('sync', {})" :disabled="sync.inProgress" variant="primary">Query</b-button>
                  </b-col>
                </b-row>

                <!--
                  function newUmswap(IERC721Partial collection, string calldata name, uint[] calldata tokenIds, address integrator) public payable reentrancyGuard
                -->
                <b-card header="New Umswap" class="mt-2" body-class="m-1 p-1" style="min-width: 48rem; max-width: 48rem;">
                  <b-card-text>
                    <b-form-group label-cols="3" label-size="sm" label-align="right" label="Collection:" class="mx-0 my-1 p-0">
                      <b-form-input type="text" size="sm" v-model.trim="umswap.collection" placeholder="0x1234..."></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label-align="right" label="Name:" class="mx-0 my-1 p-0">
                      <b-form-input type="text" size="sm" v-model.trim="umswap.name" placeholder="{up to 48 alphanums with spaces}"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label-align="right" label="TokenIds:" class="mx-0 my-1 p-0">
                      <b-form-textarea size="sm" v-model.trim="umswap.tokenIds" placeholder="Blank for all, or e.g., 1 2-5 10\n15\n20 30 555" rows="3" max-rows="100"></b-form-textarea>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label-align="right" label="Tip:" class="mx-0 my-1 p-0">
                      <b-form-input type="text" size="sm" v-model.trim="umswap.tip" placeholder="In ETH, optional. e.g. 0.0001 or blank"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="" class="mx-0 my-1 p-0">
                      <b-button size="sm" @click="newUmswap" :disabled="umswap.collection == null || umswap.name == null" variant="warning">Create</b-button>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="" class="mx-0 my-1 p-0">
                      <div v-if="umswap.txHash">
                        <b-link :href="'https://etherscan.io/tx/' + umswap.txHash" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                          {{ umswap.txHash }}
                        </b-link>
                      </div>
                      <div v-if="umswap.error">
                        {{ umswap.error }}
                      </div>
                    </b-form-group>
                  </b-card-text>
                </b-card>

                <b-card header="Send Message" class="mt-2" body-class="m-1 p-1" style="min-width: 48rem; max-width: 48rem;">
                  <b-card-text>
                    <b-form-group label-cols="3" label-size="sm" label-align="right" label="To" class="mx-0 my-1 p-0">
                      <b-form-input size="sm" v-model.trim="message.to" placeholder="0x1234... or blank for address(0)"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label-align="right" label="Umswap" class="mx-0 my-1 p-0">
                      <b-form-input size="sm" v-model.trim="message.umswap" placeholder="0x3456... or blank for address(0)"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label-align="right" label="Topic" class="mx-0 my-1 p-0">
                      <b-form-input size="sm" v-model.trim="message.topic" placeholder="Optional, 0 to 48 characters"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label-align="right" label="Text" class="mx-0 my-1 p-0">
                      <b-form-input size="sm" v-model.trim="message.text" placeholder="Mandatory, 1 to 280 characters"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label-align="right" label="Tip" class="mx-0 my-1 p-0">
                      <b-form-input size="sm" v-model.trim="message.tip" placeholder="In ETH, optional. e.g. 0.0001 or blank for none"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="" class="mx-0 my-1 p-0">
                      <b-button size="sm" @click="sendMessage" :disabled="message.text == null" variant="warning">Send</b-button>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="" class="mx-0 my-1 p-0">
                      <div v-if="message.txHash">
                        <b-link :href="'https://etherscan.io/tx/' + message.txHash" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                          {{ message.txHash }}
                        </b-link>
                      </div>
                      <div v-if="message.error">
                        {{ message.error }}
                      </div>
                    </b-form-group>
                  </b-card-text>
                </b-card>
              </b-card>

              <!-- Main Toolbar -->
              <div v-if="false" class="d-flex flex-wrap m-0 p-0">
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

                <div v-if="sync.inProgress" class="mt-1 pr-1 text-right">
                  <font size="-2" v-b-popover.hover.top="'Blah'">{{ sync.section }}</font>
                </div>

                <div class="mt-2" style="width: 200px;">
                  <b-progress v-if="sync.inProgress" height="1.5rem" :max="sync.total" :label="'((sync.completed/sync.total)*100).toFixed(2) + %'" show-progress :animated="sync.inProgress" :variant="sync.inProgress ? 'success' : 'secondary'" v-b-popover.hover.top="'Click on the Sync(ing) button to (un)pause'">
                    <b-progress-bar :value="sync.completed">
                      {{ sync.completed + '/' + sync.total + ' ' + ((sync.completed / sync.total) * 100).toFixed(0) + '%' }}
                    </b-progress-bar>
                  </b-progress>
                </div>
                <div class="ml-0 mt-1">
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
                  <b-form-select size="sm" v-model="settings.sortOption" :options="sortOptions" v-b-popover.hover.top="'Yeah. Sort'"></b-form-select>
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

              <b-row v-if="false" class="m-0 p-0">
                <!-- Collection Filter -->
                <b-col v-if="settings.showFilter" cols="2" class="m-0 p-0 border-0">
                  <b-card no-header no-body class="m-0 p-0 border-0">
                    <b-card-body class="m-0 p-1" style="flex-grow: 1; max-height: 2000px; overflow-y: auto;">
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
                        <b-button :id="'popover-target-' + data.item.token_id" variant="link" class="m-0 p-0">
                          {{ data.item.token_id }}
                        </b-button>
                        <b-popover :target="'popover-target-' + data.item.token_id" placement="right">
                          <template #title>{{ data.item.token_id }}</template>
                          <b-link :href="'https://opensea.io/assets/ethereum/0x011c77fa577c500deedad364b8af9e8540b808c0/' + data.item.token_id" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                            OpenSea
                          </b-link>
                          <br />
                          <b-link :href="'https://looksrare.org/collections/0x011c77fa577c500deedad364b8af9e8540b808c0/' + data.item.token_id" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                            LooksRare
                          </b-link>
                          <br />
                          <b-link :href="'https://x2y2.io/eth/0x011c77fa577c500deedad364b8af9e8540b808c0/' + data.item.token_id" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                            X2Y2
                          </b-link>
                        </b-popover>
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
                        <b-link :href="'http://myipc.io/' + data.item.token_id" v-b-popover.hover.bottom="'View in original website'" target="_blank">
                          <b-avatar rounded size="7rem" :src="'http://myipc.io/sprites/' + data.item.token_id + '.gif'" style="background-color: #638596"></b-avatar>
                        </b-link>
                        <br />
                        {{ data.item.name }}
                        <div v-if="data.item.price" class="mt-2">
                          <font size="-1">
                            <b-badge variant="success" v-b-popover.hover.bottom="'On ' + data.item.price.source">{{ data.item.price.price }}</b-badge>
                          </font>
                        </div>
                      </template>
                      <template #cell(details)="data">
                        <font size="-2">
                          <b-row v-for="(attribute, i) in data.item.attributes" v-bind:key="i" class="m-0 p-0">
                            <b-col cols="3" class="my-0 mx-1 py-0 px-1 text-right">{{ slugToTitle(attribute.trait_type) }}</b-col>
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
        sortOption: 'priceasc', // TODO 'idasc',
        collection: {
          showInfo: false,
          pageSize: 100,
          currentPage: 1
        },
      },

      umswap: {
        collection: "0x31385d3520bced94f77aae104b406994d8f2168c", // null,
        name: "Testing", // null,
        tokenIds: "1 2 23 3 4 5 6 7 8 9 1000 200 34", // null,
        tip: null,
        txHash: null,
        error: null,
      },

      message: {
        to: null,
        umswap: null,
        topic: null,
        text: null,
        tip: null,
        txHash: null,
        error: null,
      },

      collectionAttributeFilter: {},

      sortOptions: [
        { value: 'idasc', text: '▲ Id' },
        { value: 'iddsc', text: '▼ Id' },
        { value: 'priceasc', text: '▲ Price' },
        { value: 'pricedsc', text: '▼ Price' },
        { value: 'random', text: 'Random' },
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
        { key: 'name', label: 'Name & Price', thStyle: 'width: 15%;'},
        { key: 'details', label: 'Details', thStyle: 'width: 25%;'},
        { key: 'birth', label: 'Birth', thStyle: 'width: 20%;'},
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
      return store.getters['umswap/config'];
    },
    filter() {
      return store.getters['umswap/filter'];
    },
    sync() {
      return store.getters['umswap/sync'];
    },
    umswapFactory() {
      return store.getters['umswap/umswapFactory'];
    },
    collectionInfo() {
      return store.getters['umswap/collectionInfo'];
    },
    collectionTokens() {
      return store.getters['umswap/collectionTokens'];
    },
    ensMap() {
      return store.getters['umswap/ensMap'];
    },
    collectionTokensAttributesWithCounts() {
      const collator = {};
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
      if (this.settings.sortOption == 'idasc') {
        results.sort((a, b) => a.token_id - b.token_id);
      } else if (this.settings.sortOption == 'iddsc') {
        results.sort((a, b) => b.token_id - a.token_id);
      } else if (this.settings.sortOption == 'priceasc') {
        results.sort((a, b) => {
          const pricea = a.price && a.price.price || null;
          const priceb = b.price && b.price.price || null;
          if (pricea == priceb) {
            return a.token_id - b.token_id;
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
          const pricea = a.price && a.price.price || null;
          const priceb = b.price && b.price.price || null;
          if (pricea == priceb) {
            return a.token_id - b.token_id;
          } else if (pricea != null && priceb == null) {
            return -1;
          } else if (pricea == null && priceb != null) {
            return 1;
          } else {
            return priceb - pricea;
          }
        });
      } else {
        results.sort(() => {
          return Math.random() - 0.5;
        });
      }
      return results;
    },
    pagedFilteredCollectionTokens() {
      return this.filteredSortedCollectionTokens.slice((this.settings.collection.currentPage - 1) * this.settings.collection.pageSize, this.settings.collection.currentPage * this.settings.collection.pageSize);
    },
    getURL() {
      let url = '/umswap/mintmonitor/';
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
      } catch (e) {
        //
      }
      return address.substring(0, length);
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
      this.$router.push('/umswap/' + where);
    },
    async newUmswap() {
      this.umswap.txHash = null;
      this.umswap.error = null;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const umswapFactory = new ethers.Contract(UMSWAPFACTORYADDRESS, UMSWAPFACTORYABI, provider);
      const umswapFactoryWithSigner = umswapFactory.connect(provider.getSigner());
      const from = await provider.getSigner().getAddress();
      const collection = this.umswap.collection == null || this.umswap.collection.trim().length == 0 ? null : this.umswap.collection.trim();
      const name = this.umswap.name == null || this.umswap.name.trim().length == 0 ? null : this.umswap.name.trim();
      const tokenIds = this.umswap.tokenIds == null || this.umswap.tokenIds.trim().length == 0 ? [] : this.umswap.tokenIds.split(/[, \t\n]+/).sort((a, b) => (BigInt(a) > BigInt(b))? 0 : -1);
      const integrator = ADDRESS0;
      const tip = this.umswap.tip == null || this.umswap.tip.trim().length == 0 ? 0 : ethers.utils.parseEther(this.umswap.tip);
      const h = this.$createElement;
      const messageVNode = h('div', { class: ['confirm-modal'] }, [
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, 'From:'),
            h('b-col',
              [
                h('a', { class: ['blah'], attrs: { 'href': 'https://etherscan.io/address/' + from, 'target': '_blank' } }, from),
              ]
            ),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, 'To Contract:'),
            h('b-col',
              [
                h('a', { class: ['blah'], attrs: { 'href': 'https://etherscan.io/address/' + UMSWAPFACTORYADDRESS + '#code', 'target': '_blank' } }, UMSWAPFACTORYADDRESS),
              ]
            ),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, 'Function:'),
            h('b-col', 'newUmswap('),
          ]
        ),
        // function newUmswap(IERC721Partial collection, string calldata name, uint[] calldata tokenIds, address integrator)
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', { class: ['text-right'], props: { cols: 2 } }, 'collection:'),
            h('b-col',
              [
                h('a', { class: ['blah'], attrs: { 'href': 'https://etherscan.io/address/' + collection, 'target': '_blank' } }, collection),
              ]
            ),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', { class: ['text-right'], props: { cols: 2 } }, 'name:'),
            h('b-col', name),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', { class: ['text-right'], props: { cols: 2 } }, 'tokenIds:'),
            h('b-col', tokenIds.join(", ")),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', { class: ['text-right'], props: { cols: 2 } }, 'integrator:'),
            h('b-col',
              [
                h('a', { class: ['blah'], attrs: { 'href': 'https://etherscan.io/address/' + integrator, 'target': '_blank' } }, integrator),
              ]
            ),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', ')'),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, 'Tip:'),
            h('b-col', ethers.utils.formatEther(tip)),
          ]
        ),
      ])
      this.$bvModal.msgBoxConfirm([messageVNode], {
        title: 'Send Transaction',
        size: 'lg',
        buttonSize: 'sm',
        centered: true,
        okVariant: 'danger',
        okTitle: 'Confirm',
        cancelTitle: 'Cancel',
      }).then( async value1 => {
        if (value1) {
          event.preventDefault();
          try {
            const tx = await umswapFactoryWithSigner.newUmswap(collection, name, tokenIds, integrator, { value: tip });
            this.umswap.txHash = tx.hash;
            console.log("tx: " + JSON.stringify(tx));
          } catch (e) {
            this.umswap.error = e.message.toString();
            console.log("Umswap.newUmswap error: " + JSON.stringify(e));
          }
        }
      }).catch(err => {
        this.message.error = err.message.toString();
        console.log("Umswap.newUmswap error: " + JSON.stringify(e));
      });
    },
    async sendMessage() {
      this.message.txHash = null;
      this.message.error = null;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const umswapFactory = new ethers.Contract(UMSWAPFACTORYADDRESS, UMSWAPFACTORYABI, provider);
      const umswapFactoryWithSigner = umswapFactory.connect(provider.getSigner());
      const from = await provider.getSigner().getAddress();
      const to = this.message.to == null || this.message.to.trim().length == 0 ? ADDRESS0 : this.message.to.trim();
      const umswap = this.message.umswap == null || this.message.umswap.trim().length == 0 ? ADDRESS0 : this.message.umswap.trim();
      const topic = this.message.topic == null || this.message.topic.trim().length == 0 ? "" : this.message.topic.trim();
      const text = this.message.text == null || this.message.text.trim().length == 0 ? "" : this.message.text.trim();
      const integrator = ADDRESS0;
      const tip = this.message.tip == null || this.message.tip.trim().length == 0 ? 0 : ethers.utils.parseEther(this.message.tip);
      const h = this.$createElement;
      const messageVNode = h('div', { class: ['confirm-modal'] }, [
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, 'From:'),
            h('b-col',
              [
                h('a', { class: ['blah'], attrs: { 'href': 'https://etherscan.io/address/' + from, 'target': '_blank' } }, from),
              ]
            ),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, 'To Contract:'),
            h('b-col',
              [
                h('a', { class: ['blah'], attrs: { 'href': 'https://etherscan.io/address/' + UMSWAPFACTORYADDRESS + '#code', 'target': '_blank' } }, UMSWAPFACTORYADDRESS),
              ]
            ),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, 'Function:'),
            h('b-col', 'sendMessage('),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', { class: ['text-right'], props: { cols: 2 } }, 'to:'),
            h('b-col',
              [
                h('a', { class: ['blah'], attrs: { 'href': 'https://etherscan.io/address/' + to, 'target': '_blank' } }, to),
              ]
            ),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', { class: ['text-right'], props: { cols: 2 } }, 'umswap:'),
            h('b-col',
              [
                h('a', { class: ['blah'], attrs: { 'href': 'https://etherscan.io/address/' + umswap, 'target': '_blank' } }, umswap),
              ]
            ),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', { class: ['text-right'], props: { cols: 2 } }, 'topic:'),
            h('b-col', topic),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', { class: ['text-right'], props: { cols: 2 } }, 'text:'),
            h('b-col', text),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', { class: ['text-right'], props: { cols: 2 } }, 'integrator:'),
            h('b-col',
              [
                h('a', { class: ['blah'], attrs: { 'href': 'https://etherscan.io/address/' + integrator, 'target': '_blank' } }, integrator),
              ]
            ),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, ''),
            h('b-col', ')'),
          ]
        ),
        h('b-row', {
          }, [
            h('b-col', { class: ['text-right'], props: { cols: 3 } }, 'Tip:'),
            h('b-col', ethers.utils.formatEther(tip)),
          ]
        ),
      ])
      this.$bvModal.msgBoxConfirm([messageVNode], {
        title: 'Send Transaction',
        size: 'lg',
        buttonSize: 'sm',
        centered: true,
        okVariant: 'danger',
        okTitle: 'Confirm',
        cancelTitle: 'Cancel',
      }).then( async value1 => {
        if (value1) {
          event.preventDefault();
          try {
            const tx = await umswapFactoryWithSigner.sendMessage(to, umswap, topic, text, integrator, { value: tip });
            this.message.txHash = tx.hash;
            console.log("tx: " + JSON.stringify(tx));
          } catch (e) {
            this.message.error = e.message.toString();
            console.log("Umswap.sendMessage error: " + JSON.stringify(e));
          }
        }
      }).catch(err => {
        this.message.error = err.message.toString();
        console.log("Umswap.sendMessage error: " + JSON.stringify(e));
      });
    },
    async updateCollection(syncMode, filterUpdate) {
      store.dispatch('umswap/updateCollection', { syncMode, filterUpdate });
    },
    async halt() {
      store.dispatch('umswap/halt');
    },
    async timeoutCallback() {
      logDebug("Umswap", "timeoutCallback() count: " + this.count);
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
    logDebug("Umswap", "beforeDestroy()");
  },
  mounted() {
    logInfo("Umswap", "mounted() $route: " + JSON.stringify(this.$route.params) + ", props['tab']: " + this.tab + ", props['blocks']: " + this.blocks + ", props['search']: " + this.search);
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
          store.dispatch('umswap/monitorMints', { syncMode: 'scan', filterUpdate });
        }, 1000);
      }
    }
    this.reschedule = true;
    logDebug("Umswap", "Calling timeoutCallback()");
    this.timeoutCallback();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const umswapModule = {
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
    umswapFactory: {
      address: UMSWAPFACTORYADDRESS,
      umswapsLength: null,
    },
    messages: [],
    collectionInfo: {},
    collectionTokens: {},
    ensMap: {},
    halt: false,
    params: null,
  },
  getters: {
    filter: state => state.filter,
    sync: state => state.sync,
    umswapFactory: state => state.umswapFactory,
    messages: state => state.messages,
    collectionInfo: state => state.collectionInfo,
    collectionTokens: state => state.collectionTokens,
    ensMap: state => state.ensMap,
    params: state => state.params,
  },
  mutations: {

    // --- updateCollection() ---
    async updateCollection(state, { syncMode, filterUpdate }) {

      // --- updateCollection() start ---
      logInfo("umswapModule", "mutations.updateCollection() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const umswapFactory = new ethers.Contract(UMSWAPFACTORYADDRESS, UMSWAPFACTORYABI, provider);
        const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
        const block = await provider.getBlock("latest");
        const blockNumber = block.number;

        if (filterUpdate != null) {
          state.filter = { ...state.filter, ...filterUpdate };
        }

        state.sync.inProgress = true;
        state.sync.section = "Retrieving prices";
        state.sync.completed = 0;
        state.sync.total = 0;
        state.sync.error = false;

        const debug = false;

        const umswapsLength = await umswapFactory.getUmswapsLength();
        console.log("umswapsLength: " + umswapsLength);
        state.umswapFactory.umswapsLength = umswapsLength;

        // TODO: Batch sync, persist and incremental updates
        const fromBlock = UMSWAPFACTORYDEPLOYMENTBLOCK;
        const toBlock = blockNumber;
        const filter = {
          address: UMSWAPFACTORYADDRESS,
          fromBlock: fromBlock,
          toBlock: toBlock,
          topics: null,
        };
        const events = await provider.getLogs(filter);
        const logs = [];
        for (const event of events) {
          const logData = umswapFactory.interface.parseLog(event);
          // console.log("logData: " + JSON.stringify(logData));
          // console.log("logData.eventFragment.name: " + logData.eventFragment.name);
          const item = { name: logData.eventFragment.name };
          for (let i in logData.eventFragment.inputs) {
            const inp = logData.eventFragment.inputs[i];
            console.log("  " + i + " " + inp.name + " " + inp.type + " " + logData.args[i]);
            // parameters.push({ name: inp.name, type: inp.type, value: logData.args[i] });
            item[inp.name] = {
              type: inp.type,
              value: logData.args[i],
            }
          }
          logs.push(item);
          // console.log("parameters: " + JSON.stringify(parameters, null, 2));
          // logs.push({
          //   name: logData.eventFragment.name,
          //   parameters: parameters,
          // })
          // const from = logData.eventFragment.inputs.filter(x => x.name == 'from').map(x => x.type).join();
          // console.log("from: " + JSON.stringify(from));
        }
        console.log("logs: " + JSON.stringify(logs, null, 2));

        // // Retrieve prices
        // let continuation = null;
        // let prices = {};
        // do {
        //   let url = "https://api.reservoir.tools/tokens/bootstrap/v1?contract=" + IPCADDRESS +
        //     "&limit=500" +
        //     (continuation != null ? "&continuation=" + continuation : '');
        //   // logInfo("nftsModule", "mutations.updateCollection() - url: " + url);
        //   const data = await fetch(url)
        //     .then(handleErrors)
        //     .then(response => response.json())
        //     .catch(function(error) {
        //        console.log("ERROR - updateCollection: " + error);
        //        state.sync.error = true;
        //        return [];
        //     });
        //   continuation = debug ? null : data.continuation;
        //   if (data && data.tokens) {
        //     for (const token of data.tokens) {
        //       prices[token.tokenId] = { price: token.price, validUntil: token.validUntil, source: token.source };
        //     }
        //   }
        //   state.sync.completed = Object.keys(prices).length;
        //   state.sync.total = state.sync.completed;
        // } while (continuation != null && !state.halt && !state.sync.error);

        // // Retrieve IPC data from contracts and erc721 owner data
        // const startId = debug ? 2800 : 1;
        // const endId = debug ? 3300 : 12000;
        // const batchSize = 200;
        // let fromId = startId;
        // let toId;
        // const collectionTokens = {};
        // const ensMap = {};
        // state.sync.section = "Retrieving IPC data";
        // state.sync.total = endId - startId + 1;
        // state.sync.completed = 0;
        // do {
        //   toId = parseInt(fromId) + batchSize;
        //   if (toId >= endId) {
        //     toId = endId;
        //   }
        //   const ipcData = await ipcHelper.getBulkIpc(fromId, parseInt(toId) + 1);
        //   const tokenIds = [];
        //   for (let i = 0; i < ipcData[0].length; i++) {
        //     const tokenId = parseInt(fromId) + i;
        //     tokenIds.push(tokenId);
        //   }
        //   const ownerData = await erc721Helper.ownersByTokenIds(IPCADDRESS, tokenIds);
        //   for (let i = 0; i < ipcData[0].length; i++) {
        //     const tokenId = parseInt(fromId) + i;
        //     const owner = ownerData[0][i] && ownerData[1][i] || null;
        //     if (owner != null) {
        //       const lowerOwner = owner.toLowerCase();
        //       if (!(lowerOwner in ensMap)) {
        //         ensMap[lowerOwner] = owner;
        //       }
        //     }
        //     const ipc = {
        //       token_id: tokenId,
        //       name: ipcData[0][i],
        //       owner: owner,
        //       attribute_seed: ipcData[1][i],
        //       dna: ipcData[2][i],
        //       experience: parseInt(ipcData[3][i]),
        //       birth: parseInt(ipcData[4][i]),
        //       price: prices[tokenId] || null,
        //     }
        //     const info = IPCLib.ipc_create_ipc_from_json(ipc);
        //     const attributes = [];
        //     attributes.push({ trait_type: 'race', value: IPCEnglish.Race[info.race] });
        //     attributes.push({ trait_type: 'subrace', value: IPCEnglish.Subrace[info.subrace] });
        //     attributes.push({ trait_type: 'gender', value: IPCEnglish.Gender[info.gender] });
        //     attributes.push({ trait_type: 'height', value: parseInt(info.height / 12) + '\'' + info.height % 12 + '\"' });
        //     attributes.push({ trait_type: 'skin-color', value: IPCEnglish.Color[info.skin_color] });
        //     attributes.push({ trait_type: 'hair-color', value: IPCEnglish.Color[info.hair_color] });
        //     attributes.push({ trait_type: 'eye-color', value: IPCEnglish.Color[info.eye_color] });
        //     attributes.push({ trait_type: 'handedness', value: IPCEnglish.Handedness[info.handedness] });
        //     attributes.push({ trait_type: 'vintage', value: moment.unix(ipcData[4][i]).format("YYYY") });
        //     // attributes.push({ trait_type: 'strength', value: info.strength });
        //     // attributes.push({ trait_type: 'force', value: info.force });
        //     // attributes.push({ trait_type: 'sustain', value: info.sustain });
        //     // attributes.push({ trait_type: 'tolerance', value: info.tolerance });
        //     // attributes.push({ trait_type: 'dexterity', value: info.dexterity });
        //     // attributes.push({ trait_type: 'speed', value: info.speed });
        //     // attributes.push({ trait_type: 'precision', value: info.precision });
        //     // attributes.push({ trait_type: 'reaction', value: info.reaction });
        //     // attributes.push({ trait_type: 'intelligence', value: info.intelligence });
        //     // attributes.push({ trait_type: 'memory', value: info.memory });
        //     // attributes.push({ trait_type: 'processing', value: info.processing });
        //     // attributes.push({ trait_type: 'reasoning', value: info.reasoning });
        //     // attributes.push({ trait_type: 'constitution', value: info.constitution });
        //     // attributes.push({ trait_type: 'healing', value: info.healing });
        //     // attributes.push({ trait_type: 'fortitude', value: info.fortitude });
        //     // attributes.push({ trait_type: 'vitality', value: info.vitality });
        //     // attributes.push({ trait_type: 'luck', value: info.luck });
        //     collectionTokens[tokenId] = { ...ipc, attributes: attributes };
        //   }
        //   state.sync.completed = Object.keys(collectionTokens).length;
        //   fromId = toId;
        // } while (toId < endId && !state.halt);
        // state.collectionTokens = collectionTokens;

        // // ENS data
        // let addresses = Object.keys(ensMap);
        // state.sync.section = "Retrieving ENS names";
        // state.sync.total = addresses.length;
        // state.sync.completed = 0;
        // const ensReverseRecordsContract = new ethers.Contract(ENSREVERSERECORDSADDRESS, ENSREVERSERECORDSABI, provider);
        // const ENSOWNERBATCHSIZE = 200; // 500 fails occassionally
        // let totalRecords = 0;
        // if (!state.halt) {
        //   for (let i = 0; i < addresses.length; i += ENSOWNERBATCHSIZE) {
        //     const batch = addresses.slice(i, parseInt(i) + ENSOWNERBATCHSIZE);
        //     const allnames = await ensReverseRecordsContract.getNames(batch);
        //     // TODO: check for normalised. const validNames = allnames.filter((n) => normalize(n) === n );
        //     for (let j = 0; j < batch.length; j++) {
        //       const address = batch[j];
        //       const name = allnames[j];
        //       ensMap[address] = name != null && name.length > 0 ? name : address;
        //       // const normalized = normalize(address);
        //     }
        //     totalRecords = parseInt(totalRecords) + batch.length;
        //     state.sync.completed = totalRecords;
        //     if (state.halt) {
        //       break;
        //     }
        //   }
        //   ensMap["0x0000000000000000000000000000000000000000".toLowerCase()] = "(null)";
        //   ensMap["0x000000000000000000000000000000000000dEaD".toLowerCase()] = "(dEaD)";
        //   ensMap["0x00000000006c3852cbEf3e08E8dF289169EdE581".toLowerCase()] = "(OpenSea:Seaport1.1)";
        //   ensMap["0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85".toLowerCase()] = "(ENS)";
        //   ensMap["0x60cd862c9C687A9dE49aecdC3A99b74A4fc54aB6".toLowerCase()] = "(MoonCatRescue)";
        //   ensMap["0x74312363e45DCaBA76c59ec49a7Aa8A65a67EeD3".toLowerCase()] = "(X2Y2:Exchange)";
        //   ensMap["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase()] = "(WETH)";
        //   state.ensMap = ensMap;
        // }

        state.sync.inProgress = false;
      }
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    updateCollection(context, { syncMode, filterUpdate }) {
      logInfo("umswapModule", "actions.updateCollection() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('updateCollection', { syncMode, filterUpdate });
    },
    halt(context) {
      context.commit('halt');
    },
  },
};
