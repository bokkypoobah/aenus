const CryptoPunks = {
  template: `
    <div class="m-0 p-0">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="false && (!powerOn || network.chainId != 1)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Ethereum mainnet and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body no-header class="border-0">
        <b-card no-body class="p-0 mt-1">
          <b-tabs card align="left" no-body v-model="settings.tabIndex" active-tab-class="m-0 p-0">
            <b-tab title="Activity" @click="updateURL('activity');">
            </b-tab>
            <b-tab title="Punks" @click="updateURL('punks');">
            </b-tab>
            <b-tab title="Owners" @click="updateURL('owners');">
            </b-tab>
            <b-tab title="Chart" @click="updateURL('chart');">
            </b-tab>
          </b-tabs>

          <!-- Sidebar filter -->
          <b-card-body class="m-0 p-1">
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
                  <div v-for="(attributeKey, attributeIndex) in Object.keys(attributesWithCounts).sort()" v-bind:key="attributeIndex">
                    <b-card body-class="p-0" header-class="m-0 p-0 pl-2" footer-class="p-1" class="m-3 p-0">
                      <template #header>
                        <span variant="secondary" class="small truncate">
                          {{ slugToTitle(attributeKey) }}
                        </span>
                      </template>
                      <font size="-2">
                        <b-table small fixed striped sticky-header="200px" :fields="attributeFields" :items="getSortedTraitsForAttribute(attributeKey)" head-variant="light">
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

            <!-- Toolbar -->
            <div class="d-flex flex-wrap m-0 p-0" style="min-height: 37px;">
              <div class="mt-1" style="max-width: 150px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.searchString" debounce="600" v-b-popover.hover.top="'Filter by list of punkIds'" placeholder="🔍 id1 id2-id3 ..."></b-form-input>
              </div>
              <div class="mt-1 pl-2" style="max-width: 150px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.searchAccounts" debounce="600" v-b-popover.hover.top="'Filter by list of owner addresses. Partial matching'" placeholder="🔍 0x12... ..."></b-form-input>
              </div>
              <div class="mt-1 pl-2" style="max-width: 80px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.priceFrom" debounce="600" v-b-popover.hover.top="'ETH from'" placeholder="min"></b-form-input>
              </div>
              <div class="mt-1">
                -
              </div>
              <div class="mt-1 pr-2" style="max-width: 80px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.priceTo" debounce="600" v-b-popover.hover.top="'ETH to'" placeholder="max"></b-form-input>
              </div>
              <div class="mt-1 pr-1 flex-grow-1">
              </div>
              <div class="mt-1 pl-1">
                <b-dropdown v-if="message == null" split size="sm" text="Sync" @click="loadPunks('partial')" variant="primary" v-b-popover.hover.top="'Partial Sync'">
                  <b-dropdown-item @click="loadPunks('full')">Full Sync</b-dropdown-item>
                  <!-- <b-dropdown-item @click="searchLogs()">Search Event Logs (WIP)</b-dropdown-item> -->
                </b-dropdown>
                <b-button v-if="message != null" size="sm" @click="halt" variant="primary" v-b-popover.hover.top="'Halt'" >{{ message }}</b-button>
              </div>
              <div class="mt-1 pr-1 flex-grow-1">
              </div>
              <div v-if="settings.tabIndex == 1" class="mt-1 pl-1">
                <font size="-2">{{ filteredSortedResults.length }}</font>
              </div>
              <div v-if="settings.tabIndex == 2" class="mt-1 pl-1">
                <font size="-2">{{ filteredSortedOwners.length }}</font>
              </div>
              <div v-if="settings.tabIndex == 1" class="mt-1 pl-1">
                <b-pagination size="sm" v-model="settings.currentPage" :total-rows="filteredSortedResults.length" :per-page="settings.pageSize"></b-pagination>
              </div>
              <div v-if="settings.tabIndex == 2" class="mt-1 pl-1">
                <b-pagination size="sm" v-model="settings.ownersCurrentPage" :total-rows="filteredSortedOwners.length" :per-page="settings.ownersPageSize"></b-pagination>
              </div>
              <div class="mt-1 pr-1 flex-grow-1">
              </div>
              <div v-if="settings.tabIndex == 1" class="mt-1 pr-1">
                <b-button size="sm" @click="exportPunks" :disabled="filteredSortedResults.length == 0" variant="link">Export</b-button>
              </div>
              <div v-if="settings.tabIndex == 1" class="mt-1 pr-1">
                <b-form-select size="sm" v-model="settings.sortOption" :options="sortOptions" class="w-100"></b-form-select>
              </div>
              <div v-if="settings.tabIndex == 2" class="mt-1 pr-1">
                <b-form-select size="sm" v-model="settings.ownersSortOption" :options="ownersSortOptions" class="w-100"></b-form-select>
              </div>
              <div v-if="settings.tabIndex == 1" class="mt-1 pr-1">
                <b-button size="sm" :pressed.sync="settings.randomise" @click="settings.sortOption = 'random'; " variant="link" v-b-popover.hover.top="'Randomise'"><b-icon-shuffle shift-v="-1" font-scale="1.2"></b-icon-shuffle></b-button>
              </div>
              <div v-if="settings.tabIndex == 2" class="mt-1 pr-1">
                <b-button size="sm" :pressed.sync="settings.randomise" @click="settings.ownersSortOption = 'random'; " variant="link" v-b-popover.hover.top="'Randomise'"><b-icon-shuffle shift-v="-1" font-scale="1.2"></b-icon-shuffle></b-button>
              </div>

              <div v-if="settings.tabIndex == 0" class="mt-1 pl-1">
                <b-form-select size="sm" v-model="settings.activityMaxItems" :options="activityMaxItemsOptions" v-b-popover.hover.top="'Max items to display'"></b-form-select>
              </div>
              <div v-if="settings.tabIndex == 3" class="mt-1 pl-1">
                <b-form-select size="sm" v-model="settings.chartPeriod" :options="chartPeriodOptions" v-b-popover.hover.top="'Charting period'"></b-form-select>
              </div>
              <div v-if="settings.tabIndex == 1" class="mt-1 pl-1">
                <b-form-select size="sm" v-model="settings.pageSize" :options="pageSizes" v-b-popover.hover.top="'Page size'"></b-form-select>
              </div>
              <div v-if="settings.tabIndex == 2" class="mt-1 pl-1">
                <b-form-select size="sm" v-model="settings.ownersPageSize" :options="pageSizes" v-b-popover.hover.top="'Page size'"></b-form-select>
              </div>
              <div class="mt-1 pl-1">
                <b-button size="sm" v-b-toggle.sidebar-1 variant="link" v-b-popover.hover.top="'Filter by Attributes'"><b-icon-filter-right shift-v="-1" font-scale="1.4"></b-icon-filter-right></b-button>
              </div>
            </div>

            <!-- Loading --->
            <div v-if="this.message != null">
              <b-alert show variant="info" class="m-0 mt-4 p-2 mt-1">
                Retrieving data from sources. Please wait.
              </b-alert>
            </div>

            <!-- Activities -->
            <div v-if="settings.tabIndex == 0" v-for="(activity, activityIndex) in activities" :key="activityIndex">
              <b-card v-if="activity.values.length > 0" body-class="p-1 px-3" header-class="p-1 px-3" class="mt-1">
                <template #header>
                  <h6 class="mb-0">{{ activity.title }}</h6>
                </template>

                <b-card-group deck>
                  <div v-for="(event, eventIndex) in activity.values.slice(0, settings.activityMaxItems)" :key="eventIndex">
                    <b-card body-class="p-0" header-class="p-1" img-top class="m-1 p-0 border-0" style="max-width: 7rem;">
                      <b-link :href="'https://cryptopunks.app/cryptopunks/details/' + event.punkId" v-b-popover.hover.bottom="'View in original website'" target="_blank">
                        <b-avatar rounded size="7rem" :src="'images/punks/punk' + event.punkId.toString().padStart(4, '0') + '.png'" style="background-color: #638596"></b-avatar>
                      </b-link>
                      <b-card-text class="text-right">
                        <div class="d-flex justify-content-between m-0 p-0">
                          <div>
                            <font size="-1">
                              <b-badge variant="light" v-b-popover.hover.bottom="hoverInfo(event.punkId)">{{ event.punkId }}</b-badge>
                            </font>
                          </div>
                          <div class="flex-grow-1">
                            <font v-if="secondsOld(event.timestamp) < 3600" size="-1">
                              <b-badge variant="dark" v-b-popover.hover.bottom="formatTimestamp(event.timestamp)">{{ formatTerm(event.timestamp) }}</b-badge>
                            </font>
                            <font v-else-if="secondsOld(event.timestamp) > 86400" size="-1">
                              <b-badge variant="light" v-b-popover.hover.bottom="formatTimestamp(event.timestamp)">{{ formatTerm(event.timestamp) }}</b-badge>
                            </font>
                            <font v-else size="-1">
                              <b-badge variant="secondary" v-b-popover.hover.bottom="formatTimestamp(event.timestamp)">{{ formatTerm(event.timestamp) }}</b-badge>
                            </font>
                          </div>
                          <div class="flex-grow-1">
                          </div>
                          <div>
                            <font size="-1">
                              <b-badge :variant="(activity.type == 'Sales') ? 'success' : ((activity.type == 'Asks') ? 'primary' : 'warning')" v-b-popover.hover.bottom="formatETH(event.amount)">{{ formatETHShort(event.amount) }}</b-badge>
                            </font>
                          </div>
                        </div>
                      </b-card-text>
                    </b-card>
                  </div>
                </b-card-group deck>
              </b-card>
            </div>

            <!-- Table -->
            <b-table v-if="settings.tabIndex == 1" small striped hover :fields="resultsFields" :items="pagedFilteredSortedResults" table-class="w-100" class="m-2">
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

            <!-- Owners -->
            <div v-if="settings.tabIndex == 2">
              <b-table small striped hover :fields="ownersFields" :items="pagedFilteredSortedOwners" class="mt-3">
                <template #cell(index)="data">
                  {{ data.index+1 }}
                </template>
                <template #cell(owner)="data">
                  <b-button :id="'popover-target-owner-' + data.item.owner + '-' + data.index" variant="link" class="m-0 p-0">
                    {{ data.item.owner.substring(0, 16) }}
                  </b-button>
                  <b-popover :target="'popover-target-owner-' + data.item.owner + '-' + data.index" placement="right">
                    <template #title>Owner: {{ data.item.owner.substring(0, 12) }}:</template>
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
                      Etherscan
                    </b-link>
                    <br />
                    <b-link :href="'https://chat.blockscan.com/index?a=' + data.item.owner" v-b-popover.hover.bottom="'Message in blockscan.io'" target="_blank">
                      Blockscan
                    </b-link>
                  </b-popover>
                </template>
                <template #cell(punks)="data">
                  <b-card-group deck>
                    <div v-for="(punk, punkIndex) in getPunkDataForIds(data.item.punkIds)" :key="punkIndex">
                      <b-card body-class="p-0" header-class="p-1" img-top class="m-1 p-0 border-0" style="max-width: 7rem;">
                        <b-link :href="'https://cryptopunks.app/cryptopunks/details/' + punk.punkId" v-b-popover.hover.bottom="'View in original website'" target="_blank">
                          <b-avatar rounded size="7rem" :src="'images/punks/punk' + punk.punkId.toString().padStart(4, '0') + '.png'" style="background-color: #638596"></b-avatar>
                        </b-link>
                        <b-card-text class="text-right">
                          <font size="-1">
                            <div class="d-flex justify-content-between m-0 p-0">
                              <div>
                                <b-badge variant="light" v-b-popover.hover.bottom="hoverInfo(punk.punkId)">{{ punk.punkId }}</b-badge>
                              </div>
                              <div class="flex-grow-1">
                                <div v-if="punk.last.amount">
                                  <span v-if="secondsOld(punk.last.timestamp) < 3600" size="-1">
                                    <b-badge variant="dark" v-b-popover.hover.bottom="'Last ' + formatETH(punk.last.amount) + 'e @ ' + formatTimestamp(punk.last.timestamp)">{{ formatTerm(punk.last.timestamp) }}</b-badge>
                                  </span>
                                  <span v-else-if="secondsOld(punk.last.timestamp) > 86400" size="-1">
                                    <b-badge variant="light" v-b-popover.hover.bottom="'Last ' + formatETH(punk.last.amount) + 'e @ ' + formatTimestamp(punk.last.timestamp)">{{ formatTerm(punk.last.timestamp) }}</b-badge>
                                  </span>
                                  <span v-else size="-1">
                                    <b-badge variant="secondary" v-b-popover.hover.bottom="'Last ' + formatETH(punk.last.amount) + 'e @ ' + formatTimestamp(punk.last.timestamp)">{{ formatTerm(punk.last.timestamp) }}</b-badge>
                                  </span>
                                </div>
                              </div>
                              <div class="flex-grow-1">
                              </div>
                              <div>
                                <div v-if="punk.last.amount">
                                  <b-badge variant="success" v-b-popover.hover.bottom="'Last ' + formatETH(punk.last.amount) + 'e @ ' + formatTimestamp(punk.last.timestamp)">{{ formatETHShort(punk.last.amount) }}</b-badge>
                                </div>
                              </div>
                            </div>
                            <div class="d-flex justify-content-between m-0 p-0">
                              <div v-if="punk.bid.amount">
                                <b-badge variant="warning" v-b-popover.hover.bottom="'Bid ' + formatETH(punk.bid.amount) + 'e @ ' + formatTimestamp(punk.bid.timestamp)">{{ formatETHShort(punk.bid.amount) }}</b-badge>
                              </div>
                              <div class="flex-grow-1">
                              </div>
                              <div>
                                <span v-if="punk.ask.amount">
                                  <b-badge variant="primary" v-b-popover.hover.bottom="'Offer ' + formatETH(punk.ask.amount) + 'e @ ' + formatTimestamp(punk.ask.timestamp)">{{ formatETHShort(punk.ask.amount) }}</b-badge>
                                </span>
                                <span v-else>
                                  &nbsp;
                                </span>
                              </div>
                            </div>
                          </font>
                        </b-card-text>
                      </b-card>
                    </div>
                  </b-card-group>
                </template>
              </b-table>
            </div>

            <!-- Chart -->
            <div v-if="settings.tabIndex == 3">
              <b-row>
                <b-col cols="7">
                  <b-card body-class="m-2 p-1" header-class="p-1" class="mt-1 mr-1" style="height: 550px;">
                    <template #header>
                      <h6 class="mb-0">CryptoPunks Sales Activity</h6>
                    </template>
                    <apexchart :options="dailyChartOptions" :series="dailyChartData"></apexchart>
                    <!-- <apexchart :options="chartOptions" :yaxis="chartOptions.yaxis" :series="chartData"></apexchart> -->
                    <!--
                    <b-table small fixed striped sticky-header="200px" :fields="dailyDataFields" :items="dailyData" head-variant="light">
                      <template #cell(timestamp)="data">
                        {{ formatTimestampAsDate(data.item.timestamp) }}
                      </template>
                      <template #cell(total)="data">
                        {{ parseFloat(data.item.total).toFixed(9) }}
                      </template>
                      <template #cell(average)="data">
                        {{ parseFloat(data.item.average).toFixed(9) }}
                      </template>
                    </b-table>
                    -->
                  </b-card>
                </b-col>
                <b-col cols="5">
                  <b-card body-class="m-0 p-0" header-class="p-1 px-3" class="mt-1" style="height: 550px;">
                    <template #header>
                      <h6 class="mb-0">Sales For Selected Day</h6>
                    </template>
                    <!--
                    <b-form-group label-cols="4" label-size="sm" label="Period" label-align="right" class="mb-2">
                      <b-form-select size="sm" v-model="settings.chartPeriod" :options="chartPeriodOptions" v-b-popover.hover.bottom="'Charting period'" class="w-50"></b-form-select>
                    </b-form-group>
                    -->
                    <p v-if="dailyChartSelectedItems.length == 0" class="mt-1 p-2">
                      Click on a daily column to view the sales for the day
                    </p>
                    <font size="-2">
                      <b-table v-if="dailyChartSelectedItems.length > 0" small fixed striped sticky-header="500px" :fields="dailyChartSelectedItemsFields" :items="dailyChartSelectedItems" head-variant="light">
                        <template #cell(punkId)="data">
                          <b-link :href="'https://cryptopunks.app/cryptopunks/details/' + data.item.punkId" v-b-popover.hover.bottom="'View in original website'" target="_blank">
                            {{ data.item.punkId }}
                          </b-link>
                        </template>
                        <template #cell(image)="data">
                          <b-link :href="'https://cryptopunks.app/cryptopunks/details/' + data.item.punkId" v-b-popover.hover.bottom="'View in original website'" target="_blank">
                            <b-img-lazy width="40%" :src="'images/punks/punk' + data.item.punkId.toString().padStart(4, '0') + '.png'" style="background-color: #638596"/>
                          </b-link>
                        </template>
                        <template #cell(from)="data">
                          <b-link :href="'https://cryptopunks.app/cryptopunks/accountInfo?account=' + data.item.from" v-b-popover.hover.bottom="'View in original website'" target="_blank">
                            {{ data.item.from.substring(0, 10) }}
                          </b-link>
                        </template>
                        <template #cell(to)="data">
                          <b-link :href="'https://cryptopunks.app/cryptopunks/accountInfo?account=' + data.item.to" v-b-popover.hover.bottom="'View in original website'" target="_blank">
                            {{ data.item.to.substring(0, 10) }}
                          </b-link>
                        </template>
                        <template #cell(amount)="data">
                          {{ formatETHShort(data.item.amount) }}
                        </template>
                        <template #cell(timestamp)="data">
                          {{ formatTimestamp(data.item.timestamp) }}
                        </template>
                      </b-table>
                    </font>
                    <!--
                    {{ dailyChartSelectedItems }}

                    <b-form-group label-cols="4" label-size="sm" label="Min amount" label-align="right" class="mb-2">
                      <b-form-input type="text" size="sm" v-model.trim="settings.chartMinAmount" debounce="600" v-b-popover.hover.bottom="'ETH from'" placeholder="min" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="4" label-size="sm" label="Max amount" label-align="right" class="mb-2">
                      <b-form-input type="text" size="sm" v-model.trim="settings.chartMaxAmount" debounce="600" v-b-popover.hover.bottom="'ETH to'" placeholder="max" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="4" label-size="sm" label="Display" label-align="right" class="mb-2">
                      <b-form-checkbox-group size="sm" v-model="settings.chartTypes">
                        <b-form-checkbox value="bids">Bids</b-form-checkbox>
                        <b-form-checkbox value="asks">Offers</b-form-checkbox>
                        <b-form-checkbox value="sales">Sales</b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>
                    -->

                    <!--
                    <b-form-group label-cols="4" label-size="sm" label="Group by" label-align="right" class="mb-2">
                      <b-form-select size="sm" v-model="settings.chartAttribute" :options="chartAttributes"></b-form-select>
                    </b-form-group>
                    <b-form-group v-if="settings.chartAttribute != null" label-cols="4" label-size="sm" label="Select groups" label-align="right">
                      <font size="-2">
                        <b-table small fixed striped sticky-header="200px" :fields="attributeFields" :items="getSortedTraitsForAttribute(settings.chartAttribute)" head-variant="light">
                          <template #cell(select)="data">
                            <b-form-checkbox v-model="chartAttributeFilter[data.item.attributeOption]" value="true"></b-form-checkbox>
                          </template>
                          <template #cell(attributeOption)="data">
                            {{ slugToTitle(data.item.attributeOption) }}
                          </template>
                        </b-table>
                      </font>
                    </b-form-group>
                    <b-form-group v-if="settings.chartAttribute != null" label-cols="4" label-size="sm" label="" label-align="right" class="mb-2">
                      <b-form-checkbox size="sm" v-model="settings.chartDisplayRemainder" value="true">Display remainder</b-form-checkbox>
                    </b-form-group>
                    -->
                  </b-card>
                </b-col>
              </b-row>
            </div>

          </b-card-body>
        </b-card>
      </b-card>
    </div>
  `,
  props: ['search', 'topic'],
  data: function() {
    return {
      count: 0,
      reschedule: true,
      settings: {
        tabIndex: 0,
        searchString: null,
        searchAccounts: null,
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
        activityMaxItems: 10,

        ownersCurrentPage: 1,
        ownersPageSize: 100,
        ownersSortOption: 'countdsc',

        chartPeriod: { term: 3, termType: "month" },
        chartAttribute: "eyes", // null,
        chartDisplayRemainder: true, // null,
        chartMinAmount: 1,
        chartMaxAmount: 10000,
        chartYaxisMin: 1,
        chartYAsixMax: 1000,
        chartTypes: ['sales'], // ['bids', 'asks', 'sales']
        // imageSize: '240',
      },

      sortOptions: [
        { value: 'idasc', text: '▲ Id' },
        { value: 'iddsc', text: '▼ Id' },
        { value: 'bidasc', text: '▲ Bid' },
        { value: 'biddsc', text: '▼ Bid' },
        { value: 'askasc', text: '▲ Ask' },
        { value: 'askdsc', text: '▼ Ask' },
        { value: 'lastasc', text: '▲ Last Price' },
        { value: 'lastdsc', text: '▼ Last Price' },
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

      ownersSortOptions: [
        { value: 'countasc', text: '▲ Count' },
        { value: 'countdsc', text: 'Count Descending' },
        // { value: 'latestsale', text: 'Latest Sale' },
        // { value: 'earliestsale', text: 'Earliest Sale' },
        // { value: 'latestactivity', text: 'Latest Activity' },
        // { value: 'earliestactivity', text: 'Earliest Activity' },
        { value: 'random', text: 'Random' },
      ],

      ownersFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;' },
        { key: 'owner', label: 'Owner', thStyle: 'width: 15%;' },
        { key: 'count', label: '# Punks', thStyle: 'width: 5%;' },
        { key: 'punks', label: 'Punks', thStyle: 'width: 75%;' },
      ],

      pageSizes: [
        { value: 10, text: '10' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1k' },
        { value: 2500, text: '2.5k' },
        { value: 10000, text: '10k' },
      ],

      attributeFilter: {},
      attributeFields: [
        { key: 'select', label: '', thStyle: 'width: 10%;' },
        { key: 'attributeOption', label: 'Attribute' /*, sortable: true*/ },
        { key: 'attributeTotal', label: 'Count', /*sortable: true,*/ thStyle: 'width: 30%;', thClass: 'text-right', tdClass: 'text-right' },
      ],

      activityMaxItemsOptions: [
        { value: 10, text: '10' },
        { value: 20, text: '20' },
        { value: 50, text: '50' },
        { value: 100, text: '100' },
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

      chartPeriodOptions: [
        { value: { term: 1, termType: "days" }, text: '1dy' },
        { value: { term: 7, termType: "days" }, text: '1wk' },
        { value: { term: 14, termType: "days" }, text: '2wk' },
        { value: { term: 21, termType: "days" }, text: '3wk' },
        { value: { term: 1, termType: "month" }, text: '1mo' },
        { value: { term: 2, termType: "month" }, text: '2mo' },
        { value: { term: 3, termType: "month" }, text: '3mo' },
        { value: { term: 6, termType: "month" }, text: '6mo' },
        { value: { term: 1, termType: "year" }, text: '1yr' },
        { value: { term: 10, termType: "year" }, text: '10yr' },
      ],
      chartAttributeFilter: {
        "3d-glasses": true,
      },

      dailyChartSelectedItems: [],

      dailyDataFields: [
        { key: 'timestamp', label: 'Date', thStyle: 'width: 25%;' },
        { key: 'count', label: 'Sales', thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'total', label: 'Total', thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'average', label: 'Average', thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
      ],

      dailyChartSelectedItemsFields: [
        { key: 'punkId', label: 'Id', thStyle: 'width: 10%;', sortable: true },
        { key: 'image', label: '', thStyle: 'width: 10%;' },
        { key: 'from', label: 'From', thStyle: 'width: 15%;', sortable: true },
        { key: 'to', label: 'To', thStyle: 'width: 15%;', sortable: true },
        { key: 'amount', label: 'Amount', thStyle: 'width: 20%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'timestamp', label: 'Date', thStyle: 'width: 30%;', sortable: true },
      ],

      dailyChartOptions: {
        chart: {
          height: 280,
          width: 280,
          type: "line",
          zoom: {
            type: 'xy',
          },
          // animations: {
          //   initialAnimation: {
          //     enabled: false,
          //   }
          // },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              // console.log("dailyChartSelectedItems: " + JSON.stringify(this.dailyChartSelectedItems));
              // console.log(JSON.stringify(config.dataPointIndex) + " " + JSON.stringify(config.w.config.series[0].data[config.dataPointIndex]));
              this.dailyChartSelectedItems = config.w.config.series[0].data[config.dataPointIndex].items;
              // console.log("dailyChartSelectedItems: " + JSON.stringify(this.dailyChartSelectedItems));
            },
          },
        },
        stroke: {
          width: [0, 2, 5],
          curve: 'smooth'
        },
        fill: {
          opacity: [0.85, 0.25, 1],
          gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
          }
        },
        markers: {
          size: 0
        },
        dataLabels: {
          enabled: false,
        },
        // fill: {
        //   type: 'gradient',
        // },
        // title: {
        //   text: '3D Bubble Chart'
        // },
        tooltip: {
          // custom: ({series, seriesIndex, dataPointIndex, w}) => {
          //   return '<div class="arrow_box" style="background-color: #638596">' +
          //     '<span>' +
          // //       '<img src="images/punks/punk' + w.config.series[seriesIndex].data[dataPointIndex][3].toString().padStart(4, '0') + '.png"></img>' +
          //       series[seriesIndex][dataPointIndex] + 'e' +
          // //       w.config.series[seriesIndex].data[dataPointIndex][3] +
          //       '</span>' +
          //     '</div>'
          // }
        },
        xaxis: {
          // tickAmount: 12,
          type: 'datetime',
          // labels: {
          //   rotate: 0,
          // }
        },
        yaxis: [
          {
            // seriesName: '# Sales',
            title: {
              text: "# Sales",
              // style: {
              //   color: '#00E396',
              // }
            },
            min: this.chartYaxisMin,
            max: this.chartYaxisMax,
            labels: {
              formatter: value => parseInt(value),
            },
          },
          {
            // seriesName: 'Average Sale',
            title: {
              text: "Average ETH",
              // style: {
              //   color: '#00E396',
              // }
            },
            min: this.chartYaxisMin,
            max: this.chartYaxisMax,
            labels: {
              formatter: value => parseInt(value),
            },
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: '#FEB019'
            },
          },
          {
            // seriesName: 'Average Sale',
            title: {
              text: "Average USD",
              // style: {
              //   color: '#00E396',
              // }
            },
            min: this.chartYaxisMin,
            max: this.chartYaxisMax,
            labels: {
              formatter: value => parseInt(value),
            },
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: '#FEB019'
            },
          }
        ],
      },

      chartOptions: {
        chart: {
          height: 280,
          width: 280,
          type: "scatter",
          zoom: {
            type: 'xy',
          },
          // animations: {
          //   initialAnimation: {
          //     enabled: false,
          //   }
          // },
        },
        dataLabels: {
          enabled: false,
        },
        // fill: {
        //   type: 'gradient',
        // },
        // title: {
        //   text: '3D Bubble Chart'
        // },
        tooltip: {
          custom: ({series, seriesIndex, dataPointIndex, w}) => {
            return '<div class="arrow_box" style="background-color: #638596">' +
              '<span>' +
                '<img src="images/punks/punk' + w.config.series[seriesIndex].data[dataPointIndex][3].toString().padStart(4, '0') + '.png"></img>' +
                series[seriesIndex][dataPointIndex] + 'e #' +
                w.config.series[seriesIndex].data[dataPointIndex][3] +
                '</span>' +
              '</div>'
          }
        },
        xaxis: {
          // tickAmount: 12,
          type: 'datetime',
          // labels: {
          //   rotate: 0,
          // }
        },
        yaxis: {
          min: this.chartYaxisMin,
          max: this.chartYaxisMax,
          labels: {
            formatter: value => parseInt(value),
          },
        },
      },


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
    db() {
      return store.getters['cryptoPunks/db'];
    },
    punks() {
      return store.getters['cryptoPunks/punks'];
    },
    exchangeRates() {
      return store.getters['cryptoPunks/exchangeRates'];
    },
    events() {
      return store.getters['cryptoPunks/events'];
    },
    message() {
      return store.getters['cryptoPunks/message'];
    },
    pagedFilteredSortedResults() {
      return this.filteredSortedResults.slice((this.settings.currentPage - 1) * this.settings.pageSize, this.settings.currentPage * this.settings.pageSize);
    },
    filteredResults() {
      const priceFrom = this.settings.priceFrom && parseFloat(this.settings.priceFrom) >= 0 ? parseFloat(this.settings.priceFrom) : null;
      const priceTo = this.settings.priceTo && parseFloat(this.settings.priceTo) >= 0 ? parseFloat(this.settings.priceTo) : null;

      let data = this.settings.randomise ? this.punks.slice(0) : this.punks.slice(0);
      let stage1Data = data;

      if (this.settings.searchString != null && this.settings.searchString.length > 0) {
        const searchTokenIds = this.settings.searchString.split(/[, \t\n]+/).map(s => s.trim());
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
      if (this.settings.searchAccounts != null && this.settings.searchAccounts.length > 0) {
        // console.log("filteredResults() - this.settings.searchAccounts: " + this.settings.searchAccounts);
        const searchAccounts = this.settings.searchAccounts.split(/[, \t\n]+/).map(s => s.toLowerCase());
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
    activities() {
      const priceFrom = this.settings.priceFrom && parseFloat(this.settings.priceFrom) >= 0 ? parseFloat(this.settings.priceFrom) : null;
      const priceTo = this.settings.priceTo && parseFloat(this.settings.priceTo) >= 0 ? parseFloat(this.settings.priceTo) : null;
      let data = this.settings.randomise ? this.punks.slice(0) : this.punks.slice(0);
      let stage1Data = data;
      if (this.settings.searchString != null && this.settings.searchString.length > 0) {
        const searchTokenIds = this.settings.searchString.split(/[, \t\n]+/).map(s => s.trim());
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
      // console.log("stage1Data: " + JSON.stringify(stage1Data.slice(0, 10)));
      function getAttribute(data1, category) {
        for (let attributeIndex in data1.attributes) {
          const attribute = data1.attributes[attributeIndex];
          if (attribute.trait_type == category) {
            return attribute.value;
          }
        }
        return null;
      }
      let stage2Data = [];
      let idFilterMap = {};
      for (let i in stage1Data) {
        const d = stage1Data[i];
        let include = true;
        for (const [key, value] of Object.entries(this.attributeFilter)) {
          const attributeValue = getAttribute(d, key);
          if (!value[attributeValue]) {
            include = false;
            break;
          }
        }
        if (include) {
          stage2Data.push(d);
          idFilterMap[d.punkId] = true;
        }
      }
      // console.log("stage2Data: " + JSON.stringify(stage2Data.slice(0, 10)));
      const idFilters = Object.keys(idFilterMap).map(id => parseInt(id));
      // console.log("idFilters: " + JSON.stringify(idFilters.slice(0, 10)));

      const results = [];
      const bids = [];
      const asks = [];
      const sales = [];

      const minAmount = 0.1;
      const maxAmount = 50000;

      // console.log("events: " + JSON.stringify(this.events.slice(0, 10)));
      const searchAccounts = this.settings.searchAccounts != null && this.settings.searchAccounts.length > 0 ? this.settings.searchAccounts.split(/[, \t\n]+/).map(s => s.toLowerCase()) : null;
      // console.log("activities() - searchAccounts: " + JSON.stringify(searchAccounts));
      for (let event of this.events) {
        let include = idFilters.includes(event.punkId);
        if (include && searchAccounts) {
          let found = false;
          for (searchAccount of searchAccounts) {
            if (event.from != null && event.from.includes(searchAccount)) {
              found = true;
              break;
            } else if (event.to != null && event.to.includes(searchAccount)) {
              found = true;
              break;
            }
          }
          if (!found) {
            include = false;
          }
        }
        if (include && (priceFrom != null || priceTo != null)) {
          let amount = ethers.utils.formatEther(event.amount);
          // console.log("priceFrom: " + priceFrom + ", amount: " + event.amount + " = " + amount);
          if (priceFrom != null && amount < priceFrom) {
            include = false;
          } else if (priceTo != null && amount > priceTo) {
            include = false;
          }
        }
        if (include) {
          if (event.type == "BID_CREATED" /*|| event.type == "BID_REMOVED"*/) {
            bids.push(event);
          } else if (event.type == "ASK_CREATED" /*|| event.type == "ASK_REMOVED"*/) {
            asks.push(event);
          } else if (event.type == "SALE") {
            let amount = ethers.utils.formatEther(event.amount);
            if (amount > minAmount && amount < maxAmount) {
              sales.push(event);
            }
          }
        }
      }
      bids.sort((a, b) => {
        if (a.blockNumber == b.blockNumber) {
          return b.logNumber - a.logNumber;
        } else {
          return b.blockNumber - a.blockNumber;
        }
      });
      results.push({ type: "Bids", title: "Latest Bids", values: bids.slice(0) });
      asks.sort((a, b) => {
        if (a.blockNumber == b.blockNumber) {
          return b.logNumber - a.logNumber;
        } else {
          return b.blockNumber - a.blockNumber;
        }
      });
      results.push({ type: "Asks", title: "Latest Offers", values: asks.slice(0) });
      sales.sort((a, b) => {
        if (a.blockNumber == b.blockNumber) {
          return b.logNumber - a.logNumber;
        } else {
          return b.blockNumber - a.blockNumber;
        }
      });
      results.push({ type: "Sales", title: "Latest Sales", values: sales.slice(0) });
      sales.sort((a, b) => {
        if (a.amount == b.amount) {
          return b.blockNumber - a.blockNumber;
        } else {
          return b.amount - a.amount;
        }
      });
      results.push({ type: "Sales", title: "Highest Sales", values: sales.slice(0) });
      return results;
    },
    chartData() {
      const minAmount = this.settings.chartMinAmount && parseFloat(this.settings.chartMinAmount) >= 0 ? parseFloat(this.settings.chartMinAmount) : 0;
      const maxAmount = this.settings.chartMaxAmount && parseFloat(this.settings.chartMaxAmount) >= 0 ? parseFloat(this.settings.chartMaxAmount) : 1000000;

      const toTimestamp = new Date()/1000;
      const fromTimestamp = moment.unix(toTimestamp).utc().subtract(this.settings.chartPeriod.term, this.settings.chartPeriod.termType).unix();
      console.log("fromTimestamp: " + fromTimestamp + " " + moment.unix(fromTimestamp).utc().format());
      const series = [];

      console.log("chartAttributeFilter: " + JSON.stringify(this.chartAttributeFilter, null, 2));

      if (this.settings.chartTypes.includes("bids")) {
        const bidData = [];
        for (let event of this.activities[0].values) {
          if (event.timestamp >= fromTimestamp && event.timestamp <= toTimestamp) {
            const amount = ethers.utils.formatEther(event.amount);
            if (amount > minAmount && amount < maxAmount) {
              bidData.push([event.timestamp * 1000, amount, 6, event.punkId]);
            }
          }
        }
        console.log("bidData.length: " + bidData.length);
        series.push({ name: "Bids", data: bidData });
      }

      if (this.settings.chartTypes.includes("asks")) {
        const askData = [];
        for (let event of this.activities[1].values) {
          if (event.timestamp >= fromTimestamp && event.timestamp <= toTimestamp) {
            const amount = ethers.utils.formatEther(event.amount);
            if (amount > minAmount && amount < maxAmount) {
              askData.push([event.timestamp * 1000, amount, 6, event.punkId]);
            }
          }
        }
        console.log("askData.length: " + askData.length);
        series.push({ name: "Offers", data: askData });
      }

      if (this.settings.chartTypes.includes("sales")) {
        const salesData = [];
        for (let event of this.activities[2].values) {
          if (event.timestamp >= fromTimestamp && event.timestamp <= toTimestamp) {
            const amount = ethers.utils.formatEther(event.amount);
            if (amount > minAmount && amount < maxAmount) {
              salesData.push([event.timestamp * 1000, amount, 6, event.punkId]);
            }
          }
        }
        series.push({ name: "Sales", data: salesData });
      }
      return series;
    },
    dailyData() {
      const minAmount = this.settings.chartMinAmount && parseFloat(this.settings.chartMinAmount) >= 0 ? parseFloat(this.settings.chartMinAmount) : 0;
      const maxAmount = this.settings.chartMaxAmount && parseFloat(this.settings.chartMaxAmount) >= 0 ? parseFloat(this.settings.chartMaxAmount) : 1000000;
      console.log("chartData1 - minAmount: " + minAmount + ", maxAmount: " + maxAmount);

      const now = moment().unix();
      console.log("now: " + now + " " + moment.unix(now).utc().format());
      const beginPeriod = moment.unix(now).utc().subtract(this.settings.chartPeriod.term, this.settings.chartPeriod.termType).unix();
      console.log("beginPeriod: " + beginPeriod + " " + moment.unix(beginPeriod).utc().format());

      const collator = {};
      for (let event of this.activities[2].values) {
        // console.log(JSON.stringify(event, null, 2));
        if (beginPeriod <= event.timestamp && event.timestamp <= now) {
          // console.log("event.timestamp: " + event.timestamp + " " + moment.unix(event.timestamp).format());
          const bucket = moment.unix(event.timestamp).utc().startOf('day').unix();
          const amount = ethers.utils.formatEther(event.amount);
          // console.log("bucket: " + bucket + " " + moment.unix(bucket).utc().format());
          if (amount >= minAmount && amount <= maxAmount) {
            if (!(bucket in collator)) {
              collator[bucket] = { count: 1, total: ethers.BigNumber.from(event.amount), items: [event] };
            } else {
              collator[bucket].count++;
              collator[bucket].total = collator[bucket].total.add(event.amount);
              collator[bucket].items.push(event);
            }
          } else {
            console.log("Excluding: " + event.punkId + " " + amount);
          }
          // console.log("bucket: " + bucket + " " + moment.unix(bucket).utc().format() + " count: " + collator[bucket].count + ", total: " + collator[bucket].total);
        }
      }
      // series.push({ name: "Sales", data: salesData });
      const results = [];
      for (const [bucket, value] of Object.entries(collator)) {
        const average = value.total.div(value.count);
        results.push({ timestamp: bucket, count: value.count, total: ethers.utils.formatEther(value.total), average: ethers.utils.formatEther(average), items: value.items });
        // console.log("bucket: " + bucket + " " + moment.unix(bucket).utc().format() + " count: " + value.count + ", total: " + value.total);
      }
      results.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });
      return results;
    },
    dailyChartData() {
      const counts = [];
      const averages = [];
      const averagesUSD = [];
      for (const day of this.dailyData) {
        counts.push({ x: day.timestamp * 1000, y: day.count, items: day.items });
        averages.push({ x: day.timestamp * 1000, y: day.average });
        averagesUSD.push({ x: day.timestamp * 1000, y: day.average * this.exchangeRates[day.timestamp] });
      }
      return [
        {
          name: '# Sales',
          type: 'column',
          data: counts,
        }, {
          name: 'Average ETH',
          type: 'area',
          data: averages,
        }, {
          name: 'Average USD',
          type: 'area',
          data: averagesUSD,
        }
      ];
    },
    attributesWithCounts() {
      const collator = {};
      for (const punk of this.punks) {
        for (let attribute of punk.attributes) {
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
    chartAttributes() {
      const results = [];
      results.push({ value: null, text: "None" });
      for (let attribute of Object.keys(this.attributesWithCounts).sort()) {
        results.push({ value: attribute, text: slugToTitle(attribute) });
      }
      return results;
    },
    owners() {
      const collator = {};
      for (result of Object.values(this.filteredResults)) {
        const owner = result.owner;
        if (!collator[owner]) {
          collator[owner] = [result.punkId];
        } else {
          collator[owner].push(result.punkId);
        }
      }
      const results = [];
      for (const key of Object.keys(collator)) {
        const punkIds = collator[key];
        results.push( { owner: key, count: punkIds.length, punkIds: punkIds } );
      }
      return results;
    },
    filteredSortedOwners() {
      let results = this.settings.randomise ? this.owners.slice(0) : this.owners.slice(0);
      if (this.settings.ownersSortOption == 'countasc') {
        results.sort((a, b) => {
          return a.count - b.count;
        });
      } else if (this.settings.ownersSortOption == 'countdsc') {
        results.sort((a, b) => {
          return b.count - a.count;
        });
      } else {
        results.sort(() => {
          return Math.random() - 0.5;
        });
      }
      return results;
    },
    pagedFilteredSortedOwners() {
      return this.filteredSortedOwners.slice((this.settings.ownersCurrentPage - 1) * this.settings.ownersPageSize, this.settings.ownersCurrentPage * this.settings.ownersPageSize);
    },
  },
  methods: {
    updateURL(where) {
      this.$router.push('/cryptopunks/' + where);
    },
    slugToTitle(slug) {
      return slugToTitle(slug);
    },
    hoverInfo(punkId) {
      const punk = this.punks[punkId];
      return punkId +
        ' - Bid: ' + (punk.bid.amount && ethers.utils.formatEther(punk.bid.amount) || 'n/a') +
        '; Offer: ' + (punk.ask.amount && ethers.utils.formatEther(punk.ask.amount) || 'n/a') +
        '; Last: ' + (punk.last.amount && ethers.utils.formatEther(punk.last.amount) || 'n/a') +
        '; Traits: ' + PUNKATTRIBUTES[punkId].map(a => slugToTitle(a.value)).join(', ') +
        '; Owned: ' + punk.owner.substring(0, 10) +
        '; Claimed: ' + punk.claimer.substring(0, 10) +
        '; Wrapped: ' + (punk.wrapped ? 'y' : 'n');
    },
    getPunkDataForIds(punkIds) {
      const results = [];
      for (punkId of punkIds) {
        results.push(this.punks[punkId]);
      }
      return results;
    },
    getSortedTraitsForAttribute(category) {
      const results = [];
      for (let attributeKey in this.attributesWithCounts[category]) {
        const c = this.attributesWithCounts[category][attributeKey];
        results.push({ attributeOption: attributeKey, attributeTotal: c })
      }
      results.sort((a, b) => b.attributeTotal - a.attributeTotal);
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
    chartFilterChange(attribute, option) {
      if (!this.chartAttributeFilter[attribute]) {
        Vue.set(this.chartAttributeFilter, attribute, {});
      }
      if (this.chartAttributeFilter[attribute][option]) {
        Vue.delete(this.chartAttributeFilter[attribute], option);
        if (Object.keys(this.chartAttributeFilter[attribute]) == 0) {
          Vue.delete(this.chartAttributeFilter, attribute);
        }
      } else {
        Vue.set(this.chartAttributeFilter[attribute], option, true);
      }
      // this.chartAttributeFilter = this.chartAttributeFilter;
      console.log("chartFilterChange: " + JSON.stringify(this.chartAttributeFilter));
      // this.recalculate('filterChange');
    },
    formatETHShort(e) {
      if (e) {
        try {
          let float = ethers.utils.formatEther(e);
          if (float > 1000) {
            float = parseFloat(float) / 1000;
            return float.toFixed(1) + "k";
          }
          return parseFloat(float).toFixed(2).replace(/\.0*$/, "");
        } catch (err) {
        }
      }
      return null;
    },
    formatETH(e) {
      try {
        return e ? ethers.utils.commify(ethers.utils.formatEther(e)) : null;
      } catch (err) {
      }
      return e.toFixed(9);
    },
    secondsOld(ts) {
      return parseInt((new Date() / 1000) - ts);
    },
    formatTimestamp(ts) {
      return new Date(ts * 1000).toLocaleString();
    },
    formatTimestampAsDate(ts) {
      return new Date(ts * 1000).toLocaleDateString();
    },
    formatTerm(ts) {
      let secs = parseInt(new Date() / 1000 - ts);
      if (secs < 60) {
        return secs + "s";
      };
      let mins = parseInt(secs / 60);
      if (mins < 60) {
        return mins + "m";
      }
      let hours = parseInt(mins / 60);
      if (hours < 24) {
        return hours + "h";
      }
      let days = parseInt(hours / 24);
      if (days < 365) {
        return days + "d";
      }
      let years = parseInt(days / 365);
      days = days % 365;
      return years + "y" + days + "d";
      return s;
    },
    // NOTE: Fallback if the ENS subgraph becomes unavailable. A bit of work to massage this data into
    // the current db structure, and have to find a way to get timestamps for the events using the blockNumbers
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

          // db0.events.orderBy('blockNumber').uniqueKeys(function(keysArray) {
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
    async loadPunks(syncMode) {
      store.dispatch('cryptoPunks/loadPunks', syncMode);
    },
    async halt() {
      store.dispatch('search/halt');
    },
    exportPunks() {
      const attributeKeys = Object.keys(this.attributesWithCounts).sort();
      const attributeTitles = attributeKeys.map(e => slugToTitle(e));
      const rows = [["PunkId", "Owner", "Bid", "Bid Timestamp", "Ask", "Ask Timestamp", "Last", "Last Timestamp", ...attributeTitles, "URL"]];
      const timestamp = new Date(parseInt((new Date).getTime()/1000)*1000).toISOString().replace('T', '-').replaceAll(':', '-').replace('.000Z', '');
      for (const result of this.filteredSortedResults) {
        const attributeValues = [];
        for (const attributeKey of attributeKeys) {
          let value = null;
          for (const attribute of result.attributes) {
            if (attribute.trait_type == attributeKey) {
              value = attribute.value;
              break;
            }
          }
          attributeValues.push(value == null ? null : slugToTitle(value));
        }
        rows.push([
          result.punkId,
          result.owner,
          result.bid.amount == null ? null : ethers.utils.formatEther(result.bid.amount),
          result.bid.timestamp == null ? null : new Date(parseInt(result.bid.timestamp) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''),
          result.ask.amount == null ? null : ethers.utils.formatEther(result.ask.amount),
          result.ask.timestamp == null ? null : new Date(parseInt(result.ask.timestamp) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''),
          result.last.amount == null ? null : ethers.utils.formatEther(result.last.amount),
          result.last.timestamp == null ? null : new Date(parseInt(result.last.timestamp) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''),
          ...attributeValues,
          "https://cryptopunks.app/cryptopunks/details/" + result.punkId,
        ]);
      }
      let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "aenus_punk_export-" + timestamp + ".csv");
      document.body.appendChild(link); // Required for FF
      link.click(); // This will download the data with the specified file name
    },
    async timeoutCallback() {
      // logDebug("CryptoPunks", "timeoutCallback() count: " + this.count);
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
    if (this.search == "activity") {
      this.settings.tabIndex = 0;
    } else if (this.search == "punks") {
      this.settings.tabIndex = 1;
    } else if (this.search == "owners") {
      this.settings.tabIndex = 2;
    } else if (this.search == "chart") {
      this.settings.tabIndex = 3;
    }
    store.dispatch('cryptoPunks/loadPunks', 'initial');
    this.reschedule = true;
    // logDebug("CryptoPunks", "Calling timeoutCallback()");
    this.timeoutCallback();
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
    db: {
      name: "aenuspunksdb",
      version: 1,
      schemaDefinition: {
        punks: '&punkId,owner,claimer,timestamp,*traits',
      },
      updated: null,
    },
    filter: {
      searchString: "^[0-9]*$",
      priceFrom: 0.01,
      priceTo: 12.34,
    },
    punks: [],
    exchangeRates: {},
    tempPunks: [],
    punks: [],
    events: [],
    sales: [],
    message: null,
    halt: false,
    params: null,
    executing: false,
  },
  getters: {
    config: state => state.config,
    db: state => state.db,
    filter: state => state.filter,
    punks: state => state.punks,
    exchangeRates: state => state.exchangeRates,
    punks: state => state.punks,
    events: state => state.events,
    sales: state => state.sales,
    message: state => state.message,
    params: state => state.params,
  },
  mutations: {
    async loadPunks(state, syncMode) {
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
          const sortedEvents = punk.events.sort(function(a, b) {
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
          // let latestTimestamp = parseInt(latestRecord.timestamp) - 2 * 60 * 60;
          let latestTimestamp = parseInt(latestRecord.timestamp);
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
          return Object.keys(results).map(id => parseInt(id));
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
        const punksFromDB = await db0.punks.orderBy("punkId").toArray();
        const punks = [];
        const events = [];
        for (const punk of punksFromDB) {
          for (let event of punk.events) {
            if (event.type == "BID_CREATED" || event.type == "ASK_CREATED" || event.type == "SALE") {
              events.push({
                punkId: punk.punkId,
                type: event.type,
                from: event.from,
                to: event.to,
                amount: event.amount,
                blockNumber: event.blockNumber,
                logNumber: event.logNumber,
                timestamp: event.timestamp,
                txHash: event.txHash,
              });
            }
          }
          punks.push({
            punkId: punk.punkId,
            owner: punk.owner,
            claimer: punk.claimer,
            timestamp: punk.timestamp,
            // traits: punk.traits,
            wrapped: punk.wrapped,
            bid: punk.bid,
            ask: punk.ask,
            last: punk.last,
            attributes: [...PUNKATTRIBUTES[punk.punkId], { trait_type: 'trait-count', value: PUNKATTRIBUTES[punk.punkId].length }],
            // events: punk.events,
          });
        }
        state.punks = punks;
        state.events = events;
        // console.log(JSON.stringify(records, null, 2));
        // console.log(JSON.stringify(events.slice(0, 100), null, 2));
      }

      // --- loadPunks() start ---
      logInfo("cryptoPunksModule", "mutations.loadPunks() - syncMode: " + syncMode);
      state.message = "Syncing";
      const debug = null; // [9863];

      if (syncMode == 'full') {
        logInfo("cryptoPunksModule", "mutations.loadPunks() - deleting db");
        Dexie.delete(state.db.name);
      }

      const db0 = new Dexie(state.db.name);
      db0.version(state.db.version).stores(state.db.schemaDefinition);

      const traitsLookup = {};
      for (const [attribute, traits] of Object.entries(PUNKTRAITS)) {
        for (trait of traits) {
          // const title = trait.replace(/-/g, ' ').replace(/\b[a-z]/g, function() { return arguments[0].toUpperCase(); }).replace('3d', '3D').replace('Vr', 'VR');
          // console.log(attribute + " - " + trait + " " + title);
          traitsLookup[trait] = attribute;
        }
      }

      state.exchangeRates = await fetchExchangeRates();
      logInfo("cryptoPunksModule", "mutations.loadPunks() exchangeRates: " + JSON.stringify(state.exchangeRates).substring(0, 60) + " ...");

      // if (syncMode == 'initial') {
      //   logInfo("cryptoPunksModule", "mutations.loadPunks() - initial refreshResultsFromDB()");
      //   await refreshResultsFromDB();
      // }

      const latestEventPunkIds = debug ? debug : await fetchLatestEvents();
      logInfo("cryptoPunksModule", "mutations.loadPunks() - latestEventPunkIds: " + JSON.stringify(latestEventPunkIds));

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
      logInfo("cryptoPunksModule", "mutations.loadPunks() - refreshing from db");
      await refreshResultsFromDB();
      state.db.updated = new Date();
      state.message = null;
      state.halt = false;
      db0.close();
      logInfo("cryptoPunksModule", "mutations.loadPunks() - end");
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    loadPunks(context, syncMode) {
      // logInfo("cryptoPunksModule", "actions.loadPunks() - syncMode: " + syncMode);
      context.commit('loadPunks', syncMode);
    },
    halt(context) {
      // logInfo("cryptoPunksModule", "actions.halt()");
      context.commit('halt');
    },
  },
};
