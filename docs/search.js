const Search = {
  template: `
    <div class="mt-5 pt-3">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="false && (!powerOn || network.chainId != 1)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Ethereum mainnet and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="Search" class="border-0" header-class="p-1">
        <b-card no-body class="border-0 m-0 mt-2">
          <b-card-body class="p-0">

            <div>
              <b-card no-body class="mt-2">
                <b-card class="mb-2">
                  <template #header>
                    <h6>
                      Registered ENS Names
                    </h6>
                  </template>

                  <b-row v-if="settings.searchOption == 'single'">
                    <b-col cols="2" class="m-0 p-1 text-right">
                      ENS name
                    </b-col>
                    <b-col cols="6" class="m-0 p-1">
                      <b-form-input t6pe="text" size="sm" v-model.trim="settings.searchString" placeholder="🔍 {name1}[.eth] {name2}[.eth], {name3}[.eth] ..."></b-form-input>
                    </b-col>
                    <b-col cols="2" class="m-0 p-1">
                    </b-col>
                  </b-row>
                  <b-row v-if="settings.searchOption == 'owned'">
                    <b-col cols="2" class="m-0 p-1 text-right">
                      Account or ENS name
                    </b-col>
                    <b-col cols="6" class="m-0 p-1">
                      <b-form-input type="text" size="sm" v-model.trim="settings.searchString" placeholder="🔍 0x012345... 0x123456..., {name1}[.eth] {name2}[.eth] ..."></b-form-input>
                    </b-col>
                    <b-col cols="2" class="m-0 p-1">
                    </b-col>
                  </b-row>
                  <b-row v-if="settings.searchOption == 'group'">
                    <b-col cols="2" class="m-0 p-1 text-right">
                      Account Group
                    </b-col>
                    <b-col cols="6" class="m-0 p-1">
                      <b-form-select size="sm" v-model="settings.selectedGroup" :options="groupOptions" v-b-popover.hover="'Set up groups in Config'" ></b-form-select>
                    </b-col>
                    <b-col cols="2" class="m-0 p-1">
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="2" class="m-0 p-1 text-right">
                      Search By
                    </b-col>
                    <b-col cols="6" class="m-0 p-1">
                      <b-form-radio-group v-model="settings.searchOption" :options="searchOptions">
                      </b-form-radio-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="2" class="m-0 p-1 text-right">
                    </b-col>
                    <b-col cols="6" class="m-0 p-1">
                      <b-button size="sm" @click="retrieveNames" :disabled="retrievingMessage != null" variant="warning">{{ retrievingMessage ? retrievingMessage : 'Retrieve Names'}}</b-button>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="2" class="m-0 p-1 text-right">
                      Filter
                    </b-col>
                    <b-col cols="4" class="m-0 p-1">
                      <b-form-input type="text" size="sm" v-model.trim="settings.filter" debounce="600" class="w-100" placeholder="🔍 name"></b-form-input>
                    </b-col>
                    <b-col cols="2" class="m-0 p-1">
                      {{ filteredResults.length + ' of ' + Object.keys(results).length }}
                    </b-col>
                  </b-row>

                  <!--
                  <br />
                  <br />
                  <br />

                  <b-form-group label-cols="2" label-size="sm" label="Account Group">
                    <b-form-select size="sm" v-model="settings.selectedGroup" :options="groupOptions" class="w-50"></b-form-select>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="">
                    <b-button size="sm" @click="retrieveNames" :disabled="retrievingMessage != null" variant="warning">{{ retrievingMessage ? retrievingMessage : 'Retrieve Names'}}</b-button>
                  </b-form-group>
                  -->
                  <!--
                  <b-form-group label-cols="2" label-size="sm" label="Sort">
                    <b-form-select size="sm" v-model="sortOption" :options="sortOptions" class="w-25"></b-form-select>
                  </b-form-group>
                  -->
                  <!--
                  <b-form-group label-cols="2" label-size="sm" label="Filter" :description="filteredResults.length + ' of ' + Object.keys(results).length">
                    <b-form-input type="text" size="sm" v-model.trim="settings.filter" debounce="600" class="w-25" placeholder="🔍 name"></b-form-input>
                  </b-form-group>
                  -->

                  <hr />

                  <b-table small striped hover :fields="fields" :items="filteredResults" responsive="sm" class="mt-3">
                    <template #cell(index)="data">
                      <span>{{ data.index+1 }}</span>
                    </template>
                    <template #cell(image)="data">
                      <b-img :width="'100%'" :src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + data.item.tokenId + '/image'"></b-img>
                      <!--
                      <div v-if="data.item.hasAvatar">
                        <b-img-lazy :width="'100%'" :src="'https://metadata.ens.domains/mainnet/avatar/' + data.item.name" />
                      </div>
                      -->
                    </template>
                    <template #cell(name)="data">
                      {{ data.item.name.substring(0, 64) }}
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
                    </template>
                    <template #cell(registrationDate)="data">
                      {{ formatDate(data.item.registrationDate) }}
                    </template>
                    <template #cell(links)="data">
                      <b-link :href="'https://app.ens.domains/name/' + data.item.name" v-b-popover.hover="'View in app.ens.domains'" target="_blank">
                        ENS
                      </b-link>
                      <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover="'View in opensea.io'" target="_blank">
                        OS
                      </b-link>
                      <b-link :href="'https://looksrare.org/collections/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                        LR
                      </b-link>
                    </template>
                  </b-table>
                </b-card>
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

      settings: {
        searchOption: 'owned',
        searchString: null, // 'mrfahrenheit, fahrenheit.eth 0x287F9b46dceA520D829c874b0AF01f4fbfeF9243',
        selectedGroup: null,
        filter: null,
      },
      searchOptions: [
        { value: 'single', text: 'Single Name(s)' },
        { value: 'owned', text: 'Owned Names' },
        { value: 'group', text: 'Account Groups' },
      ],

      sortOption: 'expiryasc',
      retrievingMessage: null,
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

      fields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;' },
        { key: 'image', label: 'Image', thStyle: 'width: 10%;', sortable: true },
        { key: 'name', label: 'Name', thStyle: 'width: 30%;', sortable: true },
        { key: 'expiryDate', label: 'Expiry (UTC)', thStyle: 'width: 15%;', sortable: true },
        { key: 'registrationDate', label: 'Registration (UTC)', thStyle: 'width: 15%;', sortable: true },
        { key: 'length', label: 'Length', thStyle: 'width: 10%;', sortable: true },
        { key: 'links', label: 'Links', thStyle: 'width: 10%;' },
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
      for (result of Object.values(this.results)) {
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

    async retrieveNames() {
      const BATCHSIZE = 500; // Max ?1000
      const DELAYINMILLIS = 500;
      const url = "https://api.thegraph.com/subgraphs/name/ensdomains/ens";
      const delay = ms => new Promise(res => setTimeout(res, ms));

      const nameQuery = `
        query getRegistrations($labelNames: [String!]!) {
          registrations(where: {labelName_in: $labelNames}) {
            registrationDate
            expiryDate
            cost
            registrant {
              id
            }
            labelName
            domain {
              labelName
              labelhash
              name
              isMigrated
              resolver {
                address
                coinTypes
                texts
              }
              resolvedAddress {
                id
              }
              parent {
                labelName
                labelhash
                name
              }
              subdomains {
                labelName
                labelhash
                name
              }
            }
            events {
              id
              blockNumber
              transactionID
              __typename
            }
          }
        }
      `;

      const ownedQuery = `
        query getRegistrations($id: ID!, $first: Int, $skip: Int, $orderBy: Registration_orderBy, $orderDirection: OrderDirection, $expiryDate: Int) {
          account(id: $id) {
            registrations(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: {expiryDate_gt: $expiryDate}) {
              registrationDate
              expiryDate
              cost
              registrant {
                id
              }
              labelName
              domain {
                labelName
                labelhash
                name
                isMigrated
                resolver {
                  address
                  coinTypes
                  texts
                }
                resolvedAddress {
                  id
                }
                parent {
                  labelName
                  labelhash
                  name
                }
                subdomains {
                  labelName
                  labelhash
                  name
                }
              }
              events {
                id
                blockNumber
                transactionID
                __typename
              }
            }
          }
        }
      `;

      // history.pushState({}, null, `${this.$route.path}#${encodeURIComponent(params)}`);
      // history.pushState({}, null, `${this.$route.path}#blah`);

      const results = {};
      const now = parseInt(new Date().valueOf() / 1000);
      const expiryDate = parseInt(now) - 90 * 24 * 60 * 60;
      const warningDate = parseInt(now) + 90 * 24 * 60 * 60;

      let searchForAccounts = [];
      if (this.settings.searchOption == 'single' || this.settings.searchOption == 'owned') {
        console.log("Here: " + this.settings.searchString);

        // TODO: Cater for 0x1234...5678.eth ENS names
        const searchForLabelNames = this.settings.searchString.split(/[, \t]+/)
          .map(function(item) { return item.replace('.eth', '').toLowerCase().trim(); })
          .filter(function (name) { return ! (name.length == 42 && name.substring(0, 2) == '0x'); });
        logInfo("Search", "retrieveNames() - searchForLabelNames: " + JSON.stringify(searchForLabelNames, null, 2));

        searchForAccounts = this.settings.searchString.split(/[, \t]+/)
          .map(function(item) { return item.replace('.eth', '').toLowerCase().trim(); })
          .filter(function (name) { return name.length == 42 && name.substring(0, 2) == '0x'; });
        logInfo("Search", "retrieveNames() - searchForAccounts: " + JSON.stringify(searchForAccounts, null, 2));

        const data = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: nameQuery,
            variables: { labelNames: searchForLabelNames },
          })
        }).then(response => response.json());
        // logInfo("Search", "retrieveNames() - data: " + JSON.stringify(data, null, 2));
        const registrations = data.data.registrations || [];
        const registrantMap = {};
        // logInfo("Search", "retrieveNames() - registrations: " + JSON.stringify(registrations, null, 2));
        for (registration of registrations) {
          console.log(registration.domain.name);
          logInfo("Search", "retrieveNames() - registration: " + JSON.stringify(registration, null, 2));
          if (this.settings.searchOption == 'owned') {
            registrantMap[registration.registrant.id] = true;
          }
          results[registration.domain.name] = {
            labelName: registration.labelName,
            registrationDate: registration.registrationDate,
            expiryDate: registration.expiryDate,
            cost: registration.cost,
            registrant: registration.registrant.id,
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
        logInfo("Search", "retrieveNames() - registrantMap: " + JSON.stringify(registrantMap, null, 2));
        searchForAccounts = [ ...searchForAccounts, ...Object.keys(registrantMap) ];
        logInfo("Search", "retrieveNames() - searchForAccounts: " + JSON.stringify(searchForAccounts, null, 2));
      }

      if (this.settings.searchOption == 'owned' || this.settings.searchOption == 'group') {
        if (this.settings.searchOption == 'group') {
          if (this.settings.selectedGroup == null) {
            if (this.coinbase != null) {
              searchForAccounts = [ ...searchForAccounts, this.coinbase ];
            }
          } else {
            let group = this.groups[this.settings.selectedGroup];
            searchForAccounts = [ ...searchForAccounts, ...group.accounts ];
          }
        }
        logInfo("Search", "retrieveNames() - searchForAccounts: " + JSON.stringify(searchForAccounts));
        logInfo("Search", "retrieveNames() - expiryDate: " + expiryDate + " = " + new Date(expiryDate * 1000));
        this.retrievingMessage = "Retrieving";
        for (account of searchForAccounts) {
          logInfo("Search", "retrieveNames() - account: " + JSON.stringify(account));
          const first = BATCHSIZE;
          const id = account.toLowerCase();
          let skip = 0;
          // console.log(JSON.stringify({ query, variables: { id, first, skip, expiryDate } }));
          let completed = false;
          let records = 0;
          while (!completed) {
            const data = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                query: ownedQuery,
                variables: { id, first, skip, expiryDate },
              })
            }).then(response => response.json());
            // if (skip == 0) {
              // logInfo("Search", "retrieveNames() - data: " + JSON.stringify(data, null, 2));
            // }
            const registrations = data.data.account.registrations || [];
            if (registrations.length == 0) {
              completed = true;
            } else {
              records = records + registrations.length;
              this.retrievingMessage = "Retrieved " + records;
              for (registration of registrations) {
                // console.log(registration.domain.name);
                if (registration.domain.name == "mrfahrenheit.eth") {
                  console.log(JSON.stringify(registration, null, 2));
                }
                results[registration.domain.name] = {
                  labelName: registration.labelName,
                  registrationDate: registration.registrationDate,
                  expiryDate: registration.expiryDate,
                  cost: registration.cost,
                  registrant: registration.registrant.id,
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
                // const test = { ...results[registration.domain.name], name: undefined };
                // console.log(JSON.stringify(test, null, 2));
              }
              // this.results = results;
            }
            skip += BATCHSIZE;
          }
        }
      }
      this.results = results;
      this.retrievingMessage = null;
      // logInfo("Search", "retrieveNames() - results: " + JSON.stringify(results, null, 2));
    },

    // newGroup(groupName) {
    //   // console.log("newGroup: " + JSON.stringify(groupName));
    //   this.$bvModal.msgBoxConfirm('Add new group ' + groupName + '?', {
    //       title: 'Please Confirm',
    //       size: 'sm',
    //       buttonSize: 'sm',
    //       okVariant: 'danger',
    //       okTitle: 'Yes',
    //       cancelTitle: 'No',
    //       footerClass: 'p-2',
    //       hideHeaderClose: false,
    //       centered: true
    //     })
    //     .then(async value1 => {
    //       if (value1) {
    //         event.preventDefault();
    //         store.dispatch('config/newGroup', groupName);
    //       }
    //     })
    //     .catch(err => {
    //       // An error occurred
    //     });
    // },

    // newGroupAccount(groupIndex, account) {
    //   // console.log("newGroupAccount: " + groupIndex + ", " + account);
    //   this.$bvModal.msgBoxConfirm('Add new account ' + account + ' to group ' + this.groups[groupIndex].name + '?', {
    //       title: 'Please Confirm',
    //       size: 'lg',
    //       buttonSize: 'sm',
    //       okVariant: 'danger',
    //       okTitle: 'Yes',
    //       cancelTitle: 'No',
    //       footerClass: 'p-2',
    //       hideHeaderClose: false,
    //       centered: true
    //     })
    //     .then(async value1 => {
    //       if (value1) {
    //         event.preventDefault();
    //         store.dispatch('config/newGroupAccount', { groupIndex, account });
    //       }
    //     })
    //     .catch(err => {
    //       // An error occurred
    //     });
    // },

    // deleteGroup(groupIndex, group) {
    //   // console.log("deleteGroup: " + groupIndex);
    //   this.$bvModal.msgBoxConfirm('Delete group ' + groupIndex + '. ' + group.name + '?', {
    //       title: 'Please Confirm',
    //       size: 'sm',
    //       buttonSize: 'sm',
    //       okVariant: 'danger',
    //       okTitle: 'Yes',
    //       cancelTitle: 'No',
    //       footerClass: 'p-2',
    //       hideHeaderClose: false,
    //       centered: true
    //     })
    //     .then(async value1 => {
    //       if (value1) {
    //         event.preventDefault();
    //         store.dispatch('config/deleteGroup', { groupIndex, group });
    //       }
    //     })
    //     .catch(err => {
    //       // An error occurred
    //     });
    // },

    // deleteAccountFromGroup(groupIndex, accountIndex, account) {
    //   // console.log("deleteAccountFromGroup: " + groupIndex + ", " + accountIndex + ", " + account);
    //   this.$bvModal.msgBoxConfirm('Delete account ' + account + ' from group ' + this.groups[groupIndex].name + '?', {
    //       title: 'Please Confirm',
    //       size: 'lg',
    //       buttonSize: 'sm',
    //       okVariant: 'danger',
    //       okTitle: 'Yes',
    //       cancelTitle: 'No',
    //       footerClass: 'p-2',
    //       hideHeaderClose: false,
    //       centered: true
    //     })
    //     .then(async value1 => {
    //       if (value1) {
    //         event.preventDefault();
    //         store.dispatch('config/deleteAccountFromGroup', { groupIndex, accountIndex, account });
    //       }
    //     })
    //     .catch(err => {
    //       // An error occurred
    //     });
    // },

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
    // groups: [],
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    // groups: state => state.groups,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    // loadGroups(state) {
    //   // logInfo("searchModule", "mutations.loadGroups()")
    //   if (localStorage.getItem('groups')) {
    //     state.groups = JSON.parse(localStorage.getItem('groups'));
    //     // logInfo("searchModule", "mutations.loadGroups(): " + JSON.stringify(state.groups));
    //   }
    // },
    // saveGroups(state) {
    //   // logInfo("searchModule", "mutations.saveGroups()");
    //   localStorage.setItem('groups', JSON.stringify(state.groups));
    // },
    // newGroup(state, groupName) {
    //   logInfo("searchModule", "mutations.newGroup(" + groupName + ")");
    //   state.groups.push( { name: groupName, accounts: [] });
    // },
    // newGroupAccount(state, { groupIndex, account }) {
    //   logInfo("searchModule", "mutations.newGroupAccount(" + groupIndex + ", " + account + ")");
    //   state.groups[groupIndex].accounts.push(account);
    // },
    // deleteGroup(state, { groupIndex, group }) {
    //   logInfo("searchModule", "mutations.deleteGroup(" + groupIndex + ", " + JSON.stringify(group) + ")");
    //   state.groups.splice(groupIndex, 1);
    // },
    // deleteAccountFromGroup(state, { groupIndex, accountIndex, account }) {
    //   logInfo("searchModule", "mutations.deleteAccountFromGroup(" + groupIndex + ", " + account + ")");
    //   state.groups[groupIndex].accounts.splice(accountIndex, 1);
    // },
    // deQueue(state) {
    //   logDebug("searchModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
    //   state.executionQueue.shift();
    // },
    // updateParams(state, params) {
    //   state.params = params;
    //   logDebug("searchModule", "updateParams('" + params + "')")
    // },
    // updateExecuting(state, executing) {
    //   state.executing = executing;
    //   logDebug("searchModule", "updateExecuting(" + executing + ")")
    // },
  },
  actions: {
    // loadGroups(context) {
    //   logDebug("searchModule", "actions.loadGroups()");
    //   context.commit('loadGroups');
    // },
    // newGroup(context, groupName) {
    //   logInfo("searchModule", "actions.newGroup(" + groupName + ")");
    //   context.commit('newGroup', groupName);
    //   context.commit('saveGroups');
    // },
    // newGroupAccount(context, { groupIndex, account }) {
    //   logInfo("searchModule", "actions.newGroupAccount(" + groupIndex + ", " + account + ")");
    //   context.commit('newGroupAccount', { groupIndex, account });
    //   context.commit('saveGroups');
    // },
    // deleteGroup(context, { groupIndex, group }) {
    //   logInfo("searchModule", "actions.deleteGroup(" + groupIndex + ", " + JSON.stringify(group) + ")");
    //   context.commit('deleteGroup', { groupIndex, group });
    //   context.commit('saveGroups');
    // },
    // deleteAccountFromGroup(context, { groupIndex, accountIndex, account }) {
    //   logInfo("searchModule", "actions.deleteAccountFromGroup(" + groupIndex + ", " + account + ")");
    //   context.commit('deleteAccountFromGroup', { groupIndex, accountIndex, account });
    //   context.commit('saveGroups');
    // },

  },
};
