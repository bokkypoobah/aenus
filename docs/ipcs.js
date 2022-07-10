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
                <div v-if="settings.tabIndex == 0" class="mt-1" style="width: 150px;">
                  <b-form-input type="text" size="sm" :value="filter.transfers.accounts" @change="searchTransfers('filterUpdate', { transfers: { accounts: $event } })" :disabled="sync.inProgress" debounce="600" v-b-popover.hover.top="'List of accounts'" placeholder="🔍 0x12... ..."></b-form-input>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1">
                  <b-button size="sm" :pressed.sync="settings.collection.showFilter" variant="link" v-b-popover.hover.top="'Show collection filter'"><span v-if="settings.collection.showFilter"><b-icon-layout-sidebar-inset shift-v="+1" font-scale="1.0"></b-icon-layout-sidebar-inset></span><span v-else><b-icon-layout-sidebar shift-v="+1" font-scale="1.0"></b-icon-layout-sidebar></span></b-button>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1" style="width: 380px;">
                  <b-form-input type="text" size="sm" :value="filter.collection.address" @change="updateCollection('filterUpdate', { collection: { address: $event } })" :disabled="sync.inProgress" debounce="600" v-b-popover.hover.top="'Collection address'" placeholder="{ERC-721 address}"></b-form-input>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1 pl-1">
                  <b-dropdown dropright size="sm" :disabled="sync.inProgress" variant="link" toggle-class="text-decoration-none" v-b-popover.hover.top="'Some vintage and higher total trading volume ERC-721 collections'">
                    <b-dropdown-group header="2015 Vintage">
                      <b-dropdown-item @click="filter.collection.address = '0x4b1705c75fde41e35e454ddd14e5d0a0eac06280'">Oct 19 Etheria v0.9 (wrapped, image not working)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x629a493a94b611138d4bee231f94f5c08ab6570a'">Oct 22 Etheria v1.0 (wrapped, image not working)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'">Apr 26 ENS (new Jan 30 2020)</b-dropdown-item>
                    </b-dropdown-group>
                    <b-dropdown-group header="2016 Vintage">
                      <b-dropdown-item @click="filter.collection.address = '0x050dc61dFB867E0fE3Cf2948362b6c0F3fAF790b'">Nov 17 PixelMap (wrapped)</b-dropdown-item>
                    </b-dropdown-group>
                    <b-dropdown-group header="2017 Vintage">
                      <b-dropdown-item @click="filter.collection.address = '0x282bdd42f4eb70e7a9d9f40c8fea0825b7f68c5d'">Jun 09 CryptoPunks V1 (wrapped)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6'">Jun 22 CryptoPunks V2 (wrapped)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0xc3f733ca98e0dad0386979eb96fb1722a1a05e69'">Aug 09 MoonCats (wrapped, official)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x7c40c393dc0f283f318791d746d894ddd3693572'">Aug 09 Wrapped MoonCatsRescue - Unofficial (wrapped)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x7bb952ab78b28a62b1525aca54a71e7aa6177645'">Aug 27 Thousand Ether Homepage (wrapped)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x80f1ed6a1ac694317dc5719db099a440627d1ea7'">Aug 29 IKB Cachet de Garantie (wrapped)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x5F53f9f5DcF76757f7CbF35C2e47164C65b9b5eD'">Oct 05 Wrapped Historic DADA (wrapped, dyor)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x34d77a17038491a2a9eaa6e690b7c7cd39fc8392'">Oct 05 Dada Collectible (wrapped, dyor)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0xe81175546f554ca6ceb63b142f27de7557c5bf62'">Oct 20 Lunar Moon Plots (wrapped)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'">Nov 23 CryptoKitties (large data set, not working)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0xd0e7bc3f1efc5f098534bce73589835b8273b9a0'">Dec 24 Wrapped CryptoCats Official</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x8479277aacff4663aa4241085a7e27934a0b0840'">Dec 30 Realms of Ether (wrapped)</b-dropdown-item>
                    </b-dropdown-group>
                    <b-dropdown-group header="2018 Vintage">
                      <b-dropdown-item @click="filter.collection.address = '0x79986af15539de2db9a5086382daeda917a9cf0c'">Jan 22 CryptoFighters</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x79986af15539de2db9a5086382daeda917a9cf0c'">Jun 05 Voxels (originally CryptoVoxels, not working)</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0xbfde6246df72d3ca86419628cac46a9d2b60393c'">Aug 02 Etheremon Adventure</b-dropdown-item>
                    </b-dropdown-group>
                    <b-dropdown-group header="2019 Vintage">
                      <b-dropdown-item @click="filter.collection.address = '0xd4e4078ca3495de5b1d4db434bebc5a986197782'">Apr 05 Autoglyph</b-dropdown-item>
                    </b-dropdown-group>
                    <b-dropdown-group header="2020 Vintage">
                    </b-dropdown-group>
                    <b-dropdown-group header="2021 Vintage">
                      <b-dropdown-item @click="filter.collection.address = '0xc2c747e0f7004f9e8817db2ca4997657a7746928'">Jan 28 Hashmasks</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x31385d3520bced94f77aae104b406994d8f2168c'">Mar 07 BASTARD GAN PUNKS V2</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x97ca7fe0b0288f5eb85f386fed876618fb9b8ab8'">Mar 17 Ether Cards Founder</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'">Apr 22 Bored Ape Yacht Club</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7'">May 03 Meebits</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0xba30e5f9bb24caa003e9f2f0497ad287fdf95623'">Jun 18 Bored Ape Kennel Club</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x1a92f7381b9f03921564a437210bb9396471050c'">Jun 27 Cool Cats NFT</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0xbd3531da5cf5857e7cfaa92426877b022e612cf8'">Jul 22 Pudgy Penguins</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x42069abfe407c60cf4ae4112bedead391dba1cdb'">Jul 28 CryptoDickButts</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x60e4d786628fea6478f785a6d7e704777c86a7c6'">Aug 28 Mutant Ape Yacht Club</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6'">Sep 08 CrypToadz</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x1a2f71468f656e97c2f86541e57189f59951efe7'">Oct 07 Cryptomories</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e'">Oct 16 Doodles</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0xe0fa9fb0e30ca86513642112bee1cbbaa2a0580d'">Oct 18 The Greats by Wolfgang Beltracchi</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x79fcdef22feed20eddacbb2587640e45491b757f'">Nov 29 mfers</b-dropdown-item>
                    </b-dropdown-group>
                    <b-dropdown-group header="2022">
                      <b-dropdown-item @click="filter.collection.address = '0xed5af388653567af2f388e6224dc7c4b3241c544'">Jan 10 Azuki</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0xf1bdfc38b0089097f050141d21f5e8a3cb0ec8fc'">Jan 28 CryptoTitVags</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x45bC849a53a3531648EE7E27dD09FCaa23Ca5ff9'">Mar 25 PepeMfers Official</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x23581767a106ae21c074b2276d25e5c3e136a68b'">Apr 15 Moonbirds</b-dropdown-item>
                      <b-dropdown-item @click="filter.collection.address = '0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258'">Apr 28 Otherdeed for Otherside</b-dropdown-item>
                    </b-dropdown-group>
                  </b-dropdown>
                </div>
                <div class="mt-1 pl-1">
                  <b-button size="sm" @click="updateCollection('sync', {})" :disabled="sync.inProgress" variant="primary">Sync IPC Collection</b-button>
                </div>
                <div v-if="settings.tabIndex == 2" class="mt-1" style="max-width: 170px;">
                  <b-form-input type="text" size="sm" :value="filter.searchString" @change="monitorMints('updateFilter', { searchString: $event })" debounce="600" v-b-popover.hover.top="'Search by collection symbol, name or address'" placeholder="🔍 {symbol|name|addy}"></b-form-input>
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

                <div v-if="settings.tabIndex == 0 || settings.tabIndex == 2" class="mt-1 pl-1">
                  <b-form-select size="sm" :value="filter.scanBlocks" :options="scanBlocksOptions" @change="monitorMints('filterUpdate', { scanBlocks: $event })" :disabled="sync.inProgress" v-b-popover.hover.top="'Number of blocks to scan'"></b-form-select>
                </div>
                <div v-if="settings.tabIndex == 0" class="mt-1 pl-1">
                  <b-button size="sm" @click="searchTransfers('scanLatest', {})" :disabled="sync.inProgress || !powerOn || network.chainId != 1" variant="primary">{{ 'Search Latest ' + filter.scanBlocks + ' Blocks' }}</b-button>
                </div>
                <div v-if="settings.tabIndex == 2" class="mt-1 pl-1">
                  <b-button size="sm" @click="monitorMints('scanLatest', {})" :disabled="sync.inProgress || !powerOn || network.chainId != 1" variant="primary" style="min-width: 80px; ">{{ 'Scan Latest ' + filter.scanBlocks + ' Blocks' }}</b-button>
                </div>

                <div class="mt-1 flex-grow-1">
                </div>

                <div v-if="settings.tabIndex == 0 || settings.tabIndex == 1 || settings.tabIndex == 2" class="mt-2" style="width: 200px;">
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

                <div v-if="settings.tabIndex == 0 || settings.tabIndex == 2" class="mt-1">
                  <b-button size="sm" :pressed.sync="settings.periodSelector.displayToolbar" variant="link" v-b-popover.hover.top="'Select by UTC date & time'"><span v-if="settings.periodSelector.displayToolbar"><b-icon-calendar3-fill shift-v="+1" font-scale="1.0"></b-icon-calendar3-fill></span><span v-else><b-icon-calendar3 shift-v="+1" font-scale="1.0"></b-icon-calendar3></span></b-button>
                </div>
                <div v-if="settings.tabIndex == 0 || settings.tabIndex == 2" class="mt-1" style="max-width: 100px;">
                  <b-form-input type="text" size="sm" :value="filter.startBlockNumber" :disabled="sync.inProgress" @change="monitorMints('filterUpdate', { startBlockNumber: $event })" debounce="600" v-b-popover.hover.top="'Search from block number'" placeholder="from"></b-form-input>
                </div>
                <div v-if="settings.tabIndex == 0 || settings.tabIndex == 2" class="mt-1">
                  -
                </div>
                <div v-if="settings.tabIndex == 0 || settings.tabIndex == 2" class="mt-1" style="max-width: 100px;">
                  <b-form-input type="text" size="sm" :value="filter.endBlockNumber" :disabled="sync.inProgress" @change="monitorMints('filterUpdate', { endBlockNumber: $event })" debounce="600" v-b-popover.hover.top="'Search to block number'" placeholder="to"></b-form-input>
                </div>
                <div v-if="settings.tabIndex == 0" class="mt-1 pl-1">
                  <b-button size="sm" @click="searchTransfers('scan', {})" :disabled="sync.inProgress || !powerOn || network.chainId != 1 || filter.startBlockNumber == null || filter.endBlockNumber == null" variant="primary" style="min-width: 80px; ">Search</b-button>
                </div>
                <div v-if="settings.tabIndex == 2" class="mt-1 pl-1">
                  <b-button size="sm" @click="monitorMints('scan', {})" :disabled="sync.inProgress || !powerOn || network.chainId != 1 || filter.startBlockNumber == null || filter.endBlockNumber == null" variant="primary" style="min-width: 80px; ">Scan</b-button>
                </div>
                <div v-if="settings.tabIndex == 2" class="mt-2 pl-1">
                  <b-link size="sm" :to="getURL" v-b-popover.hover.top="'Share this link for the same search'" ><font size="-1">Share</font></b-link>
                </div>

                <div class="mt-1 flex-grow-1">
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1 pr-1">
                  <b-form-select size="sm" v-model="settings.collection.sortOption" :options="sortOptions" v-b-popover.hover.top="'Yeah. Sort'"></b-form-select>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1 pr-1">
                  <font size="-2" v-b-popover.hover.top="'Blah'">{{ filteredSortedCollectionTokens.length }}</font>
                </div>
                <div class="mt-1 pr-1">
                  <b-pagination size="sm" v-model="settings.collection.currentPage" :total-rows="filteredCollectionTokens.length" :per-page="settings.collection.pageSize" style="height: 0;"></b-pagination>
                </div>
                <div class="mt-1 pl-1">
                  <b-form-select size="sm" v-model="settings.collection.pageSize" :options="pageSizes" v-b-popover.hover.top="'Page size'"></b-form-select>
                </div>
                <div v-if="settings.tabIndex == 2" class="mt-1 pl-1">
                  <b-form-select size="sm" v-model="settings.activityMaxItems" :options="activityMaxItemsOptions" v-b-popover.hover.top="'Max items to display'"></b-form-select>
                </div>
              </div>

              <!-- Sync Toolbar -->
              <div v-if="settings.periodSelector.displayToolbar" class="d-flex flex-wrap justify-content-center m-0 p-0 pb-1">
                <div class="mt-1 pr-1">
                  <b-calendar v-model="settings.periodSelector.dateFrom" @context="calendarUpdated('dateFrom', $event)"></b-calendar>
                </div>
                <div class="mt-1">
                  <b-time v-model="settings.periodSelector.timeFrom" @context="calendarUpdated('timeFrom', $event)"></b-time>
                </div>
                <div v-if="settings.tabIndex == 2" class="mt-1">
                  -
                </div>
                <div class="mt-1 pr-1">
                  <b-calendar v-model="settings.periodSelector.dateTo" @context="calendarUpdated('dateTo', $event)"></b-calendar>
                </div>
                <div class="mt-1 pr-1">
                  <b-time v-model="settings.periodSelector.timeTo" @context="calendarUpdated('timeTo', $event)"></b-time>
                </div>
                <!--
                <div class="mt-1 pr-1">
                  <b-form-select size="sm" :value="config.period" @change="updateConfig('period', $event)" :options="periods" :disabled="sync.inProgress" v-b-popover.hover.bottom="'Sales history period'"></b-form-select>
                </div>
                <div class="mt-2" style="width: 300px;">
                  <b-progress height="1.5rem" :max="sync.daysExpected" :label="'((sync.daysInCache/sync.daysExpected)*100).toFixed(2) + %'" show-progress :animated="sync.inProgress" :variant="sync.inProgress ? 'success' : 'secondary'" v-b-popover.hover.bottom="formatTimestampAsDate(sync.from) + ' - ' + formatTimestampAsDate(sync.to) + '. Click on the Sync(ing) button to (un)pause'">
                    <b-progress-bar :value="sync.daysInCache">
                      {{ (sync.processing ? (sync.processing + ' - ') : '') + sync.daysInCache + '/' + sync.daysExpected + ' ' + ((sync.daysInCache / sync.daysExpected) * 100).toFixed(0) + '%' }}
                    </b-progress-bar>
                  </b-progress>
                </div>
                <div class="mt-1 flex-grow-1">
                </div>
                <div class="mt-1 pr-1" style="max-width: 150px;">
                  <b-button size="sm" @click="loadSales('clearCache')" variant="primary" v-b-popover.hover.bottom="'Reset application data'">Clear Local Cache</b-button>
                </div>
                -->
              </div>

              <!-- Collection information -->
              <div v-if="settings.tabIndex == 1">
                <b-card v-if="settings.collection.showInfo && collectionInfo != null" no-header no-body class="mt-1">
                  <pre>
{{ JSON.stringify(collectionInfo, null, 2) }}
                  </pre>
                </b-card>
              </div>

              <!-- Collection -->
              <b-card no-header no-body class="mt-1">
                <b-table small fixed striped :items="pagedFilteredCollectionTokens" head-variant="light">
                  <template #cell(ipcId)="data">
                    {{ data.item.ipcId }}
                  </template>
                  <template #cell(name)="data">
                    {{ data.item.name }}
                  </template>
                  <template #cell(owner)="data">
                    {{ getShortName(data.item.owner) }}
                  </template>
                  <template #cell(attributeSeed)="data">
                    {{ data.item.attributeSeed }}
                  </template>
                  <template #cell(dna)="data">
                    {{ data.item.dna }}
                  </template>
                  <template #cell(experience)="data">
                    {{ data.item.experience }}
                  </template>
                  <template #cell(timeOfBirth)="data">
                    {{ formatTimestamp(data.item.timeOfBirth) }}
                  </template>

                </b-table>
              </b-card>

              <!-- Collection information -->
              <b-card v-if="settings.tabIndex == 0" no-header no-body class="mt-1">
                <b-table small fixed striped :fields="transfersFields" :items="transfers" head-variant="light">
                  <template #cell(index)="data">
                    {{ data.index + 1 }}
                  </template>
                  <template #cell(collection)="data">
                    <b-button :id="'popover-target-collection-' + data.item.collection + '-' + data.index" variant="link" class="m-0 p-0">
                      {{ data.item.collection.substring(0, 16) }}
                    </b-button>
                    <b-popover :target="'popover-target-collection-' + data.item.collection + '-' + data.index" placement="right">
                      <template #title>{{ data.item.collection.substring(0, 16) }}</template>
                      <b-link :href="'https://etherscan.io/address/' + data.item.collection + '#code'" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                        Etherscan - Contract Code
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/token/' + data.item.collection" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                        Etherscan - Transfers
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/token/' + data.item.collection + '#balances'" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                        Etherscan - Holders
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/token/tokenholderchart/' + data.item.collection" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                        Etherscan - Holders Chart
                      </b-link>
                    </b-popover>
                  </template>
                  <template #cell(tokenId)="data">
                    <span v-if="data.item.collection.toLowerCase() == '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'">
                      <b-img :width="'100%'" :src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + data.item.tokenId + '/image'">
                      </b-img>
                    </span>
                    <span v-else>
                      {{ data.item.tokenId }}
                    </span>
                  </template>
                  <template #cell(from)="data">
                    <b-button :id="'popover-target-from-' + data.item.from + '-' + data.index" variant="link" class="m-0 p-0">
                      {{ data.item.from.substring(0, 16) }}
                    </b-button>
                    <b-popover :target="'popover-target-from-' + data.item.from + '-' + data.index" placement="right">
                      <template #title>{{ data.item.from.substring(0, 16) }}</template>
                      <b-link :href="'https://opensea.io/' + data.item.from" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/accounts/' + data.item.from" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/user/' + data.item.from + '/items'" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/address/' + data.item.from" v-b-popover.hover.bottom="'View in etherscan.io'" target="_blank">
                        EtherScan
                      </b-link>
                    </b-popover>
                  </template>
                  <template #cell(to)="data">
                    <b-button :id="'popover-target-to-' + data.item.to + '-' + data.index" variant="link" class="m-0 p-0">
                      {{ data.item.to.substring(0, 16) }}
                    </b-button>
                    <b-popover :target="'popover-target-to-' + data.item.to + '-' + data.index" placement="right">
                      <template #title>{{ data.item.to.substring(0, 16) }}</template>
                      <b-link :href="'https://opensea.io/' + data.item.to" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/accounts/' + data.item.to" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/user/' + data.item.to + '/items'" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/address/' + data.item.to" v-b-popover.hover.bottom="'View in etherscan.io'" target="_blank">
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
              </b-card>

              <!-- Collection -->
              <b-row v-if="settings.tabIndex == 1" class="m-0 p-0">
                <!-- Collection Filter -->
                <b-col v-if="settings.collection.showFilter" cols="2" class="m-0 p-0 border-0">
                  <b-card no-header no-body class="m-0 p-0 border-0">
                    <b-card-body class="m-0 p-1" style="flex-grow: 1; max-height: 1000px; overflow-y: auto;">
                      <div v-for="(attributeKey, attributeIndex) in Object.keys(collectionTokensAttributesWithCounts).sort()" v-bind:key="attributeIndex">
                        <b-card header-class="m-0 px-2 pt-2 pb-0" body-class="p-0" class="m-0 p-0 border-0">
                          <template #header>
                            <span variant="secondary" class="small truncate">
                              {{ attributeKey }}
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
                  <!-- Collection Results -->
                  <div v-if="pagedFilteredCollectionTokens.length > 0">
                    <b-card-group deck class="m-1 ml-0 p-0">
                      <div v-for="token in pagedFilteredCollectionTokens">
                        <b-card body-class="p-0" header-class="p-1" img-top class="m-1 p-0 border-0" style="max-width: 7rem;">
                          <b-avatar rounded size="7rem" :src="token.image"></b-avatar>
                          <b-card-text class="text-right">
                            <div class="d-flex justify-content-between m-0 p-0">
                              <div>
                                <font size="-1">
                                  <b-badge variant="light" v-b-popover.hover.bottom="'blah'">{{ token.tokenId }}</b-badge>
                                </font>
                              </div>
                              <div class="flex-grow-1">
                              </div>
                              <div>
                                <!--
                                <font size="-1">
                                  <b-badge :variant="(activity.type == 'Sales') ? 'success' : ((activity.type == 'Asks') ? 'primary' : 'warning')" v-b-popover.hover.bottom="formatETH(event.amount)">{{ formatETHShort(event.amount) }}</b-badge>
                                </font>
                                -->
                              </div>
                            </div>
                          </b-card-text>
                        </b-card>
                      </div>
                    </b-card-group>
                  </div>
                </b-col>
              </b-row>

              <!-- Mint Monitor -->
              <div v-if="settings.tabIndex == 2">
                <b-alert size="sm" :show="!powerOn || network.chainId != 1" variant="primary" class="m-0 mt-1">
                  Please connect to the Ethereum mainnet with a web3-enabled browser. Click the [Power] button on the top right.
                </b-alert>

                <b-alert size="sm" :show="powerOn && network.chainId == 1" dismissible variant="danger" class="m-0 mt-1">
                  Be careful when interacting with unverified contracts and signing messages on dodgy websites!
                </b-alert>

                <b-table small striped hover :fields="mintMonitorCollectionsFields" :items="mintMonitorCollectionsData" table-class="w-100" class="m-1 p-1">
                  <template #cell(index)="data">
                    {{ data.index + 1 }}
                  </template>
                  <template #cell(contract)="data">
                    <b-button :id="'popover-target-' + data.item.contract" variant="link" class="m-0 p-0">
                      {{ getContractOrCollection(data.item.contract) }}
                    </b-button>
                    <b-popover :target="'popover-target-' + data.item.contract" placement="right">
                      <template #title>{{ getContractOrCollection(data.item.contract) }}</template>
                      <b-link @click="settings.tabIndex = 1; updateCollection('filterUpdate', { collection: { address: data.item.contract } }); " v-b-popover.hover.bottom="'Inspect collection'" target="_blank">
                        View Collection
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/address/' + data.item.contract + '#code'" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                        Etherscan - Contract Code
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/token/' + data.item.contract" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                        Etherscan - Transfers
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/token/' + data.item.contract + '#balances'" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                        Etherscan - Holders
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/token/tokenholderchart/' + data.item.contract" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                        Etherscan - Holders Chart
                      </b-link>
                    </b-popover>
                  </template>
                  <template #cell(mints)="data">
                    {{ data.item.mints }}
                  </template>
                  <template #cell(tokens)="data">
                    <span v-for="(transfer, transferIndex) in data.item.transfers.slice(0, settings.activityMaxItems)">
                      <b-button :id="'popover-target-' + data.item.contract + '-' + transfer.tokenId" variant="link" class="m-0 p-0">
                        <span v-if="transfer.contract == '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'">
                          <b-img :width="'100%'" :src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + transfer.tokenId + '/image'">
                          </b-img>
                        </span>
                        <span v-else>
                          {{ getTokenIdString(transfer.tokenId) }}
                        </span>
                      </b-button>
                      <b-popover :target="'popover-target-' + data.item.contract + '-' + transfer.tokenId" placement="right">
                        <template #title>{{ getContractOrCollection(data.item.contract) }}</template>
                        <b-link :href="'https://opensea.io/assets/' + data.item.contract + '/' + transfer.tokenId" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                          OpenSea
                        </b-link>
                        <br />
                        <b-link :href="'https://looksrare.org/collections/' + data.item.contract + '/' + transfer.tokenId" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                          LooksRare
                        </b-link>
                        <br />
                        <b-link :href="'https://x2y2.io/eth/' + data.item.contract + '/' + transfer.tokenId" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                          X2Y2
                        </b-link>
                        <br />
                        <b-link :href="'https://etherscan.io/tx/' + transfer.txHash" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                          Etherscan - Tx
                        </b-link>
                        <br />
                        <b-link :href="'https://opensea.io/' + transfer.to" v-b-popover.hover.bottom="'View mintoor in OS'" target="_blank">
                          OpenSea - Mintoor Account
                        </b-link>
                        <br />
                        <b-link :href="'https://etherscan.io/address/' + transfer.to" v-b-popover.hover.bottom="'View mintoor in Etherscan.io'" target="_blank">
                          Etherscan - Mintoor Account
                        </b-link>
                      </b-popover>
                    </span>
                  </template>
                </b-table>
              </div>

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
        activityMaxItems: 50,
        periodSelector: {
          displayToolbar: false,
          dateFrom: null,
          timeFrom: null,
          dateTo: null,
          timeTo: null,
        },
        collection: {
          showInfo: false,
          showFilter: true,
          sortOption: 'idasc',
          pageSize: 100,
          currentPage: 1
        },
      },

      collectionAttributeFilter: {},
      dailyChartSelectedItems: [],

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

      scanBlocksOptions: [
        { value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1k' },
        { value: 5000, text: '5k' },
        { value: 10000, text: '10k' },
      ],

      activityMaxItemsOptions: [
        { value: 10, text: '10' },
        { value: 50, text: '50' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1k' },
        { value: 10000, text: '10k' },
      ],

      transfersFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'collection', label: 'Collection', thStyle: 'width: 20%;', sortable: true },
        { key: 'tokenId', label: 'Token Id', thStyle: 'width: 20%;', sortable: true },
        { key: 'from', label: 'From', thStyle: 'width: 20%;', sortable: true },
        { key: 'to', label: 'To', thStyle: 'width: 20%;', sortable: true },
        { key: 'txHash', label: 'Tx Hash', sortable: true, thStyle: 'width: 15%;' },
      ],

      collectionAttributeFields: [
        { key: 'select', label: '', thStyle: 'width: 10%;' },
        { key: 'attributeOption', label: 'Attribute' /*, sortable: true*/ },
        { key: 'attributeTotal', label: 'Count', /*sortable: true,*/ thStyle: 'width: 30%;', thClass: 'text-right', tdClass: 'text-right' },
      ],

      mintMonitorCollectionsFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'contract', label: 'Contract', thStyle: 'width: 25%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'mints', label: 'Mints', thStyle: 'width: 5%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'tokens', label: 'Tokens', thStyle: 'width: 65%;' },
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
    transfers() {
      return store.getters['ipcs/transfers'];
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
    mintMonitorCollections() {
      return store.getters['ipcs/mintMonitorCollections'];
    },
    collectionTokensAttributesWithCounts() {
      const collator = { };
      for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
        for (let attribute of token.attributes) {
            const key = attribute.key;
            const value = attribute.value;
            if (!collator[key]) {
              collator[key] = {};
            }
            if (!collator[key][value]) {
              collator[key][value] = [token.tokenId];
            } else {
              collator[key][value].push(token.tokenId);
            }
        }
      }
      return collator;
    },
    filteredCollectionTokens() {
      let results = [];
      for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
        results.push(token);
      }

      // if (Object.keys(this.collectionAttributeFilter) == 0) {
      //   for (const [tokenId, token] of Object.entries(this.collectionTokens)) {
      //     results.push(token);
      //   }
      // } else {
      //   let selectedTokenIds = [];
      //   for (const [trait, value] of Object.entries(this.collectionAttributeFilter)) {
      //     let thisTraitTokenIds = [];
      //     for (const selectedValue of Object.keys(value)) {
      //       const tokenIds = this.collectionTokensAttributesWithCounts[trait][selectedValue];
      //       thisTraitTokenIds = [...thisTraitTokenIds, ...tokenIds];
      //     }
      //     if (selectedTokenIds.length == 0) {
      //       selectedTokenIds = thisTraitTokenIds;
      //     } else {
      //       selectedTokenIds = selectedTokenIds.filter(tokenId => thisTraitTokenIds.includes(tokenId));
      //     }
      //   }
      //   results = Object.values(selectedTokenIds).map(tokenId => this.collectionTokens[tokenId]);
      // }
      return results;
    },
    filteredSortedCollectionTokens() {
      let results = this.filteredCollectionTokens;
      if (this.settings.collection.sortOption == 'idasc') {
        results.sort((a, b) => a.ipcId - b.ipcId);
      } else if (this.settings.collection.sortOption == 'iddsc') {
        results.sort((a, b) => b.ipcId - a.ipcId);
      }
      return results;
    },
    pagedFilteredCollectionTokens() {
      return this.filteredSortedCollectionTokens.slice((this.settings.collection.currentPage - 1) * this.settings.collection.pageSize, this.settings.collection.currentPage * this.settings.collection.pageSize);
    },
    mintMonitorCollectionsData() {
      const searchStrings = this.filter.searchString && this.filter.searchString.length > 0 && this.filter.searchString.split(/[, \t\n]+/).map(s => s.toLowerCase().trim()) || null;
      const results = [];
      for (const [contract, collection] of Object.entries(this.mintMonitorCollections)) {
        let include = true;
        const symbol = collection.symbol.toLowerCase();
        const name = collection.name.toLowerCase();
        if (searchStrings != null) {
          let found = false;
          for (searchString of searchStrings) {
            if (contract.includes(searchString) || symbol.includes(searchString) || name.includes(searchString)) {
              found = true;
              break;
            }
          }
          if (!found) {
            include = false;
          }
        }
        if (include) {
          results.push({ contract, collection, mints: collection.transfers && collection.transfers.length || null, transfers: collection.transfers });
        }
      }
      results.sort((a, b) => {
        if (a.mints == b.mints) {
          const namea = this.collections && this.collections[a.contract].name || '';
          const nameb = this.collections && this.collections[b.contract].name || '';
          return ('' + namea).localeCompare(nameb);
        } else {
          return b.mints - a.mints;
        }
      });
      return results;
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
    getShortName(address, length = 32) {
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
    getContractOrCollection(address) {
      if (this.mintMonitorCollections && (address in this.mintMonitorCollections)) {
        const collection = this.mintMonitorCollections[address];
        return collection.symbol + ' - ' + collection.name + (collection.totalSupply > 0 ? (' (' + collection.totalSupply + ')') : '');
      }
      return address.substring(0, 12);
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
    },
    getTokenIdString(tokenId) {
      const str = tokenId.toString();
      if (str.length > 13) {
        return str.substring(0, 10) + '...';
      }
      return str;
    },
    updateURL(where) {
      this.$router.push('/ipcs/' + where);
    },
    async calendarUpdated(field, context) {
      logInfo("IPCs", "calendarUpdated - field: " + field + ", context: " + JSON.stringify(context));
      const mm = this.settings.periodSelector;
      if (field == 'dateFrom' && mm.dateFrom != null && mm.dateTo == null) {
        mm.dateTo = mm.dateFrom;
      }
      if ((field == 'dateFrom' || field == 'timeFrom') && mm.dateFrom != null && mm.timeFrom != null) {
        logInfo("IPCs", "calendarUpdated - dateFrom: " + mm.dateFrom + ", timeFrom: " + mm.timeFrom);
        const fromTimestamp = moment.utc(mm.dateFrom + ' ' + mm.timeFrom).unix();
        const data = await fetch(BLOCKTIMESTAMPSUBGRAPHURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: BLOCKTIMESTAMPAFTERQUERY,
            variables: { timestamp: fromTimestamp },
          })
        }).then(handleErrors)
          .then(response => response.json());
        if (data && data.data && data.data.blocks && data.data.blocks.length == 1) {
          store.dispatch('ipcs/monitorMints', { syncMode: 'updateFilter', filterUpdate: { startBlockNumber: ethers.utils.commify(data.data.blocks[0].number) } });
        }
      }
      if ((field == 'dateTo' || field == 'timeTo') && mm.dateTo != null && mm.timeTo != null) {
        logInfo("IPCs", "calendarUpdated - dateTo: " + mm.dateTo + ", timeTo: " + mm.timeTo);
        const toTimestamp = moment.utc(mm.dateTo + ' ' + mm.timeTo).unix();
        const data = await fetch(BLOCKTIMESTAMPSUBGRAPHURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: BLOCKTIMESTAMPAFTERQUERY,
            variables: { timestamp: toTimestamp },
          })
        }).then(handleErrors)
          .then(response => response.json());
        if (data && data.data && data.data.blocks && data.data.blocks.length == 1) {
          store.dispatch('ipcs/monitorMints', { syncMode: 'updateFilter', filterUpdate: { endBlockNumber: ethers.utils.commify(data.data.blocks[0].number) } });
        }
      }
    },
    async searchTransfers(syncMode, filterUpdate) {
      store.dispatch('ipcs/searchTransfers', { syncMode, filterUpdate });
    },
    async updateCollection(syncMode, filterUpdate) {
      store.dispatch('ipcs/updateCollection', { syncMode, filterUpdate });
    },
    async monitorMints(syncMode, filterUpdate) {
      store.dispatch('ipcs/monitorMints', { syncMode, filterUpdate });
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
      transfers: {
        accounts: null,
      },
      searchString: null,
      scanBlocks: 500,
      startBlockNumber: null,
      endBlockNumber: null,
    },
    sync: {
      inProgress: false,
      error: false,
      total: null,
      completed: null,
    },

    transfers: [],
    collectionInfo: {},
    collectionTokens: {},
    ensMap: {},
    mintMonitorCollections: {},
    halt: false,
    params: null,
  },
  getters: {
    filter: state => state.filter,
    sync: state => state.sync,
    transfers: state => state.transfers,
    collectionInfo: state => state.collectionInfo,
    collectionTokens: state => state.collectionTokens,
    ensMap: state => state.ensMap,
    mintMonitorCollections: state => state.mintMonitorCollections,
    params: state => state.params,
  },
  mutations: {

    // --- searchTransfers() ---
    async searchTransfers(state, { syncMode, filterUpdate }) {
      logInfo("ipcsModule", "mutations.searchTransfers() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));

      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const block = await provider.getBlock("latest");
        const blockNumber = block.number;
        const accounts = state.filter.transfers && state.filter.transfers.accounts && state.filter.transfers.accounts.split(/[, \t\n]+/).map(s => '0x000000000000000000000000' + s.substring(2, 42).toLowerCase()) || [];
        console.log("searchTransfers - accounts: " + JSON.stringify(accounts));
        if (filterUpdate != null) {
          console.log("searchTransfers - filter before: " + JSON.stringify(state.filter));
          state.filter = { ...state.filter, ...filterUpdate };
          console.log("searchTransfers - filter after: " + JSON.stringify(state.filter));
        }
        let startBlockNumber = null;
        let endBlockNumber = null;
        if (syncMode == 'scan') {
          startBlockNumber = parseInt(state.filter.startBlockNumber.toString().replace(/,/g, ''));
          endBlockNumber = parseInt(state.filter.endBlockNumber.toString().replace(/,/g, ''));
        } else if (syncMode == 'scanLatest') {
          startBlockNumber = blockNumber - state.filter.scanBlocks;
          endBlockNumber = blockNumber;
          state.filter.startBlockNumber = ethers.utils.commify(startBlockNumber);
          state.filter.endBlockNumber = ethers.utils.commify(endBlockNumber);
        }
        console.log("searchTransfers - startBlockNumber: " + startBlockNumber + ", endBlockNumber: " + endBlockNumber);

        if (startBlockNumber != null && startBlockNumber <= endBlockNumber) {
          state.sync.completed = 0;
          state.sync.total = endBlockNumber - startBlockNumber;
          state.sync.inProgress = true;
          const transfers = [];
          const accounts = state.filter.transfers && state.filter.transfers.accounts && state.filter.transfers.accounts.split(/[, \t\n]+/).map(s => '0x000000000000000000000000' + s.substring(2, 42).toLowerCase()) || [];
          console.log("accounts: " + JSON.stringify(accounts));
          // const batchSize = 25;
          let toBlock = endBlockNumber;
          do {
            let batchSize;
            // Aug 1 2021
            if (toBlock < 12936340) {
              batchSize = 250000;
            } else {
              batchSize = 25000;
            }
            let fromBlock = toBlock - batchSize;
            if (fromBlock < startBlockNumber) {
              fromBlock = startBlockNumber;
            }
            const filterFrom = {
              address: null, // [NIXADDRESS, weth.address],
              fromBlock: fromBlock,
              toBlock: toBlock,
              topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 id)
                accounts,
                null,
              ],
            };
            const eventsFrom = await provider.getLogs(filterFrom);
            // console.log("searchTransfers - eventsFrom: " + JSON.stringify(eventsFrom.slice(0, 1), null, 2));
            const filterTo = {
              address: null, // [NIXADDRESS, weth.address],
              fromBlock: fromBlock,
              toBlock: toBlock,
              topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 id)
                null,
                accounts,
              ],
            };
            const eventsTo = await provider.getLogs(filterTo);
            // console.log("searchTransfers - eventsTo: " + JSON.stringify(eventsTo, null, 2));

            for (const event of [...eventsFrom, ...eventsTo]) {
              if (!event.removed) {
                const collection = event.address;
                if (event.topics[3] === undefined) {
                  console.log("searchTransfers - event: " + JSON.stringify(event, null, 2));
                }
                const tokenId = new BigNumber(event.topics[3].substring(2), 16).toFixed(0);
                const from = '0x' + event.topics[1].substring(26, 66);
                const to = '0x' + event.topics[2].substring(26, 66);
                const txHash = event.transactionHash;
                transfers.push({ collection, tokenId, from, to, txHash });
              }
            }

            toBlock -= batchSize;
            state.sync.completed = endBlockNumber - toBlock;
          } while (toBlock > startBlockNumber && !state.halt);
          state.transfers = transfers;
        }

        if (false && syncMode == 'scanLatest') {
          const transfers = [];
          const accounts = state.filter.transfers.accounts.split(/[, \t\n]+/).map(s => '0x000000000000000000000000' + s.substring(2, 42).toLowerCase());
          console.log("accounts: " + JSON.stringify(accounts));
          // const account = "0x287F9b46dceA520D829c874b0AF01f4fbfeF9243".toLowerCase();
          const fromBlock = 15053226; // 00:00 Jul 01 2022
          const toBlock = 15072709; // 00:00 Jul 04 2022
          // console.log("fromBlock: " + fromBlock + ", toBlock: " + toBlock);
          const filterFrom = {
            address: null, // [NIXADDRESS, weth.address],
            fromBlock: fromBlock,
            toBlock: toBlock,
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 id)
              // null, // '0x0000000000000000000000000000000000000000000000000000000000000000', // Null address
              accounts, // '0x000000000000000000000000' + account.substring(2, 42),
              null,
            ],
          };
          const eventsFrom = await provider.getLogs(filterFrom);
          console.log("monitorMints - eventsFrom: " + JSON.stringify(eventsFrom.slice(0, 1), null, 2));

          const filterTo = {
            address: null, // [NIXADDRESS, weth.address],
            fromBlock: fromBlock,
            toBlock: toBlock,
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 id)
              // null, // '0x0000000000000000000000000000000000000000000000000000000000000000', // Null address
              null,
              accounts, // '0x000000000000000000000000' + account.substring(2, 42),
            ],
          };
          const eventsTo = await provider.getLogs(filterTo);
          console.log("monitorMints - eventsTo: " + JSON.stringify(eventsTo, null, 2));

          for (const event of [...eventsFrom, ...eventsTo]) {
            if (!event.removed) {
              const collection = event.address;
              const tokenId = new BigNumber(event.topics[3].substring(2), 16).toFixed(0);
              const from = '0x' + event.topics[1].substring(26, 66);
              const to = '0x' + event.topics[2].substring(26, 66);
              const txHash = '0x' + event.transactionHash;
              transfers.push({ collection, tokenId, from, to, txHash });
            }
          }
          state.transfers = transfers;

        }
      }
      state.sync.inProgress = false;
    },

    // --- updateCollection() ---
    async updateCollection(state, { syncMode, filterUpdate }) {

      async function processSales(data) {
        // const searchForNamesByTokenIds = data.sales
        //   .map(sale => sale.token.tokenId)
        //   .map(tokenId => "0x" + new BigNumber(tokenId, 10).toString(16));
        // const namesByTokenIds = await fetchNamesByTokenIds(searchForNamesByTokenIds);
        // const saleRecords = [];
        // if (!state.sync.error) {
        //   let count = 0;
        //   const chainId = (store.getters['connection/network'] && store.getters['connection/network'].chainId) || 1;
        //   for (const sale of data.sales) {
        //     // if (count == 0) {
        //     //   logInfo("ipcsModule", "mutations.loadSales().processSales() " + new Date(sale.timestamp * 1000).toLocaleString() + " " + (sale.token.name ? sale.token.name : "(null)") + ", price: " + sale.price + ", from: " + sale.from.substr(0, 10) + ", to: " + sale.to.substr(0, 10));
        //     // }
        //     const name = namesByTokenIds[sale.token.tokenId] ? namesByTokenIds[sale.token.tokenId] : sale.token.name;
        //     saleRecords.push({
        //       chainId: chainId,
        //       contract: ENSADDRESS,
        //       tokenId: sale.token.tokenId,
        //       name: name,
        //       from: sale.from,
        //       to: sale.to,
        //       price: sale.price,
        //       timestamp: sale.timestamp,
        //       tokenId: sale.token.tokenId,
        //       txHash: sale.txHash,
        //       data: sale,
        //     });
        //     count++;
        //   }
        //   await db0.sales.bulkPut(saleRecords).then (function() {
        //   }).catch(function(error) {
        //     console.log("error: " + error);
        //   });
        // }
        // return saleRecords.length;
        return data.tokens.length;
      }

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

        state.sync.completed = 0;
        state.sync.error = false;
        state.sync.inProgress = true;

        const ipcHelper = new ethers.Contract(IPCHELPERADDRESS, IPCHELPERABI, provider);
        const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);

        const startId = 1;
        const endId = 1; // 12000;
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
          // console.log("tokenIds: " + JSON.stringify(tokenIds));
          const ownerData = await erc721Helper.ownersByTokenIds(IPCADDRESS, tokenIds);
          // console.log("ownerData: " + JSON.stringify(ownerData));


          for (let i = 0; i < ipcData[0].length; i++) {
            const ipcId = parseInt(fromId) + i;
            console.log(ipcId + " " + ipcData[0][i] + " " + ipcData[1][i] + " " + ipcData[2][i] + " " + ipcData[3][i]);
            const owner = ownerData[0][i] && ownerData[1][i] || null;
            if (owner != null) {
              const lowerOwner = owner.toLowerCase();
              if (!(lowerOwner in ensMap)) {
                ensMap[lowerOwner] = owner;
              }
            }
            const ipc = {
              ipcId: ipcId, // TODO: Delete
              id: ipcId,
              token_id: ipcId,
              name: ipcData[0][i],
              owner: owner,
              attributeSeed: ipcData[1][i], // TODO: Delete
              attribute_seed: ipcData[1][i],
              dna: ipcData[2][i],
              experience: parseInt(ipcData[3][i]),
              timeOfBirth: parseInt(ipcData[4][i]), // TODO: Delete
              birth: parseInt(ipcData[4][i]),
            }
            collectionTokens[ipcId] = ipc;
            const info = IPCLib.ipc_create_ipc_from_json(ipc);
            console.log("IPCLib.info: " + JSON.stringify(info, null, 2));
          }
          fromId = toId;
        } while (toId < endId);
        // console.log(JSON.stringify(collectionTokens, null, 0));
        state.collectionTokens = collectionTokens;
        // console.log(JSON.stringify(ensMap, null, 0));

        let addresses = Object.keys(ensMap);
        const ensReverseRecordsContract = new ethers.Contract(ENSREVERSERECORDSADDRESS, ENSREVERSERECORDSABI, provider);
        const ENSOWNERBATCHSIZE = 200; // 500 fails occassionally
        for (let i = 0; i < addresses.length; i += ENSOWNERBATCHSIZE) {
        //   this.processing = "RETRIEVING LIVE ENS REVERSE RECORDS FROM THE ETHEREUM MAINNET: " + ethers.utils.commify(i) + " OF " + ethers.utils.commify(addresses.length);
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

        if (false) {
        let url = "https://api.reservoir.tools/collection/v2?id=" + state.filter.collection.address;
        // logInfo("ipcsModule", "mutations.updateCollection() - url: " + url);
        const collectionInfo = await fetch(url)
          .then(handleErrors)
          .then(response => response.json())
          .catch(function(error) {
             console.log("ERROR - updateDBFromAPI: " + error);
             state.sync.error = true;
             return [];
          });
        state.collectionInfo = collectionInfo && collectionInfo.collection || {};
        // console.log("state.collectionInfo: " + JSON.stringify(state.collectionInfo, null, 2));

        state.sync.total = collectionInfo && collectionInfo.collection && collectionInfo.collection.tokenCount || 0;
        // state.sync.total = 5;

        let totalRecords = 0;
        let continuation = null;
        let tokens = {};
        do {
          let url = "https://api.reservoir.tools/tokens/details/v4?contract=" + state.filter.collection.address +
            "&limit=20" +
            (continuation != null ? "&continuation=" + continuation : '');
          // logInfo("ipcsModule", "mutations.updateCollection() - url: " + url);
          const data = await fetch(url)
            .then(handleErrors)
            .then(response => response.json())
            .catch(function(error) {
               console.log("ERROR - updateDBFromAPI: " + error);
               state.sync.error = true;
               return [];
            });
          // console.log(JSON.stringify(data, null, 2));

          if (data && data.tokens) {
            // console.log(JSON.stringify(data.tokens, null, 2));
            // console.log(JSON.stringify(data.tokens[0], null, 2));
            for (const record of data.tokens) {
              const token = record.token;
              tokens[token.tokenId] = {
                tokenId: token.tokenId,
                owner: token.owner,
                name: token.name,
                description: token.description,
                attributes: token.attributes,
                image: token.image,
              };
            }
          }

          // console.log(JSON.stringify(tokens, null, 2));


          let numberOfRecords = state.sync.error ? 0 : await processSales(data);
          // let numberOfRecords = state.sync.error ? 0 : data.tokens.length;
          totalRecords += numberOfRecords;
          continuation = data.continuation;
          state.sync.completed = totalRecords;
          if (state.sync.total < totalRecords) {
            state.sync.total = totalRecords;
          }
        } while (continuation != null && !state.halt && !state.sync.error /* && totalRecords < 20 && totalRecords < state.sync.total*/);

        state.collectionTokens = tokens
        }

        if (false) {

          // let continuation = null;
          // do {
          //   let url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" +
          //     "&limit=" + state.constants.reservoirSalesV3BatchSize +
          //     "&startTimestamp=" + processFrom +
          //     "&endTimestamp="+ processTo +
          //     (continuation != null ? "&continuation=" + continuation : '');
          //   // logInfo("ipcsModule", "mutations.loadSales() - url: " + url);
          //   // logInfo("ipcsModule", "mutations.loadSales() - Retrieving records for " + new Date(processFrom).toLocaleString() + " to " + new Date(processTo).toLocaleString());
          //   const data = await fetch(url)
          //     .then(handleErrors)
          //     .then(response => response.json())
          //     .catch(function(error) {
          //        console.log("ERROR - updateDBFromAPI: " + error);
          //        state.sync.error = true;
          //        return [];
          //     });
          //   let numberOfRecords = state.sync.error ? 0 : await processSales(data);
          //   totalRecords += numberOfRecords;
          //   continuation = data.continuation;
          //   state.sync.processing = moment.unix(processFrom).utc().format("DDMMM") + ': ' + totalRecords;
          // } while (continuation != null && !state.halt && !state.sync.error);



        let startBlockNumber = null;
        let endBlockNumber = null;
        if (syncMode == 'scan') {
          startBlockNumber = parseInt(state.filter.startBlockNumber.toString().replace(/,/g, ''));
          endBlockNumber = parseInt(state.filter.endBlockNumber.toString().replace(/,/g, ''));
        } else if (syncMode == 'scanLatest') {
          startBlockNumber = blockNumber - state.filter.scanBlocks;
          endBlockNumber = blockNumber;
          state.filter.startBlockNumber = ethers.utils.commify(startBlockNumber);
          state.filter.endBlockNumber = ethers.utils.commify(endBlockNumber);
        }
        console.log("startBlockNumber: " + startBlockNumber + ", endBlockNumber: " + endBlockNumber);
        if (startBlockNumber != null && startBlockNumber <= endBlockNumber) {
          state.sync.completed = 0;
          state.sync.total = endBlockNumber - startBlockNumber;
          state.sync.inProgress = true;
          // const batchSize = 25;
          let toBlock = endBlockNumber;
          do {
            let batchSize;
            // Aug 1 2021
            if (toBlock < 12936340) {
              batchSize = 250;
            } else {
              batchSize = 25;
            }
            let fromBlock = toBlock - batchSize;
            if (fromBlock < startBlockNumber) {
              fromBlock = startBlockNumber;
            }
            // console.log("fromBlock: " + fromBlock + ", toBlock: " + toBlock);
            const filter = {
              // address: CRYPTOPUNKSMARKETADDRESS, // [NIXADDRESS, weth.address],
              fromBlock: fromBlock,
              toBlock: toBlock,
              topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)
                '0x0000000000000000000000000000000000000000000000000000000000000000', // Null address
                null
              ],
            };
            const events = await provider.getLogs(filter);
            // console.log("updateCollection - events: " + JSON.stringify(events.slice(0, 1)));
            for (const event of events) {
              if (!event.removed && event.topics.length == 4) {
                const contract = event.address.toLowerCase();
                const tokenId = event.topics[3] || event.data || null;
                const bnTokenId = tokenId == null ? null : ethers.BigNumber.from(tokenId);
                if (!(contract in contractsCollator)) {
                  contractsCollator[contract] = [];
                }
                const transfer = {
                  contract: contract,
                  from: ADDRESS0,
                  to: '0x' + event.topics[2].substring(26, 66),
                  tokenId: bnTokenId,
                  blockNumber: event.blockNumber,
                  logIndex: event.logIndex,
                  txHash: event.transactionHash,
                };
                contractsCollator[contract].push(transfer);
              }
            }
            toBlock -= batchSize;
            state.sync.completed = endBlockNumber - toBlock;
          } while (toBlock > startBlockNumber && !state.halt);
          // Collections
          const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
          const contracts = Object.keys(contractsCollator);
          let tokenInfo = null;
          const collections = {};
          try {
            tokenInfo = await erc721Helper.tokenInfo(contracts);
            for (let i = 0; i < contracts.length; i++) {
              contractsCollator[contracts[i]].sort((a, b) => {
                if (a.blockNumber == b.blockNumber) {
                  return b.logIndex - a.logIndex;
                } else {
                  return b.blockNumber - a.blockNumber;
                }
              });
              collections[contracts[i]] = {
                status: ethers.BigNumber.from(tokenInfo[0][i]).toString(),
                symbol: tokenInfo[1][i],
                name: tokenInfo[2][i],
                totalSupply: ethers.BigNumber.from(tokenInfo[3][i]).toString(),
                transfers: contractsCollator[contracts[i]],
              };
            }
            if ('0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85' in contractsCollator) {
              collections['0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'] = { status: 'todo', symbol: 'ENS', name: 'Ethereum Name Service', totalSupply: 'lots', transfers: contractsCollator['0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'] || [] };
            }
          } catch (e) {
            console.log("ERROR - Not ERC-721");
          }
          state.mintMonitorCollections = collections;
        }
        }
        state.sync.inProgress = false;
      }
    },

    // --- monitorMints() ---
    async monitorMints(state, { syncMode, filterUpdate }) {
      // --- monitorMints() start ---
      logInfo("ipcsModule", "mutations.monitorMints() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const block = await provider.getBlock("latest");
        const blockNumber = block.number;

        const contractsCollator = {};

        if (filterUpdate != null) {
          state.filter = { ...state.filter, ...filterUpdate };
        }

        let startBlockNumber = null;
        let endBlockNumber = null;
        if (syncMode == 'scan') {
          startBlockNumber = parseInt(state.filter.startBlockNumber.toString().replace(/,/g, ''));
          endBlockNumber = parseInt(state.filter.endBlockNumber.toString().replace(/,/g, ''));
        } else if (syncMode == 'scanLatest') {
          startBlockNumber = blockNumber - state.filter.scanBlocks;
          endBlockNumber = blockNumber;
          state.filter.startBlockNumber = ethers.utils.commify(startBlockNumber);
          state.filter.endBlockNumber = ethers.utils.commify(endBlockNumber);
        }
        console.log("startBlockNumber: " + startBlockNumber + ", endBlockNumber: " + endBlockNumber);
        if (startBlockNumber != null && startBlockNumber <= endBlockNumber) {
          state.sync.completed = 0;
          state.sync.total = endBlockNumber - startBlockNumber;
          state.sync.inProgress = true;
          // const batchSize = 25;
          let toBlock = endBlockNumber;
          do {
            let batchSize;
            // Aug 1 2021
            if (toBlock < 12936340) {
              batchSize = 250;
            } else {
              batchSize = 25;
            }
            let fromBlock = toBlock - batchSize;
            if (fromBlock < startBlockNumber) {
              fromBlock = startBlockNumber;
            }
            // console.log("fromBlock: " + fromBlock + ", toBlock: " + toBlock);
            const filter = {
              // address: CRYPTOPUNKSMARKETADDRESS, // [NIXADDRESS, weth.address],
              fromBlock: fromBlock,
              toBlock: toBlock,
              topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)
                '0x0000000000000000000000000000000000000000000000000000000000000000', // Null address
                null
              ],
            };
            const events = await provider.getLogs(filter);
            // console.log("monitorMints - events: " + JSON.stringify(events.slice(0, 1)));
            for (const event of events) {
              if (!event.removed && event.topics.length == 4) {
                const contract = event.address.toLowerCase();
                const tokenId = event.topics[3] || event.data || null;
                const bnTokenId = tokenId == null ? null : ethers.BigNumber.from(tokenId);
                if (!(contract in contractsCollator)) {
                  contractsCollator[contract] = [];
                }
                const transfer = {
                  contract: contract,
                  from: ADDRESS0,
                  to: '0x' + event.topics[2].substring(26, 66),
                  tokenId: bnTokenId,
                  blockNumber: event.blockNumber,
                  logIndex: event.logIndex,
                  txHash: event.transactionHash,
                };
                contractsCollator[contract].push(transfer);
              }
            }
            toBlock -= batchSize;
            state.sync.completed = endBlockNumber - toBlock;
          } while (toBlock > startBlockNumber && !state.halt);
          // Collections
          const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
          const contracts = Object.keys(contractsCollator);
          let tokenInfo = null;
          const collections = {};
          try {
            tokenInfo = await erc721Helper.tokenInfo(contracts);
            for (let i = 0; i < contracts.length; i++) {
              contractsCollator[contracts[i]].sort((a, b) => {
                if (a.blockNumber == b.blockNumber) {
                  return b.logIndex - a.logIndex;
                } else {
                  return b.blockNumber - a.blockNumber;
                }
              });
              collections[contracts[i]] = {
                status: ethers.BigNumber.from(tokenInfo[0][i]).toString(),
                symbol: tokenInfo[1][i],
                name: tokenInfo[2][i],
                totalSupply: ethers.BigNumber.from(tokenInfo[3][i]).toString(),
                transfers: contractsCollator[contracts[i]],
              };
            }
            if ('0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85' in contractsCollator) {
              collections['0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'] = { status: 'todo', symbol: 'ENS', name: 'Ethereum Name Service', totalSupply: 'lots', transfers: contractsCollator['0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'] || [] };
            }
          } catch (e) {
            console.log("ERROR - Not ERC-721");
          }
          state.mintMonitorCollections = collections;
        }
        state.sync.inProgress = false;
      }
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    searchTransfers(context, { syncMode, filterUpdate }) {
      logInfo("ipcsModule", "actions.searchTransfers() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('searchTransfers', { syncMode, filterUpdate });
    },
    updateCollection(context, { syncMode, filterUpdate }) {
      logInfo("ipcsModule", "actions.updateCollection() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('updateCollection', { syncMode, filterUpdate });
    },
    monitorMints(context, { syncMode, filterUpdate }) {
      logInfo("ipcsModule", "actions.monitorMints() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('monitorMints', { syncMode, filterUpdate });
    },
    halt(context) {
      context.commit('halt');
    },
  },
};
