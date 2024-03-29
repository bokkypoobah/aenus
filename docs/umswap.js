const Umswap = {
  template: `
    <div class="m-0 p-0">
      <b-card no-body no-header class="border-0">
        <b-alert size="sm" show dismissible variant="danger" class="m-1">
          Warning - Umswap v0.8.8 testing! Please use low value wallets when interacting on this site, initially. See <b-link :href="'https://twitter.com/BokkyPooBah/status/1553875661248270337'" target="_blank">OG 2017 MoonCat bug bounty</b-link> on the unaudited contracts.
        </b-alert>
        <b-alert size="sm" :show="!powerOn || network.chainId != 1" variant="primary" class="m-1">
          Please connect to the Ethereum mainnet with a web3-enabled browser. Click the [Power] button on the top right.
        </b-alert>

        <b-card no-body class="m-1 mt-0 p-0">
          <b-tabs card align="left" no-body v-model="settings.tabIndex" active-tab-class="m-0 p-0">
            <b-tab title="Umswaps" @click="updateURL('upswaps');">
            </b-tab>
            <b-tab title="Umswap" @click="updateURL('umswap');">
            </b-tab>
            <b-tab title="New Umswap" @click="updateURL('newumswap');">
            </b-tab>
            <b-tab title="Messages" @click="updateURL('messages');">
            </b-tab>
          </b-tabs>

          <!-- Main Toolbar -->
          <div class="d-flex flex-wrap m-0 p-0">
            <div v-if="settings.tabIndex == 1" class="mt-1 pl-1">
              <b-form-select size="sm" :value="filter.umswapIndex" :options="umswapsAsOptions" @change="doIt('filterUpdate', { umswapIndex: $event })" v-b-popover.hover.top="'Select a Umswap'"></b-form-select>
            </div>
            <div v-if="settings.tabIndex == 10" class="mt-1">
              <b-button size="sm" :pressed.sync="settings.showFilter" variant="link" v-b-popover.hover.top="'Show collection filter'"><span v-if="settings.showFilter"><b-icon-layout-sidebar-inset shift-v="+1" font-scale="1.0"></b-icon-layout-sidebar-inset></span><span v-else><b-icon-layout-sidebar shift-v="+1" font-scale="1.0"></b-icon-layout-sidebar></span></b-button>
            </div>
            <div v-if="settings.tabIndex == 10" class="mt-1" style="width: 380px;">
              <b-form-input type="text" size="sm" :value="filter.collection.address" @change="doIt('filterUpdate', { collection: { address: $event } })" :disabled="sync.inProgress" debounce="600" v-b-popover.hover.top="'Collection address'" placeholder="{ERC-721 address}"></b-form-input>
            </div>
            <div v-if="settings.tabIndex == 10" class="mt-1 pl-1">
              <b-button size="sm" @click="doIt('sync', {})" :disabled="sync.inProgress" variant="primary">Sync IPC Collection</b-button>
            </div>
            <div class="mt-1 flex-grow-1">
            </div>
            <div v-if="settings.tabIndex == 10" class="mt-1">
              <b-button size="sm" :pressed.sync="settings.collection.showInfo" variant="link" v-b-popover.hover.top="'Show collection info'"><span v-if="settings.collection.showInfo"><b-icon-info-circle-fill shift-v="+1" font-scale="1.0"></b-icon-info-circle-fill></span><span v-else><b-icon-info-circle shift-v="+1" font-scale="1.0"></b-icon-info-circle></span></b-button>
            </div>
            <div v-if="settings.tabIndex == 10" class="mt-1">
              <b-badge variant="light">{{ collectionInfo && collectionInfo.name || '' }}</b-badge>
            </div>

            <div class="mt-1 flex-grow-1">
            </div>

            <div v-if="(settings.tabIndex == 0 || settings.tabIndex == 1) && !sync.inProgress" class="mt-1 pl-1">
              <b-button size="sm" @click="doIt('sync', {})" :disabled="sync.inProgress" variant="primary">Sync</b-button>
            </div>

            <div v-if="sync.inProgress" class="mt-1 pr-1 text-right">
              <font size="-2" v-b-popover.hover.top="'Blah'">{{ sync.section }}</font>
            </div>

            <div class="mt-2" style="width: 200px;">
              <b-progress v-if="sync.inProgress" height="1.5rem" :max="sync.total" :label="'((sync.completed/sync.total)*100).toFixed(2) + %'" show-progress :animated="sync.inProgress" :variant="sync.inProgress ? 'success' : 'secondary'" v-b-popover.hover.top="'Click on the Sync(ing) button to (un)pause'">
                <b-progress-bar :value="sync.completed">
                  <div v-if="sync.total == null">
                  {{ sync.completed }}
                  </div>
                  <div v-else>
                    {{ sync.completed + '/' + sync.total + ' ' + ((sync.completed / sync.total) * 100).toFixed(0) + '%' }}
                  </div>
                </b-progress-bar>
              </b-progress>
            </div>
            <div class="ml-0 mt-1">
              <b-button v-if="sync.inProgress" size="sm" @click="halt" variant="link" v-b-popover.hover.top="'Halt'"><b-icon-stop-fill shift-v="+1" font-scale="1.0"></b-icon-stop-fill></b-button>
            </div>

            <div class="mt-1 flex-grow-1">
            </div>

            <div v-if="settings.tabIndex == 20" class="mt-2 pl-1">
              <b-link size="sm" :to="getURL" v-b-popover.hover.top="'Share this link for the same search'" ><font size="-1">Share</font></b-link>
            </div>

            <div class="mt-1 flex-grow-1">
            </div>
            <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
              <b-form-select size="sm" v-model="settings.sortOption" :options="sortOptions" v-b-popover.hover.top="'Yeah. Sort'"></b-form-select>
            </div>
            <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
              <font size="-2" v-b-popover.hover.top="'Blah'">{{ filteredSortedCollectionTokens.length }}</font>
            </div>
            <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
              <b-pagination size="sm" v-model="settings.collection.currentPage" :total-rows="filteredCollectionTokens.length" :per-page="settings.collection.pageSize" style="height: 0;"></b-pagination>
            </div>
            <div v-if="settings.tabIndex == 10" class="mt-1 pl-1">
              <b-form-select size="sm" v-model="settings.collection.pageSize" :options="pageSizes" v-b-popover.hover.top="'Page size'"></b-form-select>
            </div>
          </div>

          <b-card no-body no-header class="m-0 p-0 border-0">
            <b-card-body class="m-0 p-1">

              <!-- Umswaps -->
              <b-table v-if="settings.tabIndex == 0" small fixed striped :fields="umswapsFields" :items="umswaps" head-variant="light">
                <template #cell(collection)="data">
                  <b-link :href="'https://opensea.io/collection/' + data.item.collectionSlug" v-b-popover.hover.bottom="'View in Opensea.io'" target="_blank">
                    {{ data.item.collectionName }}
                  </b-link>
                </template>
                <template #cell(umswap)="data">
                  <b-link :href="'https://opensea.io/collection/' + data.item.collectionSlug" v-b-popover.hover.bottom="'View in Opensea.io'" target="_blank">
                    {{ data.item.umswapName }}
                  </b-link>
                </template>
                <template #cell(sampleTokens)="data">
                  <b-card-group deck>
                    <div v-for="(token, tokenIndex) in data.item.sampleTokens" :key="tokenIndex">
                      <b-card body-class="p-0" header-class="p-1" img-top class="m-1 p-0 border-0" style="max-width: 4rem;">
                        <b-link :href="'https://opensea.io/assets/ethereum/' + data.item.collectionAddress + '/' + token.tokenId" v-b-popover.hover.bottom="'View in Opensea.io'" target="_blank">
                          <b-avatar rounded size="4rem" :src="token.image" style="background-color: #638596"></b-avatar>
                        </b-link>
                      </b-card>
                    </div>
                  </b-card-group deck>
                </template>
                <template #cell(stats)="data">
                  Total Supply: {{ formatETH(data.item.totalSupply) }}
                  <br />
                  Score: {{ data.item.totalScores + '/' + data.item.raters }}
                </template>
                <!--
                <template #cell(score)="data">
                  {{ data.item.totalScores + '/' + data.item.raters }}
                </template>
                <template #cell(totalSupply)="data">
                  {{ formatETH(data.item.totalSupply) }}
                </template>
                -->
              </b-table>

              <!-- Umswap -->
              <b-card v-if="settings.tabIndex == 1 && current.umswap != null" header="Umswap" class="mt-1" body-class="m-1 p-1">
                <b-card-text>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Index:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" readonly size="sm" :value="current.umswap.index" class="w-50"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Address:" class="mx-0 my-1 p-0">
                    <b-link :href="'https://etherscan.io/token/' + current.umswap.address" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                      {{ current.umswap.address }}
                    </b-link>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Symbol:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" readonly size="sm" :value="current.umswap.symbol" class="w-50"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Name:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" readonly size="sm" :value="current.umswap.name"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Creator:" class="mx-0 my-1 p-0">
                    <b-link :href="'https://etherscan.io/address/' + current.umswap.creator" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                      {{ current.umswap.creator }}
                    </b-link>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Total Supply:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" readonly size="sm" :value="current.umswap.totalSupply" class="w-50"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Swapped In:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" readonly size="sm" :value="current.umswap.swappedIn" class="w-50"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Swapped Out:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" readonly size="sm" :value="current.umswap.swappedOut" class="w-50"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Total Scores:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" readonly size="sm" :value="current.umswap.totalScores" class="w-50"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Raters:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" readonly size="sm" :value="current.umswap.raters" class="w-50"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Collection:" class="mx-0 my-1 p-0">
                    <b-link :href="'https://etherscan.io/token/' + current.umswap.collection" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                      {{ current.umswap.collection }}
                    </b-link>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="TokenIds:" class="mx-0 my-1 p-0">
                    <div v-if="current.umswap.tokenIds.length == 0">
                      All tokenIds
                    </div>
                    <div v-else>
                      <b-form-textarea type="text" readonly size="sm" :value="current.umswap.tokenIds.map(i => i.toString()).join(',')" rows="3" max-rows="100"></b-form-textarea>
                    </div>
                  </b-form-group>

                  {{ tokensOfPool }}

                  <br />

                  {{ tokensOfOwner }}

                  <!--
                  {{ current }}
                  -->
                </b-card-text>
              </b-card>

              <!-- New Umswap -->
              <b-card v-if="settings.tabIndex == 2" header="New Umswap" class="mt-1" body-class="m-1 p-1" style="min-width: 60rem; max-width: 60rem;">
                <b-card-text>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Collection:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" size="sm" v-model.trim="newUmswap.collection" placeholder="0x1234..."></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Name:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" size="sm" v-model.trim="newUmswap.name" placeholder="{up to 48 alphanums with spaces}"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="TokenIds:" class="mx-0 my-1 p-0">
                    <b-form-textarea size="sm" v-model.trim="newUmswap.tokenIds" placeholder="Blank for all, or e.g., 1 2-5 10\n15\n20 30 555" rows="3" max-rows="100"></b-form-textarea>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Tip:" class="mx-0 my-1 p-0">
                    <b-form-input type="text" size="sm" v-model.trim="newUmswap.tip" placeholder="In ETH, optional. e.g. 0.0001 or blank"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label="" class="mx-0 my-1 p-0">
                    <b-button size="sm" @click="execNewUmswap" :disabled="newUmswap.collection == null || newUmswap.name == null" variant="warning">Create</b-button>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label="" class="mx-0 my-1 p-0">
                    <div v-if="newUmswap.txHash">
                      <b-link :href="'https://etherscan.io/tx/' + newUmswap.txHash" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                        {{ newUmswap.txHash }}
                      </b-link>
                    </div>
                    <div v-if="newUmswap.error">
                      {{ newUmswap.error }}
                    </div>
                  </b-form-group>
                </b-card-text>
              </b-card>

              <!-- Messages -->
              <b-card v-if="settings.tabIndex == 3" header="Send Message" class="mt-1" body-class="m-1 p-1" style="min-width: 60rem; max-width: 60rem;">
                <b-card-text>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="To" class="mx-0 my-1 p-0">
                    <b-form-input size="sm" v-model.trim="newMessage.to" placeholder="0x1234... or blank for address(0)"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Umswap" class="mx-0 my-1 p-0">
                    <b-form-input size="sm" v-model.trim="newMessage.umswap" placeholder="0x3456... or blank for address(0)"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Topic" class="mx-0 my-1 p-0">
                    <b-form-input size="sm" v-model.trim="newMessage.topic" placeholder="Optional, 0 to 48 characters"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Text" class="mx-0 my-1 p-0">
                    <b-form-input size="sm" v-model.trim="newMessage.text" placeholder="Mandatory, 1 to 280 characters"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label-align="right" label="Tip" class="mx-0 my-1 p-0">
                    <b-form-input size="sm" v-model.trim="newMessage.tip" placeholder="In ETH, optional. e.g. 0.0001 or blank for none"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label="" class="mx-0 my-1 p-0">
                    <b-button size="sm" @click="execSendMessage" :disabled="newMessage.text == null" variant="warning">Send</b-button>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label="" class="mx-0 my-1 p-0">
                    <div v-if="newMessage.txHash">
                      <b-link :href="'https://etherscan.io/tx/' + newMessage.txHash" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                        {{ newMessage.txHash }}
                      </b-link>
                    </div>
                    <div v-if="newMessage.error">
                      {{ newMessage.error }}
                    </div>
                  </b-form-group>
                </b-card-text>
              </b-card>

            </b-card-body>
          </b-card>
        </b-card>
      </b-card>
    </div>
  `,
  props: ['tab', 'search'],
  data: function() {
    return {
      count: 0,
      reschedule: true,

      settings: {
        tabIndex: 0,
        showFilter: true,
        sortOption: 'priceasc', // TODO 'idasc',
        collection: {
          showInfo: false,
          pageSize: 100,
          currentPage: 1
        },
      },

      newUmswap: {
        collection: "0x31385d3520bced94f77aae104b406994d8f2168c", // null,
        name: "Testing", // null,
        tokenIds: "1 2 23 3 4 5 6 7 8 9 1000 200 34", // null,
        tip: null,
        txHash: null,
        error: null,
      },

      newMessage: {
        to: null,
        umswap: null,
        topic: null,
        text: null,
        tip: null,
        txHash: null,
        error: null,
      },

      // collectionAttributeFilter: {},

      // sortOptions: [
      //   { value: 'idasc', text: '▲ Id' },
      //   { value: 'iddsc', text: '▼ Id' },
      //   { value: 'priceasc', text: '▲ Price' },
      //   { value: 'pricedsc', text: '▼ Price' },
      //   { value: 'random', text: 'Random' },
      // ],

      // pageSizes: [
      //   { value: 10, text: '10' },
      //   { value: 100, text: '100' },
      //   { value: 500, text: '500' },
      //   { value: 1000, text: '1k' },
      //   { value: 2500, text: '2.5k' },
      //   { value: 10000, text: '10k' },
      // ],

      umswapsFields: [
        { key: 'collection', label: 'Collection', thStyle: 'width: 15%;' },
        { key: 'umswap', label: 'Umswap', thStyle: 'width: 15%;' },
        { key: 'sampleTokens', label: 'Sample Tokens', thStyle: 'width: 60%;' },
        { key: 'stats', label: 'Stats', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'score', label: 'Score', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'totalSupply', label: 'Total Supply', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
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
    current() {
      return store.getters['umswap/current'];
    },
    // collectionInfo() {
    //   return store.getters['umswap/collectionInfo'];
    // },
    // collectionTokens() {
    //   return store.getters['umswap/collectionTokens'];
    // },
    ensMap() {
      return store.getters['umswap/ensMap'];
    },

    umswaps() {
      const results = [];
      for (const [collectionAddress, collection] of Object.entries(this.umswapFactory.collections)) {
        for (const umswap of collection.umswaps) {
          // console.log(JSON.stringify(umswap, null, 2));
          const sampleTokens = [];
          for (const item of collection.sampleTokens) {
            sampleTokens.push( { tokenId: item.token.tokenId, image: item.token.image } );
          }
          results.push({
            umswapIndex: umswap.index,
            collectionAddress: collectionAddress,
            collectionName: collection.reservoirInfo.name,
            collectionSlug: collection.reservoirInfo.slug,
            umswapName: umswap.name,
            totalSupply: umswap.totalSupply,
            swappedIn: umswap.swappedIn,
            swappedOut: umswap.swappedOut,
            totalScores: umswap.totalScores,
            raters: umswap.raters,
            sampleTokens: sampleTokens,
          });
        }
      }
      return results;
    },

    umswapsAsOptions() {
      const results = [];
      results.push( { value: null, text: '(select one)' });
      for (const umswap of this.umswaps) {
        results.push( { value: umswap.umswapIndex, text: umswap.collectionName + ': ' + umswap.umswapName });
      }
      return results;
    },

    tokensOfOwner() {
      // console.log("tokensOfOwner: " + this.coinbase);
      // const owner = this.coinbase && this.coinbase.toLowerCase() || null;
      const results = [];
      if (this.current.tokens != null && this.current.umswap != null) {
        // console.log("tokensOfOwner: " + this.coinbase);
        // console.log("this.current.umswap: " + JSON.stringify(this.current.umswap, null, 2));
        const validTokenIds = this.current.umswap.tokenIds.length == 0 ? null : this.current.umswap.tokenIds.map(t => t.toString());
        // console.log("validTokenIds: " + JSON.stringify(validTokenIds, null, 2));
        for (const [tokenId, token] of Object.entries(this.current.tokens)) {
          if (token.owner == this.coinbase) {
            if (validTokenIds == null || validTokenIds.includes(tokenId)) {
              results.push(token);
            }
          }
        }
      }
      return results;
    },

    tokensOfPool() {
      const results = [];
      if (this.current.tokens != null && this.current.umswap != null) {
        const validTokenIds = this.current.umswap.tokenIds.length == 0 ? null : this.current.umswap.tokenIds.map(t => t.toString());
        // TODO dev - const owner = this.current.umswap.address;
        const owner = "0x7a2FE221bd3ab0f0d7fbd5843AA24fC3d00bd366";
        for (const [tokenId, token] of Object.entries(this.current.tokens)) {
          if (token.owner == owner) {
            if (validTokenIds == null || validTokenIds.includes(tokenId)) {
              results.push(token);
            }
          }
        }
      }
      return results;
    },
    // umswap() {
    //   console.log("umswap() - this.filter: " + JSON.stringify(this.filter));
    //   for (const umswap of this.umswaps) {
    //     if (umswap.index == this.filter.umswapIndex) {
    //       console.log("umswap() - umswap: " + JSON.stringify(umswap));
    //       return umswap;
    //     }
    //   }
    //   return null;
    // },

    // collectionTokensAttributesWithCounts() {
    //   const collator = {};
    //   for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
    //     for (let attribute of token.attributes) {
    //         const trait_type = attribute.trait_type;
    //         const value = attribute.value;
    //         if (!collator[trait_type]) {
    //           collator[trait_type] = {};
    //         }
    //         if (!collator[trait_type][value]) {
    //           collator[trait_type][value] = [tokenId];
    //         } else {
    //           collator[trait_type][value].push(tokenId);
    //         }
    //     }
    //   }
    //   // console.log("collectionTokensAttributesWithCounts: " + JSON.stringify(collator, null, 2));
    //   return collator;
    // },
    // filteredCollectionTokens() {
    //   let results = [];
    //   if (Object.keys(this.collectionAttributeFilter) == 0) {
    //     for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
    //       results.push(token);
    //     }
    //   } else {
    //     let selectedTokenIds = [];
    //     for (const [trait, value] of Object.entries(this.collectionAttributeFilter)) {
    //       let thisTraitTokenIds = [];
    //       for (const selectedValue of Object.keys(value)) {
    //         const tokenIds = this.collectionTokensAttributesWithCounts[trait][selectedValue];
    //         thisTraitTokenIds = [...thisTraitTokenIds, ...tokenIds];
    //       }
    //       if (selectedTokenIds.length == 0) {
    //         selectedTokenIds = thisTraitTokenIds;
    //       } else {
    //         selectedTokenIds = selectedTokenIds.filter(tokenId => thisTraitTokenIds.includes(tokenId));
    //       }
    //     }
    //     results = Object.values(selectedTokenIds).map(tokenId => this.collectionTokens[tokenId]);
    //   }
    //   return results;
    // },
    // filteredSortedCollectionTokens() {
    //   let results = this.filteredCollectionTokens;
    //   if (this.settings.sortOption == 'idasc') {
    //     results.sort((a, b) => a.token_id - b.token_id);
    //   } else if (this.settings.sortOption == 'iddsc') {
    //     results.sort((a, b) => b.token_id - a.token_id);
    //   } else if (this.settings.sortOption == 'priceasc') {
    //     results.sort((a, b) => {
    //       const pricea = a.price && a.price.price || null;
    //       const priceb = b.price && b.price.price || null;
    //       if (pricea == priceb) {
    //         return a.token_id - b.token_id;
    //       } else if (pricea != null && priceb == null) {
    //         return -1;
    //       } else if (pricea == null && priceb != null) {
    //         return 1;
    //       } else {
    //         return pricea - priceb;
    //       }
    //     });
    //   } else if (this.settings.sortOption == 'pricedsc') {
    //     results.sort((a, b) => {
    //       const pricea = a.price && a.price.price || null;
    //       const priceb = b.price && b.price.price || null;
    //       if (pricea == priceb) {
    //         return a.token_id - b.token_id;
    //       } else if (pricea != null && priceb == null) {
    //         return -1;
    //       } else if (pricea == null && priceb != null) {
    //         return 1;
    //       } else {
    //         return priceb - pricea;
    //       }
    //     });
    //   } else {
    //     results.sort(() => {
    //       return Math.random() - 0.5;
    //     });
    //   }
    //   return results;
    // },
    // pagedFilteredCollectionTokens() {
    //   return this.filteredSortedCollectionTokens.slice((this.settings.collection.currentPage - 1) * this.settings.collection.pageSize, this.settings.collection.currentPage * this.settings.collection.pageSize);
    // },
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
    formatETH(e) {
      try {
        return e ? ethers.utils.commify(ethers.utils.formatEther(e)) : null;
      } catch (err) {
      }
      return e.toFixed(9);
    },
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
    // getSortedTraitsForCollectionTokensAttributes(category) {
    //   const results = [];
    //   for (let attributeKey in this.collectionTokensAttributesWithCounts[category]) {
    //     const c = this.collectionTokensAttributesWithCounts[category][attributeKey];
    //     results.push({ attributeOption: attributeKey, attributeTotal: c })
    //   }
    //   results.sort((a, b) => b.attributeTotal.length - a.attributeTotal.length);
    //   return results;
    // },
    // collectionFilterChange(attribute, option) {
    //   if (!this.collectionAttributeFilter[attribute]) {
    //     Vue.set(this.collectionAttributeFilter, attribute, {});
    //   }
    //   if (this.collectionAttributeFilter[attribute][option]) {
    //     Vue.delete(this.collectionAttributeFilter[attribute], option);
    //     if (Object.keys(this.collectionAttributeFilter[attribute]) == 0) {
    //       Vue.delete(this.collectionAttributeFilter, attribute);
    //     }
    //   } else {
    //     Vue.set(this.collectionAttributeFilter[attribute], option, true);
    //   }
    //   // console.log("collectionFilterChange: " + JSON.stringify(this.collectionAttributeFilter));
    // },
    updateURL(where) {
      this.$router.push('/umswap/' + where);
    },
    async execNewUmswap() {
      this.newUmswap.txHash = null;
      this.newUmswap.error = null;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const umswapFactory = new ethers.Contract(UMSWAPFACTORYADDRESS, UMSWAPFACTORYABI, provider);
      const umswapFactoryWithSigner = umswapFactory.connect(provider.getSigner());
      const from = await provider.getSigner().getAddress();
      const collection = this.newUmswap.collection == null || this.newUmswap.collection.trim().length == 0 ? null : this.newUmswap.collection.trim();
      const name = this.newUmswap.name == null || this.newUmswap.name.trim().length == 0 ? null : this.newUmswap.name.trim();
      const tokenIds = this.newUmswap.tokenIds == null || this.newUmswap.tokenIds.trim().length == 0 ? [] : this.newUmswap.tokenIds.split(/[, \t\n]+/).sort((a, b) => (BigInt(a) > BigInt(b))? 0 : -1);
      const integrator = ADDRESS0;
      const tip = this.newUmswap.tip == null || this.newUmswap.tip.trim().length == 0 ? 0 : ethers.utils.parseEther(this.newUmswap.tip);
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
            this.newUmswap.txHash = tx.hash;
            console.log("tx: " + JSON.stringify(tx));
          } catch (e) {
            this.newUmswap.error = e.message.toString();
            console.log("newUmswap.newUmswap error: " + JSON.stringify(e));
          }
        }
      }).catch(err => {
        this.newUmswap.error = err.message.toString();
        console.log("newUmswap.newUmswap error: " + JSON.stringify(e));
      });
    },
    async execSendMessage() {
      this.newMessage.txHash = null;
      this.newMessage.error = null;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const umswapFactory = new ethers.Contract(UMSWAPFACTORYADDRESS, UMSWAPFACTORYABI, provider);
      const umswapFactoryWithSigner = umswapFactory.connect(provider.getSigner());
      const from = await provider.getSigner().getAddress();
      const to = this.newMessage.to == null || this.newMessage.to.trim().length == 0 ? ADDRESS0 : this.newMessage.to.trim();
      const umswap = this.newMessage.umswap == null || this.newMessage.umswap.trim().length == 0 ? ADDRESS0 : this.newMessage.umswap.trim();
      const topic = this.newMessage.topic == null || this.newMessage.topic.trim().length == 0 ? "" : this.newMessage.topic.trim();
      const text = this.newMessage.text == null || this.newMessage.text.trim().length == 0 ? "" : this.newMessage.text.trim();
      const integrator = ADDRESS0;
      const tip = this.newMessage.tip == null || this.newMessage.tip.trim().length == 0 ? 0 : ethers.utils.parseEther(this.newMessage.tip);
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
            this.newMessage.txHash = tx.hash;
            console.log("tx: " + JSON.stringify(tx));
          } catch (e) {
            this.newMessage.error = e.message.toString();
            console.log("Umswap.sendMessage error: " + JSON.stringify(e));
          }
        }
      }).catch(err => {
        this.newMessage.error = err.message.toString();
        console.log("Umswap.sendMessage error: " + JSON.stringify(e));
      });
    },
    async doIt(syncMode, filterUpdate) {
      store.dispatch('umswap/doIt', { syncMode, filterUpdate });
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
    logInfo("Umswap", "mounted() $route: " + JSON.stringify(this.$route.params) + ", props['tab']: " + this.tab + ", props['search']: " + this.search);
    if (this.tab == null || this.tab == "umswaps") {
      this.settings.tabIndex = 0;
    } else if (this.tab == "umswap") {
      this.settings.tabIndex = 1;
      if (this.search != null) {
        const filterUpdate = {
          umswapIndex: this.search,
        };
        setTimeout(function() {
          store.dispatch('umswap/doIt', { syncMode: 'scan', filterUpdate });
        }, 1000);
      }
    // } else if (this.tab == "mintmonitor") {
    //   this.settings.tabIndex = 2;
    //   let startBlockNumber = null;
    //   let endBlockNumber = null;
    //   if (this.blocks != null) {
    //     if (new RegExp('^[0-9,]+$').test(this.blocks)) {
    //       startBlockNumber = this.blocks;
    //       endBlockNumber = this.blocks;
    //     } else if (new RegExp('^[0-9,]+\s*\-\s*[0-9,]+$').test(this.blocks)) {
    //       startBlockNumber = this.blocks.replace(/\s*\-.*$/, '');
    //       endBlockNumber = this.blocks.replace(/^.*\-\s*/, '');
    //     }
    //     const filterUpdate = {
    //       startBlockNumber: ethers.utils.commify(parseInt(startBlockNumber)),
    //       endBlockNumber: ethers.utils.commify(parseInt(endBlockNumber)),
    //       searchString: this.search,
    //     };
    //     setTimeout(function() {
    //       store.dispatch('umswap/monitorMints', { syncMode: 'scan', filterUpdate });
    //     }, 1000);
    //   }
    } else if (this.tab == "newumswap") {
      this.settings.tabIndex = 2;
    } else if (this.tab == "messages") {
      this.settings.tabIndex = 3;
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
      umswapIndex: null,
      // collection: {
      //   address: null, // "0x31385d3520bced94f77aae104b406994d8f2168c",
      //   startBlockNumber: 4000000,
      // },
      // searchString: null,
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
      umswaps: [],
      collections: {},
    },
    current: {
      umswap: null,
      collection: null,
      tokens: null,
    },
    // umswap: {
    //   index: 1, // null,
    // },
    messages: [],
    // collectionInfo: {},
    // collectionTokens: {},
    ensMap: {},
    halt: false,
    params: null,
  },
  getters: {
    filter: state => state.filter,
    sync: state => state.sync,
    umswapFactory: state => state.umswapFactory,
    current: state => state.current,
    messages: state => state.messages,
    // collectionInfo: state => state.collectionInfo,
    // collectionTokens: state => state.collectionTokens,
    ensMap: state => state.ensMap,
    params: state => state.params,
  },
  mutations: {

    // --- doIt() ---
    async doIt(state, { syncMode, filterUpdate }) {

      // --- doIt() start ---
      logInfo("umswapModule", "mutations.doIt() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const umswapFactory = new ethers.Contract(UMSWAPFACTORYADDRESS, UMSWAPFACTORYABI, provider);
        const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
        const block = await provider.getBlock("latest");
        const blockNumber = block.number;

        if (filterUpdate != null) {
          state.filter = { ...state.filter, ...filterUpdate };
        }

        const debug = false;

        if (syncMode != 'filterUpdate' || Object.keys(state.umswapFactory.collections) == 0) {
          state.sync.inProgress = true;
          state.sync.section = "Retrieving umswaps";
          state.sync.completed = 0;
          state.sync.total = 2;
          state.sync.error = false;
          const umswapsLength = await umswapFactory.getUmswapsLength();
          // state.umswapFactory.umswapsLength = umswapsLength;
          var umswapsIndices = generateRange(0, parseInt(umswapsLength) - 1, 1);
          const umswaps = await umswapFactory.getUmswaps(umswapsIndices);

          const collections = {};
          for (let i = 0; i < umswaps[0].length; i++) {
            const index = umswapsIndices[i];
            const address = umswaps[0][i];
            const symbol = umswaps[1][i];
            const name = umswaps[2][i];
            const collection = umswaps[3][i];
            const tokenIds = umswaps[4][i];
            const creator = umswaps[5][i];
            const stats = umswaps[6][i];
            const swappedIn = stats[0].toString();
            const swappedOut = stats[1].toString();
            const totalScores = stats[2].toString();
            const totalSupply = stats[3].toString();
            const raters = stats[4].toString();
            // console.log(index + " " + address + " " + symbol + " " + name + " " + collection + " " +
            //   JSON.stringify(tokenIds) + " " + creator +
            //   " swappedIn: " + swappedIn + " swappedOut: " + swappedOut + " totalScores: " + totalScores + " totalSupply: " + totalSupply + " raters: " + raters);
            if (!(collection in collections)) {
              collections[collection] = { address: collection, type: null, symbol: null, name: null, totalSupply: null, reservoirInfo: null, allTokens: [], sampleTokens: [], umswaps: [] };
            }
            const umswap = { index, address, symbol, name, collection, tokenIds, creator, swappedIn, swappedOut, totalScores, totalSupply, raters };
            collections[collection].umswaps.push(umswap);

            // if (index == state.filter.umswapIndex) {
            //   logInfo("umswapModule", "mutations.doIt() - state.filter.umswapIndex: " + state.filter.umswapIndex);
            //   state.umswap = umswap;
            // }
          }
          state.sync.completed = 1;

          state.sync.section = "Retrieving collection summary info";
          for (const [address, collection] of Object.entries(collections)) {
            const info = await erc721Helper.tokenInfo([address]);
            collection.type = info[0][0].toString();
            collection.symbol = info[1][0].toString();
            collection.name = info[2][0].toString();
            collection.totalSupply = info[3][0].toString();

            let infoUrl = "https://api.reservoir.tools/collection/v2?id=" + address;
            // logInfo("umswapModule", "mutations.doIt() - infoUrl: " + infoUrl);
            const reservoirInfo = await fetch(infoUrl)
              .then(handleErrors)
              .then(response => response.json())
              .catch(function(error) {
                 console.log("ERROR - doIt: " + error);
                 // Want to work around API data unavailablity - state.sync.error = true;
                 return [];
              });
            collection.reservoirInfo = reservoirInfo && reservoirInfo.collection || null;

            let tokensUrl = "https://api.reservoir.tools/tokens/details/v4?contract=" + address + "&limit=22";
            const reservoirTokens = await fetch(tokensUrl)
              .then(handleErrors)
              .then(response => response.json())
              .catch(function(error) {
                 console.log("ERROR - doIt: " + error);
                 // Want to work around API data unavailablity - state.sync.error = true;
                 return [];
              });
            collection.sampleTokens = reservoirTokens && reservoirTokens.tokens || null;
            // console.log("collection: " + JSON.stringify(collection, null, 2));
          }
          state.sync.completed = 2;
          state.umswapFactory.collections = collections;
        }

        if (state.filter.umswapIndex == null) {
          state.current.umswap = null;
          state.current.collection = null;
          state.current.tokens = null;
        } else {
          // TODO: Handle non-existant #
          logInfo("umswapModule", "mutations.doIt() - state.filter.umswapIndex: " + state.filter.umswapIndex);
          for (const [address, collection] of Object.entries(state.umswapFactory.collections)) {
            for (const umswap of collection.umswaps) {
              if (umswap.index == state.filter.umswapIndex) {
                state.current.umswap = umswap;
                state.current.collection = collection;
                break;
              }
            }
          }
          // console.log("current: " + JSON.stringify(state.current, null, 2));

          if (state.current.collection != null) {
            state.sync.inProgress = true;
            state.sync.section = "Retrieving token metadata";
            state.sync.total = state.current.collection.reservoirInfo.tokenCount;
            let totalRecords = 0;
            let continuation = null;
            let tokens = {};
            do {
              let url = "https://api.reservoir.tools/tokens/details/v4?contract=" + state.current.collection.address +
                "&limit=50" +
                (continuation != null ? "&continuation=" + continuation : '');
              // logInfo("umswapModule", "mutations.doIt() - url: " + url);
              const data = await fetch(url)
                .then(handleErrors)
                .then(response => response.json())
                .catch(function(error) {
                   console.log("ERROR - umswapModule.mutations.doIt(): " + error);
                   state.sync.error = true;
                   return [];
                });
              if (data && data.tokens) {
                // console.log(JSON.stringify(data.tokens[0], null, 2));
                for (const record of data.tokens) {
                  const token = record.token;
                  tokens[token.tokenId] = {
                    tokenId: token.tokenId,
                    owner: null, // token.owner,
                    name: token.name,
                    // description: token.description,
                    // attributes: token.attributes,
                    image: token.image,
                  };
                }
              }
              let numberOfRecords = state.sync.error ? 0 : data.tokens.length;
              totalRecords += numberOfRecords;
              continuation = data.continuation;
              state.sync.completed = totalRecords;
            } while (continuation != null && !state.halt && !state.sync.error /* && totalRecords < 20 && totalRecords < state.sync.total*/);

            const tokenIds = Object.keys(tokens);
            state.sync.section = "Retrieving token owners";
            state.sync.total = tokenIds.length;
            state.sync.completed = 0;
            totalRecords = 0;
            const ERC721OWNERBATCHSIZE = 250;
            if (!state.halt) {
              for (let i = 0; i < tokenIds.length; i += ERC721OWNERBATCHSIZE) {
                const batch = tokenIds.slice(i, parseInt(i) + ERC721OWNERBATCHSIZE);
                const ownerData = await erc721Helper.ownersByTokenIds(state.current.collection.address, batch);
                for (let j = 0; j < batch.length; j++) {
                  const tokenId = batch[j];
                  const owner = ownerData[0][j] && ownerData[1][j] || null;
                  tokens[tokenId].owner = owner;
                }
                totalRecords = parseInt(totalRecords) + batch.length;
                state.sync.completed = totalRecords;
                if (state.halt) {
                  break;
                }
              }
            }
            state.current.tokens = tokens;
            console.log(JSON.stringify(tokens, null, 2).substring(0, 5000));
          }
        }
        state.sync.inProgress = false;


        if (false) {
          for (const collectionAddress of collectionAddresses) {
            let url = "https://api.reservoir.tools/collection/v2?id=" + collectionAddress;
            logInfo("umswapModule", "mutations.doIt() - url: " + url);
            const collectionInfo = await fetch(url)
              .then(handleErrors)
              .then(response => response.json())
              .catch(function(error) {
                 console.log("ERROR - doIt: " + error);
                 state.sync.error = true;
                 return [];
              });
            console.log("collectionInfo: " + JSON.stringify(collectionInfo, null, 2));
            console.log("totalSupply: " + collectionInfo.collection.tokenCount);
            // state.collectionInfo = collectionInfo && collectionInfo.collection || {};

            let totalRecords = 0;
            let continuation = null;
            let tokens = {};
            do {
              let url = "https://api.reservoir.tools/tokens/details/v4?contract=" + collectionAddress +
                "&limit=50" +
                (continuation != null ? "&continuation=" + continuation : '');
              logInfo("umswapModule", "mutations.doIt() - url: " + url);
              const data = await fetch(url)
                .then(handleErrors)
                .then(response => response.json())
                .catch(function(error) {
                   console.log("ERROR - umswapModule.mutations.doIt(): " + error);
                   state.sync.error = true;
                   return [];
                });
              // console.log(JSON.stringify(data, null, 2));

              if (data && data.tokens) {
                console.log(JSON.stringify(data.tokens, null, 2));
                // console.log(JSON.stringify(data.tokens[0], null, 2));
                // for (const record of data.tokens) {
                //   const token = record.token;
                //   tokens[token.tokenId] = {
                //     tokenId: token.tokenId,
                //     owner: token.owner,
                //     name: token.name,
                //     description: token.description,
                //     attributes: token.attributes,
                //     image: token.image,
                //   };
                // }
              }

              // console.log(JSON.stringify(tokens, null, 2));


              // let numberOfRecords = state.sync.error ? 0 : await processSales(data);
              // let numberOfRecords = state.sync.error ? 0 : data.tokens.length;
              // totalRecords += numberOfRecords;
              // TODO continuation = data.continuation;
              // state.sync.completed = totalRecords;
              // if (state.sync.total < totalRecords) {
              //   state.sync.total = totalRecords;
              // }
            } while (continuation != null && !state.halt && !state.sync.error /* && totalRecords < 20 && totalRecords < state.sync.total*/);

            // state.collectionTokens = tokens;
          }
        }

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
            // console.log("  " + i + " " + inp.name + " " + inp.type + " " + logData.args[i]);
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
        // console.log("logs: " + JSON.stringify(logs, null, 2));

        // // Retrieve prices
        // let continuation = null;
        // let prices = {};
        // do {
        //   let url = "https://api.reservoir.tools/tokens/bootstrap/v1?contract=" + IPCADDRESS +
        //     "&limit=500" +
        //     (continuation != null ? "&continuation=" + continuation : '');
        //   // logInfo("nftsModule", "mutations.doIt() - url: " + url);
        //   const data = await fetch(url)
        //     .then(handleErrors)
        //     .then(response => response.json())
        //     .catch(function(error) {
        //        console.log("ERROR - doIt: " + error);
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
    doIt(context, { syncMode, filterUpdate }) {
      logInfo("umswapModule", "actions.doIt() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('doIt', { syncMode, filterUpdate });
    },
    halt(context) {
      context.commit('halt');
    },
  },
};
