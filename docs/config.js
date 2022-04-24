const Config = {
  template: `
    <div class="mt-5 pt-3">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="!powerOn || network.chainId != 1">
        <b-card-text>
        Please install the MetaMask extension, connect to the Ethereum mainnet and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="Configuration" class="border-0" header-class="p-1">
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
                      Account Groups
                      <b-button size="sm" class="float-right m-0 p-0" href="#" @click="$bvModal.show('bv-modal-addgroup')" variant="link" v-b-popover.hover="'Add new group'"><b-icon-plus shift-v="-2" font-scale="1.4"></b-icon-plus></b-button>
                    </h6>
                  </template>
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
  },
  methods: {

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
      this.$bvModal.msgBoxConfirm('Delete group ' + (groupIndex+1) + '. ' + group.name + '?', {
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
      logDebug("Config", "timeoutCallback() count: " + this.count);

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
    logDebug("Config", "beforeDestroy()");
  },
  mounted() {
    logInfo("Config", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    // store.dispatch('config/loadGroups');
    logDebug("Config", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const configModule = {
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
      logInfo("configModule", "mutations.loadGroups()")
      if (localStorage.getItem('groups')) {
        state.groups = JSON.parse(localStorage.getItem('groups'));
        // logInfo("configModule", "mutations.loadGroups(): " + JSON.stringify(state.groups));
      }
    },
    // setGroups(state, g) {
    //   logDebug("configModule", "mutations.setGroup('" + g + "')")
    //   state.groups = g;
    // },
    saveGroups(state) {
      // logInfo("configModule", "mutations.saveGroups()");
      localStorage.setItem('groups', JSON.stringify(state.groups));
    },
    newGroup(state, groupName) {
      logInfo("configModule", "mutations.newGroup(" + groupName + ")");
      state.groups.push( { name: groupName, accounts: [] });
    },
    newGroupAccount(state, { groupIndex, account }) {
      logInfo("configModule", "mutations.newGroupAccount(" + groupIndex + ", " + account + ")");
      state.groups[groupIndex].accounts.push(account);
    },
    deleteGroup(state, { groupIndex, group }) {
      logInfo("configModule", "mutations.deleteGroup(" + groupIndex + ", " + JSON.stringify(group) + ")");
      state.groups.splice(groupIndex, 1);
    },
    deleteAccountFromGroup(state, { groupIndex, accountIndex, account }) {
      logInfo("configModule", "mutations.deleteAccountFromGroup(" + groupIndex + ", " + account + ")");
      state.groups[groupIndex].accounts.splice(accountIndex, 1);
    },
    deQueue(state) {
      logDebug("configModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("configModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("configModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    loadGroups(context) {
      logDebug("configModule", "actions.loadGroups()");
      context.commit('loadGroups');
    },
    // setGroups(context, g) {
    //   logDebug("configModule", "actions.setGroups(" + JSON.stringify(g) + ")");
    //   context.commit('setGroups', g);
    // },
    newGroup(context, groupName) {
      logInfo("configModule", "actions.newGroup(" + groupName + ")");
      context.commit('newGroup', groupName);
      context.commit('saveGroups');
    },
    newGroupAccount(context, { groupIndex, account }) {
      logInfo("configModule", "actions.newGroupAccount(" + groupIndex + ", " + account + ")");
      context.commit('newGroupAccount', { groupIndex, account });
      context.commit('saveGroups');
    },
    deleteGroup(context, { groupIndex, group }) {
      logInfo("configModule", "actions.deleteGroup(" + groupIndex + ", " + JSON.stringify(group) + ")");
      context.commit('deleteGroup', { groupIndex, group });
      context.commit('saveGroups');
    },
    deleteAccountFromGroup(context, { groupIndex, accountIndex, account }) {
      logInfo("configModule", "actions.deleteAccountFromGroup(" + groupIndex + ", " + account + ")");
      context.commit('deleteAccountFromGroup', { groupIndex, accountIndex, account });
      context.commit('saveGroups');
    },

  },
};
