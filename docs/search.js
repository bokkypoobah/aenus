const Search = {
  template: `
    <div class="mt-5 pt-3 pl-1 pr-1">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="false && (!powerOn || network.chainId != 1)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Ethereum mainnet and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="Search Registered ENS Names" class="border-0" header-class="p-0">

        <b-card no-body class="p-0 mt-1">

          <b-tabs card align="left" no-body active-tab-class="m-0 p-0" v-model="settings.searchTabIndex">
            <b-tab title="By Name" active>
            </b-tab>
            <b-tab title="By Owner">
            </b-tab>
            <b-tab title="By Group">
            </b-tab>
            <b-tab title="Scan Digits">
            </b-tab>
          </b-tabs>

          <b-card-body class="m-1 p-1">
            <div v-if="settings.searchTabIndex == 0">
              <b-row>
                <b-col cols="3" class="m-0 p-1 text-right">
                  Name
                </b-col>
                <b-col cols="4" class="m-0 p-1">
                  <b-form-textarea size="sm" v-model.trim="settings.searchString" placeholder="🔍 {name1}[.eth] {name2}[.eth], {name3}[.eth]\n{name4}[.eth] ..." rows="3" max-rows="100"></b-form-textarea>
                </b-col>
                <b-col cols="4" class="m-0 p-1">
                  <b-button size="sm" @click="search('name', settings.searchString, settings.selectedGroup)" :disabled="searchMessage != null" variant="primary">{{ searchMessage ? searchMessage : 'Search'}}</b-button>
                </b-col>
              </b-row>
            </div>

            <div v-if="settings.searchTabIndex == 1">
              <b-row>
                <b-col cols="3" class="m-0 p-1 text-right">
                  Name/addr
                </b-col>
                <b-col cols="4" class="m-0 p-1">
                  <b-form-textarea size="sm" v-model.trim="settings.searchString" placeholder="🔍 0x012345... 0x123456..., {name1}[.eth]\n{name2}[.eth] ..." rows="3" max-rows="100"></b-form-textarea>
                </b-col>
                <b-col cols="4" class="m-0 p-1">
                  <b-button size="sm" @click="search('owner', settings.searchString, settings.selectedGroup)" :disabled="searchMessage != null" variant="primary">{{ searchMessage ? searchMessage : 'Search'}}</b-button>
                  <span v-if="searchMessage != null">
                    <b-button size="sm" @click="stopScan" variant="primary">Stop Scan</b-button>
                  </span>
                </b-col>
              </b-row>
            </div>
            <div v-if="settings.searchTabIndex == 2">
              <b-row>
                <b-col cols="3" class="m-0 p-1 text-right">
                  Group
                </b-col>
                <b-col cols="4" class="m-0 p-1">
                  <b-form-select size="sm" v-model="settings.selectedGroup" :options="groupOptions" v-b-popover.hover="'Set up groups in Config'"></b-form-select>
                </b-col>
                <b-col cols="4" class="m-0 p-1">
                  <b-button size="sm" @click="search('group', settings.searchString, settings.selectedGroup)" :disabled="searchMessage != null" variant="primary">{{ searchMessage ? searchMessage : 'Search'}}</b-button>
                  <span v-if="searchMessage != null">
                    <b-button size="sm" @click="stopScan" variant="primary">Stop Scan</b-button>
                  </span>
                </b-col>
              </b-row>
            </div>
            <div v-if="settings.searchTabIndex == 3">
              <b-card-text>
                <b-row>
                  <b-col cols="3" class="m-0 p-1 text-right">
                    Digit Set
                  </b-col>
                  <b-col cols="4" class="m-0 p-1">
                    <b-form-select size="sm" v-model="settings.selectedDigit" :options="digitOptions" class="w-100"></b-form-select>
                  </b-col>
                  <b-col cols="4" class="m-0 p-1">
                  </b-col>
                </b-row>

                <b-row>
                  <b-col cols="3" class="m-0 p-1 text-right">
                    Prefix
                  </b-col>
                  <b-col cols="4" class="m-0 p-1">
                    <b-form-input type="text" size="sm" v-model.trim="settings.digitPrefix" placeholder="optional prefix, e.g., 'mr'" class="w-100"></b-form-input>
                  </b-col>
                  <b-col cols="4" class="m-0 p-1">
                  </b-col>
                </b-row>

                <b-row>
                  <b-col cols="3" class="m-0 p-1 text-right">
                    Postfix
                  </b-col>
                  <b-col cols="4" class="m-0 p-1">
                    <b-form-input type="text" size="sm" v-model.trim="settings.digitPostfix" placeholder="optional postfix, e.g., 'abc'" class="w-100"></b-form-input>
                  </b-col>
                  <b-col cols="4" class="m-0 p-1">
                  </b-col>
                </b-row>

                <b-row>
                  <b-col cols="3" class="m-0 p-1 text-right">
                    From
                  </b-col>
                  <b-col cols="4" class="m-0 p-1">
                    <b-form-input type="text" size="sm" v-model.trim="settings.digitRange[settings.selectedDigit].from" class="w-100"></b-form-input>
                  </b-col>
                  <b-col cols="4" class="m-0 p-1">
                  </b-col>
                </b-row>

                <b-row>
                  <b-col cols="3" class="m-0 p-1 text-right">
                    To
                  </b-col>
                  <b-col cols="4" class="m-0 p-1">
                    <b-form-input type="text" size="sm" v-model.trim="settings.digitRange[settings.selectedDigit].to" class="w-100"></b-form-input>
                  </b-col>
                  <b-col cols="4" class="m-0 p-1">
                    <b-button size="sm" @click="scanDigits(settings.selectedDigit, settings.digitRange[settings.selectedDigit].from, settings.digitRange[settings.selectedDigit].to, settings.digitRange[settings.selectedDigit].length, settings.digitPrefix, settings.digitPostfix)" :disabled="searchMessage != null" variant="primary">{{ searchMessage ? searchMessage : 'Search'}}</b-button>
                    <span v-if="searchMessage != null">
                      <b-button size="sm" @click="stopScan" variant="primary">Stop Scan</b-button>
                    </span>
                  </b-col>
                </b-row>

              </b-card-text>
            </div>
            <div v-if="settings.searchTabIndex == 4">
              <b-card-text>
                Hello 4
              </b-card-text>
            </div>

            <b-row>
              <b-col cols="3" class="m-0 p-1 text-right">
                Filter
              </b-col>
              <b-col cols="4" class="m-0 p-1">
                <b-form-input type="text" size="sm" v-model.trim="settings.filter" debounce="600" class="w-100" placeholder="🔍 name"></b-form-input>
              </b-col>
              <b-col cols="4" class="m-0 p-1">
                {{ filteredResults.length + ' of ' + Object.keys(searchResults).length }}
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="3" class="m-0 p-1 text-right">
                Sort
              </b-col>
              <b-col cols="4" class="m-0 p-1">
                <b-form-select size="sm" v-model="sortOption" :options="sortOptions" class="w-100"></b-form-select>
              </b-col>
              <b-col cols="4" class="m-0 p-1">
                <b-button size="sm" @click="exportNames" :disabled="Object.keys(searchResults).length == 0" variant="primary">Export</b-button>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>

        <!-- Results Section -->
        <b-card no-body class="p-0 mt-1">

          <b-card-body class="m-1 p-1">
            <b-tabs card align="left" no-body active-tab-class="m-0 p-0" v-model="settings.resultsTabIndex">
              <b-tab title="Summary">
              </b-tab>
              <b-tab title="Details">
              </b-tab>
              <b-tab title="Owners">
              </b-tab>
              <b-tab title="Not Registered" :disabled="notRegistered.length == 0">
              </b-tab>
            </b-tabs>

            <div v-if="settings.resultsTabIndex == 0">
              <div v-if="filteredResults.length == 0">
                <div v-if="settings.searchTabIndex == 0">
                  Enter a comma or space separated list of ENS names to search for and click Search. <em>.eth</em> is optional
                </div>
                <div v-if="settings.searchTabIndex == 1">
                  Enter a comma or space separated list of ENS name or ETH addresses to search for and click Search. <em>.eth</em> is optional
                </div>
                <div v-if="settings.searchTabIndex == 2">
                  Select an account group to search for and click Search
                </div>
              </div>
              <div v-else>
                <b-table small striped hover :fields="textFields" :items="summary" responsive="sm" class="mt-3">
                  <template #cell(names)="data">
                    <span v-for="(result, resultIndex) in data.item.results" :key="resultIndex">
                      <b-button :id="'popover-target-' + result.length + '-' + resultIndex" variant="link" class="m-0 p-0">
                        {{ result.labelName }}
                      </b-button>
                      <b-popover :target="'popover-target-' + result.length + '-' + resultIndex" placement="right">
                        <template #title>{{ result.name }} links</template>
                        <b-link :href="'https://app.ens.domains/name/' + result.name" v-b-popover.hover="'View in app.ens.domains'" target="_blank">
                          ENS
                        </b-link>
                        <br />
                        <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + result.tokenId" v-b-popover.hover="'View in opensea.io'" target="_blank">
                          OpenSea
                        </b-link>
                        <br />
                        <b-link :href="'https://looksrare.org/collections/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + result.tokenId" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                          LooksRare
                        </b-link>
                        <br />
                        <b-link :href="'https://x2y2.io/eth/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + result.tokenId" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                          X2Y2
                        </b-link>
                        <br />
                        <b-link :href="'https://etherscan.io/enslookup-search?search=' + result.name" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                          EtherScan
                        </b-link>
                        <br />
                        <b-link :href="'https://duckduckgo.com/?q=' + result.labelName" v-b-popover.hover="'Search name in duckduckgo.com'" target="_blank">
                          DuckDuckGo
                        </b-link>
                        <br />
                        <b-link :href="'https://www.google.com/search?q=' + result.labelName" v-b-popover.hover="'Search name in google.com'" target="_blank">
                          Google
                        </b-link>
                        <br />
                        <b-link :href="'https://twitter.com/search?q=' + result.name" v-b-popover.hover="'Search name in twitter.com'" target="_blank">
                          Twitter
                        </b-link>
                        <br />
                        <b-link :href="'https://wikipedia.org/wiki/' + result.labelName" v-b-popover.hover="'Search name in wikipedia.org'" target="_blank">
                          Wikipedia
                        </b-link>
                        <br />
                        <b-link :href="'https://en.wiktionary.org/wiki/' + result.labelName" v-b-popover.hover="'Search name in wiktionary.org'" target="_blank">
                          Wiktionary
                        </b-link>
                        <br />
                        <b-link :href="'https://thesaurus.yourdictionary.com/' + result.labelName" v-b-popover.hover="'Search name in thesaurus.yourdictionary.com'" target="_blank">
                          Thesaurus
                        </b-link>
                      </b-popover>
                    </span>
                  </template>
                </b-table>
              </div>
            </div>

            <div v-if="settings.resultsTabIndex == 1">
              <b-table small striped hover :fields="resultsFields" :items="filteredResults" responsive="sm" class="mt-3">
                <template #cell(index)="data">
                  {{ data.index+1 }}
                </template>
                <!--
                <template #cell(image)="data">
                  <b-img :width="'100%'" :src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + data.item.tokenId + '/image'"></b-img>
                  <div v-if="data.item.hasAvatar">
                    <b-img-lazy :width="'100%'" :src="'https://metadata.ens.domains/mainnet/avatar/' + data.item.name" />
                  </div>
                </template>
                -->
                <template #cell(name)="data">
                  <b-button :id="'popover-target-name-' + data.index" variant="link" class="m-0 p-0">
                    {{ data.item.name.substring(0, 64) }}
                  </b-button>
                  <b-popover :target="'popover-target-name-' + data.index" placement="right">
                    <template #title>{{ data.item.name.substring(0, 64) }}:</template>
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
                    <b-link :href="'https://etherscan.io/enslookup-search?search=' + data.item.name" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                      EtherScan
                    </b-link>
                    <br />
                    <b-link :href="'https://duckduckgo.com/?q=' + data.item.labelName" v-b-popover.hover="'Search name in duckduckgo.com'" target="_blank">
                      DuckDuckGo
                    </b-link>
                    <br />
                    <b-link :href="'https://www.google.com/search?q=' + data.item.labelName" v-b-popover.hover="'Search name in google.com'" target="_blank">
                      Google
                    </b-link>
                    <br />
                    <b-link :href="'https://twitter.com/search?q=' + data.item.name" v-b-popover.hover="'Search name in twitter.com'" target="_blank">
                      Twitter
                    </b-link>
                    <br />
                    <b-link :href="'https://wikipedia.org/wiki/' + data.item.labelName" v-b-popover.hover="'Search name in wikipedia.org'" target="_blank">
                      Wikipedia
                    </b-link>
                    <br />
                    <b-link :href="'https://en.wiktionary.org/wiki/' + data.item.labelName" v-b-popover.hover="'Search name in wiktionary.org'" target="_blank">
                      Wiktionary
                    </b-link>
                    <br />
                    <b-link :href="'https://thesaurus.yourdictionary.com/' + data.item.labelName" v-b-popover.hover="'Search name in thesaurus.yourdictionary.com'" target="_blank">
                      Thesaurus
                    </b-link>
                  </b-popover>
                  <!--
                  <br />
                  <br />
                  <font size="-2">Length: {{ data.item.length }}</font>
                  -->
                </template>
                <template #cell(registrant)="data">
                  <b-button :id="'popover-target-registrant-' + data.index" variant="link" class="m-0 p-0">
                    {{ data.item.registrant }}
                  </b-button>
                  <b-popover :target="'popover-target-registrant-' + data.index" placement="right">
                    <template #title>Registrant: {{ data.item.registrant.substring(0, 12) }}:</template>
                    <b-link :href="'https://opensea.io/' + data.item.registrant" v-b-popover.hover="'View in opensea.io'" target="_blank">
                      OpenSea
                    </b-link>
                    <br />
                    <b-link :href="'https://looksrare.org/accounts/' + data.item.registrant" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                      LooksRare
                    </b-link>
                    <br />
                    <b-link :href="'https://x2y2.io/user/' + data.item.registrant + '/items'" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                      X2Y2
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/address/' + data.item.registrant" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                      EtherScan
                    </b-link>
                  </b-popover>
                  <br />
                  <br />
                  <font size="-2">
                    <b-button size="sm" :id="'popover-target-owner-' + data.index" variant="link" class="m-0 p-0">
                      C: {{ data.item.owner }}
                    </b-button>
                    <b-popover :target="'popover-target-owner-' + data.index" placement="right">
                      <template #title>Controller: {{ data.item.owner.substring(0, 12) }}:</template>
                      <b-link :href="'https://opensea.io/' + data.item.owner" v-b-popover.hover="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/accounts/' + data.item.owner" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/user/' + data.item.owner + '/items'" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/address/' + data.item.owner" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                        EtherScan
                      </b-link>
                    </b-popover>
                  </font>
                  <br />
                  <font size="-2">
                    <b-button size="sm" :id="'popover-target-resolvedAddress-' + data.index" variant="link" class="m-0 p-0">
                      RA: {{ data.item.resolvedAddress }}
                    </b-button>
                    <b-popover :target="'popover-target-resolvedAddress-' + data.index" placement="right">
                      <template #title>Resolved Addr: {{ data.item.resolvedAddress.substring(0, 12) }}:</template>
                      <b-link :href="'https://opensea.io/' + data.item.resolvedAddress" v-b-popover.hover="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/accounts/' + data.item.resolvedAddress" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/user/' + data.item.resolvedAddress + '/items'" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/address/' + data.item.resolvedAddress" v-b-popover.hover="'View in etherscan.io'" target="_blank">
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
                <!--
                <template #cell(registrationDate)="data">
                  {{ formatDate(data.item.registrationDate) }}
                </template>
                -->
                <!--
                <template #cell(links)="data">
                  <b-link :href="'https://app.ens.domains/name/' + data.item.name" v-b-popover.hover="'View in app.ens.domains'" target="_blank">
                    ens
                  </b-link>
                  <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover="'View in opensea.io'" target="_blank">
                    os
                  </b-link>
                  <b-link :href="'https://looksrare.org/collections/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                    lr
                  </b-link>
                  <b-link :href="'https://etherscan.io/enslookup-search?search=' + data.item.name" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                    es
                  </b-link>
                  <b-link :href="'https://duckduckgo.com/?q=' + data.item.labelName" v-b-popover.hover="'Search name in duckduckgo.com'" target="_blank">
                    ddg
                  </b-link>
                  <b-link :href="'https://www.google.com/search?q=' + data.item.labelName" v-b-popover.hover="'Search name in google.com'" target="_blank">
                    g
                  </b-link>
                  <b-link :href="'https://twitter.com/search?q=' + data.item.name" v-b-popover.hover="'Search name in twitter.com'" target="_blank">
                    t
                  </b-link>
                  <b-link :href="'https://wikipedia.org/wiki/' + data.item.labelName" v-b-popover.hover="'Search name in wikipedia.org'" target="_blank">
                    wiki
                  </b-link>
                  <b-link :href="'https://en.wiktionary.org/wiki/' + data.item.labelName" v-b-popover.hover="'Search name in wiktionary.org'" target="_blank">
                    wikt
                  </b-link>
                  <b-link :href="'https://thesaurus.yourdictionary.com/' + data.item.labelName" v-b-popover.hover="'Search name in thesaurus.yourdictionary.com'" target="_blank">
                    thes
                  </b-link>
                </template>
                -->
              </b-table>
            </div>

            <div v-if="settings.resultsTabIndex == 2">
              <b-table small striped hover :fields="ownershipFields" :items="ownership" responsive="sm" class="mt-3">
                <template #cell(index)="data">
                  {{ data.index+1 }}
                </template>
                <template #cell(registrant)="data">
                  <b-button :id="'popover-target-owner-' + data.item.registrant + '-' + data.index" variant="link" class="m-0 p-0">
                    {{ data.item.registrant }}
                  </b-button>
                  <b-popover :target="'popover-target-owner-' + data.item.registrant + '-' + data.index" placement="right">
                    <template #title>Registrant: {{ data.item.registrant.substring(0, 12) }}:</template>
                    <b-link :href="'https://opensea.io/' + data.item.registrant" v-b-popover.hover="'View in opensea.io'" target="_blank">
                      OpenSea
                    </b-link>
                    <br />
                    <b-link :href="'https://looksrare.org/accounts/' + data.item.registrant" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                      LooksRare
                    </b-link>
                    <br />
                    <b-link :href="'https://x2y2.io/user/' + data.item.registrant + '/items'" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                      X2Y2
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/address/' + data.item.registrant" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                      EtherScan
                    </b-link>
                  </b-popover>
                </template>
                <template #cell(names)="data">
                  <span v-for="(result, resultIndex) in data.item.results" :key="resultIndex">
                    <b-button :id="'popover-target-' + data.item.registrant + '-' + resultIndex" variant="link" class="m-0 p-0">
                      {{ result.labelName }}
                    </b-button>
                    <b-popover :target="'popover-target-' + data.item.registrant + '-' + resultIndex" placement="right">
                      <template #title>{{ result.name }} links</template>
                      <b-link :href="'https://app.ens.domains/name/' + result.name" v-b-popover.hover="'View in app.ens.domains'" target="_blank">
                        ENS
                      </b-link>
                      <br />
                      <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + result.tokenId" v-b-popover.hover="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/collections/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + result.tokenId" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/eth/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + result.tokenId" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/enslookup-search?search=' + result.name" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                        EtherScan
                      </b-link>
                      <br />
                      <b-link :href="'https://duckduckgo.com/?q=' + result.labelName" v-b-popover.hover="'Search name in duckduckgo.com'" target="_blank">
                        DuckDuckGo
                      </b-link>
                      <br />
                      <b-link :href="'https://www.google.com/search?q=' + result.labelName" v-b-popover.hover="'Search name in google.com'" target="_blank">
                        Google
                      </b-link>
                      <br />
                      <b-link :href="'https://twitter.com/search?q=' + result.name" v-b-popover.hover="'Search name in twitter.com'" target="_blank">
                        Twitter
                      </b-link>
                      <br />
                      <b-link :href="'https://wikipedia.org/wiki/' + result.labelName" v-b-popover.hover="'Search name in wikipedia.org'" target="_blank">
                        Wikipedia
                      </b-link>
                      <br />
                      <b-link :href="'https://en.wiktionary.org/wiki/' + result.labelName" v-b-popover.hover="'Search name in wiktionary.org'" target="_blank">
                        Wiktionary
                      </b-link>
                      <br />
                      <b-link :href="'https://thesaurus.yourdictionary.com/' + result.labelName" v-b-popover.hover="'Search name in thesaurus.yourdictionary.com'" target="_blank">
                        Thesaurus
                      </b-link>
                    </b-popover>
                  </span>
                </template>
              </b-table>
            </div>

            <div v-if="settings.resultsTabIndex == 3">
              <b-card-text class="m-2 p-2">
                <b-row v-for="(name, index) in notRegistered" :key="index">
                  <b-col cols="1" class="text-right">
                    {{ index+1 }}
                  </b-col>
                  <b-col cols="6">
                    <b-link :href="'https://app.ens.domains/name/' + name + '.eth'" v-b-popover.hover="'Register in app.ens.domains'" target="_blank">
                      {{ name + '.eth' }}
                    </b-link>
                  </b-col>
                </b-row>
              </b-card-text>
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

      settings: {
        searchTabIndex: 0,
        searchString: null,
        selectedGroup: null,
        selectedDigit: 'digit999',
        digitPrefix: null,
        digitPostfix: null,
        filter: null,

        digitRange: {
          'digit9': {
            from: 0,
            to: 9,
            length: 1,
          },
          'digit99': {
            from: 0,
            to: 99,
            length: 2,
          },
          'digit999': {
            from: 0,
            to: 999,
            length: 3,
          },
          'digit9999': {
            from: 0,
            to: 9999,
            length: 4,
          },
          'digit99999': {
            from: 0,
            to: 99999,
            length: 5,
          },
          'digit999999': {
            from: 0,
            to: 999999,
            length: 6,
          },
        },

        resultsTabIndex: 0,
      },

      digitOptions: [
        { value: 'digit9', text: '0 to 9, prefix/postfix required for min 3 length' },
        { value: 'digit99', text: '00 to 99, prefix/postfix required for min 3 length' },
        { value: 'digit999', text: '000 to 999' },
        { value: 'digit9999', text: '0000 to 9999' },
        { value: 'digit99999', text: '00000 to 99999' },
        { value: 'digit999999', text: '000000 to 999999' },
        // { value: 'nameasc', text: '0-0 - 9-9' },
      ],

      sortOption: 'nameasc',
      results: [],

      sortOptions: [
        { value: 'nameasc', text: 'Name Ascending' },
        { value: 'namedsc', text: 'Name Descending' },
        { value: 'expiryasc', text: 'Expiry Ascending' },
        { value: 'expirydsc', text: 'Expiry Descending' },
        { value: 'registrationasc', text: 'Registration Ascending' },
        { value: 'registrationdsc', text: 'Registration Descending' },
        { value: 'lengthname', text: 'Length Ascending, Name Ascending' },
        { value: 'random', text: 'Random' },
      ],

      resultsFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;' },
        // { key: 'image', label: 'Image', thStyle: 'width: 10%;', sortable: false },
        { key: 'name', label: 'Name', thStyle: 'width: 40%;', sortable: false },
        { key: 'registrant', label: 'Registrant/Controller/Resolved Address', thStyle: 'width: 35%;', sortable: false },
        { key: 'expiryDate', label: 'Expiry/Registration (UTC)', thStyle: 'width: 20%;', sortable: false },
        // { key: 'registrationDate', label: 'Registration (UTC)', thStyle: 'width: 15%;', sortable: false },
        // { key: 'length', label: 'Length', thStyle: 'width: 10%;', sortable: false },
        // { key: 'links', label: 'Links', thStyle: 'width: 10%;' },
      ],
      textFields: [
        { key: 'lengthGroup', label: 'Length', thStyle: 'width: 10%;' },
        { key: 'names', label: 'Names', thStyle: 'width: 90%;' },
      ],
      ownershipFields: [
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
      return store.getters['search/results'];
    },
    notRegistered() {
      return store.getters['search/notRegistered'];
    },
    searchMessage() {
      return store.getters['search/message'];
    },
    groups() {
      return store.getters['config/groups'];
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
      const results = [];
      // let regexConst = this.search != null && this.search.length > 0 ? new RegExp(this.search) : null;
      // if (regexConst != null) {
      //   console.log("Search.filteredResults() - search: " + JSON.stringify(this.search));
      //   console.log("Search.filteredResults() - regexConst: " + JSON.stringify(regexConst.toString()));
      // }
      let regexConst = null;
      if (this.settings.filter != null && this.settings.filter.length > 0) {
        // let search = this.search.replace("$", "\\\$");
        let filter = this.settings.filter;
        // let filter = /god\$/;
        regexConst = new RegExp(filter);
        // regexConst = /god/;
        // console.log("Search.filteredResults() - filter: " + JSON.stringify(filter));
        // console.log("Search.filteredResults() - regexConst: " + JSON.stringify(regexConst.toString()));
      }
      for (result of Object.values(this.searchResults)) {
        if (this.settings.filter == null || this.settings.filter.length == 0) {
          results.push(result);
        } else {
          if (regexConst.test(result.name)) {
            results.push(result);
          }
        }
      }

      if (this.sortOption == 'nameasc') {
        results.sort(function (a, b) {
            return ('' + a.name).localeCompare(b.name);
        })
      } else if (this.sortOption == 'namedsc') {
        results.sort(function (a, b) {
            return ('' + b.name).localeCompare(a.name);
        })
      } else if (this.sortOption == 'expiryasc') {
        results.sort((a, b) => {
          return a.expiryDate - b.expiryDate;
        });
      } else if (this.sortOption == 'expirydsc') {
        results.sort((a, b) => {
          return b.expiryDate - a.expiryDate;
        });
      } else if (this.sortOption == 'registrationasc') {
        results.sort((a, b) => {
          return a.registrationDate - b.registrationDate;
        });
      } else if (this.sortOption == 'registrationdsc') {
        results.sort((a, b) => {
          return b.registrationDate - a.registrationDate;
        });
      } else if (this.sortOption == 'lengthname') {
        results.sort((a, b) => {
          if (a.length == b.length) {
            return ('' + a.name).localeCompare(b.name);
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
    summary() {
      const collator = {};
      for (result of Object.values(this.filteredResults)) {
        const lengthGroup = result.length >= 5 ? "5+" : result.length;
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
      return results;
    },
    ownership() {
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
          return new Date(parseInt(d) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''); // .substring(4);
        } else {
          return new Date(d).toDateString().substring(4);
        }
      }
    },

    setPowerOn() {
      store.dispatch('connection/setPowerOn', true);
      localStorage.setItem('powerOn', true);
      var t = this;
      setTimeout(function() {
        t.statusSidebar = true;
      }, 1500);
    },

    async search(searchType, searchString, searchGroup) {
      // console.log("search: " + searchType + ", " + searchString + ", " + searchGroup);
      store.dispatch('search/search', { searchType, searchString, searchGroup } );
    },

    async scanDigits(selectedDigit, scanFrom, scanTo, length, digitPrefix, digitPostfix) {
      console.log("search: " + selectedDigit + ", " + scanFrom + ", " + scanTo + ", " + length + ", " + digitPrefix + ", " + digitPostfix);
      store.dispatch('search/scanDigits', { selectedDigit, scanFrom, scanTo, length, digitPrefix, digitPostfix } );
    },

    async stopScan() {
      console.log("stopScan");
      store.dispatch('search/stopScan');
    },

    exportNames() {
      const rows = [
          ["No", "Label Name", "Name", "Registration Date", "Expiry Date", "Cost (ETH)", "Registrant", "Controller", "Resolver", "Resolved Address"],
      ];
      const timestamp = new Date(parseInt((new Date).getTime()/1000)*1000).toISOString().replace('T', '-').replaceAll(':', '-').replace('.000Z', '');
      let i = 1;
      for (const result of this.filteredResults) {
        rows.push([
          i,
          result.labelName,
          result.name,
          new Date(parseInt(result.registrationDate) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''),
          new Date(parseInt(result.expiryDate) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''),
          ethers.utils.formatEther(result.cost),
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
      link.setAttribute("download", "ensutil_export-" + timestamp + ".csv");
      document.body.appendChild(link); // Required for FF
      link.click(); // This will download the data with the specified file name
    },

    async timeoutCallback() {
      logDebug("Search", "timeoutCallback() count: " + this.count);

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
    logDebug("Search", "beforeDestroy()");
  },
  mounted() {
    logInfo("Search", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("Search", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const searchModule = {
  namespaced: true,
  state: {
    results: [],
    notRegistered: [],
    message: null,
    stopScan: false,

    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    results: state => state.results,
    notRegistered: state => state.notRegistered,
    message: state => state.message,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    async search(state, { searchType, searchString, searchGroup } ) {
      logInfo("searchModule", "mutations.search(): " + searchType + ", " + searchString + ", " + searchGroup);
      // const DELAYINMILLIS = 500;
      // const delay = ms => new Promise(res => setTimeout(res, ms));

      const results = {};
      const now = parseInt(new Date().valueOf() / 1000);
      const expiryDate = parseInt(now) - 90 * 24 * 60 * 60;
      const warningDate = parseInt(now) + 90 * 24 * 60 * 60;

      let searchForAccounts = [];
      if (searchType == 'name' || searchType == 'owner') {
        const searchForNames = searchString == null ? [] : searchString.split(/[, \t\n]+/)
          .map(function(name) { return name.toLowerCase().trim(); })
          .filter(function (name) { return !(name.length == 42 && name.substring(0, 2) == '0x'); })
          .map(function(name) { return name.replace('.eth', ''); });
        searchForAccounts = searchString == null ? [] : searchString.split(/[, \t\n]+/)
          .map(function(name) { return name.toLowerCase().trim(); })
          .filter(function (name) { return name.length == 42 && name.substring(0, 2) == '0x'; });
        // logInfo("searchModule", "mutations.search() - searchString: " + searchString);
        // logInfo("searchModule", "mutations.search() - searchForNames: " + JSON.stringify(searchForNames, null, 2));
        // logInfo("searchModule", "mutations.search() - searchForAccounts: " + JSON.stringify(searchForAccounts, null, 2));

        const data = await fetch(ENSSUBGRAPHURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: ENSSUBGRAPHNAMEQUERY,
            variables: { labelNames: searchForNames },
          })
        }).then(response => response.json());
        // logInfo("searchModule", "mutations.search() - data: " + JSON.stringify(data, null, 2));
        const registrations = data.data.registrations || [];
        const registrantMap = {};
        // logInfo("searchModule", "mutations.search() - registrations: " + JSON.stringify(registrations, null, 2));
        for (registration of registrations) {
          // logInfo("searchModule", "mutations.search() - registration: " + JSON.stringify(registration, null, 2));
          if (searchType == 'owner') {
            registrantMap[registration.registrant.id] = true;
          }
          results[registration.domain.name] = {
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
          };
        }
        // logInfo("searchModule", "mutations.search() - results: " + JSON.stringify(Object.keys(results), null, 2));
        const namesFound = Object.keys(results).map(function(name) { return name.replace('.eth', ''); });
        // logInfo("searchModule", "mutations.search() - namesFound: " + JSON.stringify(namesFound, null, 2));
        state.notRegistered = searchForNames.filter(name => !namesFound.includes(name));
        // logInfo("searchModule", "mutations.search() - notRegistered: " + JSON.stringify(state.notRegistered, null, 2));
        state.notRegistered.sort(function (a, b) {
            return ('' + a).localeCompare(b);
        })
        // logInfo("searchModule", "mutations.search() - notRegistered sorted: " + JSON.stringify(state.notRegistered, null, 2));
        // logInfo("searchModule", "mutations.search() - registrantMap sorted: " + JSON.stringify(registrantMap, null, 2));

        searchForAccounts = [ ...searchForAccounts, ...Object.keys(registrantMap) ];
        // logInfo("searchModule", "mutations.search() - searchForAccounts: " + JSON.stringify(searchForAccounts, null, 2));
      } else {
        state.notRegistered = [];
      }

      if (searchType == 'owner' || searchType == 'group') {
        if (searchType == 'group') {
          if (searchGroup == null) {
            if (store.getters['connection/coinbase'] != null) {
              searchForAccounts = [ ...searchForAccounts, store.getters['connection/coinbase'] ];
            }
          } else {
            let group = store.getters['config/groups'][searchGroup];
            searchForAccounts = [ ...searchForAccounts, ...group.accounts ];
          }
        }
        // logInfo("searchModule", "mutations.search() - searchForAccounts: " + JSON.stringify(searchForAccounts));
        // logInfo("searchModule", "mutations.search() - expiryDate: " + expiryDate + " = " + new Date(expiryDate * 1000));
        state.message = "Retrieving";
        for (account of searchForAccounts) {
          // logInfo("searchModule", "mutations.search() - account: " + JSON.stringify(account));
          const first = ENSSUBGRAPHBATCHSIZE;
          const id = account.toLowerCase();
          let skip = 0;
          // console.log(JSON.stringify({ query, variables: { id, first, skip, expiryDate } }));
          let completed = false;
          let records = 0;
          while (!completed && !state.stopScan) {
            const data = await fetch(ENSSUBGRAPHURL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                query: ENSSUBGRAPHOWNEDQUERY,
                variables: { id, first, skip, expiryDate },
              })
            }).then(response => response.json());
            // if (skip == 0) {
            //   logInfo("searchModule", "mutations.search() - data: " + JSON.stringify(data, null, 2));
            // }
            const registrations = data.data.account && data.data.account.registrations || [];
            if (registrations.length == 0) {
              completed = true;
            } else {
              records = records + registrations.length;
              state.message = "Retrieved " + records;
              for (registration of registrations) {
                // if (registration.domain.name == "test.eth") {
                //   console.log(JSON.stringify(registration, null, 2));
                // }
                results[registration.domain.name] = {
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
                };
                // console.log(JSON.stringify(registration, null, 2));
                // console.log("resolvedAddress: " + JSON.stringify(registration.domain.resolvedAddres));
                // console.log(JSON.stringify(results[registration.domain.name], null, 2));
              }
              // this.results = results;
            }
            skip += ENSSUBGRAPHBATCHSIZE;
          }
        }
      }
      state.results = results;
      state.message = null;
      state.stopScan = false;
      // logInfo("searchModule", "mutations.search() - results: " + JSON.stringify(results, null, 2));

    },

    stopScan(state) {
      state.stopScan = true;
    },

    async scanDigits(state, { selectedDigit, scanFrom, scanTo, length, digitPrefix, digitPostfix } ) {
      const generateRangeZeroPad = (start, stop, step, length, digitPrefix, digitPostfix) => Array.from({ length: (stop - start) / step + 1}, (_, i) => (digitPrefix || '') + (parseInt(start) + (i * step)).toString().padStart(length, '0') + (digitPostfix || ''));

      logInfo("searchModule", "mutations.scanDigits(): " + selectedDigit + ", " + scanFrom + ", " + scanTo + ", " + length + ", " + digitPrefix + ", " + digitPostfix);
      const results = {};
      const now = parseInt(new Date().valueOf() / 1000);
      const expiryDate = parseInt(now) - 90 * 24 * 60 * 60;
      const warningDate = parseInt(now) + 90 * 24 * 60 * 60;
      state.message = "Retrieving";
      state.notRegistered = [];
      let records = 0;
      for (let iBatch = scanFrom; iBatch < scanTo && !state.stopScan; iBatch = parseInt(iBatch) + ENSSUBGRAPHBATCHSCANSIZE) {
        // logInfo("searchModule", "mutations.scanDigits() - iBatch: " + iBatch);
        const max = (parseInt(iBatch) + ENSSUBGRAPHBATCHSCANSIZE - 1) < scanTo ? parseInt(iBatch) + ENSSUBGRAPHBATCHSCANSIZE - 1: scanTo;
        // logInfo("searchModule", "mutations.scanDigits() - from: " + iBatch + " to " + max);
        const numbers = generateRangeZeroPad(iBatch, max, 1, length, digitPrefix, digitPostfix);
        // logInfo("searchModule", "mutations.scanDigits() - numbers: " + numbers);

        // console.log(JSON.stringify({ ENSSUBGRAPHNAMEQUERY, variables: { labelNames: numbers } }));

        const data = await fetch(ENSSUBGRAPHURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: ENSSUBGRAPHNAMEQUERY,
            variables: { labelNames: numbers },
          })
        }).then(response => response.json());
        // logInfo("searchModule", "mutations.search() - data: " + JSON.stringify(data, null, 2));
        const registrations = data.data.registrations || [];
        records = records + registrations.length;
        state.message = "Retrieved " + records;
        for (registration of registrations) {
          results[registration.domain.name] = {
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
          };
        }
        const namesFound = Object.keys(results).map(function(name) { return name.replace('.eth', ''); });
        // logInfo("searchModule", "mutations.scanDigits() - namesFound: " + JSON.stringify(namesFound, null, 2));
        const notRegistered = numbers.filter(name => !namesFound.includes(name));
        // logInfo("searchModule", "mutations.scanDigits() - notRegistered: " + JSON.stringify(notRegistered, null, 2));
        state.notRegistered.push(...notRegistered);
        // logInfo("searchModule", "mutations.scanDigits() - all notRegistered: " + JSON.stringify(state.notRegistered, null, 2));
      }
      state.results = results;
      state.message = null;
      state.stopScan = false;
      state.notRegistered.sort(function (a, b) {
          return ('' + a).localeCompare(b);
      })
    },
  },
  actions: {
    search(context, { searchType, searchString, searchGroup } ) {
      // logInfo("searchModule", "actions.search(): " + searchType + ", " + searchString + ", " + searchGroup);
      context.commit('search', { searchType, searchString, searchGroup } );
    },
    scanDigits(context, { selectedDigit, scanFrom, scanTo, length, digitPrefix, digitPostfix } ) {
      logInfo("searchModule", "actions.scanDigits(): " + selectedDigit + ", " + scanFrom + ", " + scanTo + ", " + length + ", " + digitPrefix + ", " + digitPostfix);
      context.commit('scanDigits', { selectedDigit, scanFrom, scanTo, length, digitPrefix, digitPostfix } );
    },
    stopScan(context) {
      logInfo("searchModule", "actions.stopScan()");
      context.commit('stopScan');
    },
  },
};


// history.pushState({}, null, `${this.$route.path}#${encodeURIComponent(params)}`);
// history.pushState({}, null, `${this.$route.path}#blah`);

// console.log("navigator.userAgent: " + navigator.userAgent);
// console.log("isMobile: " + (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));
