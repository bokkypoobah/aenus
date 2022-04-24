const Search = {
  template: `
    <div class="mt-5 pt-3">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="!powerOn || network.chainId != 1">
        <b-card-text>
          Please install the MetaMask extension, connect to the Ethereum mainnet and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="Search" class="border-0" header-class="p-1" v-if="network.chainId == 1 || network.chainId == 4">
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

                  <b-form-group label-cols="2" label-size="sm" label="Account Group">
                    <b-form-select size="sm" v-model="selectedGroup" :options="groupOptions" class="w-50"></b-form-select>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="">
                    <b-button size="sm" @click="retrieveNames" :disabled="retrievingMessage != null" variant="warning">{{ retrievingMessage ? retrievingMessage : 'Retrieve Names'}}</b-button>
                  </b-form-group>
                  <!--
                  <b-form-group label-cols="2" label-size="sm" label="Sort">
                    <b-form-select size="sm" v-model="sortOption" :options="sortOptions" class="w-25"></b-form-select>
                  </b-form-group>
                  -->
                  <b-form-group label-cols="2" label-size="sm" label="Search">
                    <b-form-input type="text" size="sm" v-model.trim="search" debounce="600" class="w-25" placeholder="🔍 name"></b-form-input>
                  </b-form-group>


                  <b-table small striped hover :fields="fields" :items="filteredResults" responsive="sm">
                    <template #cell(index)="data">
                      <span>{{ data.index+1 }}</span>
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
      selectedGroup: null,
      sortOption: 'expiryasc',
      search: null,
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
        { key: 'name', label: 'Name', thStyle: 'width: 40%;', sortable: true },
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
      if (this.search != null && this.search.length > 0) {
        // let search = this.search.replace("$", "\\\$");
        let search = this.search;
        // let search = /god\$/;
        regexConst = new RegExp(search);
        // regexConst = /god/;
        // console.log("Search.filteredResults() - search: " + JSON.stringify(search));
        // console.log("Search.filteredResults() - regexConst: " + JSON.stringify(regexConst.toString()));
      }
      for (result of Object.values(this.results)) {
        if (this.search == null || this.search.length == 0) {
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
      console.log("retrieveNames");
      const BATCHSIZE = 200; // Max ?1000
      const DELAYINMILLIS = 500;
      const url = "https://api.thegraph.com/subgraphs/name/ensdomains/ens";
      const delay = ms => new Promise(res => setTimeout(res, ms));

      const query = `
        query getRegistrations($id: ID!, $first: Int, $skip: Int, $orderBy: Registration_orderBy, $orderDirection: OrderDirection, $expiryDate: Int) {
          account(id: $id) {
            registrations(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: {expiryDate_gt: $expiryDate}) {
              registrationDate
              expiryDate
              cost
              registrant {
                id
                __typename
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
                  __typename
                }
                resolvedAddress {
                  id
                  __typename
                }
                parent {
                  labelName
                  labelhash
                  name
                  __typename
                }
                subdomains {
                  labelName
                  labelhash
                  name
                  __typename
                }
                __typename
              }
              events {
                id
                blockNumber
                transactionID
                __typename
              }
              __typename
            }
            __typename
          }
        }
      `;

      let accounts;
      if (this.selectedGroup == null) {
        accounts = [ this.coinbase ];
      } else {
        let group = this.groups[this.selectedGroup];
        accounts = group.accounts;
      }
      logInfo("Search", "retrieveNames() - accounts: " + JSON.stringify(accounts));
      const now = parseInt(new Date().valueOf() / 1000);
      const expiryDate = parseInt(now) - 90 * 24 * 60 * 60;
      const warningDate = parseInt(now) + 90 * 24 * 60 * 60;
      logInfo("Search", "retrieveNames() - expiryDate: " + expiryDate + " = " + new Date(expiryDate * 1000));
      const results = {};
      for (account of accounts) {
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
              query,
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
              // console.log(registration.labelName);
              if (registration.domain.name == "jpmyorgan.eth") {
                console.log(JSON.stringify(registration, null, 2));
              }
              const length = registration.domain.name.indexOf("\.");
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
                length: length,
                warn: registration.expiryDate < now ? 'red' : registration.expiryDate < warningDate ? 'orange' : null,
              };
              // const test = { ...results[registration.domain.name], name: undefined };
              // console.log(JSON.stringify(test, null, 2));
            }
            // this.results = results;
          }
          skip += BATCHSIZE;
        }
      }
      this.results = results;
      this.retrievingMessage = null;
      // logInfo("Search", "retrieveNames() - results: " + JSON.stringify(results, null, 2));
    },

    newGroup(groupName) {
      // console.log("newGroup: " + JSON.stringify(groupName));
      this.$bvModal.msgBoxConfirm('Add new group ' + groupName + '?', {
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
            store.dispatch('config/newGroup', groupName);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    newGroupAccount(groupIndex, account) {
      // console.log("newGroupAccount: " + groupIndex + ", " + account);
      this.$bvModal.msgBoxConfirm('Add new account ' + account + ' to group ' + this.groups[groupIndex].name + '?', {
          title: 'Please Confirm',
          size: 'lg',
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
            store.dispatch('config/newGroupAccount', { groupIndex, account });
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    deleteGroup(groupIndex, group) {
      // console.log("deleteGroup: " + groupIndex);
      this.$bvModal.msgBoxConfirm('Delete group ' + groupIndex + '. ' + group.name + '?', {
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
            store.dispatch('config/deleteGroup', { groupIndex, group });
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    deleteAccountFromGroup(groupIndex, accountIndex, account) {
      // console.log("deleteAccountFromGroup: " + groupIndex + ", " + accountIndex + ", " + account);
      this.$bvModal.msgBoxConfirm('Delete account ' + account + ' from group ' + this.groups[groupIndex].name + '?', {
          title: 'Please Confirm',
          size: 'lg',
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
            store.dispatch('config/deleteAccountFromGroup', { groupIndex, accountIndex, account });
          }
        })
        .catch(err => {
          // An error occurred
        });
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
    groups: [],
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    groups: state => state.groups,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    loadGroups(state) {
      // logInfo("searchModule", "mutations.loadGroups()")
      if (localStorage.getItem('groups')) {
        state.groups = JSON.parse(localStorage.getItem('groups'));
        // logInfo("searchModule", "mutations.loadGroups(): " + JSON.stringify(state.groups));
      }
    },
    // setGroups(state, g) {
    //   logDebug("searchModule", "mutations.setGroup('" + g + "')")
    //   state.groups = g;
    // },
    saveGroups(state) {
      // logInfo("searchModule", "mutations.saveGroups()");
      localStorage.setItem('groups', JSON.stringify(state.groups));
    },
    newGroup(state, groupName) {
      logInfo("searchModule", "mutations.newGroup(" + groupName + ")");
      state.groups.push( { name: groupName, accounts: [] });
    },
    newGroupAccount(state, { groupIndex, account }) {
      logInfo("searchModule", "mutations.newGroupAccount(" + groupIndex + ", " + account + ")");
      state.groups[groupIndex].accounts.push(account);
    },
    deleteGroup(state, { groupIndex, group }) {
      logInfo("searchModule", "mutations.deleteGroup(" + groupIndex + ", " + JSON.stringify(group) + ")");
      state.groups.splice(groupIndex, 1);
    },
    deleteAccountFromGroup(state, { groupIndex, accountIndex, account }) {
      logInfo("searchModule", "mutations.deleteAccountFromGroup(" + groupIndex + ", " + account + ")");
      state.groups[groupIndex].accounts.splice(accountIndex, 1);
    },
    deQueue(state) {
      logDebug("searchModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("searchModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("searchModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    loadGroups(context) {
      logDebug("searchModule", "actions.loadGroups()");
      context.commit('loadGroups');
    },
    // setGroups(context, g) {
    //   logDebug("searchModule", "actions.setGroups(" + JSON.stringify(g) + ")");
    //   context.commit('setGroups', g);
    // },
    newGroup(context, groupName) {
      logInfo("searchModule", "actions.newGroup(" + groupName + ")");
      context.commit('newGroup', groupName);
      context.commit('saveGroups');
    },
    newGroupAccount(context, { groupIndex, account }) {
      logInfo("searchModule", "actions.newGroupAccount(" + groupIndex + ", " + account + ")");
      context.commit('newGroupAccount', { groupIndex, account });
      context.commit('saveGroups');
    },
    deleteGroup(context, { groupIndex, group }) {
      logInfo("searchModule", "actions.deleteGroup(" + groupIndex + ", " + JSON.stringify(group) + ")");
      context.commit('deleteGroup', { groupIndex, group });
      context.commit('saveGroups');
    },
    deleteAccountFromGroup(context, { groupIndex, accountIndex, account }) {
      logInfo("searchModule", "actions.deleteAccountFromGroup(" + groupIndex + ", " + account + ")");
      context.commit('deleteAccountFromGroup', { groupIndex, accountIndex, account });
      context.commit('saveGroups');
    },

  },
};
