const Admin = {
  template: `
    <div class="mt-5 pt-3">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="!powerOn || (network.chainId != 1 && network.chainId != 4)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Rinkeby network and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="Admin" class="border-0" header-class="p-1" v-if="network.chainId == 1 || network.chainId == 4">
        <b-card no-body class="border-0 m-0 mt-2">
          <b-card-body class="p-0">

            <div>
              <b-card no-body class="mt-2">
                <b-card header="Transfer Nix Ownership" class="mb-2">
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

      admin: {
        transferTo: null,
        transferMessage: null,
        token: null,
        tokens: null,
        tokenId: null,
      },

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
    tokensData() {
      return store.getters['nixData/tokensData'];
    },
    tradeData() {
      return store.getters['nixData/tradeData'];
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

    transferOwnership() {
      console.log("transferOwnership");
      this.$bvModal.msgBoxConfirm('Transfer Nix Ownership?', {
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
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const nix = new ethers.Contract(store.getters['connection/network'].nixAddress, NIXABI, provider);
            const nixWithSigner = nix.connect(provider.getSigner());
            try {
              const tx = await nixWithSigner.transferOwnership(this.admin.transferTo);
              console.log("tx: " + JSON.stringify(tx));
            } catch (e) {
              console.log("error: " + e.toString());
            }
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    withdraw() {
      console.log("withdraw");
      this.$bvModal.msgBoxConfirm('Withdraw?', {
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
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const nix = new ethers.Contract(store.getters['connection/network'].nixAddress, NIXABI, provider);
            const nixWithSigner = nix.connect(provider.getSigner());
            const token = this.admin.token == null || this.admin.token.trim().length == 0 ? ADDRESS0 : this.admin.token;
            const tokens = this.admin.tokens == null || this.admin.tokens.trim().length == 0 ? "0" : this.admin.tokens;
            const tokenId = this.admin.tokenId == null || this.admin.tokenId.trim().length == 0 ? "0" : this.admin.tokenId;
            try {
              const tx = await nixWithSigner.withdraw(token, tokens, tokenId);
              console.log("tx: " + JSON.stringify(tx));
            } catch (e) {
              console.log("error: " + e.toString());
            }
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    async timeoutCallback() {
      logDebug("Admin", "timeoutCallback() count: " + this.count);

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
    logDebug("Admin", "beforeDestroy()");
  },
  mounted() {
    logDebug("Admin", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("Admin", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const adminModule = {
  namespaced: true,
  state: {
    canvas: null,
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    canvas: state => state.canvas,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    setCanvas(state, c) {
      logDebug("adminModule", "mutations.setCanvas('" + c + "')")
      state.canvas = c;
    },
    deQueue(state) {
      logDebug("adminModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("adminModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("adminModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    setCanvas(context, c) {
      logDebug("connectionModule", "actions.setCanvas(" + JSON.stringify(c) + ")");
      // context.commit('setCanvas', c);
    },
  },
};
