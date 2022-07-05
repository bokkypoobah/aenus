const ENSSales = {
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
            <b-tab title="List" @click="updateURL('list');">
            </b-tab>
            <b-tab title="Chart" @click="updateURL('chart');">
            </b-tab>
          </b-tabs>

          <!--
          Later on - top sellers and buyers
          {{ accounts }}
          -->

          <b-card-body class="m-0 p-1">
            <!-- Main Toolbar -->
            <div class="d-flex flex-wrap m-0 p-0">
              <div class="mt-1" style="max-width: 150px;">
                <b-form-input type="text" size="sm" :value="filter.searchString" @change="updateFilter('searchString', $event)" debounce="600" v-b-popover.hover.top="'Pro mode regex, or simple search string'" placeholder="🔍 {regex}"></b-form-input>
              </div>
              <div class="mt-1">
                <b-button size="sm" :pressed.sync="settings.filterToolbar" variant="link" v-b-popover.hover.top="'Amateur mode filters'"><span v-if="settings.syncToolbar"><b-icon-caret-up-fill shift-v="+1" font-scale="1.0"></b-icon-caret-up-fill></span><span v-else><b-icon-caret-down-fill shift-v="+1" font-scale="1.0"></b-icon-caret-down-fill></span></b-button>
              </div>
              <div class="mt-1 pl-1" style="max-width: 150px;">
                <b-form-input type="text" size="sm" :value="filter.searchAccounts" @change="updateFilter('searchAccounts', $event)" debounce="600" v-b-popover.hover.top="'List of account search strings'" placeholder="🔍 0x12... ..."></b-form-input>
              </div>
              <div class="mt-1 pl-1" style="max-width: 80px;">
                <b-form-input type="text" size="sm" :value="filter.priceFrom" @change="updateFilter('priceFrom', $event)" debounce="600" v-b-popover.hover.top="'Price from, ETH'" placeholder="min"></b-form-input>
              </div>
              <div class="mt-1">
                -
              </div>
              <div class="mt-1 pr-1" style="max-width: 80px;">
                <b-form-input type="text" size="sm" :value="filter.priceTo" @change="updateFilter('priceTo', $event)" debounce="600" v-b-popover.hover.top="'Price to, ETH'" placeholder="max"></b-form-input>
              </div>
              <div class="mt-1 pr-1 flex-grow-1">
              </div>
              <div class="mt-1 pr-1">
                <b-input-group class="mb-2" style="height: 0;">
                  <template #append>
                    <b-button size="sm" :pressed.sync="settings.syncToolbar" variant="outline-primary" v-b-popover.hover.top="'Sync settings'"><span v-if="settings.syncToolbar"><b-icon-gear-fill shift-v="+1" font-scale="1.0"></b-icon-gear-fill></span><span v-else><b-icon-gear shift-v="+1" font-scale="1.0"></b-icon-gear></span></b-button>
                  </template>
                  <b-button v-if="!sync.inProgress" size="sm" @click="loadSales('partial')" variant="primary" v-b-popover.hover.top="'Partial Sync'" style="min-width: 80px; ">Sync</b-button>
                  <b-button v-if="sync.inProgress" size="sm" @click="halt" variant="primary" v-b-popover.hover.top="'Halt'" style="min-width: 80px; ">Syncing</b-button>
                </b-input-group>
              </div>
              <div class="mt-1 pr-1 flex-grow-1">
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1 pr-1">
                <b-button size="sm" @click="exportSales" :disabled="filteredSortedSales.length == 0" variant="link" v-b-popover.hover.top="'Export to CSV for easy import into a spreadsheet'">Export</b-button>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1 pr-1">
                <b-form-select size="sm" v-model="settings.sortOption" :options="sortOptions" v-b-popover.hover.top="'Yeah. Sort'"></b-form-select>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1 pr-1">
                <font size="-2" v-b-popover.hover.top="formatTimestamp(earliestEntry) + ' to ' + formatTimestamp(latestEntry)">{{ filteredSortedSales.length }}</font>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1 pr-1">
                <b-pagination size="sm" v-model="settings.currentPage" :total-rows="filteredSortedSales.length" :per-page="settings.pageSize" style="height: 0;"></b-pagination>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1">
                <b-form-select size="sm" v-model="settings.pageSize" :options="pageSizes" v-b-popover.hover.top="'Page size'"></b-form-select>
              </div>
            </div>

            <!-- Filter Toolbar -->
            <div v-if="settings.filterToolbar" class="d-flex flex-wrap m-0 p-0 pb-1">
              <div class="mt-1 pr-1">
                <b-form-select size="sm" v-model="settings.type" :options="typeOptions" v-b-popover.hover.top="'Type'"></b-form-select>
              </div>
              <div class="mt-1">
                <b-form-select size="sm" v-model="settings.lengthFrom" :options="lengthFromOptions" v-b-popover.hover.top="'Length from'"></b-form-select>
              </div>
              <div class="mt-1">
                -
              </div>
              <div class="mt-1">
                <b-form-select size="sm" v-model="settings.lengthTo" :options="lengthToOptions" v-b-popover.hover.top="'Length from'"></b-form-select>
              </div>
              <div class="mt-2 pl-1">
                <b-form-checkbox size="sm" v-model="settings.palindrome" value="true">Palindrome</b-form-checkbox>
              </div>
            </div>

            <!-- Sync Toolbar -->
            <div v-if="settings.syncToolbar" class="d-flex flex-wrap m-0 p-0 pb-1">
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
            </div>

            <!-- Listing -->
            <b-table v-if="settings.tabIndex == 0" small striped hover :fields="salesFields" :items="pagedFilteredSortedSales" table-class="w-auto" class="m-2 p-2">
              <template #cell(timestamp)="data">
                {{ formatTimestamp(data.item.timestamp) }}
              </template>
              <template #cell(name)="data">
                <b-link :id="'popover-target-name-' + data.index">
                  {{ data.item.name }}
                </b-link>
                <b-popover :target="'popover-target-name-' + data.index" placement="right">
                  <template #title>{{ encodeURIComponent(data.item.name.substring(0, 64)) }}:</template>
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
                  <b-link v-if="data.item.name" :href="'https://etherscan.io/enslookup-search?search=' + data.item.name.replace(/\.eth.*$/, '')" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                    EtherScan
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://duckduckgo.com/?q=' + data.item.name.replace(/\.eth.*$/, '')" v-b-popover.hover="'Search name in duckduckgo.com'" target="_blank">
                    DuckDuckGo
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://www.google.com/search?q=' + data.item.name.replace(/\.eth.*$/, '')" v-b-popover.hover="'Search name in google.com'" target="_blank">
                    Google
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://twitter.com/search?q=' + data.item.name.replace(/\.eth.*$/, '')" v-b-popover.hover="'Search name in twitter.com'" target="_blank">
                    Twitter
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://wikipedia.org/wiki/' + data.item.name.replace(/\.eth.*$/, '')" v-b-popover.hover="'Search name in wikipedia.org'" target="_blank">
                    Wikipedia
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://en.wiktionary.org/wiki/' + data.item.name.replace(/\.eth.*$/, '')" v-b-popover.hover="'Search name in wiktionary.org'" target="_blank">
                    Wiktionary
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://thesaurus.yourdictionary.com/' + data.item.name.replace(/\.eth.*$/, '')" v-b-popover.hover="'Search name in thesaurus.yourdictionary.com'" target="_blank">
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
              <template #cell(price)="data">
                {{ data.item.price }}
              </template>
              <template #cell(priceUSD)="data">
                {{ priceUSD(data.item.price, data.item.timestamp) }}
              </template>
            </b-table>

            <div v-if="settings.tabIndex == 1">
              <b-row>
                <b-col cols="7">
                  <div v-if="true">
                    <b-card body-class="m-2 p-1" header-class="p-1" class="mt-2 mr-1" style="height: 550px;">
                      <template #header>
                        <h6 class="mb-0">ENS Daily Activity</h6>
                      </template>
                      <apexchart :options="dailyChartOptions" :series="dailyChartData" class="w-100"></apexchart>
                    </b-card>
                  </div>
                  <div v-if="true">
                      <b-card body-class="m-2 p-1" header-class="p-1" class="mt-2 mr-1" style="height: 550px;">
                        <template #header>
                          <h6 class="mb-0">ENS Activity</h6>
                        </template>
                        <apexchart :options="chartOptions" :series="chartData" class="w-100"></apexchart>
                      </b-card>
                  </div>
                </b-col>
                <b-col cols="5">
                  <b-card body-class="m-0 p-0" header-class="p-1 px-3" class="mt-2" style="height: 550px;">
                    <template #header>
                      <h6 class="mb-0">Sales For Selected Day</h6>
                    </template>
                    <p v-if="dailyChartSelectedItems.length == 0" class="mt-2 p-2">
                      Click on a daily column to view the sales for the day
                    </p>
                    <font size="-2">
                    <!-- <b-table v-if="dailyChartSelectedItems.length > 0" small fixed striped sticky-header="500px" :items="dailyChartSelectedItems" head-variant="light"> -->
                      <b-table v-if="dailyChartSelectedItems.length > 0" small fixed striped sticky-header="500px" :fields="dailyChartSelectedItemsFields" :items="dailyChartSelectedItems" head-variant="light">
                        <template #cell(name)="data">
                          <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                            {{ (data.item.name && data.item.name.length > 20) ? (data.item.name.substr(0, 17) + '...') : data.item.name }}
                          </b-link>
                        </template>
                        <template #cell(from)="data">
                          <b-link :href="'https://opensea.io/' + data.item.from" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                            {{ data.item.from.substring(0, 6) }}
                          </b-link>
                        </template>
                        <template #cell(to)="data">
                          <b-link :href="'https://opensea.io/' + data.item.to" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                            {{ data.item.to.substring(0, 6) }}
                          </b-link>
                        </template>
                        <template #cell(timestamp)="data">
                          {{ formatTimestamp(data.item.timestamp) }}
                        </template>
                        <template #cell(txHash)="data">
                          <b-link :href="'https://etherscan.io/tx/' + data.item.txHash" v-b-popover.hover.bottom="'View in Etherscan'" target="_blank">
                            {{ data.item.txHash.substring(0, 8) }}
                          </b-link>
                        </template>
                      </b-table>
                    </font>
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
        filterToolbar: true, // TODO false
        syncToolbar: false,
        type: null,
        lengthFrom: null,
        lengthTo: null,
        palindrome: false,
        sortOption: 'latestsale',
        // randomise: false,
        pageSize: 100,
        currentPage: 1,
      },

      dailyChartSelectedItems: [],

      typeOptions: [
        { value: null, text: '(all)' },
        {
          label: 'Numerals',
          options: [
            { value: '^[0-9]*$', text: 'Latin Numerals - 0 to 9' },
            { value: '^[0-9a-fx]*$', text: 'Hexadecimal Numerals - 0 to 9, a to f, x' },
            { value: '^[\u0660-\u0669]*$', text: 'Arabic Numerals - ٠ to ٩' },
            { value: '^[\u09E6-\u09EF]*$', text: 'Bengali Numerals - ০, ১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯' },
            { value: '^[〇一二三四五六七八九十百千万]*$', text: 'Chinese Numerals - 〇, 一, 二, 三, 四, 五, 六, 七, 八, 九, 十, 百, 千, 万' },
            { value: '^[\u0966-\u096F]*$', text: 'Devanagari (Hindi) Numerals - ०, १, २, ३, ४, ५, ६, ७, ८, ९' },
            { value: '^[\u17E0-\u17E9]*$', text: 'Khmer Numerals - ០, ១, ២, ៣, ៤, ៥, ៦, ៧, ៨, ៩' },
            { value: '^[᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙]*$', text: 'Mongolian Numerals - ᠐, ᠑, ᠒, ᠓, ᠔, ᠕, ᠖, ᠗, ᠘, ᠙' },
            { value: '^[영일이삼사오육칠팔구]*$', text: 'Sino-Korean Numerals - 영, 일, 이, 삼, 사, 오, 육, 칠, 팔, 구' },
            { value: '^[\u0E50-\u0E59]*$', text: 'Thai Numerals - ๐ to ๙' },
          ],
        },
        {
          label: 'Alphabets',
          options: [
            { value: '^[a-z]*$', text: 'a to z' },
          ],
        },
        {
          label: 'Alphanumerics',
          options: [
            { value: '^[0-9a-z]*$', text: '0 to 9, a to z' },
          ],
        },
        {
          label: 'Specials',
          options: [
            { value: '^[0-3][0-9][0-9]°$', text: '000° to 359° (will incorrectly include 360° to 399°)' },
          ],
        },
      ],

      lengthFromOptions: [
        { value: null, text: 'min' },
        { value: '3', text: '3' },
        { value: '4', text: '4' },
        { value: '5', text: '5' },
        { value: '6', text: '6' },
        { value: '7', text: '7' },
        { value: '8', text: '8' },
        { value: '9', text: '9' },
        { value: '10', text: '10' },
        { value: '20', text: '20' },
      ],

      lengthToOptions: [
        { value: null, text: 'max' },
        { value: '3', text: '3' },
        { value: '4', text: '4' },
        { value: '5', text: '5' },
        { value: '6', text: '6' },
        { value: '7', text: '7' },
        { value: '8', text: '8' },
        { value: '9', text: '9' },
        { value: '10', text: '10' },
        { value: '20', text: '20' },
      ],

      sortOptions: [
        { value: 'nameasc', text: '▲ Name' },
        { value: 'namedsc', text: '▼ Name' },
        { value: 'priceasc', text: '▲ Price' },
        { value: 'pricedsc', text: '▼ Price' },
        { value: 'latestsale', text: 'Latest Sale' },
        { value: 'earliestsale', text: 'Earliest Sale' },
        // { value: 'random', text: 'Random' },
      ],

      pageSizes: [
        { value: 10, text: '10' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1k' },
        { value: 2500, text: '2.5k' },
        { value: 10000, text: '10k' },
      ],

      periods: [
        { value: { term: 1, termType: "days" }, text: '1d' },
        { value: { term: 7, termType: "days" }, text: '1wk' },
        { value: { term: 14, termType: "days" }, text: '2wk' },
        { value: { term: 21, termType: "days" }, text: '3wk' },
        { value: { term: 1, termType: "month" }, text: '1mo' },
        { value: { term: 2, termType: "month" }, text: '2mo' },
        { value: { term: 3, termType: "month" }, text: '3mo' },
        { value: { term: 6, termType: "month" }, text: '6mo' },
        { value: { term: 1, termType: "year" }, text: '1yr' },
        { value: { term: 0, termType: "days" }, text: 'Reset' },
      ],

      salesFields: [
        { key: 'timestamp', label: 'Timestamp', thStyle: 'width: 20%;' },
        { key: 'name', label: 'Name', thStyle: 'width: 20%;' },
        { key: 'from', label: 'From', thStyle: 'width: 15%;' },
        { key: 'to', label: 'To', thStyle: 'width: 15%;' },
        { key: 'price', label: 'ETH', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'priceUSD', label: 'USD', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'orderSide', label: 'OrderSide', thStyle: 'width: 5%;' },
        { key: 'txHash', label: 'Tx', thStyle: 'width: 15%;' },
      ],

      dailyChartSelectedItemsFields: [
        { key: 'name', label: 'Name', thStyle: 'width: 30%;', sortable: true },
        { key: 'from', label: 'From', thStyle: 'width: 10%;', sortable: true },
        { key: 'to', label: 'To', thStyle: 'width: 10%;', sortable: true },
        { key: 'price', label: 'Price', thStyle: 'width: 10%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'timestamp', label: 'Timestamp', thStyle: 'width: 25%;', sortable: true },
        { key: 'txHash', label: 'Tx', thStyle: 'width: 15%;', sortable: true },
      ],

      chartOptions: {
        chart: {
          // height: 280,
          // width: 280,
          type: "scatter",
          zoom: {
            type: 'xy',
          },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          custom: ({series, seriesIndex, dataPointIndex, w}) => {
            return '<div class="arrow_box" style="background-color: #ffffff">' +
                '<span>' +
                  w.config.series[seriesIndex].data[dataPointIndex][3] + ' ' +
        //         '<img src="images/punks/punk' + w.config.series[seriesIndex].data[dataPointIndex][3].toString().padStart(4, '0') + '.png"></img>' +
                series[seriesIndex][dataPointIndex] + 'e' +
        //         w.config.series[seriesIndex].data[dataPointIndex][3] +
                '</span>' +
              '</div>'
          }
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          // min: this.chartYaxisMin,
          // max: this.chartYaxisMax,
          labels: {
            formatter: value => parseFloat(value).toFixed(2),
          },
        },
      },

      dailyChartOptions: {
        chart: {
          // height: 280,
          // width: 280,
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
        // tooltip: {
        //   custom: ({series, seriesIndex, dataPointIndex, w}) => {
        //     return '<div class="arrow_box" style="background-color: #ffffff">' +
        //       '<span>BLAH' +
        //   // //       '<img src="images/punks/punk' + w.config.series[seriesIndex].data[dataPointIndex][3].toString().padStart(4, '0') + '.png"></img>' +
        //   //       series[seriesIndex][dataPointIndex] + 'e' +
        //   // //       w.config.series[seriesIndex].data[dataPointIndex][3] +
        //         '</span>' +
        //       '</div>'
        //   }
        // },
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
            // min: this.chartYaxisMin,
            // max: this.chartYaxisMax,
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
            // min: this.chartYaxisMin,
            // max: this.chartYaxisMax,
            labels: {
              formatter: value => parseFloat(value).toFixed(2),
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
            // min: this.chartYaxisMin,
            // max: this.chartYaxisMax,
            labels: {
              formatter: value => parseFloat(value).toFixed(2),
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
      return store.getters['ensSales/config'];
    },
    filter() {
      return store.getters['ensSales/filter'];
    },
    sync() {
      return store.getters['ensSales/sync'];
    },
    sales() {
      return store.getters['ensSales/sales'];
    },
    exchangeRates() {
      return store.getters['ensSales/exchangeRates'];
    },
    earliestEntry() {
      let timestamp = null;
      for (const sale of this.sales) {
        if (timestamp == null || timestamp > sale.timestamp) {
          timestamp = sale.timestamp;
        }
      }
      return timestamp;
    },
    latestEntry() {
      let timestamp = null;
      for (const sale of this.sales) {
        if (timestamp == null || timestamp < sale.timestamp) {
          timestamp = sale.timestamp;
        }
      }
      return timestamp;
    },
    filteredSales() {
      let results;
      if (this.settings.type == null && this.settings.lengthFrom == null && this.settings.lengthTo == null && !this.settings.palindrome) {
        results = this.sales;
      } else {
        results = [];
        const regex = this.settings.type != null ? new RegExp(this.settings.type, 'i') : null;
        const lengthFrom = this.settings.lengthFrom && parseInt(this.settings.lengthFrom) >= 3 ? parseInt(this.settings.lengthFrom) : null;
        const lengthTo = this.settings.lengthTo && parseInt(this.settings.lengthTo) >= 3 ? parseInt(this.settings.lengthTo) : null;
        for (const sale of this.sales) {
          let include = true;
          const name = sale.name && sale.name.replace(/\.eth.*$/, '') || null;
          if (regex && !regex.test(name)) {
            include = false;
          }
          if (include && lengthFrom != null) {
            if (name == null || name.length < lengthFrom) {
              include = false;
            }
          }
          if (include && lengthTo != null) {
            if (name == null || name.length > lengthTo) {
              include = false;
            }
          }
          if (include && this.settings.palindrome) {
            if (name == null) {
              include = false;
            } else {
              const reverse = name.split('').reverse().join('');
              if (name !== reverse) {
                include = false;
              }
            }
          }
          if (include) {
            results.push(sale);
          }
        }
      }
      return results;
    },
    filteredSortedSales() {
      let results = this.filteredSales;
      if (this.settings.sortOption == 'nameasc') {
        results.sort((a, b) => ('' + a.name).localeCompare(b.name));
      } else if (this.settings.sortOption == 'namedsc') {
        results.sort((a, b) => ('' + b.name).localeCompare(a.name));
      } else if (this.settings.sortOption == 'priceasc') {
        results.sort((a, b) => {
          if (a.price == b.price) {
            return ('' + a.name).localeCompare(b.name);
          } else {
            return a.price - b.price;
          }
        });
      } else if (this.settings.sortOption == 'pricedsc') {
        results.sort((a, b) => {
          if (a.price == b.price) {
            return ('' + a.name).localeCompare(b.name);
          } else {
            return b.price - a.price;
          }
        });
      } else if (this.settings.sortOption == 'latestsale') {
        results.sort((a, b) => {
          if (a.timestamp == b.timestamp) {
            return ('' + a.name).localeCompare(b.name);
          } else {
            return b.timestamp - a.timestamp;
          }
        });
      } else if (this.settings.sortOption == 'earliestsale') {
        results.sort((a, b) => {
          if (a.timestamp == b.timestamp) {
            return ('' + a.name).localeCompare(b.name);
          } else {
            return a.timestamp - b.timestamp;
          }
        });
      }
      return results;
    },
    pagedFilteredSortedSales() {
      return this.filteredSortedSales.slice((this.settings.currentPage - 1) * this.settings.pageSize, this.settings.currentPage * this.settings.pageSize);
    },
    accounts() {
      const sellers = {};
      const buyers = {};
      for (const sale of this.sales.slice(0, 10)) {
        console.log("sale: " + JSON.stringify(sale));
        if (!(sale.from in sellers)) {
          sellers[sale.from] = { count: 1, total: sale.price, items: [sale] };
        } else {
          sellers[sale.from].count++;
          sellers[sale.from].total = parseFloat(sellers[sale.from].total) + sale.price;
          sellers[sale.from].items.push(sale);
        }
        if (!(sale.to in buyers)) {
          buyers[sale.to] = { count: 1, total: sale.price, items: [sale] };
        } else {
          buyers[sale.to].count++;
          buyers[sale.to].total = parseFloat(buyers[sale.to].total) + sale.price;
          buyers[sale.to].items.push(sale);
        }
      }
      const sellersData = [];
      for (const [account, value] of Object.entries(sellers)) {
        const average = value.total / value.count;
        sellersData.push({ account: account, count: value.count, total: value.total, average: average, items: value.items });
        console.log("seller: " + account + " count: " + value.count + ", total: " + value.total);
      }
      sellersData.sort((a, b) => {
        return b.total - a.total;
      });
      const buyersData = [];
      for (const [account, value] of Object.entries(buyers)) {
        const average = value.total / value.count;
        buyersData.push({ account: account, count: value.count, total: value.total, average: average, items: value.items });
        console.log("buyer: " + account + " count: " + value.count + ", total: " + value.total);
      }
      buyersData.sort((a, b) => {
        return b.total - a.total;
      });
      return { sellers: sellersData, buyers: buyersData };
    },
    chartData() {
      const results = [];
      const data = [];
      for (const sale of this.filteredSales) {
        data.push([sale.timestamp * 1000, sale.price, 6, sale.name]);
      }
      results.push({ name: "Sales", data: data });
      return results;
    },
    dailyData() {
      const collator = {};
      for (const sale of this.filteredSales) {
        const bucket = moment.unix(sale.timestamp).utc().startOf('day').unix();
        if (!(bucket in collator)) {
          collator[bucket] = { count: 1, total: sale.price, items: [sale] };
        } else {
          collator[bucket].count++;
          collator[bucket].total = parseFloat(collator[bucket].total) + sale.price;
          collator[bucket].items.push(sale);
        }
      }
      const results = [];
      for (const [bucket, value] of Object.entries(collator)) {
        const average = value.total / value.count;
        results.push({ timestamp: bucket, count: value.count, total: value.total, average: average, items: value.items });
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
  },
  methods: {
    updateURL(where) {
      this.$router.push('/enssales/' + where);
    },
    formatETH(e) {
      try {
        return e ? ethers.utils.commify(ethers.utils.formatEther(e)) : null;
      } catch (err) {
      }
      return e.toFixed(9);
    },
    formatTimestamp(ts) {
      if (ts != null) {
        return new Date(ts * 1000).toLocaleString();
      }
      return null;
    },
    formatTimestampAsDate(ts) {
      if (ts != null) {
        return moment.unix(ts).utc().format("MMMDD");
      }
      return null;
    },
    priceUSD(price, timestamp) {
      const bucket = moment.unix(timestamp).utc().startOf('day').unix();
      const exchangeRate = this.exchangeRates[bucket];
      return ethers.utils.commify(parseFloat(price * exchangeRate).toFixed(0));
    },
    updateConfig(field, config) {
      // logInfo("ENSSales", "updateConfig: " + field + " => " + JSON.stringify(config));
      const configUpdate = {};
      configUpdate[field] = config;
      store.dispatch('ensSales/updateConfig', configUpdate);
    },
    updateFilter(field, filter) {
      // logInfo("ENSSales", "updateFilter: " + field + " => " + JSON.stringify(filter));
      const filterUpdate = {};
      filterUpdate[field] = filter;
      store.dispatch('ensSales/updateFilter', filterUpdate);
    },
    async loadSales(syncMode) {
      // logInfo("ENSSales", "loadSales - syncMode: " + syncMode);
      store.dispatch('ensSales/loadSales', syncMode);
    },
    async halt() {
      store.dispatch('ensSales/halt');
    },
    exportSales() {
      const rows = [
          ["Timestamp", "Name", "Length", "From", "To", "Price", "Tx"],
      ];
      const timestamp = new Date(parseInt((new Date).getTime()/1000)*1000).toISOString().replace('T', '-').replaceAll(':', '-').replace('.000Z', '');
      for (const result of this.filteredSortedSales) {
        rows.push([
          new Date(parseInt(result.timestamp) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''),
          result.name,
          result.name && result.name.replace(/\.eth.*$/, "").length || null,
          result.from,
          result.to,
          result.price,
          result.txHash,
        ]);
      }
      let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "aenus_enssales_export-" + timestamp + ".csv");
      document.body.appendChild(link); // Required for FF
      link.click(); // This will download the data with the specified file name
    },
    async timeoutCallback() {
      logDebug("ENSSales", "timeoutCallback() count: " + this.count);

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
    logDebug("ENSSales", "beforeDestroy()");
  },
  mounted() {
    logInfo("ENSSales", "mounted() $route: " + JSON.stringify(this.$route.params) + ", props['search']: " + this.search + ", props['topic']: " + this.topic);
    if (this.search == "list") {
      this.settings.tabIndex = 0;
    } else if (this.search == "chart") {
      this.settings.tabIndex = 1;
    }
    store.dispatch('ensSales/loadSales', 'mounted');

    this.reschedule = true;
    logDebug("ENSSales", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const ensSalesModule = {
  namespaced: true,
  state: {
    constants: {
      reservoirSalesV3BatchSize: 50,
      currency: 'USD',
    },
    config: {
      period: { term: 1, termType: "month" },
    },
    filter: {
      searchString: null,
      searchAccounts: null,
      priceFrom: null,
      priceTo: null,
    },
    sync: {
      inProgress: false,
      error: false,
      now: null,
      from: null,
      to: null,
      daysExpected: null,
      daysInCache: null,
      processing: null,
    },
    sales: [],
    exchangeRates: {},
    halt: false,
    params: null,
    db: {
      name: "aenusenssalesdb",
      version: 1,
      definition: {
        sales: '[chainId+contract+tokenId],chainId,contract,tokenId,name,from,to,price,timestamp',
      },
    },
  },
  getters: {
    config: state => state.config,
    filter: state => state.filter,
    sync: state => state.sync,
    sales: state => state.sales,
    exchangeRates: state => state.exchangeRates,
    params: state => state.params,
  },
  mutations: {
    // --- loadSales() ---
    async loadSales(state, { syncMode, configUpdate, filterUpdate }) {
      // --- loadSales() functions start ---
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
        }).then(handleErrors)
          .then(response => response.json())
          .then(data => processRegistrations(data.data.registrations))
          .catch(function(error) {
             console.log("ERROR fetchNamesByTokenIds: " + error);
             state.sync.error = true;
             data = [];
          });
        // console.log(JSON.stringify(data, null, 2));
        return data;
      }
      async function processSales(data) {
        const searchForNamesByTokenIds = data.sales
          .map(sale => sale.token.tokenId)
          .map(tokenId => "0x" + new BigNumber(tokenId, 10).toString(16));
        const namesByTokenIds = await fetchNamesByTokenIds(searchForNamesByTokenIds);
        const saleRecords = [];
        if (!state.sync.error) {
          let count = 0;
          const chainId = (store.getters['connection/network'] && store.getters['connection/network'].chainId) || 1;
          for (const sale of data.sales) {
            // if (count == 0) {
            //   logInfo("ensSalesModule", "mutations.loadSales().processSales() " + new Date(sale.timestamp * 1000).toLocaleString() + " " + (sale.token.name ? sale.token.name : "(null)") + ", price: " + sale.price + ", from: " + sale.from.substr(0, 10) + ", to: " + sale.to.substr(0, 10));
            // }
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
        return saleRecords.length;
      }
      // async function fetchSales(startTimestamp, endTimestamp) {
      //   logInfo("ensSalesModule", "mutations.loadSales().fetchSales() - " + startTimestamp.toLocaleString() + " - " + endTimestamp.toLocaleString());
      //   const url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85&limit=" + state.config.reservoirSalesV3BatchSize + "&startTimestamp=" + parseInt(startTimestamp / 1000) + "&endTimestamp="+ parseInt(endTimestamp / 1000);
      //   let continuation = null;
      //   do {
      //     let url1;
      //     if (continuation == null) {
      //       url1 = url;
      //     } else {
      //       url1 = url + "&continuation=" + continuation;
      //     }
      //     const data = await fetch(url1)
      //       .then(response => response.json());
      //     await processSales(data);
      //     continuation = data.continuation;
      //   } while (continuation != null);
      // }
      async function updateDBFromAPI() {
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI()");
        const earliestEntry = await db0.sales.orderBy("timestamp").first();
        const earliestDate = earliestEntry ? earliestEntry.timestamp : null;
        const latestEntry = await db0.sales.orderBy("timestamp").last();
        const latestDate = latestEntry ? latestEntry.timestamp : null;
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - earliestDate: " +
          (earliestDate == null ? null : (moment.unix(earliestDate).utc().format() + " (" + earliestDate + ")")) + ", latestDate: " +
          (latestDate == null ? null : (moment.unix(latestDate).utc().format() + " (" + latestDate + ")"))
        );

        let to = state.sync.now;
        let from = state.sync.to;
        let dates;
        try {
          dates = JSON.parse(localStorage.ensSalesDates);
        } catch (e) {
          dates = {};
        };
        const sales = {};
        while (to > state.sync.from && !state.halt) {
          let totalRecords = 0;
          if (!(from in dates)) {
            let processFrom = from;
            const processTo = to;
            if (processFrom == state.sync.to) {
              if (processFrom < latestDate) {
                processFrom = latestDate;
              }
            }
            let continuation = null;
            do {
              let url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" +
                "&limit=" + state.constants.reservoirSalesV3BatchSize +
                "&startTimestamp=" + processFrom +
                "&endTimestamp="+ processTo +
                (continuation != null ? "&continuation=" + continuation : '');
              // logInfo("ensSalesModule", "mutations.loadSales() - url: " + url);
              // logInfo("ensSalesModule", "mutations.loadSales() - Retrieving records for " + new Date(processFrom).toLocaleString() + " to " + new Date(processTo).toLocaleString());
              const data = await fetch(url)
                .then(handleErrors)
                .then(response => response.json())
                .catch(function(error) {
                   console.log("ERROR - updateDBFromAPI: " + error);
                   state.sync.error = true;
                   return [];
                });
              let numberOfRecords = state.sync.error ? 0 : await processSales(data);
              totalRecords += numberOfRecords;
              continuation = data.continuation;
              state.sync.processing = moment.unix(processFrom).utc().format("DDMMM") + ': ' + totalRecords;
            } while (continuation != null && !state.halt && !state.sync.error);
            if (from != state.sync.to && !state.halt) {
              dates[from] = true;
            }
            if (totalRecords > 0) {
              logInfo("ensSalesModule", "mutations.loadSales() - Retrieved " +  totalRecords + " record(s) for " + moment.unix(processFrom).utc().format() + " to " + moment.unix(processTo).utc().format());
            } else {
              logInfo("ensSalesModule", "mutations.loadSales() - Nothing new");
            }
          }
          to = from;
          from = moment.unix(from).utc().subtract(1, 'day').unix();
          localStorage.ensSalesDates = JSON.stringify(dates);
          state.sync.daysInCache = Object.keys(dates).length;
        }
        logInfo("ensSalesModule", "mutations.loadSales() - processed dates: " + JSON.stringify(Object.keys(dates)));
      }
      async function fetchExchangeRates() {
        // TODO: Use toTs={timestamp} when > 2000 days - https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistoday
        const days = parseInt((new Date() - new Date("2017-07-22")) / (24 * 60 * 60 * 1000));
        const url = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=ETH&tsym=" + state.constants.currency + "&limit=" + days;
        logInfo("cryptoPunksModule", "mutations.loadPunks().fetchLatestEvents() url: " + url);
        const data = await fetch(url)
          .then(handleErrors)
          .then(response => response.json())
          .catch(function(error) {
             console.log("ERROR - fetchExchangeRates: " + error);
             state.sync.error = true;
             return null;
          });
        const results = {};
        if (data) {
          for (day of data.Data.Data) {
            results[day.time] = day.close;
          }
        }
        return results;
      }
      async function refreshResultsFromDB() {
        const regex = state.filter.searchString != null && state.filter.searchString.length > 0 ? new RegExp(state.filter.searchString, 'i') : null;
        const searchAccounts = state.filter.searchAccounts ? state.filter.searchAccounts.split(/[, \t\n]+/).map(s => s.trim().toLowerCase()) : null;
        const priceFrom = state.filter.priceFrom && parseFloat(state.filter.priceFrom) > 0 ? parseFloat(state.filter.priceFrom) : null;
        const priceTo = state.filter.priceTo && parseFloat(state.filter.priceTo) > 0 ? parseFloat(state.filter.priceTo) : null;
        const salesFromDB = await db0.sales.orderBy("timestamp").reverse().toArray();
        const saleRecords = [];
        let count = 0;
        for (const sale of salesFromDB) {
          let include = true;
          const name = sale.name && sale.name.replace(/\.eth.*$/, '') || null;
          if (regex && !regex.test(name)) {
            include = false;
          }
          if (include && searchAccounts != null) {
            let found = false;
            for (searchAccount of searchAccounts) {
              if (sale.from.includes(searchAccount) || sale.to.includes(searchAccount)) {
                found = true;
                break;
              }
            }
            if (!found) {
              include = false;
            }
          }
          if (include && priceFrom != null) {
            if (sale.price < priceFrom) {
              include = false;
            }
          }
          if (include && priceTo != null) {
            if (sale.price > priceTo) {
              include = false;
            }
          }
          if (include) {
            saleRecords.push({
              name: sale.name,
              from: sale.from,
              to: sale.to,
              price: sale.price,
              orderSide: sale.data.orderSide,
              timestamp: sale.timestamp,
              tokenId: sale.tokenId,
              txHash: sale.txHash,
            });
            count++;
          }
        }
        state.sales = saleRecords;
      }
      // --- loadSales() functions end ---

      // --- loadSales() start ---
      logInfo("ensSalesModule", "mutations.loadSales() - syncMode: " + syncMode + ", configUpdate: " + JSON.stringify(configUpdate) + ", filterUpdate: " + JSON.stringify(filterUpdate));

      if (syncMode == 'clearCache' || !('ensSalesConfig' in localStorage)) {
        state.config = { period: { term: 1, termType: "month" } };
      } else {
        state.config = JSON.parse(localStorage.ensSalesConfig);
      }
      if (configUpdate != null) {
        console.log("config before: " + JSON.stringify(state.config));
        console.log("updating config with: " + JSON.stringify(configUpdate));
        state.config = { ...state.config, ...configUpdate };
        console.log("config after: " + JSON.stringify(state.config));
        localStorage.ensSalesConfig = JSON.stringify(state.config);
      }

      if (syncMode == 'clearCache') {
        logInfo("ensSalesModule", "mutations.loadSales() - deleting db");
        Dexie.delete(state.db.name);
        delete localStorage['ensSalesDates'];
        delete localStorage['ensSalesConfig'];
      }

      if (syncMode != 'updateFilter') {
        const now = moment().unix();
        const to = moment.unix(now).utc().startOf('day').unix();
        const from = moment.unix(to).utc().subtract(state.config.period.term, state.config.period.termType).unix();
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - to: " + moment.unix(to).utc().format() + " (" + to + ")");
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - from: " + moment.unix(from).utc().format() + " (" + from + ")");
        const days = moment.unix(to).utc().diff(moment.unix(from).utc(), "days");
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - days: " + days);
        const daysInCache = ('ensSalesDates' in localStorage) ? Object.keys(JSON.parse(localStorage.ensSalesDates)).length : 0;
        logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - daysInCache: " + daysInCache);

        state.sync = {
          inProgress: true,
          error: false,
          now: now,
          from: from,
          to: to,
          daysExpected: days,
          daysInCache: daysInCache,
          processing: null,
        };
      }

      if (filterUpdate != null) {
        console.log("filter before: " + JSON.stringify(state.filter));
        console.log("updating filter with: " + JSON.stringify(filterUpdate));
        state.filter = { ...state.filter, ...filterUpdate };
        console.log("filter after: " + JSON.stringify(state.filter));
      }

      if (filterUpdate == null) {
        state.exchangeRates = await fetchExchangeRates();
        logInfo("ensSalesModule", "mutations.loadSales() exchangeRates: " + JSON.stringify(state.exchangeRates).substring(0, 60) + " ...");
      }

      const db0 = new Dexie(state.db.name);
      db0.version(state.db.version).stores(state.db.definition);

      if (syncMode != 'clearCache' && syncMode != 'updateFilter' && syncMode != 'mounted') {
        // logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - from: " + moment.unix(state.sync.from).utc().format() + " (" + state.sync.from + ")");
        db0.transaction('rw', db0.sales, function* () {
          var deleteCount = yield db0.sales.where("timestamp").below(state.sync.from).delete();
          logInfo("ensSalesModule", "mutations.loadSales().updateDBFromAPI() - deleted " + deleteCount + " old records before " +  moment.unix(state.sync.from).utc().format("YYYY-MM-DD"));
          if ('ensSalesDates' in localStorage) {
            try {
              const ensSalesDates = JSON.parse(localStorage.ensSalesDates);
              Object.keys(ensSalesDates).forEach(function (timestamp) {
                if (timestamp < state.sync.from) {
                  delete ensSalesDates[timestamp];
                }
              });
              localStorage.ensSalesDates = JSON.stringify(ensSalesDates);
              state.sync.daysInCache = Object.keys(ensSalesDates).length;
            } catch (e) {
              console.log("Error updating ensSalesDates")
            }
          }
        }).catch (e => {
          console.error (e);
        });
      }
      if (syncMode != 'clearCache' && syncMode != 'updateFilter' && syncMode != 'mounted') {
        await updateDBFromAPI();
      }
      await refreshResultsFromDB();
      state.sync.inProgress = false;
      state.sync.processing = null;
      state.halt = false;

      db0.close();
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    updateFilter(context, filterUpdate) {
      // logInfo("ensSalesModule", "filterUpdates.updateFilter() - filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('loadSales', { syncMode: 'updateFilter', configUpdate: null, filterUpdate });
    },
    updateConfig(context, configUpdate) {
      // logInfo("ensSalesModule", "configUpdates.updateConfig() - configUpdate: " + JSON.stringify(configUpdate));
      context.commit('loadSales', { syncMode: 'updateConfig', configUpdate, filterUpdate: null });
    },
    loadSales(context, syncMode) {
      // logInfo("ensSalesModule", "actions.loadSales() - syncMode: " + syncMode);
      context.commit('loadSales', { syncMode: syncMode, configUpdate: null, filterUpdate: null } );
    },
    halt(context) {
      context.commit('halt');
    },
  },
};
