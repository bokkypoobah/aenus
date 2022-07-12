const Accounts = {
  template: `
    <div class="m-0 p-0">
      <b-card no-body no-header class="border-0">
        <b-card no-body class="p-0 mt-1">
          <b-tabs card align="left" no-body v-model="settings.tabIndex" active-tab-class="m-0 p-0">
            <b-tab title="Search (WIP)" @click="updateURL('transfers');">
            </b-tab>
            <!--
            <b-tab title="Collection" @click="updateURL('collection');">
            </b-tab>
            <b-tab title="Mint Monitor" @click="updateURL('mintmonitor');">
            </b-tab>
            -->
          </b-tabs>

          <b-card no-body no-header :img-src="settings.tabIndex == 1 && collectionInfo && collectionInfo.metadata && collectionInfo.metadata.bannerImageUrl || ''" img-top class="m-0 p-0 border-0">

            <b-card-body class="m-0 p-1">
              <!-- Main Toolbar -->
              <div class="d-flex flex-wrap m-0 p-0">
                <div v-if="settings.tabIndex == 0" class="mt-1" style="width: 150px;">
                  <b-form-input type="text" size="sm" :value="filter.transfers.accounts" @change="searchTransfers('filterUpdate', { transfers: { accounts: $event } })" :disabled="sync.inProgress" debounce="600" v-b-popover.hover.top="'List of accounts'" placeholder="🔍 0x12... ..."></b-form-input>
                </div>
                <!-- Min rows 2
                <div v-if="settings.tabIndex == 0" class="mt-1" style="width: 150px;">
                  <b-form-textarea size="sm" :value="filter.transfers.accounts" @change="searchTransfers('filterUpdate', { transfers: { accounts: $event } })" placeholder="🔍 0x12... ..." rows="1" max-rows="100"></b-form-textarea>
                </div>
                -->
                <div v-if="settings.tabIndex == 1" class="mt-1">
                  <b-button size="sm" :pressed.sync="settings.collection.showFilter" variant="link" v-b-popover.hover.top="'Show collection filter'"><span v-if="settings.collection.showFilter"><b-icon-layout-sidebar-inset shift-v="+1" font-scale="1.0"></b-icon-layout-sidebar-inset></span><span v-else><b-icon-layout-sidebar shift-v="+1" font-scale="1.0"></b-icon-layout-sidebar></span></b-button>
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
                <!--
                <div v-if="false" class="mt-1 pl-1">
                  <b-button size="sm" @click="copyToClipboard('Lorem ipsum');" variant="primary">Test</b-button>
                </div>
                -->
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

                <div v-if="settings.tabIndex == 0" class="mt-1 pl-1">
                  <b-button size="sm" @click="searchTransfers('scanLatest', {})" :disabled="sync.inProgress || !powerOn || network.chainId != 1" variant="primary">{{ 'Search Latest ' + filter.scanBlocks + ' Blocks' }}</b-button>
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
                <div v-if="settings.tabIndex == 0" class="ml-0 mt-1">
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
                <div v-if="settings.tabIndex == 1" class="mt-1 pr-1">
                  <b-pagination size="sm" v-model="settings.collection.currentPage" :total-rows="filteredSortedCollectionTokens.length" :per-page="settings.collection.pageSize" style="height: 0;"></b-pagination>
                </div>
                <div v-if="settings.tabIndex == 1" class="mt-1 pl-1">
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

              <!-- Transfers -->
              <b-card v-if="settings.tabIndex == 0" no-header no-body class="mt-1 border-0">

                <b-alert size="sm" :show="!powerOn || network.chainId != 1" variant="primary" class="m-0 my-1">
                  Please connect to the Ethereum mainnet with a web3-enabled browser. Click the [Power] button on the top right.
                </b-alert>

                <b-card no-body header="Transactions">
                  <b-card-body class="m-0 p-0">
                    <b-table small fixed striped :fields="transactionsFields" :items="filteredTransactions" head-variant="light">
                      <template #cell(index)="data">
                        {{ data.index + 1 }}
                      </template>
                      <template #cell(timestamp)="data">
                        {{ formatTimestamp(data.item.timestamp) }}
                      </template>
                      <template #cell(description)="data">
                        {{ data.item.description }}
                        <!--
                        <b-row v-for="(transfer, transferIndex) in data.item.transfers" v-bind:key="transferIndex">
                          <b-col>
                            <div v-if="transfer.type == 'received'">
                              Received from {{ getShortName(transfer.from, 16) }}
                            </div>
                            <div v-else-if="transfer.type == 'sent'">
                              Sent to {{ getShortName(transfer.to, 16) }}
                            </div>
                            <div v-else-if="transfer.type == 'mint'">
                              Minted
                            </div>
                            <div v-else-if="transfer.type == 'burn'">
                              Burnt
                            </div>
                            <div v-else>
                              Unknown
                            </div>
                          </b-col>
                          <b-col>
                            <span v-if="transfer.contract.toLowerCase() == '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'">
                              <b-img :width="'100%'" :src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + transfer.tokenId + '/image'">
                              </b-img>
                            </span>
                            <span v-else>
                              {{ getShortName(transfer.contract, 16) + ':' + transfer.tokenId }}
                            </span>
                          </b-col>
                        </b-row>
                        -->
                      </template>
                      <template #cell(block)="data">
                        {{ data.item.block }}
                      </template>
                      <template #cell(txHash)="data">
                        <b-link :href="'https://etherscan.io/tx/' + data.item.txHash" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                          {{ data.item.txHash.substring(0, 10) }}
                        </b-link>
                        <font v-if="data.item.txHash in transactions" size="-1">
                          <b-badge variant="light" v-b-popover.hover.bottom="JSON.stringify(transactions[data.item.txHash].tx, null, 2)">tx</b-badge>
                          <b-badge variant="light" v-b-popover.hover.bottom="JSON.stringify(transactions[data.item.txHash].txReceipt, null, 2)">rcp</b-badge>
                          <b-badge variant="light" v-b-popover.hover.bottom="JSON.stringify(transactions[data.item.txHash].block, null, 2)">blk</b-badge>
                        </font>
                      </template>
                    </b-table>
                  </b-card-body>
                </b-card>

                <b-card no-body header="Events" class="mt-1">
                  <b-card-body class="m-0 p-0">
                    <b-table small fixed striped :fields="transfersFields" :items="transfers" head-variant="light">
                      <template #cell(index)="data">
                        {{ data.index + 1 }}
                      </template>
                      <template #cell(contract)="data">
                        <b-button :id="'popover-target-contract-' + data.item.contract + '-' + data.index" variant="link" class="m-0 p-0">
                          {{ getShortName(data.item.contract) }}
                        </b-button>
                        <b-popover :target="'popover-target-contract-' + data.item.contract + '-' + data.index" placement="right">
                          <template #title>{{ data.item.contract.substring(0, 16) }}</template>
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
                      <template #cell(tokenId)="data">
                        <span v-if="data.item.contract.toLowerCase() == '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'">
                          <b-img :width="'100%'" :src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + data.item.tokenId + '/image'">
                          </b-img>
                        </span>
                        <span v-else>
                          {{ data.item.tokenId }}
                        </span>
                      </template>
                      <template #cell(from)="data">
                        <b-button :id="'popover-target-from-' + data.item.from + '-' + data.index" variant="link" class="m-0 p-0">
                          {{ getShortName(data.item.from, 16) }}
                        </b-button>
                        <b-popover :target="'popover-target-from-' + data.item.from + '-' + data.index" placement="right">
                          <template #title>{{ data.item.from.substring(0, 22) }}</template>
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
                          {{ getShortName(data.item.to, 16) }}
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
                          {{ data.item.txHash.substring(0, 10) }}
                        </b-link>
                        <font v-if="data.item.txHash in transactions" size="-1">
                          <b-badge variant="light" v-b-popover.hover.bottom="JSON.stringify(transactions[data.item.txHash].tx, null, 2)">tx</b-badge>
                          <b-badge variant="light" v-b-popover.hover.bottom="JSON.stringify(transactions[data.item.txHash].txReceipt, null, 2)">rcp</b-badge>
                          <b-badge variant="light" v-b-popover.hover.bottom="JSON.stringify(transactions[data.item.txHash].block, null, 2)">blk</b-badge>
                        </font>
                      </template>
                    </b-table>
                  </b-card-body>
                </b-card>
              </b-card>

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
        tabIndex: 0,
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

      transactionsFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'timestamp', label: 'Timestamp', thStyle: 'width: 15%;', sortable: true },
        { key: 'description', label: 'Description', thStyle: 'width: 35%;', sortable: true },
        { key: 'via', label: 'Via', thStyle: 'width: 10%;', sortable: true },
        { key: 'valueType', label: 'Type', thStyle: 'width: 5%;', sortable: true },
        { key: 'value', label: 'Value', thStyle: 'width: 15%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'txHash', label: 'Tx Hash', sortable: true, thStyle: 'width: 15%;' },
      ],

      transfersFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'contract', label: 'Contract', thStyle: 'width: 30%;', sortable: true },
        { key: 'tokenId', label: 'Token Id', thStyle: 'width: 15%;', sortable: true },
        { key: 'from', label: 'From', thStyle: 'width: 15%;', sortable: true },
        { key: 'to', label: 'To', thStyle: 'width: 15%;', sortable: true },
        { key: 'txHash', label: 'Tx Hash', sortable: true, thStyle: 'width: 20%;' },
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
      return store.getters['accounts/config'];
    },
    filter() {
      return store.getters['accounts/filter'];
    },
    sync() {
      return store.getters['accounts/sync'];
    },
    transactions() {
      return store.getters['accounts/transactions'];
    },
    transfers() {
      return store.getters['accounts/transfers'];
    },
    transfersCollectionContracts() {
      return store.getters['accounts/transfersCollectionContracts'];
    },
    collectionInfo() {
      return store.getters['accounts/collectionInfo'];
    },
    collectionTokens() {
      return store.getters['accounts/collectionTokens'];
    },
    ensMap() {
      return store.getters['accounts/ensMap'];
    },
    filteredTransactions() {
      const results = [];
      // console.log("filteredTransactions - this.transactions: " + JSON.stringify(this.transactions, null, 2));
      for (const [txHash, tx] of Object.entries(this.transactions)) {
        // console.log("filteredTransactions - tx: " + JSON.stringify(tx, null, 2));
        results.push({
          txHash: tx.tx.hash,
          block: tx.block.number,
          timestamp: tx.block.timestamp,
          description: tx.description,
          via: tx.via,
          valueType: tx.valueType,
          value: tx.value,
          transfers: tx.transfers,
        });
      }
      return results;
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
      if (this.settings.collection.sortOption == 'idasc') {
        results.sort((a, b) => a.tokenId - b.tokenId);
      } else if (this.settings.collection.sortOption == 'iddsc') {
        results.sort((a, b) => b.tokenId - a.tokenId);
      }
      return results;
    },
    pagedFilteredCollectionTokens() {
      return this.filteredSortedCollectionTokens.slice((this.settings.collection.currentPage - 1) * this.settings.collection.pageSize, this.settings.collection.currentPage * this.settings.collection.pageSize);
    },
    getURL() {
      let url = '/accounts/mintmonitor/';
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
    copyToClipboard(str) {
      // https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/copyToClipboard.md
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
    formatTimestamp(ts) {
      if (ts != null) {
        return moment.unix(ts).format("YYYY-MM-DD HH:mm:ss");
      }
      return null;
    },
    getShortName(address, length = 32) {
      const addressLower = address.toLowerCase();
      if (addressLower in this.transfersCollectionContracts) {
        let collection = this.transfersCollectionContracts[addressLower];
        return collection.name && collection.name.substring(0, length) || 'error';
      }
      try {
        let name = this.ensMap[address.toLowerCase()];
        if (name != null) {
          name = name.substring(0, length);
        }
        return name;
      } catch (e) {
        return address.substring(0, length);
      }
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
      this.$router.push('/accounts/' + where);
    },
    async calendarUpdated(field, context) {
      logInfo("Accounts", "calendarUpdated - field: " + field + ", context: " + JSON.stringify(context));
      const mm = this.settings.periodSelector;
      if (field == 'dateFrom' && mm.dateFrom != null && mm.dateTo == null) {
        mm.dateTo = mm.dateFrom;
      }
      if ((field == 'dateFrom' || field == 'timeFrom') && mm.dateFrom != null && mm.timeFrom != null) {
        logInfo("Accounts", "calendarUpdated - dateFrom: " + mm.dateFrom + ", timeFrom: " + mm.timeFrom);
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
          store.dispatch('accounts/monitorMints', { syncMode: 'updateFilter', filterUpdate: { startBlockNumber: ethers.utils.commify(data.data.blocks[0].number) } });
        }
      }
      if ((field == 'dateTo' || field == 'timeTo') && mm.dateTo != null && mm.timeTo != null) {
        logInfo("Accounts", "calendarUpdated - dateTo: " + mm.dateTo + ", timeTo: " + mm.timeTo);
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
          store.dispatch('accounts/monitorMints', { syncMode: 'updateFilter', filterUpdate: { endBlockNumber: ethers.utils.commify(data.data.blocks[0].number) } });
        }
      }
    },
    async searchTransfers(syncMode, filterUpdate) {
      store.dispatch('accounts/searchTransfers', { syncMode, filterUpdate });
    },
    async halt() {
      store.dispatch('accounts/halt');
    },
    async timeoutCallback() {
      logDebug("Accounts", "timeoutCallback() count: " + this.count);
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
    logDebug("Accounts", "beforeDestroy()");
  },
  mounted() {
    logInfo("Accounts", "mounted() $route: " + JSON.stringify(this.$route.params) + ", props['tab']: " + this.tab + ", props['blocks']: " + this.blocks + ", props['search']: " + this.search);
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
          store.dispatch('accounts/monitorMints', { syncMode: 'scan', filterUpdate });
        }, 1000);
      }
    }
    this.reschedule = true;
    logDebug("Accounts", "Calling timeoutCallback()");
    this.timeoutCallback();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const accountsModule = {
  namespaced: true,
  state: {
    filter: {
      collection: {
        address: null, // "0x31385d3520bced94f77aae104b406994d8f2168c",
        startBlockNumber: 4000000,
      },
      transfers: {
        accounts: "0x287F9b46dceA520D829c874b0AF01f4fbfeF9243", // TODO null,
      },
      searchString: null,
      scanBlocks: 500,
      startBlockNumber: 14484994, // null,
      endBlockNumber: 14591766, // null,
    },
    sync: {
      inProgress: false,
      error: false,
      total: null,
      completed: null,
    },

    transactions: {},
    transfers: [],
    transfersCollectionContracts: {},
    collectionInfo: {},
    collectionTokens: {},
    ensMap: {},
    halt: false,
    params: null,
  },
  getters: {
    filter: state => state.filter,
    sync: state => state.sync,
    transactions: state => state.transactions,
    transfers: state => state.transfers,
    transfersCollectionContracts: state => state.transfersCollectionContracts,
    collectionInfo: state => state.collectionInfo,
    collectionTokens: state => state.collectionTokens,
    ensMap: state => state.ensMap,
    params: state => state.params,
  },
  mutations: {

    // --- searchTransfers() ---
    async searchTransfers(state, { syncMode, filterUpdate }) {
      logInfo("accountsModule", "mutations.searchTransfers() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));

      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const block = await provider.getBlock("latest");
        const blockNumber = block.number;
        console.log("state.filter: " + JSON.stringify(state.filter, null, 2));
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

        let debug = null;
        // debug = ["0xa537831867d1af2a566e55231b7468e29e6936bfc6aa13d78a4464450e95e514"]; // OS Wyvern tx
        // debug = ["0xf59e8412897d3e25c3e4c0d75cf3354a88e30bbf12b0e02f40373ba09e270a8c"]; // MoonCats unwrap(uint256 _tokenId)
        // debug = ["0x85a48ee39f63ebb61763bbe428a286092ebf88e2ecdcc32e2ce28b535132dc5c"]; // MoonCats batchWrap(uint256[] _rescueOrders)
        // debug = ["0x3801ef7981577abb32a5426c0470a28aaecac379eef773b70ca85227fc507361"]; // MoonCats batchReWrap(uint256[] _rescueOrders, uint256[] _oldTokenIds)
        // debug = ["0xd3b7f8caf380a4e7179246fa4ea529c77bc1298c33328b8909a8c770885a993f"]; // ENS registerWithConfig(string name, address owner, uint256 duration, bytes32 secret, address resolver, address addr)
        // debug = ["0x32ca6cd120b55364567793bb51e9f2ff362bf559c0298a01e959538909d992b6"]; // OpenSea SeaPort 1.1 ETH purchase fulfillBasicOrder()
        // debug = ["0x1ba1bb6ec3d89c0165db1fa3905ad587c8d995daec8aa2ed90d3ae4df7a68904"]; // OpenSea SeaPort 1.1 WETH accept
        // debug = ["0x7522bef2c13d82d5e294154ec85c0f44887b44076e010fdd6f82adb483e1068e"]; // LooksRare Meebit
        // debug = ["0x6d898e34c9547ded9b24951ee53d18de84ad375542ee3e268a08d50db1fe50e2"]; // WETH Wrap
        // debug = ["0x367481e4f1d0224c34b89c4ac5f2f05edfd73a8f2736dc9d1a8c755adafcb308"]; // WETH Unwrap
        // debug = ["0x66df1c53a341bae5276ab7034275bde2324bc304a85e58c8ef4d41e8e51aeb60"]; // OpenSea Wyvern
        // debug = ["0x36e7f316034fe9b8b19819900f2eb0e120ecf61c26d58da0a80165c35d5e586e"]; // Gem: Gemswap 2 - OpenSea and LooksRare
        // debug = ["0x59e3ba75f605b75489ca10e7c448fbd0d1776280549746490e5e14a142d2b97a"]; // Gem: Gemswap 2 - OpenSea and X2Y2


        if (startBlockNumber != null && startBlockNumber <= endBlockNumber) {
          state.sync.completed = 0;
          state.sync.total = endBlockNumber - startBlockNumber;
          state.sync.inProgress = true;
          const transfers = [];
          const txHashes = {};
          const accounts = state.filter.transfers.accounts.split(/[, \t\n]+/).map(s => s.toLowerCase());
          const accountsBytes32 = accounts.map(s => '0x000000000000000000000000' + s.substring(2, 42));
          console.log("accounts: " + JSON.stringify(accounts));
          // console.log("accountsBytes32: " + JSON.stringify(accountsBytes32));
          // const batchSize = 25;
          const ensMap = {};
          const contracts = {};
          const transactions = {};
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
              topics: [[
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 id)
                ],
                accountsBytes32,
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
                accountsBytes32,
              ],
            };
            const eventsTo = await provider.getLogs(filterTo);
            // console.log("searchTransfers - eventsTo: " + JSON.stringify(eventsTo, null, 2));

            for (const event of [...eventsFrom, ...eventsTo]) {
              if (!event.removed) {
                const contract = event.address;
                // ERC-20
                // if (event.topics[3] === undefined) {
                //   console.log("searchTransfers - event: " + JSON.stringify(event, null, 2));
                // }

                let tokenId;
                if (event.topics.length > 3) {
                  tokenId = new BigNumber(event.topics[3].substring(2), 16).toFixed(0);
                } else {
                  tokenId = event.data != null ? new BigNumber(event.data.substring(2), 16).toFixed(0) : null;
                }

                const from = '0x' + event.topics[1].substring(26, 66);
                const to = '0x' + event.topics[2].substring(26, 66);
                const txHash = event.transactionHash;

                if (!(contract in contracts)) {
                  contracts[contract] = true;
                }
                if (!(txHash in txHashes)) {
                  txHashes[txHash] = true;
                }
                for (const addy of [contract, from, to]) {
                  const lowerAddy = addy.toLowerCase();
                  if (!(lowerAddy in ensMap)) {
                    ensMap[lowerAddy] = addy;
                  }
                }

                transfers.push({ blockNumber: event.blockNumber, txIndex: event.transactionIndex, contract, tokenId, from, to, txHash, logIndex: event.logIndex });
              }
            }

            toBlock -= batchSize;
            state.sync.completed = endBlockNumber - toBlock;
          } while (toBlock > startBlockNumber && !state.halt && !debug);
          state.transfers = transfers;

          // console.log("txHashes: " + JSON.stringify(txHashes));
          let txHashesToProcess = Object.keys(txHashes);
          state.sync.total = txHashesToProcess.length;
          state.sync.completed = 0;
          txHashesToProcess = debug ? debug : txHashesToProcess;
          for (const txHash of txHashesToProcess) {
            if (debug) {
              console.log("Processing: " + txHash);
            }
            const tx = await provider.getTransaction(txHash);
            const txReceipt = await provider.getTransactionReceipt(txHash);
            const block = await provider.getBlock(txReceipt.blockNumber);
            if (false && debug) {
              console.log("tx: " + JSON.stringify(tx).substring(0, 50));
              console.log("txReceipt: " + JSON.stringify(txReceipt).substring(0, 50));
              // console.log("block: " + JSON.stringify(block, null, 2));
            }
            transactions[txHash] = {
              tx,
              txReceipt,
              block,
              description: null,
              via: null,
              valueType: null,
              value: null,
              transfers: [],
            };
            state.sync.completed = parseInt(state.sync.completed) + 1;
            if (state.halt) {
              break;
            }
          }

          let contractAddresses = Object.keys(contracts);
          const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
          const tokenInfos = await erc721Helper.tokenInfo(contractAddresses);
          const tokenContracts = {};
          for (let i = 0; i < tokenInfos[0].length; i++) {
            const mask = ethers.BigNumber.from(tokenInfos[0][i]).toString();
            if (mask > 0) {
              const symbol = tokenInfos[1][i];
              const name = tokenInfos[2][i];
              const totalSupply = ethers.BigNumber.from(tokenInfos[3][i]).toString();
              tokenContracts[contractAddresses[i].toLowerCase()] = { mask, symbol, name, totalSupply };
            }
          }
          // console.log("tokenContracts: " + JSON.stringify(tokenContracts, null, 2));

          const markets = [
            { address: "0x7f268357A8c2552623316e2562D90e642bB538E5", name: "Wyvern Exchange" },
          ];

          const marketsMap = {};
          for (const market of markets) {
            marketsMap[market.address.toLowerCase()] = market.name;
          }
          // console.log("marketsMap: " + JSON.stringify(marketsMap, null, 2));

          for (const txHash of txHashesToProcess) {
            const transaction = transactions[txHash];
            const tx = transaction.tx;
            const txReceipt = transaction.txReceipt;
            if (debug) {
              console.log("tx: " + JSON.stringify(tx).substring(0, 50));
              console.log("txReceipt: " + JSON.stringify(txReceipt).substring(0, 50));
              // console.log("block: " + JSON.stringify(transactions[txHash].block, null, 2));
            }
            const parsedTx = parseTx(tx, txReceipt, block, provider);
            console.log("parsedTx: " + JSON.stringify(parsedTx, null, 2));

            const from = transaction.tx.from.toLowerCase();
            const to = transaction.tx.to.toLowerCase();
            // console.log("to: " + to);

            // const transfers = [];
            // for (const event of txReceipt.logs) {
            //   // console.log(JSON.stringify(event));
            //   if (event.topics[0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
            //     const from = '0x' + event.topics[1].substring(26, 66);
            //     const to = event.topics[2] && ('0x' + event.topics[2].substring(26, 66)) || null;
            //     let tokenId;
            //     if (event.topics.length > 3) {
            //       tokenId = new BigNumber(event.topics[3].substring(2), 16).toFixed(0);
            //     } else {
            //       tokenId = event.data != null ? new BigNumber(event.data.substring(2), 16).toFixed(0) : null;
            //     }
            //     // const type = (from.substring(0, 50) == ADDRESS0.substring(0, 50)) ? "mint" : ((to.substring(0, 50) == ADDRESS0.substring(0, 50)) ? "burn" : "transfer");
            //
            //     let type;
            //     if (from.substring(0, 50) == ADDRESS0.substring(0, 50)) {
            //       type = "mint";
            //     } else if (to.substring(0, 50) == ADDRESS0.substring(0, 50)) {
            //       type = "burn";
            //     } else {
            //       // console.log("from: " + from + ", to: " + to + ", accounts: " + JSON.stringify(accounts));
            //       if (accounts.includes(from)) {
            //         type = "sent";
            //       } else if (accounts.includes(to)) {
            //         type = "received";
            //       } else {
            //         type = "transfer";
            //       }
            //     }
            //
            //     transfers.push({
            //       type,
            //       contract: event.address,
            //       from,
            //       to,
            //       tokenId,
            //       logIndex: event.logIndex,
            //     });
            //   }
            // }
            // transfers.sort((a, b) => {
            //   return a.logIndex - b.logIndex;
            // });
            // // console.log("transfers: " + JSON.stringify(transfers));
            // transactions[txHash].transfers = transfers;

            transactions[txHash].description = parsedTx.description;
            transactions[txHash].via = parsedTx.via;
            // Exchange transaction
            // if (to in marketsMap) {
            //   transactions[txHash].via = marketsMap[to];
            // } else if (to in tokenContracts) {
            //   // console.log("NFT: " + JSON.stringify(tokenContracts[to]));
            //   transactions[txHash].description = "Mint '" + tokenContracts[to].symbol + "' '" + tokenContracts[to].name + "'";
            //   transactions[txHash].via = null;
            // }
            transactions[txHash].valueType = "ETH";
            transactions[txHash].value = tx.value && ethers.utils.formatEther(tx.value) || null;


            // transactions[txHash].action = "New Action";
            // action: "action",
            // valueType: "valueType",
            // value: tx.value && ethers.utils.formatEther(tx.value) || null,
            // description: "description",
            // items: [],
          }


          const GETPRICEBATCHSIZE = 20;
          records = 0;
          const prices = {};
          const DELAYINMILLIS = 1000;
          const transfersCollectionContracts = {};
          for (let i = 0; i < contractAddresses.length && !state.halt; i += GETPRICEBATCHSIZE) {
            const batch = contractAddresses.slice(i, parseInt(i) + GETPRICEBATCHSIZE);
            let url = "https://api.reservoir.tools/collections/v4?";
            let separator = "";
            for (let j = 0; j < batch.length; j++) {
              url = url + separator + "contract=" + batch[j];
              separator = "&";
            }
            url = url + separator + "sortBy=allTimeVolume&includeTopBid=false&limit=20";
            const data = await fetch(url).then(response => response.json());
          //   records = records + data.tokens.length;
          //   state.message = "Retrieving prices " + records;
            for (collection of data.collections) {
              transfersCollectionContracts[collection.id.toLowerCase()] = collection;
            }
            await delay(DELAYINMILLIS);
          }
          state.transfersCollectionContracts = transfersCollectionContracts;
          // console.log("transfersCollectionContracts: " + JSON.stringify(transfersCollectionContracts, null, 2));
          state.transactions = transactions;

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
          // console.log("ensMap: " + JSON.stringify(ensMap, null, 2));
        }
      }
      state.sync.inProgress = false;
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    searchTransfers(context, { syncMode, filterUpdate }) {
      logInfo("accountsModule", "actions.searchTransfers() - syncMode: " + syncMode + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('searchTransfers', { syncMode, filterUpdate });
    },
    halt(context) {
      context.commit('halt');
    },
  },
};
