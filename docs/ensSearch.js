const ENSSearch = {
  template: `
    <div class="m-0 p-0">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="false && (!powerOn || network.chainId != 1)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Ethereum mainnet and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body no-header class="border-0">

        <b-card no-body class="p-0 mt-1">
          <!-- Search type tabs -->
          <b-tabs card align="left" no-body v-model="settings.searchTabIndex" active-tab-class="m-0 p-0">
            <b-tab v-for="t in tabs" :key="'dyn-tabx-' + t.name" @click="updateURL(t.name);" :title="t.text" title-item-class="p-0" title-link-class="px-2">
            </b-tab>
          </b-tabs>

          <!-- Search input -->
          <b-card-body class="m-1 p-1">

            <b-card-text class="m-0 p-0">
              <b-row v-if="['names', 'owned', 'contains', 'startswith', 'endswith'].includes(tabs[settings.searchTabIndex].name)">
                <b-col sm="6">
                  <b-form-textarea size="sm" v-model.trim="settings.searchString" :placeholder="tabs[settings.searchTabIndex].placeholder" rows="3" max-rows="100"></b-form-textarea>
                </b-col>
              </b-row>
              <b-row v-if="['groups'].includes(tabs[settings.searchTabIndex].name)">
                <b-col sm="6" class="mt-2">
                  <b-form-select size="sm" v-model="settings.selectedGroup" :options="groupOptions" v-b-popover.hover.bottom="'Set up groups in Config'"></b-form-select>
                </b-col>
              </b-row>
              <div v-if="['sets'].includes(tabs[settings.searchTabIndex].name)" class="m-0 p-0">
                <b-row class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" label="Set" label-class="m-0 p-0" class="text-right">
                      <b-form-select size="sm" v-model="settings.selectedSet" :options="setOptions"></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" :label="'From' + (settings.setAttributes[settings.selectedSet].type == 'hours' ? ', hh': '')" label-class="m-0 p-0" class="text-right">
                      <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].from"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" :label="'To' + (settings.setAttributes[settings.selectedSet].type == 'hours' ? ', hh': '')" label-class="m-0 p-0" class="text-right">
                      <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].to"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" :label="'Step' + (settings.setAttributes[settings.selectedSet].type == 'hours' ? ', hh': '')" label-class="m-0 p-0" class="text-right">
                      <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].step"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <div v-if="settings.setAttributes[settings.selectedSet].type == 'hours'">
                  <b-row class="m-0 p-0">
                    <b-col sm="6" class="m-0 p-0">
                      <b-form-group label-cols="3" content-cols="9" label="From, mm" label-class="m-0 p-0" class="text-right">
                        <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].from2"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row class="m-0 p-0">
                    <b-col sm="6" class="m-0 p-0">
                      <b-form-group label-cols="3" content-cols="9" label="To, mm" label-class="m-0 p-0" class="text-right">
                        <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].to2"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row class="m-0 p-0">
                    <b-col sm="6" class="m-0 p-0">
                      <b-form-group label-cols="3" content-cols="9" label="Step, mm" label-class="m-0 p-0" class="text-right">
                        <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].step2"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </div>
                <b-row v-if="'regex' in settings.setAttributes[settings.selectedSet]" class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" label="Regex" label-class="m-0 p-0" class="text-right">
                      <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].regex" placeholder="🔍 {regex}, e.g., '^([0-9])([0-9])([0-9])\\3\\2\\1$' for 6 digit palindromes"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="'palindrome' in settings.setAttributes[settings.selectedSet]" class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" label="" label-class="m-0 p-0" class="text-right">
                      <b-form-checkbox v-model.trim="settings.setAttributes[settings.selectedSet].palindrome">
                        Palindrome
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="'minMaxRepeatedCount' in settings.setAttributes[settings.selectedSet]" class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" label="Min repeated chars" label-class="m-0 p-0" class="text-right">
                      <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].minMaxRepeatedCount"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="'minMaxConsecutiveCount' in settings.setAttributes[settings.selectedSet]" class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" label="Min consecutive chars" label-class="m-0 p-0" class="text-right">
                      <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].minMaxConsecutiveCount"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="'prefix' in settings.setAttributes[settings.selectedSet]" class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" label="Prefix" label-class="m-0 p-0" class="text-right">
                      <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].prefix" placeholder="optional prefix, e.g., 'mr'"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="'separator' in settings.setAttributes[settings.selectedSet]" class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" label="Separator" label-class="m-0 p-0" class="text-right">
                      <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].separator" placeholder="optional separator, e.g., 'h'"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="'postfix' in settings.setAttributes[settings.selectedSet]" class="m-0 p-0">
                  <b-col sm="6" class="m-0 p-0">
                    <b-form-group label-cols="3" content-cols="9" label="Postfix" label-class="m-0 p-0" class="text-right">
                      <b-form-input type="text" size="sm" v-model.trim="settings.setAttributes[settings.selectedSet].postfix" placeholder="optional postfix, e.g., 'abc'"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
              </div>
              <b-row>
                <b-col sm="6" class="mt-2">
                  <div class="d-flex flex-wrap m-0 p-0">
                    <div class="mt-1 flex-grow-1">
                    </div>
                    <div class="mt-2" style="width: 200px;">
                      <b-progress v-if="progress.message != null" height="1.5rem" :max="progress.total" show-progress :animated="progress.message != null" :variant="progress.message != null ? 'success' : 'secondary'" v-b-popover.hover.top="'Click button on the right to end this stage'">
                        <b-progress-bar :value="progress.completed">
                          {{ progress.total == null ? (progress.completed + ' ' + progress.message) : (progress.completed + '/' + progress.total + ' ' + ((progress.completed / progress.total) * 100).toFixed(0) + '% ' + progress.message) }}
                        </b-progress-bar>
                      </b-progress>
                    </div>
                    <div class="ml-0 mt-1">
                      <b-button v-if="progress.message != null" size="sm" @click="halt" variant="link" v-b-popover.hover.top="'Halt'"><b-icon-stop-fill shift-v="+1" font-scale="1.0"></b-icon-stop-fill></b-button>
                    </div>
                    <div class="mt-1">
                      <b-button v-if="progress.message == null" size="sm" @click="scan( { searchType: tabs[settings.searchTabIndex].name, search: settings.searchString, group: settings.selectedGroup, setAttributes: settings.setAttributes[settings.selectedSet] } );" variant="primary" class="float-right">Search</b-button>
                      <!-- <b-button v-if="progress.message != null" size="sm" @click="halt" variant="primary" class="float-right">Halt</b-button> -->
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card-body>
        </b-card>

        <!-- Intro -->
        <b-card v-if="Object.keys(searchResults).length == 0 && unregistered.length == 0" class="mt-1" no-header>
          <b-card-text>
            The list of names and/or addresses can be comma, space, tab or newline separated. <em>.eth</em> is optional
          </b-card-text>
        </b-card>

        <!-- Results Section -->
        <b-card  v-if="Object.keys(searchResults).length > 0 || unregistered.length > 0" no-body class="p-0 mt-1">
          <b-card-body class="m-1 p-1">
            <b-tabs card align="left" no-body active-tab-class="m-0 p-0" v-model="settings.resultsTabIndex">
              <b-tab title="Summary">
              </b-tab>
              <b-tab title="Details">
              </b-tab>
              <b-tab title="Images">
              </b-tab>
              <b-tab title="Owners">
              </b-tab>
              <b-tab title="Unregistered" :disabled="unregistered.length == 0">
              </b-tab>
              <b-tab title="Hours" v-if="['sets'].includes(tabs[settings.searchTabIndex].name) && settings.setAttributes[settings.selectedSet].type == 'hours'">
              </b-tab>
            </b-tabs>

            <!-- Results Toolbar -->
            <div v-if="Object.keys(searchResults).length > 0" class="d-flex flex-wrap m-0 p-0" style="min-height: 37px;">
              <div v-if="settings.resultsTabIndex != 4" class="mt-2" style="max-width: 150px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.filter" debounce="600" v-b-popover.hover.top="'Filter by regular expression'" placeholder="🔍 {regex}"></b-form-input>
              </div>
              <div class="mt-2">
                <b-button size="sm" :pressed.sync="settings.filterToolbar" variant="link" v-b-popover.hover.top="'Amateur mode filters'"><span v-if="settings.filterToolbar"><b-icon-caret-up-fill shift-v="+1" font-scale="1.0"></b-icon-caret-up-fill></span><span v-else><b-icon-caret-down-fill shift-v="+1" font-scale="1.0"></b-icon-caret-down-fill></span></b-button>
              </div>
              <div v-if="settings.resultsTabIndex != 4" class="mt-2 pl-2" style="max-width: 150px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.filterAccount" debounce="600" v-b-popover.hover.top="'Filter by list of registrant addresses'" placeholder="🔍 0x12... ..."></b-form-input>
              </div>
              <div v-if="settings.resultsTabIndex != 4" class="mt-2 pl-2" style="max-width: 80px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.priceFrom" debounce="600" v-b-popover.hover.top="'ETH from'" placeholder="min"></b-form-input>
              </div>
              <div v-if="settings.resultsTabIndex != 4" class="mt-2">
                -
              </div>
              <div v-if="settings.resultsTabIndex != 4" class="mt-2 pr-2" style="max-width: 80px;">
                <b-form-input type="text" size="sm" v-model.trim="settings.priceTo" debounce="600" v-b-popover.hover.top="'ETH to'" placeholder="max"></b-form-input>
              </div>
              <div v-if="settings.resultsTabIndex != 4" class="mt-2 pl-1">
                <font size="-2">{{ filteredResults.length }}/{{ Object.keys(searchResults).length }}</font>
              </div>
              <div class="pr-1 flex-grow-1">
              </div>
              <div v-if="settings.resultsTabIndex != 4 && settings.resultsTabIndex != 5" class="mt-2 pl-1" style="max-width: 200px;">
                <b-form-select size="sm" v-model="settings.sortOption" :options="sortOptions" class="w-100"></b-form-select>
              </div>
              <div v-if="settings.resultsTabIndex != 4 && settings.resultsTabIndex != 5" class="mt-2 pl-1">
                <b-button size="sm" :pressed.sync="settings.randomise" @click="settings.sortOption = 'random'; " variant="link" v-b-popover.hover.top="'Randomise'"><b-icon-arrow-clockwise shift-v="-1" font-scale="1.4"></b-icon-arrow-clockwise></b-button>
              </div>
              <div v-if="settings.resultsTabIndex != 4" class="mt-2 pl-1">
                <b-button size="sm" @click="exportNames" :disabled="Object.keys(searchResults).length == 0" variant="link">Export</b-button>
              </div>
              <div class="pr-1 flex-grow-1">
              </div>
              <!--
              <div class="pl-1" v-if="settings.resultsTabIndex == 2">
                <b-form-select size="sm" v-model="settings.imageSize" :options="imageSizeOptions"></b-form-select>
              </div>
              -->
              <div v-if="settings.resultsTabIndex == 1 || settings.resultsTabIndex == 2" class="mt-2 pl-1">
                <b-pagination size="sm" v-model="settings.resultsCurrentPage" :total-rows="filteredResults.length" :per-page="settings.resultsPageSize"></b-pagination>
              </div>
              <div v-if="settings.resultsTabIndex == 1 || settings.resultsTabIndex == 2" class="mt-2 pl-1" style="max-width: 200px;">
                <b-form-select size="sm" v-model="settings.resultsPageSize" :options="pageSizes"></b-form-select>
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

            <!-- Summary -->
            <div v-if="settings.resultsTabIndex == 0">
              <b-table small striped hover :fields="summaryFields" :items="summary" table-class="w-auto" thead-class="hidden_header" class="mt-1">
                <template #cell(names)="data">
                  <span v-for="(result, resultIndex) in data.item.results" :key="resultIndex">
                    <b-button :id="'popover-target-' + result.labelName + '-' + resultIndex" variant="link" class="m-0 p-0">
                      <span v-if="result.warn == null">
                        {{ !result.labelName ? '' : (result.labelName.length > 128 ? (result.labelName.substring(0, 128) + '...') : result.labelName) }}
                      </span>
                      <span v-if="result.warn != null">
                        <b-badge v-if="result.warn != null" v-b-popover.hover.bottom="'Expiring ' + formatDate(result.expiryDate) + ' UTC'" variant="warning">{{ result.labelName }}</b-badge>
                      </span>
                    </b-button>
                    <span v-if="prices[result.tokenId]">
                      <font shift-v="+3" size="-1"><b-badge v-b-popover.hover.bottom="'Floor ask price in ETH from ' + prices[result.tokenId].source" variant="success">{{ prices[result.tokenId].floorAskPrice }}</b-badge></font>
                    </span>
                    <b-popover :target="'popover-target-' + result.labelName + '-' + resultIndex" placement="right">
                      <template #title>{{ result.name }} links</template>
                      <b-link :href="'https://app.ens.domains/name/' + result.name" v-b-popover.hover.bottom="'View in app.ens.domains'" target="_blank">
                        ENS
                      </b-link>
                      <br />
                      <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + result.tokenId" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/collections/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + result.tokenId" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/eth/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + result.tokenId" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/enslookup-search?search=' + result.name" v-b-popover.hover.bottom="'View in etherscan.io'" target="_blank">
                        EtherScan
                      </b-link>
                      <br />
                      <b-link :href="'https://duckduckgo.com/?q=' + result.labelName" v-b-popover.hover.bottom="'Search name in duckduckgo.com'" target="_blank">
                        DuckDuckGo
                      </b-link>
                      <br />
                      <b-link :href="'https://www.google.com/search?q=' + result.labelName" v-b-popover.hover.bottom="'Search name in google.com'" target="_blank">
                        Google
                      </b-link>
                      <br />
                      <b-link :href="'https://twitter.com/search?q=' + result.name" v-b-popover.hover.bottom="'Search name in twitter.com'" target="_blank">
                        Twitter
                      </b-link>
                      <br />
                      <b-link :href="'https://wikipedia.org/wiki/' + result.labelName" v-b-popover.hover.bottom="'Search name in wikipedia.org'" target="_blank">
                        Wikipedia
                      </b-link>
                      <br />
                      <b-link :href="'https://en.wiktionary.org/wiki/' + result.labelName" v-b-popover.hover.bottom="'Search name in wiktionary.org'" target="_blank">
                        Wiktionary
                      </b-link>
                      <br />
                      <b-link :href="'https://thesaurus.yourdictionary.com/' + result.labelName" v-b-popover.hover.bottom="'Search name in thesaurus.yourdictionary.com'" target="_blank">
                        Thesaurus
                      </b-link>
                    </b-popover>
                  </span>
                </template>
              </b-table>
            </div>

            <!-- Details -->
            <div v-if="settings.resultsTabIndex == 1">
              <b-table small striped hover :fields="resultsFields" :items="pagedFilteredResults" responsive="sm" class="mt-1">
                <template #cell(index)="data">
                  {{ data.index+1+(settings.resultsCurrentPage - 1) * settings.resultsPageSize }}
                </template>
                <template #cell(image)="data">
                  <b-img :width="'100%'" :src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + data.item.tokenId + '/image'"></b-img>
                  <!--
                  <div v-if="data.item.hasAvatar">
                    <b-img-lazy :width="'100%'" :src="'https://metadata.ens.domains/mainnet/avatar/' + data.item.name" />
                    <b-img-lazy :width="'100%'" :src="'https://metadata.ens.domains/mainnet/avatar/' + data.item.name" />
                  </div>
                  -->
                </template>
                <template #cell(name)="data">
                  <b-button :id="'popover-target-name-' + data.index" variant="link" class="m-0 p-0">
                    {{ data.item.name.substring(0, 64) }}
                  </b-button>
                  <b-popover :target="'popover-target-name-' + data.index" placement="right">
                    <template #title>{{ data.item.name.substring(0, 64) }}:</template>
                    <b-link :href="'https://app.ens.domains/name/' + data.item.name" v-b-popover.hover.bottom="'View in app.ens.domains'" target="_blank">
                      ENS
                    </b-link>
                    <br />
                    <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                      OpenSea
                    </b-link>
                    <br />
                    <b-link :href="'https://looksrare.org/collections/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                      LooksRare
                    </b-link>
                    <br />
                    <b-link :href="'https://x2y2.io/eth/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + data.item.tokenId" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                      X2Y2
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/enslookup-search?search=' + data.item.name" v-b-popover.hover.bottom="'View in etherscan.io'" target="_blank">
                      EtherScan
                    </b-link>
                    <br />
                    <b-link :href="'https://duckduckgo.com/?q=' + data.item.labelName" v-b-popover.hover.bottom="'Search name in duckduckgo.com'" target="_blank">
                      DuckDuckGo
                    </b-link>
                    <br />
                    <b-link :href="'https://www.google.com/search?q=' + data.item.labelName" v-b-popover.hover.bottom="'Search name in google.com'" target="_blank">
                      Google
                    </b-link>
                    <br />
                    <b-link :href="'https://twitter.com/search?q=' + data.item.name" v-b-popover.hover.bottom="'Search name in twitter.com'" target="_blank">
                      Twitter
                    </b-link>
                    <br />
                    <b-link :href="'https://wikipedia.org/wiki/' + data.item.labelName" v-b-popover.hover.bottom="'Search name in wikipedia.org'" target="_blank">
                      Wikipedia
                    </b-link>
                    <br />
                    <b-link :href="'https://en.wiktionary.org/wiki/' + data.item.labelName" v-b-popover.hover.bottom="'Search name in wiktionary.org'" target="_blank">
                      Wiktionary
                    </b-link>
                    <br />
                    <b-link :href="'https://thesaurus.yourdictionary.com/' + data.item.labelName" v-b-popover.hover.bottom="'Search name in thesaurus.yourdictionary.com'" target="_blank">
                      Thesaurus
                    </b-link>
                  </b-popover>
                  <br />
                  <br />
                  <span v-if="prices[data.item.tokenId]">
                    <font shift-v="+3" size="-1"><b-badge v-b-popover.hover.bottom="'Floor ask price in ETH'" variant="success">{{ prices[data.item.tokenId].floorAskPrice }}</b-badge></font>
                  </span>

                </template>
                <template #cell(registrant)="data">
                  <b-button :id="'popover-target-registrant-' + data.index" variant="link" class="m-0 p-0">
                    {{ getName(data.item.registrant) }}
                  </b-button>
                  <b-popover :target="'popover-target-registrant-' + data.index" placement="right">
                    <template #title>Registrant: {{ data.item.registrant.substring(0, 12) }}:</template>
                    <b-link :href="'https://opensea.io/' + data.item.registrant" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                      OpenSea
                    </b-link>
                    <br />
                    <b-link :href="'https://looksrare.org/accounts/' + data.item.registrant" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                      LooksRare
                    </b-link>
                    <br />
                    <b-link :href="'https://x2y2.io/user/' + data.item.registrant + '/items'" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                      X2Y2
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/address/' + data.item.registrant" v-b-popover.hover.bottom="'View in etherscan.io'" target="_blank">
                      EtherScan
                    </b-link>
                  </b-popover>
                  <br />
                  <br />
                  <font size="-2">
                    <b-button size="sm" :id="'popover-target-owner-' + data.index" variant="link" class="m-0 p-0">
                      C: {{ getName(data.item.owner) }}
                    </b-button>
                    <b-popover :target="'popover-target-owner-' + data.index" placement="right">
                      <template #title>Controller: {{ data.item.owner.substring(0, 12) }}:</template>
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
                  </font>
                  <br />
                  <font size="-2">
                    <b-button size="sm" :id="'popover-target-resolvedAddress-' + data.index" variant="link" class="m-0 p-0">
                      RA: {{ getName(data.item.resolvedAddress) }}
                    </b-button>
                    <b-popover :target="'popover-target-resolvedAddress-' + data.index" placement="right">
                      <template #title>Resolved Addr: {{ data.item.resolvedAddress.substring(0, 12) }}:</template>
                      <b-link :href="'https://opensea.io/' + data.item.resolvedAddress" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/accounts/' + data.item.resolvedAddress" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/user/' + data.item.resolvedAddress + '/items'" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/address/' + data.item.resolvedAddress" v-b-popover.hover.bottom="'View in etherscan.io'" target="_blank">
                        EtherScan
                      </b-link>
                    </b-popover>
                  </font>
                </template>
                <template #cell(expiryDate)="data">
                  <div v-if="data.item.warn">
                    <font :color="data.item.warn">
                      {{ formatDate(data.item.expiryDate) }}
                    </font>
                  </div>
                  <div v-else>
                    {{ formatDate(data.item.expiryDate) }}
                  </div>
                  <br />
                  <font size="-2">R: {{ formatDate(data.item.registrationDate) }}</font>
                </template>
              </b-table>
            </div>

            <!-- Images -->
            <!-- TODO: Add hyperlinks -->
            <div v-if="settings.resultsTabIndex == 2">
              <b-card-group deck class="m-2">
                <div v-for="record in pagedFilteredResults">
                  <b-card overlay :id="'popover-target-image-' + record.name" :img-src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + record.tokenId + '/image'" class="m-2 p-0">
                    <div v-if="prices[record.tokenId]">
                      <b-col cols="10" class="m-0 p-1 text-right">
                        <font shift-v="+3" size="-1"><b-badge v-b-popover.hover.bottom="'Floor ask price in ETH'" variant="success">{{ prices[record.tokenId].floorAskPrice }}</b-badge></font>
                      </b-col>
                    </div>
                  </b-card>
                  <!--
                  <b-card body-class="p-1" header-class="p-1" footer-class="p-1" img-top class="m-1 p-0 border-0">
                    <b-img-lazy :width="settings.imageSize + '%'" :src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + record.tokenId + '/image'"></b-img>
                    </b-img-lazy>
                  </b-card>
                  -->
                </div>
              </b-card-group deck>
            </div>

            <!-- Owners -->
            <div v-if="settings.resultsTabIndex == 3">
              <b-table small striped hover :fields="ownersFields" :items="owners" class="mt-3">
                <template #cell(index)="data">
                  {{ data.index+1 }}
                </template>
                <template #cell(registrant)="data">
                  <b-button :id="'popover-target-owner-' + data.item.registrant + '-' + data.index" variant="link" class="m-0 p-0">
                    {{ getName(data.item.registrant) }}
                  </b-button>
                  <b-popover :target="'popover-target-owner-' + data.item.registrant + '-' + data.index" placement="right">
                    <template #title>Registrant: {{ data.item.registrant.substring(0, 12) }}:</template>
                    <b-link :href="'https://opensea.io/' + data.item.registrant" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                      OpenSea
                    </b-link>
                    <br />
                    <b-link :href="'https://looksrare.org/accounts/' + data.item.registrant" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                      LooksRare
                    </b-link>
                    <br />
                    <b-link :href="'https://x2y2.io/user/' + data.item.registrant + '/items'" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                      X2Y2
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/address/' + data.item.registrant" v-b-popover.hover.bottom="'View in etherscan.io'" target="_blank">
                      Etherscan
                    </b-link>
                    <br />
                    <b-link :href="'https://chat.blockscan.com/index?a=' + data.item.registrant" v-b-popover.hover.bottom="'Message in etherscan.io'" target="_blank">
                      Blockscan
                    </b-link>
                  </b-popover>
                </template>
                <template #cell(names)="data">
                  <span v-for="(result, resultIndex) in data.item.results" :key="resultIndex">
                    <b-button :id="'popover-target-' + data.item.registrant + '-' + resultIndex" variant="link" class="m-0 p-0">
                      {{ result.labelName }}
                    </b-button>
                    <span v-if="prices[result.tokenId]">
                      <font shift-v="+3" size="-1"><b-badge v-b-popover.hover.bottom="'Floor ask price in ETH'" variant="success">{{ prices[result.tokenId].floorAskPrice }}</b-badge></font>
                    </span>
                    <b-popover :target="'popover-target-' + data.item.registrant + '-' + resultIndex" placement="right">
                      <template #title>{{ result.name }} links</template>
                      <b-link :href="'https://app.ens.domains/name/' + result.name" v-b-popover.hover.bottom="'View in app.ens.domains'" target="_blank">
                        ENS
                      </b-link>
                      <br />
                      <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + result.tokenId" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/collections/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + result.tokenId" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/eth/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + result.tokenId" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/enslookup-search?search=' + result.name" v-b-popover.hover.bottom="'View in etherscan.io'" target="_blank">
                        EtherScan
                      </b-link>
                      <br />
                      <b-link :href="'https://duckduckgo.com/?q=' + result.labelName" v-b-popover.hover.bottom="'Search name in duckduckgo.com'" target="_blank">
                        DuckDuckGo
                      </b-link>
                      <br />
                      <b-link :href="'https://www.google.com/search?q=' + result.labelName" v-b-popover.hover.bottom="'Search name in google.com'" target="_blank">
                        Google
                      </b-link>
                      <br />
                      <b-link :href="'https://twitter.com/search?q=' + result.name" v-b-popover.hover.bottom="'Search name in twitter.com'" target="_blank">
                        Twitter
                      </b-link>
                      <br />
                      <b-link :href="'https://wikipedia.org/wiki/' + result.labelName" v-b-popover.hover.bottom="'Search name in wikipedia.org'" target="_blank">
                        Wikipedia
                      </b-link>
                      <br />
                      <b-link :href="'https://en.wiktionary.org/wiki/' + result.labelName" v-b-popover.hover.bottom="'Search name in wiktionary.org'" target="_blank">
                        Wiktionary
                      </b-link>
                      <br />
                      <b-link :href="'https://thesaurus.yourdictionary.com/' + result.labelName" v-b-popover.hover.bottom="'Search name in thesaurus.yourdictionary.com'" target="_blank">
                        Thesaurus
                      </b-link>
                    </b-popover>
                  </span>
                </template>
              </b-table>
            </div>

            <!-- Unregistered -->
            <div v-if="settings.resultsTabIndex == 4">
              <b-card-text class="m-0 p-0">
                <span v-for="(name, index) in unregistered" :key="index">
                  <b-link :href="'https://app.ens.domains/name/' + name + '.eth'" v-b-popover.click="'Register in app.ens.domains'" target="_blank">
                    {{ name }}
                  </b-link>
                </span>
              </b-card-text>
            </div>

            <!-- Hours - Only enabled sometimes -->
            <div v-if="settings.resultsTabIndex == 5">
              <b-card-text class="m-0 p-0">
                <b-row class="m-0 p-0">
                  <b-col class="m-0 p-0 text-right">mm\\hh</b-col>
                  <b-col v-for="(hours, hoursIndex) in 24" :key="hoursIndex" class="m-0 p-0 text-right">
                    {{ (hours - 1).toString().padStart(2, '0') }}
                  </b-col>
                </b-row>
                <b-row v-for="(mins, index) in hours" :key="index" class="m-0 p-0">
                  <b-col class="m-0 p-0 text-right">{{ mins.mm.padStart(2, '0') }}</b-col>
                  <b-col v-for="(hhmm, hhmmIndex) in mins.hh" :key="hhmmIndex" class="m-0 p-0 text-right">
                    <div v-if="hhmm">
                      <font size="-2">
                        <div v-if="prices[hhmm.tokenId] && prices[hhmm.tokenId].floorAskPrice != null">
                          <b-badge v-b-popover.hover.bottom="'Floor ask price in ETH'" variant="success">
                            {{ prices[hhmm.tokenId].floorAskPrice }}
                          </b-badge>
                        </div>
                      </font>
                      <font size="-2">
                        <span v-if="hhmm.warn == null">
                          <b-link v-if="hhmm" :id="'popover-target-' + hhmm.labelName">
                            {{ hhmm.labelName }}
                          </b-link>
                        </span>
                        <span v-if="hhmm.warn != null">
                          <b-link v-if="hhmm" :id="'popover-target-' + hhmm.labelName" style="background: yellow; " v-b-popover.hover.bottom="'Expiring ' + formatDate(hhmm.expiryDate) + ' UTC'">
                            {{ hhmm.labelName }}
                          </b-link>
                        </span>
                      </font>
                      <b-popover :target="'popover-target-' + hhmm.labelName" placement="right">
                        <template #title>{{ hhmm.labelName }}:</template>
                        <b-link :href="'https://app.ens.domains/name/' + hhmm.name" v-b-popover.hover.bottom="'View in app.ens.domains'" target="_blank">
                          ENS
                        </b-link>
                        <br />
                        <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + hhmm.tokenId" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                          OpenSea
                        </b-link>
                        <br />
                        <b-link :href="'https://looksrare.org/collections/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + hhmm.tokenId" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                          LooksRare
                        </b-link>
                        <br />
                        <b-link :href="'https://x2y2.io/eth/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + hhmm.tokenId" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                          X2Y2
                        </b-link>
                        <br />
                        <b-link :href="'https://etherscan.io/enslookup-search?search=' + hhmm.name" v-b-popover.hover.bottom="'View in etherscan.io'" target="_blank">
                          EtherScan
                        </b-link>
                        <br />
                        <b-link :href="'https://duckduckgo.com/?q=' + hhmm.labelName" v-b-popover.hover.bottom="'Search name in duckduckgo.com'" target="_blank">
                          DuckDuckGo
                        </b-link>
                        <br />
                        <b-link :href="'https://www.google.com/search?q=' + hhmm.labelName" v-b-popover.hover.bottom="'Search name in google.com'" target="_blank">
                          Google
                        </b-link>
                        <br />
                        <b-link :href="'https://twitter.com/search?q=' + hhmm.name" v-b-popover.hover.bottom="'Search name in twitter.com'" target="_blank">
                          Twitter
                        </b-link>
                        <br />
                        <b-link :href="'https://wikipedia.org/wiki/' + hhmm.labelName" v-b-popover.hover.bottom="'Search name in wikipedia.org'" target="_blank">
                          Wikipedia
                        </b-link>
                        <br />
                        <b-link :href="'https://en.wiktionary.org/wiki/' + hhmm.labelName" v-b-popover.hover.bottom="'Search name in wiktionary.org'" target="_blank">
                          Wiktionary
                        </b-link>
                        <br />
                        <b-link :href="'https://thesaurus.yourdictionary.com/' + hhmm.labelName" v-b-popover.hover.bottom="'Search name in thesaurus.yourdictionary.com'" target="_blank">
                          Thesaurus
                        </b-link>
                      </b-popover>
                    </div>
                  </b-col>
                </b-row>
              </b-card-text>
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
        searchTabIndex: 0,
        searchString: null,
        selectedGroup: null,
        selectedSet: 'digit999',
        filter: null,
        filterAccount: null,
        priceFrom: null,
        priceTo: null,
        filterToolbar: true, // TODO false
        type: null,
        lengthFrom: null,
        lengthTo: null,
        palindrome: false,
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
            minMaxRepeatedCount: 1,
            minMaxConsecutiveCount: 1,
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
            minMaxRepeatedCount: 1,
            minMaxConsecutiveCount: 1,
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
            minMaxRepeatedCount: 1,
            minMaxConsecutiveCount: 1,
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
            minMaxRepeatedCount: 1,
            minMaxConsecutiveCount: 1,
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
            minMaxRepeatedCount: 1,
            minMaxConsecutiveCount: 1,
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
            minMaxRepeatedCount: 1,
            minMaxConsecutiveCount: 1,
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
            minMaxRepeatedCount: 1,
            minMaxConsecutiveCount: 1,
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
            minMaxRepeatedCount: 1,
            minMaxConsecutiveCount: 1,
            prefix: null,
            postfix: null,
          },
        },
      },

      tabs: [
        { name: 'names', text: 'Names', placeholder: '🔍 {name1}[.eth] {name2}[.eth], {name3}[.eth]\n{name4}[.eth] ...' },
        { name: 'contains', text: 'Contains', placeholder: '🔍 {term1} {term2}, {term3} \n{term4} ...' },
        { name: 'startswith', text: 'Starts With', placeholder: '🔍 {term1} {term2}, {term3} \n{term4} ...' },
        { name: 'endswith', text: 'Ends With', placeholder: '🔍 {term1} {term2}, {term3} \n{term4} ...' },
        { name: 'owned', text: 'Owned', placeholder: '🔍 {name1}[.eth] {0xaddress1}, {name2}[.eth]\n{0xaddress2} ...' },
        { name: 'groups', text: 'Groups', placeholder: null },
        { name: 'sets', text: 'Sets', placeholder: null },
      ],

      pageSizes: [
        { value: 10, text: '10' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1k' },
        { value: 2500, text: '2.5k' },
        { value: 10000, text: '10k' },
      ],

      setOptions: [
        { value: 'digit9', text: 'Digits 0 to 9 [prefix/postfix required for min 3 length]' },
        { value: 'digit99', text: 'Digits 00 to 99, [prefix/postfix required for min 3 length]' },
        { value: 'digit999', text: 'Digits 000 to 999 [Club999]' },
        { value: 'digit9999', text: 'Digits 0000 to 9999 [Club10k]' },
        { value: 'digit99999', text: 'Digits 00000 to 99999 [Club100k]' },
        { value: 'digit999999', text: 'Digits 000000 to 999999 [Club1m]' },
        { value: 'digit9999999', text: 'Digits 0000000 to 9999999 [Club10m]' },
        { value: 'digit99999999', text: 'Digits 00000000 to 99999999 [Club100m]' },
        { value: 'hours', text: 'Hours 00h00 to 23h59' },
      ],

      typeOptions: [
        { value: null, text: '(all)' },
        {
          label: 'Sets',
          options: [
            { value: '^[0-9]{3}$', text: '999Club - 0 to 9 - 3 digits' },
            { value: '^[0-9]{4}$', text: '10kClub - 0 to 9 - 4 digits' },
            { value: '^[0-9]{5}$', text: '100kClub - 0 to 9 - 5 digits' },
            { value: '^[0-9]{6}$', text: '1mClub - 0 to 9 - 6 digits' },
            { value: '^[0-9]{8}$', text: '10mClub - 0 to 9 - 7 digits' },
            { value: '^([0-9])[0-9]\\1$', text: '3 Digit Palindrome' },
            { value: '^([0-9])([0-9])\\2\\1$', text: '4 Digit Palindrome' },
            { value: '^([0-9])([0-9])[0-9]\\2\\1$', text: '5 Digit Palindrome' },
            { value: '^([0-9])([0-9])([0-9])\\3\\2\\1$', text: '6 Digit Palindrome' },
            { value: '^([0-9])([0-9])([0-9])[0-9]\\3\\2\\1$', text: '7 Digit Palindrome' },
            { value: '^[a-z]{3}$', text: '3 Letters' },
            { value: '^[a-z]{4}$', text: '4 Letters' },
            { value: '^[a-z]{5}$', text: '5 Letters' },
            { value: '^[a-z]{6}$', text: '6 Letters' },
            { value: '^[a-z]{7}$', text: '7 Letters' },
            { value: '^[a-z]{8}$', text: '8 Letters' },
            { value: '^[0-9]-[0-9]$', text: 'N-N' },
            { value: '^[0-9]{2}-[0-9]{2}$', text: 'NN-NN' },
            { value: '^[0-2][0-9]h[0-5][0-9]$', text: '24 hours - NNhNN (will incorrectly include 24hNN to 29hNN)' },
            { value: '^[0-3][0-9][0-9]°$', text: '000° to 359° (will incorrectly include 360° to 399°)' },
            { value: '^[〇一二三四五六七八九]{3}$', text: '999ChineseClub - 〇, 一, 二, 三, 四, 五, 六, 七, 八, 九' },
            { value: '^[〇一二三四五六七八九]{4}$', text: '10kChineseClub - 〇, 一, 二, 三, 四, 五, 六, 七, 八, 九' },
            { value: '^[〇一二三四五六七八九]{5}$', text: '100kChineseClub - 〇, 一, 二, 三, 四, 五, 六, 七, 八, 九' },
          ],
        },
        {
          label: 'Numerals',
          options: [
            { value: '^[0-9]*$', text: 'Latin Numerals - 0 to 9' },
            { value: '^[0-9a-fx]*$', text: 'Hexadecimal Numerals - 0 to 9, a to f, x' },
            { value: '^[\u0660-\u0669]*$', text: 'Arabic Numerals - ٠ to ٩' },
            /* { value: '^[\u1B50-\u1B59]*$', text: 'Balinese Numerals - ᭐, ᭑, ᭒, ᭓, ᭔, ᭕, ᭖, ᭗, ᭘, ᭙' }, - Cannot register */
            { value: '^[\u09E6-\u09EF]*$', text: 'Bengali Numerals - ০, ১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯' },
            { value: '^[〇一二三四五六七八九十百千万]*$', text: 'Chinese Numerals - 〇, 一, 二, 三, 四, 五, 六, 七, 八, 九, 十, 百, 千, 万' },
            { value: '^[\u0966-\u096F]*$', text: 'Devanagari (Hindi) Numerals - ०, १, २, ३, ४, ५, ६, ७, ८, ९' },
            { value: '^[\u1369-\u1371]*$', text: 'Ethiopic Numerals - ፩, ፪, ፫, ፬, ፭, ፮, ፯, ፰, ፱' },
            { value: '^[\u0AE6-\u0AEF]*$', text: 'Gujarati Numerals - ૦, ૧, ૨, ૩, ૪, ૫, ૬, ૭, ૮, ૯' },
            { value: '^[\u0A66-\u0A6F]*$', text: 'Gurmukhi Numerals - ੦, ੧, ੨, ੩, ੪, ੫, ੬, ੭, ੮, ੯' },
            { value: '^[\u17E0-\u17E9]*$', text: 'Khmer Numerals - ០, ១, ២, ៣, ៤, ៥, ៦, ៧, ៨, ៩' },
            { value: '^[\u0ED0-\u0ED9]*$', text: 'Lao Numerals - ໐, ໑, ໒, ໓, ໔, ໕, ໖, ໗, ໘, ໙' },
            { value: '^[\u1946-\u194F]*$', text: 'Limbu Numerals - ᥆, ᥇, ᥈, ᥉, ᥊, ᥋, ᥌, ᥍, ᥎, ᥏' },
            { value: '^[\u0D66-\u0D6F]*$', text: 'Malayalam Numerals - ൦, ൧, ൨, ൩, ൪, ൫, ൬, ൭, ൮, ൯' },
            { value: '^[᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙]*$', text: 'Mongolian Numerals - ᠐, ᠑, ᠒, ᠓, ᠔, ᠕, ᠖, ᠗, ᠘, ᠙' },
            { value: '^[\u1040-\u1049]*$', text: 'Myanmar Numerals - ၀, ၁, ၂, ၃, ၄, ၅, ၆, ၇, ၈, ၉' },
            /* { value: '^[\u19D0-\u19D9]*$', text: 'New Tai Lue Numerals - ᧐, ᧑, ᧒, ᧓, ᧔, ᧕, ᧖, ᧗, ᧘, ᧙' }, - Cannot register */
            { value: '^[\u0B66-\u0B6F]*$', text: 'Oriya Numerals - ୦, ୧, ୨, ୩, ୪, ୫, ୬, ୭, ୮, ୯' },
            /* { value: '^[𐒠𐒡𐒢𐒣𐒤𐒥𐒦𐒧𐒨𐒩]*$', text: 'Osmanya Numerals - 𐒠, 𐒡, 𐒢, 𐒣, 𐒤, 𐒥, 𐒦, 𐒧, 𐒨, 𐒩' }, - Cannot register */
            { value: '^[영일이삼사오육칠팔구]*$', text: 'Sino-Korean Numerals - 영, 일, 이, 삼, 사, 오, 육, 칠, 팔, 구' },
            { value: '^[\u0C66-\u0C6F]*$', text: 'Telugu Numerals - ౦, ౧, ౨, ౩, ౪, ౫, ౬, ౭, ౮, ౯' },
            { value: '^[\u0E50-\u0E59]*$', text: 'Thai Numerals - ๐ to ๙' },
            { value: '^[\u0F20-\u0F29]*$', text: 'Tibetan Numerals - ༠, ༡, ༢, ༣, ༤, ༥, ༦, ༧, ༨, ༩' },
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

      sortOptions: [
        { value: 'nameasc', text: '▲ Name' },
        { value: 'namedsc', text: '▼ Name' },
        { value: 'priceasc', text: '▲ Price' },
        { value: 'pricedsc', text: '▼ Price' },
        { value: 'expiryasc', text: '▲ Expiry' },
        { value: 'expirydsc', text: '▼ Expiry' },
        { value: 'registrationasc', text: '▲ Registration' },
        { value: 'registrationdsc', text: '▼ Registration' },
        { value: 'latesttransferdateasc', text: '▲ Latest Transfer Date' },
        { value: 'latesttransferdatedsc', text: '▼ Latest Transfer Date' },
        { value: 'creationdateasc', text: '▲ Creation Date' },
        { value: 'creationdatedsc', text: '▼ Creation Date' },
        { value: 'lengthname', text: '▲ Length, ▲ Name' },
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
      return store.getters['ensSearch/results'];
    },
    unregistered() {
      return store.getters['ensSearch/unregistered'];
    },
    progress() {
      return store.getters['ensSearch/progress'];
    },
    groups() {
      return store.getters['config/groups'];
    },
    prices() {
      return store.getters['ensSearch/prices'];
    },
    ensMap() {
      return store.getters['ensSearch/ensMap'];
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
      const searchAccounts = this.settings.filterAccount ? this.settings.filterAccount.split(/[, \t\n]+/).map(s => s.toLowerCase()) : [];
      const priceFrom = this.settings.priceFrom && parseFloat(this.settings.priceFrom) > 0 ? parseFloat(this.settings.priceFrom) : null;
      const priceTo = this.settings.priceTo && parseFloat(this.settings.priceTo) > 0 ? parseFloat(this.settings.priceTo) : null;
      const typeRegex = this.settings.type != null ? new RegExp(this.settings.type, 'i') : null;
      const lengthFrom = this.settings.lengthFrom && parseInt(this.settings.lengthFrom) >= 3 ? parseInt(this.settings.lengthFrom) : null;
      const lengthTo = this.settings.lengthTo && parseInt(this.settings.lengthTo) >= 3 ? parseInt(this.settings.lengthTo) : null;

      if (regex == null && priceFrom == null && priceTo == 0 && searchAccounts.length == 0 && this.settings.type == null && this.settings.lengthFrom == null && this.settings.lengthTo == null && !this.settings.palindrome) {
        for (result of Object.values(this.searchResults)) {
          results.push(result);
        }
      } else {
        for (result of Object.values(this.searchResults)) {
          let include = true;
          if (regex && !regex.test(result.labelName)) {
            include = false;
          }
          if (include && searchAccounts.length > 0) {
            let found = false;
            for (searchAccount of searchAccounts) {
              if (result.registrant.includes(searchAccount)) {
                found = true;
                break;
              }
            }
            if (!found) {
              include = false;
            }
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

          if (include && typeRegex && !typeRegex.test(result.labelName)) {
            include = false;
          }
          if (include && lengthFrom != null) {
            if (name == null || result.labelName.length < lengthFrom) {
              include = false;
            }
          }
          if (include && lengthTo != null) {
            if (name == null || result.labelName.length > lengthTo) {
              include = false;
            }
          }
          if (include && this.settings.palindrome) {
            if (result.labelName == null) {
              include = false;
            } else {
              const reverse = result.labelName.split('').reverse().join('');
              if (result.labelName !== reverse) {
                include = false;
              }
            }
          }

          if (include) {
            results.push(result);
          }
        }
      }

      if (this.settings.sortOption == 'nameasc') {
        results.sort((a, b) => ('' + a.labelName).localeCompare(b.labelName))
      } else if (this.settings.sortOption == 'namedsc') {
        results.sort((a, b) => ('' + b.labelName).localeCompare(a.labelName))
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
      } else if (this.settings.sortOption == 'latesttransferdateasc') {
        results.sort((a, b) => {
          const lastTransferBlockNumberA = a.lastTransfer && a.lastTransfer.blockNumber || null;
          const lastTransferBlockNumberB = b.lastTransfer && b.lastTransfer.blockNumber || null;
          if (lastTransferBlockNumberA == lastTransferBlockNumberB) {
            return ('' + a.labelName).localeCompare(b.labelName);
          } else if (lastTransferBlockNumberA != null && lastTransferBlockNumberB == null) {
            return -1;
          } else if (lastTransferBlockNumberA == null && lastTransferBlockNumberB != null) {
            return 1;
          } else {
            return lastTransferBlockNumberA - lastTransferBlockNumberB;
          }
        });
      } else if (this.settings.sortOption == 'latesttransferdatedsc') {
        results.sort((a, b) => {
          const lastTransferBlockNumberA = a.lastTransfer && a.lastTransfer.blockNumber || null;
          const lastTransferBlockNumberB = b.lastTransfer && b.lastTransfer.blockNumber || null;
          if (lastTransferBlockNumberA == lastTransferBlockNumberB) {
            return ('' + a.labelName).localeCompare(b.labelName);
          } else if (lastTransferBlockNumberA != null && lastTransferBlockNumberB == null) {
            return -1;
          } else if (lastTransferBlockNumberA == null && lastTransferBlockNumberB != null) {
            return 1;
          } else {
            return lastTransferBlockNumberB - lastTransferBlockNumberA;
          }
        });
      } else if (this.settings.sortOption == 'creationdateasc') {
        results.sort((a, b) => {
          const creationBlockNumberA = a.creation && a.creation.blockNumber || null;
          const creationBlockNumberB = b.creation && b.creation.blockNumber || null;
          if (creationBlockNumberA == creationBlockNumberB) {
            return ('' + a.labelName).localeCompare(b.labelName);
          } else if (creationBlockNumberA != null && creationBlockNumberB == null) {
            return -1;
          } else if (creationBlockNumberA == null && creationBlockNumberB != null) {
            return 1;
          } else {
            return creationBlockNumberA - creationBlockNumberB;
          }
        });
      } else if (this.settings.sortOption == 'creationdatedsc') {
        results.sort((a, b) => {
          const creationBlockNumberA = a.creation && a.creation.blockNumber || null;
          const creationBlockNumberB = b.creation && b.creation.blockNumber || null;
          if (creationBlockNumberA == creationBlockNumberB) {
            return ('' + a.labelName).localeCompare(b.labelName);
          } else if (creationBlockNumberA != null && creationBlockNumberB == null) {
            return -1;
          } else if (creationBlockNumberA == null && creationBlockNumberB != null) {
            return 1;
          } else {
            return creationBlockNumberB - creationBlockNumberA;
          }
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
    summary() {
      const collator = {};
      for (result of Object.values(this.filteredResults)) {
        const lengthGroup = (result.length >= 20 ? "20+" : result.length).toString().padStart(2, '0') + result.nameType;
        if (!collator[lengthGroup]) {
          collator[lengthGroup] = [result];
        } else {
          collator[lengthGroup].push(result);
        }
      }
      const results = [];
      for (const key of Object.keys(collator)) {
        const value = collator[key];
        results.push( { lengthGroup: key, results: value } );
      }
      results.sort((a, b) => {
        return ('' + a.lengthGroup).localeCompare(b.lengthGroup);
      });
      return results;
    },
    owners() {
      const collator = {};
      for (result of Object.values(this.filteredResults)) {
        const registrant = result.registrant;
        if (!collator[registrant]) {
          collator[registrant] = [result];
        } else {
          collator[registrant].push(result);
        }
      }
      const results = [];
      for (const key of Object.keys(collator)) {
        const value = collator[key];
        results.push( { registrant: key, length: value.length, results: value } );
      }
      results.sort((a, b) => {
        if (a.length == b.length) {
          return ('' + a.registrant).localeCompare(b.registrant);
        } else {
          return b.length - a.length;
        }
      });
      return results;
    },
    hours() {
      const collator = {};
      for (result of Object.values(this.filteredResults)) {
        const hh = parseInt(result.labelName.substring(0, 2));
        const mm = parseInt(result.labelName.slice(-2));
        if (!collator[mm]) {
          collator[mm] = Array(24).fill(null); // [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
          collator[mm][hh] = result;
        } else {
          collator[mm][hh] = result;
        }
      }
      const results = [];
      for (const key of Object.keys(collator)) {
        const hours = collator[key];
        results.push( { mm: key, hh: hours } );
      }
      return results;
    },
  },
  methods: {
    updateURL(where) {
      this.$router.push('/ens/' + where);
    },
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
    getName(a, length = 42) {
      const aLower = a.toLowerCase();
      if (aLower in this.ensMap) {
        return this.ensMap[aLower].substring(0, length);
      }
      return a == null ? null : a.substring(0, length);
    },

    setPowerOn() {
      store.dispatch('connection/setPowerOn', true);
      localStorage.setItem('powerOn', true);
      var t = this;
      setTimeout(function() {
        t.statusSidebar = true;
      }, 1500);
    },

    async scan(options) {
      store.dispatch('ensSearch/scan', options);
    },

    async halt() {
      store.dispatch('ensSearch/halt');
    },

    exportNames() {
      const rows = [
          ["No", "Label Name", "Name", "Price", "Registration Date", "Expiry Date", "Cost (ETH)", "Registrant", "Controller", "Resolver", "Resolved Address"],
      ];
      const timestamp = new Date(parseInt((new Date).getTime()/1000)*1000).toISOString().replace('T', '-').replaceAll(':', '-').replace('.000Z', '');
      let i = 1;
      for (const result of this.filteredResults) {
        rows.push([
          i,
          result.labelName,
          result.name,
          this.prices[result.tokenId] ? this.prices[result.tokenId].floorAskPrice : null,
          new Date(parseInt(result.registrationDate) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''),
          new Date(parseInt(result.expiryDate) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''),
          (result.cost ? ethers.utils.formatEther(result.cost) : null),
          result.registrant,
          result.owner,
          result.resolver,
          result.resolvedAddress,
        ]);
        i++;
      }

      let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "aenus_ens_export-" + timestamp + ".csv");
      document.body.appendChild(link); // Required for FF
      link.click(); // This will download the data with the specified file name
    },

    async timeoutCallback() {
      logDebug("ENSSearch", "timeoutCallback() count: " + this.count);

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
    logDebug("ENSSearch", "beforeDestroy()");
  },
  mounted() {
    logInfo("ENSSearch", "mounted() $route: " + JSON.stringify(this.$route.params) + ", props['search']: " + this.search + ", props['topic']: " + this.topic);

    // const tabIndex = this.tabs.findIndex(tab => tab === this.$route.hash)

    if (this.search == "names") {
      this.settings.searchTabIndex = 0;
    } else if (this.search == "contains") {
      this.settings.searchTabIndex = 1;
    } else if (this.search == "startswith") {
      this.settings.searchTabIndex = 2;
    } else if (this.search == "endswith") {
      this.settings.searchTabIndex = 3;
    } else if (this.search == "owned") {
      this.settings.searchTabIndex = 4;
    } else if (this.search == "groups") {
      this.settings.searchTabIndex = 5;
    } else if (this.search == "sets") {
      this.settings.searchTabIndex = 6;
    }

    if (this.topic) {
      this.settings.searchString = this.topic;
      // scan( { searchType: tabs[settings.searchTabIndex].name, search: settings.searchString, group: settings.selectedGroup, setAttributes: settings.setAttributes[settings.selectedSet] } );
      store.dispatch('ensSearch/scan', { searchType: this.search, search: this.topic, group: this.topic });
    }

    this.reschedule = true;
    logDebug("ENSSearch", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const ensSearchModule = {
  namespaced: true,
  state: {
    results: [],
    unregistered: [],
    tempResults: [],
    tempUnregistered: [],
    tempRegistrants: [],
    prices: [],
    ensMap: {},
    halt: false,
    progress: {
      message: null,
      completed: null,
      total: null,
    },
  },
  getters: {
    results: state => state.results,
    unregistered: state => state.unregistered,
    prices: state => state.prices,
    ensMap: state => state.ensMap,
    progress: state => state.progress,
  },
  mutations: {
    // --- Scan ---
    async scan(state, options) {
      // --- Scan functions ---
      function* getBatch(records, batchsize = ENSSUBGRAPHBATCHSCANSIZE) {
        while (records.length) {
          yield records.splice(0, batchsize);
        }
      }
      function* generateDigitSequence(setAttributes) {
        // logInfo("ensSearchModule", "mutations.scan().generateDigitSequence() - setAttributes: " + JSON.stringify(setAttributes));
        const regex = setAttributes.regex ? new RegExp(setAttributes.regex, 'i') : null;
        for (let i = setAttributes.from; i <= setAttributes.to; i = parseInt(i) + parseInt(setAttributes.step)) {
          let include = true;
          const number = i.toString().padStart(setAttributes.length, '0');
          if (setAttributes.palindrome) {
            const reverse = number.split('').reverse().join('');
            if (number !== reverse) {
              include = false;
            }
          }
          if (include && setAttributes.minMaxRepeatedCount > 1) {
            const maxRepeatedCount = maxCharacterCount(number);
            if (maxRepeatedCount < setAttributes.minMaxRepeatedCount) {
              include = false;
            }
          }
          if (include && setAttributes.minMaxConsecutiveCount > 1) {
            const parts = number.match(/(.)\1*/g);
            parts.sort((a, b) => b.length - a.length);
            const maxConsecutiveCount = parts[0].length;
            if (maxConsecutiveCount < setAttributes.minMaxConsecutiveCount) {
              include = false;
            }
          }
          if (include && regex) {
            if (!regex.test(number)) {
              include = false;
            }
          }
          if (include) {
            yield (setAttributes.prefix || '') + number + (setAttributes.postfix || '');
          }
        }
      }
      function* generateHourSequence(setAttributes) {
        const regex = setAttributes.regex ? new RegExp(setAttributes.regex, 'i') : null;
        for (let i = setAttributes.from; i <= setAttributes.to; i = parseInt(i) + parseInt(setAttributes.step)) {
          for (let j = setAttributes.from2; j <= setAttributes.to2; j = parseInt(j) + parseInt(setAttributes.step2)) {
            const number = i.toString().padStart(setAttributes.length, '0') + (setAttributes.separator || '') + j.toString().padStart(setAttributes.length, '0');
            let include = true;
            if (setAttributes.palindrome) {
              const reverse = number.split('').reverse().join('');
              if (number !== reverse) {
                include = false;
              }
            }
            if (include && regex) {
              if (!regex.test(number)) {
                include = false;
              }
            }
            if (include) {
              yield (setAttributes.prefix || '') + number + (setAttributes.postfix || '');
            }
          }
        }
      }
      function processRegistrations(registrations) {
        // console.log("processRegistrations: " + JSON.stringify(registrations, null, 2));
        const digits = new RegExp('^[0-9]+$');
        const hours = new RegExp('^[0-9][0-9]h[0-9][0-9]$');
        const alphanum = new RegExp('^[0-9a-z-]+$');

        for (const registration of registrations) {
          if (!(registration.registrant.id in state.tempRegistrants)) {
            state.tempRegistrants[registration.registrant.id] = true;
          }
          let nameType;
          if (digits.test(registration.domain.labelName)) {
            nameType = "1d";
          } else if (hours.test(registration.domain.labelName)) {
            nameType = "2h";
          } else if (alphanum.test(registration.domain.labelName)) {
            nameType = "3an";
          } else {
            nameType = "4";
          }

          let creation = null;
          const domainEvents = registration.domain.events.filter(e => (e.__typename === "NewOwner" || e.__typename === "NameTransferred"));
          if (domainEvents.length > 0) {
            domainEvents.sort((a, b) => a.blockNumber - b.blockNumber);
            let era = null;
            // reliancesteel prepunk1000 3698485
            if (domainEvents[0].blockNumber <= 3698485) {
              era = "prepunk1k";
            // wangyue.eth prepunk 10k 3740344
            } else if (domainEvents[0].blockNumber <= 3740344) {
              era = "prepunk10k";
            // holtrenfrew.eth prepunk 3919717
            } else if (domainEvents[0].blockNumber <= 3919717) {
              era = "prepunk";
            }
            creation = { blockNumber: domainEvents[0].blockNumber, txHash: domainEvents[0].transactionID, era };
          }

          let lastTransfer = null;
          const events = registration.events && registration.events.filter(e => (e.__typename === "NewOwner" || e.__typename === "NameTransferred")) || [];
          if (events.length > 0) {
            events.sort((a, b) => b.blockNumber - a.blockNumber);
            lastTransfer = { blockNumber: events[0].blockNumber, txHash: events[0].transactionID };
          }

          const maxRepeatedCount = maxCharacterCount(registration.labelName);

          let maxConsecutiveCount = 0;
          if (registration.labelName.length > 0) {
            const parts = registration.labelName.match(/(.)\1*/g);
            parts.sort((a, b) => b.length - a.length);
            maxConsecutiveCount = parts[0].length;
          }

          state.tempResults[registration.domain.name] = {
            labelName: registration.labelName,
            registrationDate: registration.registrationDate,
            expiryDate: registration.expiryDate,
            cost: registration.cost,
            registrant: registration.registrant.id,
            owner: registration.domain.owner.id,
            labelhash: registration.domain.labelhash,
            tokenId: new BigNumber(registration.domain.labelhash.substring(2), 16).toFixed(0),
            name: registration.domain.name,
            isMigrated: registration.domain.isMigrated,
            resolver: registration.domain.resolver && registration.domain.resolver.address || null,
            resolvedAddress: registration.domain.resolvedAddress && registration.domain.resolvedAddress.id || null,
            parent: registration.domain.parent.name,
            length: registration.domain.name.indexOf("\."),
            warn: registration.expiryDate < now ? 'red' : registration.expiryDate < warningDate ? 'orange' : null,
            hasAvatar: registration.domain.resolver && registration.domain.resolver.texts && registration.domain.resolver.texts.includes("avatar"),
            nameType: nameType,
            creation,
            lastTransfer,
            maxRepeatedCount,
            maxConsecutiveCount,
          };
          // console.log("state.tempResults[registration.domain.name]: " + JSON.stringify(state.tempResults[registration.domain.name]));
        }
      }
      async function fetchRegistrationsByNames(batch) {
        await fetch(ENSSUBGRAPHURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: ENSSUBGRAPHNAMEQUERY,
            variables: { labelNames: batch },
          })
        }).then(response => response.json())
          .then(data => processRegistrations(data.data.registrations))
          .catch(function(e) {
            console.log("error: " + e);
          });
        state.progress.completed = Object.keys(state.tempResults).length;
        const namesFound = Object.keys(state.tempResults).map(name => name.replace(/\.eth.*$/, ''));
        const unregistered = batch.filter(name => !namesFound.includes(name));
        state.tempUnregistered.push(...unregistered);
      }
      async function fetchRegistrationsByApproximateName(name, searchType) {
        let skip = 0;
        let completed = false;
        while (!completed && !state.halt) {
          let query = null;
          if (searchType == 'contains') {
            query = ENSSUBGRAPHNAMECONTAINSQUERY;
          } else if (searchType == 'startswith') {
            query = ENSSUBGRAPHNAMESTARTSWITHQUERY;
          } else {
            query = ENSSUBGRAPHNAMEENDSWITHQUERY;
          }
          const data = await fetch(ENSSUBGRAPHURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              query: query,
              variables: { labelName: name, first: ENSSUBGRAPHBATCHSIZE, skip },
            })
          }).then(response => response.json());
          const registrations = data.data && data.data.registrations || [];
          if (registrations.length == 0) {
            if (skip == 0) {
              state.tempUnregistered.push(name);
            }
            completed = true;
          } else {
            processRegistrations(data.data.registrations)
          }
          state.progress.completed = Object.keys(state.tempResults).length;
          skip += ENSSUBGRAPHBATCHSIZE;
        }
      }
      async function fetchRegistrationsByAccount(accounts) {
        for (account of accounts) {
          let skip = 0;
          let completed = false;
          while (!completed && !state.halt) {
            const data = await fetch(ENSSUBGRAPHURL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                query: ENSSUBGRAPHOWNEDQUERY,
                variables: { id: account, first: ENSSUBGRAPHBATCHSIZE, skip, expiryDate },
              })
            }).then(response => response.json())
            const registrations = data.data.account && data.data.account.registrations || [];
            if (registrations.length == 0) {
              completed = true;
            } else {
              processRegistrations(data.data.account.registrations);
            }
            state.progress.completed = Object.keys(state.tempResults).length;
            skip += ENSSUBGRAPHBATCHSIZE;
          }
        }
      }

      // --- Scan start ---
      // logInfo("ensSearchModule", "mutations.scan() - options: " + JSON.stringify(options));
      let generator = null;
      if (options.searchType == 'sets') {
        if (options.setAttributes.type == 'digits') {
          // logInfo("ensSearchModule", "mutations.scan() - digits");
          generator = generateDigitSequence(options.setAttributes);
        } else if (options.setAttributes.type == 'hours') {
          // logInfo("ensSearchModule", "mutations.scan() - hours");
          generator = generateHourSequence(options.setAttributes);
        }
      } else if (['names', 'owned', 'contains', 'startswith', 'endswith'].includes(options.searchType)) {
        const searchForNames = options.search == null ? [] : options.search.split(/[, \t\n]+/)
          .map(name => name.toLowerCase().trim())
          .filter(name => !(name.length == 42 && name.substring(0, 2) == '0x'))
          .map(name => name.replace(/\.eth.*$/, ''));
        generator = searchForNames[Symbol.iterator]();
      }
      // console.log( [...generator] );

      state.tempResults = {};
      state.tempUnregistered = [];
      state.tempRegistrants = {};
      const now = parseInt(new Date().valueOf() / 1000);
      const expiryDate = parseInt(now) - 90 * SECONDSPERDAY;
      const warningDate = parseInt(now) + 90 * SECONDSPERDAY;
      state.progress.total = null;
      state.progress.completed = 0;
      state.progress.message = "Names";

      if (generator) {
        if (['contains', 'startswith', 'endswith'].includes(options.searchType)) {
          let result = generator.next();
          while (!result.done && !state.halt) {
            await fetchRegistrationsByApproximateName(result.value, options.searchType);
            result = generator.next();
          }
        } else {
          let count = 0;
          let result = generator.next();
          let batch = [];
          while (!result.done && !state.halt) {
            batch.push(result.value);
            count++;
            if (count >= ENSSUBGRAPHBATCHSCANSIZE) {
              await fetchRegistrationsByNames(batch);
              count = 0;
              batch = [];
            }
            result = generator.next();
          }
          if (count > 0){
            await fetchRegistrationsByNames(batch);
          }
        }
        state.tempUnregistered.sort((a, b) => ('' + a).localeCompare(b));
        state.unregistered = state.tempUnregistered;
      }

      if (options.searchType == 'owned') {
        let searchForAccounts = options.search == null ? [] : options.search.split(/[, \t\n]+/)
          .map(name => name.toLowerCase().trim())
          .filter(name => name.length == 42 && name.substring(0, 2) == '0x');
        searchForAccounts = [ ...searchForAccounts, ...Object.keys(state.tempRegistrants) ];
        await fetchRegistrationsByAccount(searchForAccounts);
      } else if (options.searchType == 'groups') {
        let searchForAccounts = null;
        if (options.group == null) {
          if (store.getters['connection/coinbase'] != null) {
            searchForAccounts = [ store.getters['connection/coinbase'] ];
          }
        } else {
          searchForAccounts = store.getters['config/groups'][options.group].accounts.map(name => name.toLowerCase().trim());
        }
        await fetchRegistrationsByAccount(searchForAccounts);
      }
      state.results = state.tempResults;
      state.tempResults = {};
      state.tempUnregistered = [];
      state.tempRegistrants = {};

      // Get prices
      if (state.halt) {
        state.halt = false;
      }
      let keys = Object.keys(state.results);
      state.progress.message = null;
      state.progress.total = keys.length;
      state.progress.completed = 0;
      state.progress.message = "Prices";
      const GETPRICEBATCHSIZE = 20;
      const prices = {};
      const DELAYINMILLIS = 1000;
      for (let i = 0; i < keys.length && !state.halt; i += GETPRICEBATCHSIZE) {
        const batch = keys.slice(i, parseInt(i) + GETPRICEBATCHSIZE);
        let continuation = null;
        do {
          let url = "https://api.reservoir.tools/tokens/v5?";
          let separator = "";
          for (let j = 0; j < batch.length; j++) {
            const record = state.results[batch[j]];
            url = url + separator + "tokens=" + ENSADDRESS + "%3A" + record.tokenId;
            separator = "&";
          }
          url = url + (continuation != null ? "&continuation=" + continuation : '');
          const data = await fetch(url).then(response => response.json());
          state.progress.completed = parseInt(state.progress.completed) + data.tokens.length;
          // continuation = data.continuation;
          // console.log(JSON.stringify(data, null, 2));
          for (price of data.tokens) {
            prices[price.token.tokenId] = {
              floorAskPrice: price.market && price.market.floorAsk && price.market.floorAsk.price && price.market.floorAsk.price.amount && price.market.floorAsk.price.amount.decimal || null,
              source: price.market && price.market.floorAsk && price.market.floorAsk.source && price.market.floorAsk.source.name || null,
            };
          }
          await delay(DELAYINMILLIS);
        } while (continuation != null /*&& !state.halt && !state.sync.error */);
      }
      // console.log(JSON.stringify(prices, null, 2));
      state.prices = prices;

      // Get ENS
      if (state.halt) {
        state.halt = false;
      }
      const ensMap = {};
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        for (const [k, v] of Object.entries(state.results)) {
          for (const a of [v.registrant, v.owner, v.resolver, v.resolvedAddress]) {
            if (a) {
              const aLower = a.toLowerCase();
              if (!ensMap[aLower]) {
                ensMap[aLower] = aLower;
              }
            }
          }
        }
        // console.log(JSON.stringify(ensMap, null, 2));
        let addresses = Object.keys(ensMap);
        state.progress.message = null;
        state.progress.total = addresses.length;
        state.progress.completed = 0;
        state.progress.message = "ENS";
        const ensReverseRecordsContract = new ethers.Contract(ENSREVERSERECORDSADDRESS, ENSREVERSERECORDSABI, provider);
        const ENSOWNERBATCHSIZE = 200; // 500 fails occassionally
        for (let i = 0; i < addresses.length; i += ENSOWNERBATCHSIZE) {
          const batch = addresses.slice(i, parseInt(i) + ENSOWNERBATCHSIZE);
          const allnames = await ensReverseRecordsContract.getNames(batch);
          for (let j = 0; j < batch.length; j++) {
            const address = batch[j];
            const name = allnames[j];
            ensMap[address] = name != null && name.length > 0 ? name : address;
        //     // const normalized = normalize(address);
          }
          state.progress.completed = parseInt(state.progress.completed) + batch.length;
        }
        state.ensMap = ensMap;
      }

      state.progress.message = null;
      state.halt = false;
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    scan(context, options) {
      logInfo("ensSearchModule", "actions.scan() - options: " + JSON.stringify(options));
      context.commit('scan', options);
    },
    halt(context) {
      // logInfo("ensSearchModule", "actions.halt()");
      context.commit('halt');
    },
  },
};


// history.pushState({}, null, `${this.$route.path}#${encodeURIComponent(params)}`);
// history.pushState({}, null, `${this.$route.path}#blah`);

// console.log("navigator.userAgent: " + navigator.userAgent);
// console.log("isMobile: " + (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));
