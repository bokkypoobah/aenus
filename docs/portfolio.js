const Portfolio = {
  template: `
    <div class="mt-5 pt-3">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="!powerOn || (network.chainId != 1 && network.chainId != 4)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Rinkeby network and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="Portfolio" class="border-0" header-class="p-1" v-if="network.chainId == 1 || network.chainId == 4">
        <b-card no-body class="border-0 m-0 mt-2">
          <b-card-body class="p-0">

            <b-modal id="bv-modal-addgroup" size="lg" hide-footer title-class="m-0 p-0" header-class="m-1 p-1" body-class="m-1 p-1">
              <template v-slot:modal-title>
                Add New Group
              </template>
              <b-card-body class="m-0 p-0">
                <b-card-text class="mt-5">
                  <b-form-group label-cols="3" label-size="sm" label="New Group" description="New group name">
                    <b-form-input size="sm" v-model="newGroupName" class="w-50"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label="">
                    <b-button size="sm" @click="$bvModal.hide('bv-modal-addgroup'); newGroup(newGroupName); newGroupName = null;" :disabled="newGroupName == null || newGroupName.length == 0" variant="warning">Add</b-button>
                  </b-form-group>
                </b-card-text>
              </b-card-body>
            </b-modal>

            <b-modal id="bv-modal-addaccount" size="lg" hide-footer title-class="m-0 p-0" header-class="m-1 p-1" body-class="m-1 p-1">
              <template v-slot:modal-title>
                Add New Account To Group {{ groups[selectedGroupIndex].name }}
              </template>
              <b-card-body class="m-0 p-0">
                <b-card-text class="mt-5">
                  <b-form-group label-cols="3" label-size="sm" label="New Account">
                    <b-form-input size="sm" v-model="newAccount" class="w-50"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label="">
                    <b-button size="sm" @click="newGroupAccount(selectedGroupIndex, newAccount); $bvModal.hide('bv-modal-addaccount')" :disabled="newAccount == null || newAccount.length == 0" variant="warning">Add</b-button>
                  </b-form-group>
                </b-card-text>
              </b-card-body>
            </b-modal>

            <div>
              <b-card no-body class="mt-2">
                <b-card class="mb-2">
                  <template #header>
                    <h6>
                      Registered ENS Names
                      <b-button size="sm" class="float-right m-0 p-0" href="#" @click="$bvModal.show('bv-modal-addgroup')" variant="link" v-b-popover.hover="'Add new group'"><b-icon-plus shift-v="-2" font-scale="1.4"></b-icon-plus></b-button>
                    </h6>
                  </template>

                  <b-form-group label-cols="3" label-size="sm" label="Account Group">
                    <b-form-select size="sm" v-model="selectedGroup" :options="groupOptions" class="w-50"></b-form-select>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label="">
                    <b-button size="sm" @click="retrieveNames" variant="warning">Retrieve Names</b-button>
                  </b-form-group>

                  {{ results }}

                  <!--
                  <div v-if="groups.length == 0">
                    <b-card-text>
                      Click on the + button to add a new group
                    </b-card-text>
                  </div>
                  <div v-for="(group, groupIndex) in groups">
                    <b-card class="mb-2">
                      <template #header>
                        <h6>
                          {{ groupIndex+1 }}. <em>{{ group.name }}</em>
                          <b-button size="sm" class="m-0 p-0" @click="deleteGroup(groupIndex, group)" variant="link" v-b-popover.hover="'Delete ' + group.name + '!'"><b-icon-trash style="color: #ff0000;" shift-v="+1" font-scale="1.0"></b-icon-trash></b-button>
                          <b-button size="sm" class="float-right m-0 p-0" href="#" @click="selectedGroupIndex = groupIndex; $bvModal.show('bv-modal-addaccount')" variant="link" v-b-popover.hover="'Add new account'"><b-icon-plus shift-v="+1" font-scale="1.4"></b-icon-plus></b-button>
                        </h6>
                      </template>
                      <div v-if="group.accounts.length == 0">
                        <b-card-text>
                          Click on the + button to add a new account
                        </b-card-text>
                      </div>
                      <div v-for="(account, accountIndex) in group.accounts">
                        {{ accountIndex+1 }}. {{ account }}
                        <b-button size="sm" class="float-right m-0 p-0" @click="deleteAccountFromGroup(groupIndex, accountIndex, account)" variant="link" v-b-popover.hover="'Delete account ' + account + '!'"><b-icon-trash style="color: #ff0000;" shift-v="+1" font-scale="1.0"></b-icon-trash></b-button>
                      </div>
                    </b-card>
                  </div>
                  -->
                </b-card>
                <!--
                <b-card header="Old stuff" class="mb-2">
                  <b-card-text>
                    <b-form-group label-cols="3" label-size="sm" label="Transfer Nix ownership to" description="e.g. 0x123456...">
                      <b-form-input size="sm" v-model="admin.transferTo" class="w-50"></b-form-input>
                    </b-form-group>
                  </b-card-text>
                  <b-form-group label-cols="3" label-size="sm" label="">
                    <b-button size="sm" @click="transferOwnership" variant="warning">Transfer Ownership</b-button>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label="Data">
                    <b-form-textarea size="sm" rows="10" v-model="JSON.stringify(admin, null, 2)" class="w-50"></b-form-textarea>
                  </b-form-group>
                </b-card>
                <b-card header="Withdraw ETH, ERC-20 And ERC-721 Tokens From Nix" class="mb-2">
                  <b-card-text>
                    <b-form-group label-cols="3" label-size="sm" label="Token" description="Blank for ETH, address for ERC-20 or ERC-721. e.g., 0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4 for TestToadz">
                      <b-form-input size="sm" v-model="admin.token" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Tokens" description="Tokens in raw format, for ETH and ERC-20. e.g., 3500000000000000000 for 3.5 with 18dp. Set to 0 or null for full balance">
                      <b-form-input size="sm" v-model="admin.tokens" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Token Id" description="ERC-721 Token Id. e.g., 3">
                      <b-form-input size="sm" v-model="admin.tokenId" class="w-50"></b-form-input>
                    </b-form-group>
                  </b-card-text>
                  <b-form-group label-cols="3" label-size="sm" label="">
                    <b-button size="sm" @click="withdraw" variant="warning">Withdraw</b-button>
                  </b-form-group>
                  <b-form-group label-cols="3" label-size="sm" label="Data">
                    <b-form-textarea size="sm" rows="10" v-model="JSON.stringify(admin, null, 2)" class="w-50"></b-form-textarea>
                  </b-form-group>
                </b-card>
                -->
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
      results: [],
      newGroupName: null,
      selectedGroupIndex: null,
      newAccount: null,
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
      const BATCHSIZE = 1000; // Max ?1000
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
      logInfo("Portfolio", "retrieveNames() - accounts: " + JSON.stringify(accounts));
      // const expiryDate = parseInt(new Date().valueOf() / 1000);
      const expiryDate = 1642582008;
      logInfo("Portfolio", "retrieveNames() - expiryDate: " + JSON.stringify(expiryDate));
      const results = {};
      for (account of accounts) {
        logInfo("Portfolio", "retrieveNames() - account: " + JSON.stringify(account));
        const first = BATCHSIZE;
        const id = account.toLowerCase();
        let skip = 0;
        // console.log(JSON.stringify({ query, variables: { id, first, skip, expiryDate } }));
        let completed = false;
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
          //   logInfo("Portfolio", "retrieveNames() - data: " + JSON.stringify(data, null, 2));
          // }
          const registrations = data.data.account.registrations || [];
          if (registrations.length == 0) {
            completed = true;
          } else {
            for (registration of registrations) {
              // console.log(registration.labelName);
              if (registration.domain.name == "jpmyorgan.eth") {
                console.log(JSON.stringify(registration, null, 2));
              }
              results[registration.domain.name] = {
                labelName: registration.labelName,
                registrationDate: registration.registrationDate,
                expiryDate: registration.expiryDate,
                cost: registration.cost,
                registrant: registration.registrant.id,
                labelhash: registration.domain.labelhash,
                name: registration.domain.name,
                isMigrated: registration.domain.isMigrated,
                resolver: registration.domain.resolver && registration.domain.resolver.address || null,
                resolvedAddress: registration.domain.resolvedAddress && registration.domain.resolvedAddress.id || null,
                parent: registration.domain.parent.name,
              };
            }
            this.results = results;
          }
          skip += BATCHSIZE;
        }
      }
      // logInfo("Portfolio", "retrieveNames() - results: " + JSON.stringify(results, null, 2));
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
      logDebug("Portfolio", "timeoutCallback() count: " + this.count);

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
    logDebug("Portfolio", "beforeDestroy()");
  },
  mounted() {
    logInfo("Portfolio", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("Portfolio", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const portfolioModule = {
  namespaced: true,
  state: {
    groups: [
      // {
      //   name: "Group1",
      //   accounts: [
      //     "0x000001f568875F378Bf6d170B790967FE429C81A",
      //     "0x00000217d2795F1Da57e392D2a5bC87125BAA38D"
      //   ]
      // },
      // {
      //   name: "Group2",
      //   accounts: [
      //     "0x000001f568875F378Bf6d170B790967FE429C81A",
      //     "0x00000217d2795F1Da57e392D2a5bC87125BAA38D"
      //   ]
      // },
    ],
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
      // logInfo("portfolioModule", "mutations.loadGroups()")
      if (localStorage.getItem('groups')) {
        state.groups = JSON.parse(localStorage.getItem('groups'));
        // logInfo("portfolioModule", "mutations.loadGroups(): " + JSON.stringify(state.groups));
      }
    },
    // setGroups(state, g) {
    //   logDebug("portfolioModule", "mutations.setGroup('" + g + "')")
    //   state.groups = g;
    // },
    saveGroups(state) {
      // logInfo("portfolioModule", "mutations.saveGroups()");
      localStorage.setItem('groups', JSON.stringify(state.groups));
    },
    newGroup(state, groupName) {
      logInfo("portfolioModule", "mutations.newGroup(" + groupName + ")");
      state.groups.push( { name: groupName, accounts: [] });
    },
    newGroupAccount(state, { groupIndex, account }) {
      logInfo("portfolioModule", "mutations.newGroupAccount(" + groupIndex + ", " + account + ")");
      state.groups[groupIndex].accounts.push(account);
    },
    deleteGroup(state, { groupIndex, group }) {
      logInfo("portfolioModule", "mutations.deleteGroup(" + groupIndex + ", " + JSON.stringify(group) + ")");
      state.groups.splice(groupIndex, 1);
    },
    deleteAccountFromGroup(state, { groupIndex, accountIndex, account }) {
      logInfo("portfolioModule", "mutations.deleteAccountFromGroup(" + groupIndex + ", " + account + ")");
      state.groups[groupIndex].accounts.splice(accountIndex, 1);
    },
    deQueue(state) {
      logDebug("portfolioModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("portfolioModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("portfolioModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    loadGroups(context) {
      logDebug("portfolioModule", "actions.loadGroups()");
      context.commit('loadGroups');
    },
    // setGroups(context, g) {
    //   logDebug("portfolioModule", "actions.setGroups(" + JSON.stringify(g) + ")");
    //   context.commit('setGroups', g);
    // },
    newGroup(context, groupName) {
      logInfo("portfolioModule", "actions.newGroup(" + groupName + ")");
      context.commit('newGroup', groupName);
      context.commit('saveGroups');
    },
    newGroupAccount(context, { groupIndex, account }) {
      logInfo("portfolioModule", "actions.newGroupAccount(" + groupIndex + ", " + account + ")");
      context.commit('newGroupAccount', { groupIndex, account });
      context.commit('saveGroups');
    },
    deleteGroup(context, { groupIndex, group }) {
      logInfo("portfolioModule", "actions.deleteGroup(" + groupIndex + ", " + JSON.stringify(group) + ")");
      context.commit('deleteGroup', { groupIndex, group });
      context.commit('saveGroups');
    },
    deleteAccountFromGroup(context, { groupIndex, accountIndex, account }) {
      logInfo("portfolioModule", "actions.deleteAccountFromGroup(" + groupIndex + ", " + account + ")");
      context.commit('deleteAccountFromGroup', { groupIndex, accountIndex, account });
      context.commit('saveGroups');
    },

  },
};
