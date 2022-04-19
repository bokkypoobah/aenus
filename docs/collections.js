const Collections = {
  template: `
    <div class="mt-5 pt-3">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="!powerOn || (network.chainId != 1 && network.chainId != 4)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Rinkeby network and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="Collections" class="border-0" header-class="p-1" v-if="network.chainId == 1 || network.chainId == 4">
        <b-card no-body class="border-0 m-0 mt-2">
          <b-card-body class="p-0">

            <div>
              <b-card no-body class="mt-2">

                <b-tabs v-model="tabIndex" vertical pills card end nav-class="p-2" active-tab-class="p-2">

                  <b-tab active title="Collections" class="p-1">
                    <b-card-text>
                      <font size="-1">
                        <b-table small fixed striped sticky-header="1000px" :fields="collectionsFields" :items="collectionList" head-variant="light">
                          <template #cell(address)="data">
                            <b-link :href="explorer + 'token/' + data.item.address" class="card-link truncate" target="_blank">{{ data.item.address }}</b-link>
                          </template>
                          <template #cell(totalSupply)="data">
                            <div v-if="data.item.totalSupply">
                              <div v-if="data.item.totalSupply == data.item.computedTotalSupply" v-b-popover.hover="'Count of retrieved tokenIds matches contract totalSupply'">
                                {{ data.item.totalSupply }}
                              </div>
                              <div v-else v-b-popover.hover="'Count of retrieved tokenIds vs contract totalSupply'">
                                Loaded {{ (data.item.computedTotalSupply ? data.item.computedTotalSupply : '?') + ' of ' + data.item.totalSupply }}
                              </div>
                            </div>
                            <div v-else>
                              <div v-if="data.item.computedTotalSupply" v-b-popover.hover="'Count of retrieved tokenIds, as the contract does not implement ERC721Enumerable'">
                                {{ data.item.computedTotalSupply }}
                              </div>
                              <div v-else v-b-popover.hover="'Collection contract does not implement ERC721Enumerable'">
                                Counting
                              </div>
                            </div>
                          </template>
                          <template #cell(timestamp)="data">
                            <div v-if="data.item.timestamp">
                              {{ formatDate(data.item.timestamp) }}
                            </div>
                          </template>
                        </b-table>
                      </font>
                    </b-card-text>
                  </b-tab>

                  <b-tab active title="Collection" class="p-1">
                    <b-form-group label-cols="3" label-size="sm" label="Collection">
                      <div v-if="collectionListAsOptions.length > 0">
                        <b-form-select size="sm" v-model="collection.selected" :options="collectionListAsOptions" class="w-50"></b-form-select>
                      </div>
                      <div v-else>
                        Loading ...
                      </div>
                    </b-form-group>
                    <div v-if="collections[collection.selected] && collections[collection.selected].tokens">
                      <font size="-2">
                        <b-table small fixed striped sticky-header="1000px" :fields="collectionFields" :items="selectedRecords(collection)" head-variant="light">
                          <template #cell(traits)="data">
                            <div v-if="data.item.traits">
                              <b-row v-for="(attribute, i) in data.item.traits"  v-bind:key="i" class="m-0 p-0">
                                <b-col cols="3" class="m-0 p-0"><font size="-3">{{ attribute.trait_type }}</font></b-col><b-col class="m-0 p-0"><b><font size="-2">{{ attribute.value }}</font></b></b-col>
                              </b-row>
                            </div>
                          </template>
                          <template #cell(image)="data">
                            <div v-if="data.item.image">
                              <b-img-lazy :width="'100%'" :src="data.item.image.replace('ipfs://', 'https://ipfs.io/ipfs/')" />
                            </div>
                          </template>
                        </b-table>
                      </font>
                    </div>
                  </b-tab>

                  <b-tab title="Search OS Collections" class="p-1">
                    <b-form-group label-cols="3" label-size="sm" label="OS ERC-721 Token Collections">
                      <b-button size="sm" @click="loadOSCollections" variant="primary">Load</b-button>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Filter">
                      <b-form-input type="text" size="sm" @change="recalculateOSFilter()" v-model.trim="osCollection.filter" debounce="600" placeholder="🔍 0x1234..., Symbol or Name" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-card-text>
                      <font size="-2">
                        <b-table small fixed striped sticky-header="1000px" :items="osCollection.filtered" head-variant="light">
                          <template #cell(address)="data">
                            {{ data.item.address }}
                            <b-link size="sm" @click="selectInspectAddress(data.item.address);" v-b-popover.hover="'Inspect'" variant="link">
                              <b-icon-search shift-v="+1" font-scale="1.0"></b-icon-search>
                            </b-link>
                          </template>
                        </b-table>
                      </font>
                    </b-card-text>
                  </b-tab>

                  <b-tab title="Inspect Collection" class="p-1">
                    <b-form-group label-cols="3" label-size="sm" label="Address" description="'0xab04795fa12aCe45Dd2A2E4A132e4E46B2d4D1B8' for 'TTT', '0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4' for 'TESTTOADZ', '0x652dc3aa8e1d18a8cc19aef62cf4f03c4d50b2b5' for 'TESTS'">
                      <b-form-input type="text" size="sm" v-model.trim="inspect.address" placeholder="0x1234..." class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="">
                      <b-button size="sm" @click="inspectAddress" variant="primary">Inspect</b-button>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Type">
                      <b-form-checkbox-group size="sm" v-model="inspect.erc721Types" :options="inspect.erc721TypesOptions"></b-form-checkbox-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Symbol">
                      <b-form-input type="text" size="sm" readonly v-model.trim="inspect.symbol" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Name">
                      <b-form-input type="text" size="sm" readonly v-model.trim="inspect.name" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Total Supply">
                      <b-form-input type="text" size="sm" readonly v-model.trim="inspect.totalSupply" class="w-50"></b-form-input>
                    </b-form-group>
                    <div v-if="inspect.erc721Types.includes('ERC721')">
                      <b-card header="Scan ERC721Enumerable.tokenByIndex(index), then ERC721.ownerOf(tokenId)" class="mb-2">
                        <template #header>
                          <span variant="secondary">
                            {{ inspect.erc721Types.includes('ERC721Enumerable') ? 'Scan ERC721Enumerable.tokenByIndex(index), then ERC721.ownerOf(tokenId)' : 'Scan ERC721.ownerOf(tokenId)' }}
                          </span>
                        </template>
                        <div v-if="!inspect.erc721Types.includes('ERC721Enumerable')">
                          <b-form-group label-cols="3" label-size="sm" label="Scan from (inclusive)">
                            <b-form-input type="text"  size="sm" v-model.trim="scanOwners.from" class="w-50"></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Scan to (exclusive)">
                            <b-form-input type="text" size="sm" v-model.trim="scanOwners.to" class="w-50"></b-form-input>
                          </b-form-group>
                        </div>
                        <b-form-group label-cols="3" label-size="sm" label="Batch size">
                          <b-form-input type="text" size="sm" v-model.trim="scanOwners.batchSize" class="w-50"></b-form-input>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-button size="sm" @click="scanForOwners" variant="primary">Scan for owners and tokenURI</b-button>
                        </b-form-group>
                        <div v-if="Object.keys(scanOwners.tokenURIs).length > 0">
                          <b-form-group label-cols="3" label-size="sm" label="">
                            <b-button size="sm" @click="retrieveTraitsAndImagesFromTokenURI" variant="primary">Retrieve traits and images from tokenURI</b-button>
                            or
                            <b-button size="sm" @click="retrieveTraitsAndImagesFromOS" variant="primary">Retrieve traits and images from OS</b-button>
                          </b-form-group>
                        </div>
                      </b-card>
                      <b-card>
                        <font size="-2">
                          <b-table small fixed striped sticky-header="1000px" :fields="scanOwners.fields" :items="scanOwners.owners" head-variant="light">
                            <template #cell(owner)="data">
                              <b-link :href="explorer + 'address/' + data.item.owner" class="card-link truncate" target="_blank">{{ data.item.owner }}</b-link>
                            </template>
                            <template #cell(tokenURI)="data">
                              <div v-if="scanOwners.tokenURIs[data.item.tokenId]">
                                <b-link :href="scanOwners.tokenURIs[data.item.tokenId].replace('ipfs://', 'https://ipfs.io/ipfs/')" class="card-link truncate" target="_blank">{{ scanOwners.tokenURIs[data.item.tokenId] }}</b-link>
                              </div>
                            </template>
                            <template #cell(image)="data">
                              <div v-if="scanOwners.traitsAndImages[data.item.tokenId]">
                                <b-img-lazy :width="'100%'" :src="scanOwners.traitsAndImages[data.item.tokenId].image.replace('ipfs://', 'https://ipfs.io/ipfs/')" />
                              </div>
                            </template>
                            <template #cell(traits)="data">
                              <div v-if="scanOwners.traitsAndImages[data.item.tokenId]">
                                <b-row v-for="(attribute, i) in scanOwners.traitsAndImages[data.item.tokenId].traits"  v-bind:key="i" class="m-0 p-0">
                                  <b-col cols="3" class="m-0 p-0"><font size="-3">{{ attribute.trait_type }}</font></b-col><b-col class="m-0 p-0"><b><font size="-2">{{ attribute.value }}</font></b></b-col>
                                </b-row>
                              </div>
                            </template>
                          </b-table>
                        </font>
                      </b-card>
                    </div>
                  </b-tab>

                  <b-tab title="TestToadz" class="p-1">
                    <b-card header="TestToadz" class="mb-2">
                      <b-card-text>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-button size="sm" @click="loadTestToadz" variant="primary">Load</b-button>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Token Address">
                          <b-link :href="explorer + 'token/' + testToadz.address" class="card-link" target="_blank">{{ testToadz.address }}</b-link>
                        </b-form-group>
                        <!--
                        <b-form-group label-cols="3" label-size="sm" label="Supports ERC-721 '0x80ac58cd'">
                          <b-form-input size="sm" readonly v-model="testToadz.supportsERC721" class="w-50"></b-form-input>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Supports ERC-721 Metadata '0x5b5e139f'">
                          <b-form-input size="sm" readonly v-model="testToadz.supportsERC721METADATA" class="w-50"></b-form-input>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Supports ERC-721 Enumerable '0x780e9d63'">
                          <b-form-input size="sm" readonly v-model="testToadz.supportsERC721ENUMERABLE" class="w-50"></b-form-input>
                        </b-form-group>
                        -->
                        <b-form-group label-cols="3" label-size="sm" label="Symbol">
                          <b-form-input size="sm" readonly v-model="testToadz.symbol" class="w-50"></b-form-input>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Name">
                          <b-form-input size="sm" readonly v-model="testToadz.name" class="w-50"></b-form-input>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Balance">
                          <b-form-input size="sm" readonly v-model="testToadz.balance" class="w-50"></b-form-input>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Approved To Nix For Trading">
                          <b-form-input size="sm" readonly v-model="testToadz.approvedToNix" class="w-50"></b-form-input>
                        </b-form-group>
                      </b-card-text>
                      <b-card-text>
                        <font size="-2">
                          <b-table small fixed striped sticky-header="1000px" :fields="testToadzFields" :items="testToadz.owners" head-variant="light">
                            <template #cell(tokenURI)="data">
                              {{ testToadz.tokenURIs[data.item.tokenId] || '(none)' }}
                            </template>
                            <template #cell(image)="data">
                              <div v-if="testToadz.osData[data.item.tokenId]">
                                <b-img-lazy :width="'100%'" :src="testToadz.osData[data.item.tokenId].image" />
                              </div>
                            </template>
                            <template #cell(traits)="data">
                              <div v-if="testToadz.osData[data.item.tokenId]">
                                <b-row v-for="(attribute, i) in testToadz.osData[data.item.tokenId].traits"  v-bind:key="i" class="m-0 p-0">
                                  <b-col cols="3" class="m-0 p-0"><font size="-3">{{ attribute.trait_type }}</font></b-col><b-col class="m-0 p-0"><b><font size="-2">{{ attribute.value }}</font></b></b-col>
                                </b-row>
                              </div>
                            </template>
                          </b-table>
                        </font>
                      </b-card-text>
                    </b-card>

                    <b-card header="Check TestToadz Royalties" class="mb-2">
                      <b-card-text>
                        <b-form-group label-cols="3" label-size="sm" label="TokenId" description="e.g., 123">
                          <b-form-input size="sm" v-model="testToadz.royaltyTokenId" class="w-50"></b-form-input>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Sale amount" description="In WETH. e.g., 0.456">
                          <b-form-input size="sm" v-model="testToadz.royaltyAmount" class="w-50"></b-form-input>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-button size="sm" @click="checkTestToadzRoyalty" variant="primary">Check</b-button>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Nix RoyaltyEngine">
                          <div v-if="testToadz.nixRoyaltyEngine">
                            <b-link :href="explorer + 'address/' + testToadz.nixRoyaltyEngine" class="card-link" target="_blank">{{ testToadz.nixRoyaltyEngine }}</b-link>
                          </div>
                          <div v-else>
                            Click Check for address
                          </div>
                        </b-form-group>
                        <font size="-2">
                          <b-table small fixed striped sticky-header="1000px" :items="testToadz.royaltyPayments" head-variant="light">
                            <template #cell(payTo)="data">
                              <b-link :href="explorer + 'token/' + weth.address + '?a=' + data.item.payTo" class="card-link" target="_blank">{{ data.item.payTo }}</b-link>
                            </template>
                            <template #cell(payAmount)="data">
                              {{ formatETH(data.item.payAmount) }}
                            </template>
                          </b-table>
                        </font>
                      </b-card-text>
                    </b-card>

                    <b-card header="Mint TestToadz" class="mb-2">
                      <b-card-text>
                        <b-form-group label-cols="3" label-size="sm" label="Number to mint" description="Up to 3 at a time. 20 max can be minted per account">
                          <b-form-input size="sm" v-model="testToadz.mintNumber" class="w-50"></b-form-input>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-button size="sm" @click="mintTestToadz" variant="warning">Mint</b-button>
                        </b-form-group>
                        <b-form-group v-if="testToadz.mintMessage && testToadz.mintMessage.substring(0, 2) != '0x'" label-cols="3" label-size="sm" label="">
                          <b-form-textarea size="sm" rows="10" v-model="testToadz.mintMessage" class="w-50"></b-form-textarea>
                        </b-form-group>
                        <b-form-group v-if="testToadz.mintMessage && testToadz.mintMessage.substring(0, 2) == '0x'" label-cols="3" label-size="sm" label="">
                          Tx <b-link :href="explorer + 'tx/' + testToadz.mintMessage" class="card-link" target="_blank">{{ testToadz.mintMessage }}</b-link>
                        </b-form-group>
                      </b-card-text>
                    </b-card>

                    <b-card header="Approve TestToadz or Revoke TestToadz Approval To Nix For Trading" class="mb-2">
                      <b-card-text>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-button size="sm" @click="approveTestToadzToNix(true)" variant="warning">Approve</b-button>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-button size="sm" @click="approveTestToadzToNix(false)" variant="warning">Revoke Approval</b-button>
                        </b-form-group>
                        <b-form-group v-if="testToadz.approvalMessage && testToadz.approvalMessage.substring(0, 2) != '0x'" label-cols="3" label-size="sm" label="">
                          <b-form-textarea size="sm" rows="10" v-model="testToadz.approvalMessage" class="w-50"></b-form-textarea>
                        </b-form-group>
                        <b-form-group v-if="testToadz.approvalMessage && testToadz.approvalMessage.substring(0, 2) == '0x'" label-cols="3" label-size="sm" label="">
                          Tx <b-link :href="explorer + 'tx/' + testToadz.approvalMessage" class="card-link" target="_blank">{{ testToadz.approvalMessage }}</b-link>
                        </b-form-group>
                      </b-card-text>
                    </b-card>
                  </b-tab>

                  <!--
                  <b-tab title="Approvals" class="p-1">
                    <b-form-group label-cols="3" label-size="sm" label="">
                      <b-button size="sm" @click="checkApprovals" variant="primary">Check</b-button>
                    </b-form-group>
                  </b-tab>
                  -->
                </b-tabs>
              </b-card>
            </div>

          </b-card-body>
        </b-card>
      </b-card>
    </div>
  `,
  data: function () {
    return {
      count: 0,
      reschedule: true,

      tabIndex: 0,

      collectionsFields: [
        { key: 'chainId', label: 'Chain Id', thStyle: 'width: 10%;', sortable: true },
        { key: 'address', label: 'Address', thStyle: 'width: 10%;', sortable: true },
        { key: 'symbol', label: 'Symbol', thStyle: 'width: 10%;', sortable: true },
        { key: 'name', label: 'Name', thStyle: 'width: 20%;', sortable: true },
        { key: 'totalSupply', label: 'Total Supply', thStyle: 'width: 20%;', thClass: 'text-right', tdClass: 'text-right', sortable: true },
        // { key: 'computedTotalSupply', label: 'Computed Total Supply', thStyle: 'width: 20%;', thClass: 'text-right', tdClass: 'text-right', sortable: true },
        { key: 'blockNumber', label: 'Block Number', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right', sortable: true },
        { key: 'timestamp', label: 'Timestamp', thStyle: 'width: 20%;', sortable: true },
      ],

      collection: {
        selected: '4.0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4',
      },

      collectionFields: [
        { key: 'tokenId', label: 'Token Id', thStyle: 'width: 25%;', sortable: true },
        { key: 'owner', label: 'Owner', thStyle: 'width: 25%;', sortable: true },
        // { key: 'tokenURI', label: 'Token URI', thStyle: 'width: 25%;', sortable: true },
        // { key: 'metadataRetrieved', label: 'Metadata Retrieved', thStyle: 'width: 20%;', sortable: true },
        { key: 'traits', label: 'Traits', thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right', sortable: true },
        { key: 'image', label: 'Image', thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right', sortable: true },
      ],

      osCollection: {
        data: [],
        filter: null,
        filtered: [],
      },

      inspect: {
        // address: "0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4",
        // address: "0xab04795fa12aCe45Dd2A2E4A132e4E46B2d4D1B8",
        address: "0x652dc3aa8e1d18a8cc19aef62cf4f03c4d50b2b5",
        symbol: null,
        name: null,
        totalSupply: null,
        erc721Types: [],
        erc721TypesOptions: [
          { text: 'ERC-721', value: 'ERC721', disabled: true },
          { text: 'ERC-721 Metadata', value: 'ERC721Metadata', disabled: true },
          { text: 'ERC-721 Enumerable', value: 'ERC721Enumerable', disabled: true },
        ],
      },

      scanOwners: {
        from: 0,
        to: 6969,
        batchSize: 1000,
        owners: [],
        tokenURIs: {},
        traitsAndImages: {},
        fields: [
          { key: 'tokenId', label: 'Token Id', thStyle: 'width: 10%;', sortable: true },
          { key: 'owner', label: 'Owner', thStyle: 'width: 20%;', sortable: true },
          { key: 'tokenURI', label: 'TokenURI', thStyle: 'width: 20%;', sortable: true },
          { key: 'traits', label: 'Traits', thStyle: 'width: 30%;', sortable: true },
          { key: 'image', label: 'Image', thStyle: 'width: 20%;', sortable: true },
        ],
      },

      testToadz: {
        address: TESTTOADZADDRESS,
        supportsERC721: null,
        supportsERC721METADATA: null,
        supportsERC721ENUMERABLE: null,
        symbol: null,
        name: null,
        balance: null,
        nixRoyaltyEngine: null,
        royaltyTokenId: null,
        royaltyAmount: null,
        royaltyPayments: [],
        approvedToNix: null,
        approvalMessage: null,
        mintNumber: null,
        mintMessage: null,
        owners: [],
        tokenURIs: {},
        osData: {},
      },

      testToadzFields: [
        { key: 'tokenId', label: 'Token Id', sortable: true },
        { key: 'owner', label: 'Owner', sortable: true },
        // { key: 'tokenURI', label: 'TokenURI', sortable: true },
        { key: 'traits', label: 'Traits', sortable: true },
        { key: 'image', label: 'Image', sortable: true },
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
    tokensData() {
      return store.getters['nixData/tokensData'];
    },
    tradeData() {
      return store.getters['nixData/tradeData'];
    },
    collections() {
      return store.getters['nixData/collections'];
    },
    collectionList() {
      return store.getters['nixData/collectionList'];
    },
    collectionListAsOptions() {
      const results = [];
      const map = {};
      if (store.getters['nixData/collections']) {
        for (const [chainIdAddress, collection] of Object.entries(store.getters['nixData/collections'])) {
          results.push({ value: chainIdAddress, text: collection.symbol + ' - ' + collection.name + ' - ' + collection.computedTotalSupply });
        }
        results.sort(function(a, b) {
          return ('' + a.text + a.value).localeCompare(b.text + b.value);
        });
      // } else {
      //   results.push({ value: '--- (loading) ---', text: '--- (loading) ---'});
      }
      return results;
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
          return new Date(parseInt(d) * 1000).toISOString(); // .substring(4);
        } else {
          return new Date(d).toDateString().substring(4);
        }
      }
    },
    selectedRecords(collection) {
      // console.log("selectedRecords(" + collection + ")");
      const results = [];
      if (collection.selected && this.collections && this.collections[collection.selected]) {
        return Object.values(this.collections[collection.selected].tokens);
      }
      return results;
    },

    async recalculateOSFilter() {
      let results = [];
      if (this.osCollection.filter && this.osCollection.filter.length > 0) {
        const filter = this.osCollection.filter.toLowerCase();
        for (const item of this.osCollection.data) {
          const address = item.address.toLowerCase();
          const symbol = item.symbol.toLowerCase();
          const name = item.symbol.toLowerCase();
          if (address.includes(filter) || symbol.includes(filter) || name.includes(filter)) {
            results.push(item);
          }
        }
      } else {
        results = this.osCollection.data;
      }
      this.osCollection.filtered = results;
    },

    async loadOSCollections() {
      console.log("loadOSCollections");
      const BATCHSIZE = 300; // Max 30
      const DELAYINMILLIS = 500;
      const delay = ms => new Promise(res => setTimeout(res, ms));

      let offset = 0;
      let done = false;
      const osCollectionData = [];
      while (!done) {
        try {
          let url = "https://testnets-api.opensea.io/api/v1/collections?offset=" + offset + "\&limit=" + BATCHSIZE;
          console.log("Processing " + offset + ": " + url);
          const data = await fetch(url).then(response => response.json());
          if (data && data.collections && data.collections.length > 0) {
            // console.log("data: " + JSON.stringify(data.collections.length));
            for (let i = 0; i < data.collections.length; i++) {
              const collection = data.collections[i];
              const info = collection.primary_asset_contracts.length > 0 ? collection.primary_asset_contracts[0] : null;
              if (info && info.schema_name == 'ERC721') {
                const address = ethers.utils.getAddress(info.address);
                console.log((offset + i) + " " + address + " " + info.symbol + " " + info.name + " " + info.schema_name);
                osCollectionData.push({ address: address, symbol: info.symbol, name: info.name, total_supply: info.total_supply });
              }
            }
            this.osCollection.data = osCollectionData;
            this.recalculateOSFilter();
            await delay(DELAYINMILLIS);
          } else {
            done = true;
          }
          offset = offset + BATCHSIZE;
        } catch (e) {
          done = true;
        }
      }
      this.osCollection.data = osCollectionData;
    },

    selectInspectAddress(a) {
      this.inspect.address = a;
      this.inspect.erc721Types = [];
      this.inspect.symbol = "?";
      this.inspect.name = "?";
      this.inspect.totalSupply = "?";
      this.tabIndex = 2;
    },

    async inspectAddress() {
      event.preventDefault();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
      this.inspect.erc721Types = [];
      this.inspect.symbol = "?";
      this.inspect.name = "?";
      this.inspect.totalSupply = "?";
      let tokenInfo = null;
      try {
        tokenInfo = await erc721Helper.tokenInfo([this.inspect.address]);
      } catch (e) {
        this.inspect.symbol = "ERROR - May not be ERC-721";
      }
      if (tokenInfo && tokenInfo.length == 4 && tokenInfo[0].length == 1) {
        let tokenType = tokenInfo[0][0].toNumber();
        const MASK_ERC721 = 2**0;
        const MASK_ERC721METADATA = 2**1;
        const MASK_ERC721ENUMERABLE = 2**2;
        if ((tokenType & MASK_ERC721) == MASK_ERC721) {
          this.inspect.erc721Types.push("ERC721");
        }
        if ((tokenType & MASK_ERC721METADATA) == MASK_ERC721METADATA) {
          this.inspect.erc721Types.push("ERC721Metadata");
        }
        if ((tokenType & MASK_ERC721ENUMERABLE) == MASK_ERC721ENUMERABLE) {
          this.inspect.erc721Types.push("ERC721Enumerable");
        }
        this.inspect.symbol = tokenInfo[1][0];
        this.inspect.name = tokenInfo[2][0];
        this.inspect.totalSupply = (!((tokenType & MASK_ERC721ENUMERABLE) == MASK_ERC721ENUMERABLE) || tokenInfo[3][0] == null) ? "n/a" : tokenInfo[3][0].toString();
        this.scanOwners.owners = [];
        this.scanOwners.tokenURIs = {};
        this.scanOwners.traitsAndImages = {};
      }
    },

    async scanForOwners() {
      // console.log("scanForOwners - scanOwners: " + JSON.stringify(this.scanOwners));
      event.preventDefault();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
      const tokenInfo = await erc721Helper.tokenInfo([this.inspect.address]);
      const timestamp = parseInt(new Date() / 1000);
      const batchSize = parseInt(this.scanOwners.batchSize);
      if (this.inspect.erc721Types.includes('ERC721Enumerable')) {
        const totalSupply = parseInt(this.inspect.totalSupply);
        const owners = [];
        for (let i = 0; i < totalSupply; i += batchSize) {
          const to = (i + batchSize > totalSupply) ? totalSupply : i + batchSize;
          const ownersInfo = await erc721Helper.ownersByEnumerableIndex(this.inspect.address, i, to);
          for (let j = 0; j < ownersInfo[0].length; j++) {
            owners.push({ chainId: this.network.chainId, contract: this.inspect.address, tokenId: ownersInfo[0][j].toString(), owner: ownersInfo[1][j], timestamp: timestamp });
          }
          this.scanOwners.owners = owners;
        }
      } else {
        var searchTokenIds = generateRange(parseInt(this.scanOwners.from), (parseInt(this.scanOwners.to) - 1), 1);
        const owners = [];
        for (let i = 0; i < searchTokenIds.length; i += batchSize) {
          const batch = searchTokenIds.slice(i, parseInt(i) + batchSize);
          const ownersInfo = await erc721Helper.ownersByTokenIds(this.inspect.address, batch);
          for (let j = 0; j < ownersInfo[0].length; j++) {
            if (ownersInfo[0][j]) {
              owners.push({ chainId: this.network.chainId, contract: this.inspect.address, tokenId: batch[j].toString(), owner: ownersInfo[1][j], timestamp: timestamp });
            }
          }
          this.scanOwners.owners = owners;
        }
      }
      const tokenIds = this.scanOwners.owners.map(a => a.tokenId);
      const tokenURIsInfo = await erc721Helper.tokenURIsByTokenIds(this.inspect.address, tokenIds);
      const tokenURIRecords = [];
      const tokenURIs = {};
      for (let i = 0; i < tokenURIsInfo[0].length; i++) {
        if (tokenURIsInfo[0][i]) {
          tokenURIs[tokenIds[i]] = tokenURIsInfo[1][i];
        }
      }
      this.scanOwners.tokenURIs = tokenURIs;
      this.scanOwners.traitsAndImages = {};
    },

    async retrieveTraitsAndImagesFromTokenURI() {
      // console.log("retrieveTraitsAndImagesFromTokenURI");
      event.preventDefault();
      const traitsAndImages = {};
      for (owner of this.scanOwners.owners) {
        const tokenURI = this.scanOwners.tokenURIs[owner.tokenId];
        if (tokenURI.substring(0, 4) == 'ipfs') {
          const expandedTokenURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
          // TODO: handle parsing of e.g. base64, SVG
          const data = await fetch(expandedTokenURI).then(response => response.json());
          const image = data.image;
          const traits = data.attributes;
          traitsAndImages[owner.tokenId] = { traits: traits, image: image };
        } else if (tokenURI.substring(0, 29) == 'data:application/json;base64,') {
          const base64data = tokenURI.substring(29);
          // console.log("base64data: " + base64data);
          const data = JSON.parse(atob(base64data));
          // console.log("data: " + JSON.stringify(data));
          if (data.image) {
            traitsAndImages[owner.tokenId] = { traits: [], image: data.image };
          }
        }
      }
      this.scanOwners.traitsAndImages = traitsAndImages;
      // console.log("traitsAndImages: " + JSON.stringify(traitsAndImages));
    },

    async retrieveTraitsAndImagesFromOS() {
      // console.log("retrieveTraitsAndImagesFromOS");
      const tokenIds = this.scanOwners.owners.map(a => a.tokenId);
      const BATCHSIZE = 30; // Max 30
      const DELAYINMILLIS = 500;
      const delay = ms => new Promise(res => setTimeout(res, ms));
      const traitsAndImages = {};
      for (let i = 0; i < tokenIds.length; i += BATCHSIZE) {
        let url = "https://testnets-api.opensea.io/api/v1/assets?asset_contract_address=" + this.inspect.address + "\&order_direction=desc\&limit=50\&offset=0";
        for (let j = i; j < i + BATCHSIZE && j < tokenIds.length; j++) {
          url = url + "&token_ids=" + tokenIds[j];
        }
        const data = await fetch(url).then(response => response.json());
        if (data.assets && data.assets.length > 0) {
          for (let assetIndex = 0; assetIndex < data.assets.length; assetIndex++) {
            const asset = data.assets[assetIndex];
            traitsAndImages[asset.token_id] = { image: asset.image_url, traits: asset.traits };
          }
        }
        await delay(DELAYINMILLIS);
      }
      this.scanOwners.traitsAndImages = traitsAndImages;
    },

    async loadTestToadz() {
      event.preventDefault();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
      // console.log("Start: " + new Date().toString());
      const tokenInfo = await erc721Helper.tokenInfo([TESTTOADZADDRESS]);
      // console.log(JSON.stringify(tokenInfo, null, 2));
      const totalSupply = 6969; // TestToadz
      var tokensIndices = [...Array(parseInt(totalSupply)).keys()];
      const ownersInfo = await erc721Helper.ownersByTokenIds(TESTTOADZADDRESS, tokensIndices);
      const owners = [];
      const tokenIds = [];
      const ownerRecords = [];
      const timestamp = parseInt(new Date() / 1000);
      for (let i = 0; i < ownersInfo[0].length; i++) {
        if (ownersInfo[0][i]) {
          console.log(ownersInfo[1][i]);
          owners.push({ tokenId: tokensIndices[i], owner: ownersInfo[1][i] });
          tokenIds.push(tokensIndices[i]);
          ownerRecords.push({ chainId: this.network.chainId, contract: TESTTOADZADDRESS, tokenId: tokensIndices[i], owner: ownersInfo[1][i], timestamp: timestamp });
        }
      }
      console.log("End: " + new Date().toString());
      // console.log(JSON.stringify(owners, null, 2));
      console.log(JSON.stringify(ownerRecords, null, 2));
      this.testToadz.owners = owners;

      const tokenURIsInfo = await erc721Helper.tokenURIsByTokenIds(TESTTOADZADDRESS, tokenIds);
      console.log(JSON.stringify(tokenURIsInfo, null, 2));
      const tokenURIRecords = [];
      const tokenURIs = {};
      for (let i = 0; i < tokenURIsInfo[0].length; i++) {
        if (tokenURIsInfo[0][i]) {
          console.log(tokenURIsInfo[1][i]);
          tokenURIRecords.push({ chainId: this.network.chainId, contract: TESTTOADZADDRESS, tokenId: tokenIds[i], tokenURI: tokenURIsInfo[1][i], timestamp: timestamp });
          tokenURIs[tokenIds[i]] = tokenURIsInfo[1][i];
        }
      }
      this.testToadz.tokenURIs = tokenURIs;

      const BATCHSIZE = 30; // Max 30
      const DELAYINMILLIS = 100;
      const delay = ms => new Promise(res => setTimeout(res, ms));
      const osData = {};
      for (let i = 0; i < tokenIds.length; i += BATCHSIZE) {
        let url = "https://testnets-api.opensea.io/api/v1/assets?asset_contract_address=" + TESTTOADZADDRESS + "\&order_direction=desc\&limit=50\&offset=0";
        for (let j = i; j < i + BATCHSIZE && j < tokenIds.length; j++) {
          url = url + "&token_ids=" + tokenIds[j];
        }
        console.log("url: " + url);
        const data = await fetch(url).then(response => response.json());
        // console.log("data: " + JSON.stringify(data));
        if (data.assets && data.assets.length > 0) {
        //   this.settings.contract.loadingOSData += data.assets.length;
          for (let assetIndex = 0; assetIndex < data.assets.length; assetIndex++) {
            const asset = data.assets[assetIndex];
            // console.log("asset: " + JSON.stringify(asset));
            // console.log("asset - token_id: " + asset.token_id + ", image_url: " + asset.image_url + ", traits: " + JSON.stringify(asset.traits));
        //     records.push({ contract: contract, tokenId: asset.token_id, asset: asset, timestamp: timestamp });
            osData[asset.token_id] = { image: asset.image_url, traits: asset.traits };
          }
        }
        await delay(DELAYINMILLIS);
      }
      this.testToadz.osData = osData;
      console.log("osData: " + JSON.stringify(osData));


      var db0 = new Dexie("NixDB");
      db0.version(1).stores({
        // nftData: '&tokenId,asset,timestamp',
        owners: '[chainId+contract+tokenId],chainId,contract,tokenId,owner,timestamp',
        tokenURIs: '[chainId+contract+tokenId],chainId,contract,tokenId,tokenURI,timestamp',
      });
      await db0.owners.bulkPut(ownerRecords).then (function(){
      }).catch(function(error) {
        console.log("error: " + error);
      });
      await db0.tokenURIs.bulkPut(tokenURIRecords).then (function(){
      }).catch(function(error) {
        console.log("error: " + error);
      });

      console.log("chainId: " + this.network.chainId);

      const testToadz = new ethers.Contract(TESTTOADZADDRESS, TESTTOADZABI, provider);
      this.testToadz.supportsERC721 = (await testToadz.supportsInterface(ERC721_INTERFACE)).toString();
      this.testToadz.supportsERC721METADATA = (await testToadz.supportsInterface(ERC721METADATA_INTERFACE)).toString();
      this.testToadz.supportsERC721ENUMERABLE = (await testToadz.supportsInterface(ERC721ENUMERABLE_INTERFACE)).toString();
      this.testToadz.symbol = (await testToadz.symbol()).toString();
      this.testToadz.name = (await testToadz.name()).toString();
      this.testToadz.balance = (await testToadz.balanceOf(this.coinbase)).toString();
      this.testToadz.approvedToNix = (await testToadz.isApprovedForAll(this.coinbase, store.getters['connection/network'].nixAddress)).toString();
    },

    async checkTestToadzRoyalty() {
      event.preventDefault();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const nix = new ethers.Contract(store.getters['connection/network'].nixAddress, NIXABI, provider);
      const nixRoyaltyEngine = await nix.royaltyEngine();
      this.testToadz.nixRoyaltyEngine = nixRoyaltyEngine;
      const royaltyEngine = new ethers.Contract(nixRoyaltyEngine, ROYALTYENGINEABI, provider);
      const royaltyPayments = [];
      try {
        const results = await royaltyEngine.getRoyaltyView(TESTTOADZADDRESS, this.testToadz.royaltyTokenId, ethers.utils.parseEther(this.testToadz.royaltyAmount));
        for (let i = 0; i < results[0].length; i++) {
          royaltyPayments.push({ payTo: results[0][i], payAmount: results[1][i] });
        }
      } catch (e) {
        royaltyPayments.push({ payTo: "Error", payAmount: "Error" });
      }
      this.testToadz.royaltyPayments = royaltyPayments;
    },

    approveTestToadzToNix(approved) {
      console.log("approveTestToadzToNix(" + approved + ")");
      this.$bvModal.msgBoxConfirm(approved ? 'Approve TestToadz for Nix trading?' : 'Revoke TestToadz approval for Nix trading?', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Yes',
          cancelTitle: 'No',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(async value1 => {
          if (value1) {
            event.preventDefault();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const testToadz = new ethers.Contract(TESTTOADZADDRESS, TESTTOADZABI, provider);
            const testToadzSigner = testToadz.connect(provider.getSigner());
            try {
              const tx = await testToadzSigner.setApprovalForAll(store.getters['connection/network'].nixAddress, approved);
              this.testToadz.approvalMessage = tx.hash;
              console.log("tx: " + JSON.stringify(tx));
            } catch (e) {
              this.testToadz.approvalMessage = e.message.toString();
              console.log("error: " + e.toString());
            }
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    mintTestToadz() {
      console.log("mintTestToadz()");
      this.$bvModal.msgBoxConfirm('Mint ' + this.testToadz.mintNumber + ' TestToadz?', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Yes',
          cancelTitle: 'No',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(async value1 => {
          if (value1) {
            event.preventDefault();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const testToadz = new ethers.Contract(TESTTOADZADDRESS, TESTTOADZABI, provider);
            const testToadzSigner = testToadz.connect(provider.getSigner());
            try {
              const tx = await testToadzSigner.mint(this.testToadz.mintNumber);
              this.testToadz.mintMessage = tx.hash;
              console.log("tx: " + JSON.stringify(tx));
            } catch (e) {
              this.testToadz.mintMessage = e.message.toString();
              console.log("error: " + e.toString());
            }
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    async timeoutCallback() {
      logDebug("Collections", "timeoutCallback() count: " + this.count);

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
    logDebug("Collections", "beforeDestroy()");
  },
  mounted() {
    logDebug("Collections", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("Collections", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const collectionsModule = {
  namespaced: true,
  state: {
    canvas: null,
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    canvas: state => state.canvas,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    setCanvas(state, c) {
      logDebug("collectionsModule", "mutations.setCanvas('" + c + "')")
      state.canvas = c;
    },
    deQueue(state) {
      logDebug("collectionsModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("collectionsModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("collectionsModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    setCanvas(context, c) {
      logDebug("connectionModule", "actions.setCanvas(" + JSON.stringify(c) + ")");
      // context.commit('setCanvas', c);
    },
  },
};
