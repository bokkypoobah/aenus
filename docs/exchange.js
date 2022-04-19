const Exchange = {
  template: `
    <div class="mt-5 pt-3">
      <b-card class="mt-5" header-class="warningheader" header="Web3 Connection And/Or Incorrect Network Detected" v-if="!powerOn || (network.chainId != 1 && network.chainId != 4)">
        <b-card-text>
          Please install the MetaMask extension, connect to the Rinkeby network and refresh this page. Then click the [Power] button on the top right.
        </b-card-text>
      </b-card>

      <b-card no-body header="Exchange" class="border-0" header-class="p-1" v-if="network.chainId == 1 || network.chainId == 4">
        <b-card no-body class="border-0 m-0 mt-2">
          <b-card-body class="p-0">

            <div>
              <b-card no-body class="mt-2">

                <b-tabs vertical pills card end nav-class="p-2" active-tab-class="p-2">

                  <b-tab title="Collections" class="p-1">
                    <div v-if="nixTokenList.length == 0">
                      <b-card>
                        <b-card-text>
                          Loading collections
                        </b-card-text>
                      </b-card>
                    </div>
                    <font size="-2">
                      <b-table small fixed striped sticky-header="1000px" :fields="nixTokenFields" :items="nixTokenList" head-variant="light" show-empty>
                        <template #cell(token)="data">
                          <b-link :href="explorer + 'token/' + data.item.token" class="truncate" target="_blank">{{ data.item.token }}</b-link>
                        </template>
                        <template #cell(volumeWeth)="data">
                          {{ formatETH(data.item.volumeWeth) }}
                        </template>
                        <template #cell(averageWeth)="data">
                          {{ formatETH(data.item.averageWeth) }}
                        </template>
                      </b-table>
                    </font>
                  </b-tab>

                  <b-tab title="Orders" class="p-1">
                    <div v-if="nixTokenList.length == 0">
                      <b-card>
                        <b-card-text>
                          Loading orders
                        </b-card-text>
                      </b-card>
                    </div>
                    <div v-for="(nixToken, nixTokenIndex) in nixTokenList">
                      <b-card body-class="p-0" header-class="m-0 p-0 pl-2" footer-class="p-1" class="m-3 p-0">
                        <template #header>
                          <span variant="secondary" class="small truncate">
                            {{ nixTokenIndex }}. <b-link :href="explorer + 'token/' + nixToken.token" target="_blank">{{ nixToken.token }}</b-link> {{ nixToken.symbol }} {{ nixToken.name }}, # Orders: {{ nixToken.ordersLength }}, executed: {{ nixToken.executed }}, volumeToken: {{ nixToken.volumeToken }}, volumeWeth: {{ formatETH(nixToken.volumeWeth) }}, averageWeth: {{ formatETH(nixToken.averageWeth) }}
                          </span>
                        </template>
                        <font size="-2">
                          <b-table small fixed striped sticky-header="1000px" :items="Object.values(nixToken.orders)" head-variant="light" show-empty>
                            <template #cell(maker)="data">
                              <b-link :href="explorer + 'address/' + data.item.maker" target="_blank">{{ data.item.maker.substring(0, 10) + '...' }}</b-link>
                            </template>
                            <template #cell(taker)="data">
                              <div v-if="data.item.taker">
                                <b-link :href="explorer + 'address/' + data.item.taker" target="_blank">{{ data.item.taker.substring(0, 10) + '...' }}</b-link>
                              </div>
                            </template>
                            <template #cell(tokenIds)="data">
                              {{ JSON.stringify(data.item.tokenIds.map((x) => { return x.toString(); })) }}
                            </template>
                            <template #cell(price)="data">
                              {{ formatETH(data.item.price) }}
                            </template>
                            <template #cell(buyOrSell)="data">
                              {{ formatBuyOrSell(data.item.buyOrSell) }}
                            </template>
                            <template #cell(anyOrAll)="data">
                              {{ formatAnyOrAll(data.item.anyOrAll) }}
                            </template>
                            <template #cell(expiry)="data">
                              {{ formatDate(data.item.expiry) }}
                            </template>
                            <template #cell(royaltyFactor)="data">
                              {{ data.item.royaltyFactor.toString() }}
                            </template>
                            <template #cell(orderStatus)="data">
                              {{ formatOrderStatus(data.item.orderStatus) }}
                            </template>
                          </b-table>
                        </font>

                      </b-card>
                    </div>
                    <div v-for="(tokensDataItem, tokensDataIndex) in tokensData">
                      <b-card body-class="p-0" header-class="m-0 p-0 pl-2" footer-class="p-1" class="m-3 p-0">
                        <template #header>
                          <span variant="secondary" class="small truncate">
                            {{ tokensDataIndex }}. ERC-721 Token <b-link :href="explorer + 'token/' + tokensDataItem.token" target="_blank">{{ tokensDataItem.token }}</b-link> - ordersLength: {{ tokensDataItem.ordersLength }}, executed: {{ tokensDataItem.executed }}, volumeToken: {{ tokensDataItem.volumeToken }}, volumeWeth: {{ formatETH(tokensDataItem.volumeWeth) }}, averageWeth: {{ formatETH(tokensDataItem.averageWeth) }}
                          </span>
                        </template>
                        <font size="-2">
                          <b-table small fixed striped sticky-header="1000px" :items="tokensDataItem.ordersData" head-variant="light" show-empty>
                            <template #cell(maker)="data">
                              <b-link :href="explorer + 'address/' + data.item.maker" target="_blank">{{ data.item.maker.substring(0, 10) + '...' }}</b-link>
                            </template>
                            <template #cell(taker)="data">
                              <b-link :href="explorer + 'address/' + data.item.taker" target="_blank">{{ data.item.taker.substring(0, 10) + '...' }}</b-link>
                            </template>
                            <template #cell(tokenIds)="data">
                              {{ JSON.stringify(data.item.tokenIds.map((x) => { return x.toString(); })) }}
                            </template>
                            <template #cell(price)="data">
                              {{ formatETH(data.item.price) }}
                            </template>
                            <template #cell(buyOrSell)="data">
                              {{ formatBuyOrSell(data.item.buyOrSell) }}
                            </template>
                            <template #cell(anyOrAll)="data">
                              {{ formatAnyOrAll(data.item.anyOrAll) }}
                            </template>
                            <template #cell(expiry)="data">
                              {{ formatDate(data.item.expiry) }}
                            </template>
                            <template #cell(royaltyFactor)="data">
                              {{ data.item.royaltyFactor.toString() }}
                            </template>
                            <template #cell(orderStatus)="data">
                              {{ formatOrderStatus(data.item.orderStatus) }}
                            </template>
                          </b-table>
                        </font>
                      </b-card>
                    </div>
                  </b-tab>

                  <b-tab title="Add Order" class="p-1">
                    <b-form-group label-cols="3" label-size="sm" label="Token" description="e.g., 0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4 for TestToadz">
                      <b-form-input size="sm" v-model="order.token" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Taker" description="e.g., 0x12345...">
                      <b-form-input size="sm" v-model="order.taker" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Buy or Sell">
                      <b-form-select size="sm" v-model="order.buyOrSell" :options="buyOrSellOptions" class="w-50"></b-form-select>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Any or All">
                      <b-form-select size="sm" v-model="order.anyOrAll" :options="anyOrAllOptions" class="w-50"></b-form-select>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Token Ids" description="e.g., 1, 2, 3, 4">
                      <b-form-input size="sm" v-model="order.tokenIds" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Price" description="e.g., 0.1 for 0.1 WETH">
                      <b-form-input size="sm" v-model="order.price" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Expiry" description="Unixtime e.g., 1672491599 for 23:59:59 31/12/2022 UTC">
                      <b-form-input size="sm" v-model="order.expiry" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="TradeMax" description="e.g., 1 for single execution orders">
                      <b-form-input size="sm" v-model="order.tradeMax" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Royalty Factor" description="0 to 100. e.g., 100">
                      <b-form-input size="sm" v-model="order.royaltyFactor" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Integrator" description="e.g., 0x2345...">
                      <b-form-input size="sm" v-model="order.integrator" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Tip" description="ETH, e.g., '0' or '0.0001'">
                      <b-form-input size="sm" v-model="order.tip" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="">
                      <b-button size="sm" @click="addOrder" variant="warning">Add Order</b-button>
                    </b-form-group>
                    <b-form-group v-if="order.txMessage.addOrder && order.txMessage.addOrder.substring(0, 2) != '0x'" label-cols="3" label-size="sm" label="">
                      <b-form-textarea size="sm" rows="10" v-model="order.txMessage.addOrder" class="w-50"></b-form-textarea>
                    </b-form-group>
                    <b-form-group v-if="order.txMessage.addOrder && order.txMessage.addOrder.substring(0, 2) == '0x'" label-cols="3" label-size="sm" label="">
                      Tx <b-link :href="explorer + 'tx/' + order.txMessage.addOrder" class="card-link" target="_blank">{{ order.txMessage.addOrder }}</b-link>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Data">
                      <b-form-textarea size="sm" rows="10" v-model="JSON.stringify(order, null, 2)" class="w-50"></b-form-textarea>
                    </b-form-group>
                  </b-tab>

                  <b-tab title="Disable Order" class="p-1">
                    <b-form-group label-cols="3" label-size="sm" label="Token" description="e.g., 0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4 for TestToadz">
                      <b-form-input size="sm" v-model="order.token" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Order Index" description="e.g., 12">
                      <b-form-input size="sm" v-model="order.orderIndex" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Integrator" description="e.g., 0x2345...">
                      <b-form-input size="sm" v-model="order.integrator" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Tip" description="ETH, e.g., '0' or '0.0001'">
                      <b-form-input size="sm" v-model="order.tip" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="">
                      <b-button size="sm" @click="disableOrder" variant="warning">Disable Order</b-button>
                    </b-form-group>
                    <b-form-group v-if="order.txMessage.disableOrder && order.txMessage.disableOrder.substring(0, 2) != '0x'" label-cols="3" label-size="sm" label="">
                      <b-form-textarea size="sm" rows="10" v-model="order.txMessage.disableOrder" class="w-50"></b-form-textarea>
                    </b-form-group>
                    <b-form-group v-if="order.txMessage.disableOrder && order.txMessage.disableOrder.substring(0, 2) == '0x'" label-cols="3" label-size="sm" label="">
                      Tx <b-link :href="explorer + 'tx/' + order.txMessage.disableOrder" class="card-link" target="_blank">{{ order.txMessage.disableOrder }}</b-link>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Data">
                      <b-form-textarea size="sm" rows="10" v-model="JSON.stringify(order, null, 2)" class="w-50"></b-form-textarea>
                    </b-form-group>
                  </b-tab>

                  <b-tab title="Update Order" class="p-1">
                    <b-form-group label-cols="3" label-size="sm" label="Token" description="e.g., 0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4 for TestToadz">
                      <b-form-input size="sm" v-model="order.token" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Order Index" description="e.g., 12">
                      <b-form-input size="sm" v-model="order.orderIndex" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Taker" description="e.g., 0x12345...">
                      <b-form-input size="sm" v-model="order.taker" class="w-50"></b-form-input>
                    </b-form-group>
                    <!--
                    <b-form-group label-cols="3" label-size="sm" label="Buy or Sell">
                      <b-form-select size="sm" v-model="order.buyOrSell" :options="buyOrSellOptions" class="w-50"></b-form-select>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Any or All">
                      <b-form-select size="sm" v-model="order.anyOrAll" :options="anyOrAllOptions" class="w-50"></b-form-select>
                    </b-form-group>
                    -->
                    <b-form-group label-cols="3" label-size="sm" label="Token Ids" description="e.g., 1, 2, 3, 4">
                      <b-form-input size="sm" v-model="order.tokenIds" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Price" description="e.g., 0.1 for 0.1 WETH">
                      <b-form-input size="sm" v-model="order.price" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Expiry" description="Unixtime e.g., 1672491599 for 23:59:59 31/12/2022 UTC">
                      <b-form-input size="sm" v-model="order.expiry" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="TradeMax Adjustment" description="e.g., 5, -5. Must be 0 or 1 for Buy or Sell All orders">
                      <b-form-input size="sm" v-model="order.tradeMaxAdjustment" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Royalty Factor" description="0 to 100. e.g., 100">
                      <b-form-input size="sm" v-model="order.royaltyFactor" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Integrator" description="e.g., 0x2345...">
                      <b-form-input size="sm" v-model="order.integrator" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Tip" description="ETH, e.g., '0' or '0.0001'">
                      <b-form-input size="sm" v-model="order.tip" class="w-50"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="">
                      <b-button size="sm" @click="updateOrder" variant="warning">Update Order</b-button>
                    </b-form-group>
                    <b-form-group v-if="order.txMessage.updateOrder && order.txMessage.updateOrder.substring(0, 2) != '0x'" label-cols="3" label-size="sm" label="">
                      <b-form-textarea size="sm" rows="10" v-model="order.txMessage.updateOrder" class="w-50"></b-form-textarea>
                    </b-form-group>
                    <b-form-group v-if="order.txMessage.updateOrder && order.txMessage.updateOrder.substring(0, 2) == '0x'" label-cols="3" label-size="sm" label="">
                      Tx <b-link :href="explorer + 'tx/' + order.txMessage.updateOrder" class="card-link" target="_blank">{{ order.txMessage.updateOrder }}</b-link>
                    </b-form-group>
                    <b-form-group label-cols="3" label-size="sm" label="Data">
                      <b-form-textarea size="sm" rows="10" v-model="JSON.stringify(order, null, 2)" class="w-50"></b-form-textarea>
                    </b-form-group>
                  </b-tab>

                  <b-tab title="Execute Orders" class="p-1">
                    <b-card-text>
                      <b-form-group label-cols="3" label-size="sm" label="Token" description="e.g., 0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4 for TestToadz">
                        <b-form-input size="sm" v-model="execute.token" class="w-50"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Order index" description="e.g., 3">
                        <b-form-input size="sm" v-model="execute.orderIndex" class="w-50"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Token Ids" description="e.g., 1, 2, 5">
                        <b-form-input size="sm" v-model="execute.tokenIds" class="w-50"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Net Amount" description="e.g., -0.1234">
                        <b-form-input size="sm" v-model="execute.netAmount" class="w-50"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Royalty Factor" description="0 to 100. e.g., 100">
                        <b-form-input size="sm" v-model="execute.royaltyFactor" class="w-50"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Integrator" description="e.g., 0x2345...">
                        <b-form-input size="sm" v-model="execute.integrator" class="w-50"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Tip" description="ETH, e.g., '0' or '0.0001'">
                        <b-form-input size="sm" v-model="execute.tip" class="w-50"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="">
                        <b-button size="sm" @click="executeOrders" variant="warning">Execute Orders</b-button>
                      </b-form-group>
                      <b-form-group v-if="execute.txMessage && execute.txMessage.substring(0, 2) != '0x'" label-cols="3" label-size="sm" label="">
                        <b-form-textarea size="sm" rows="10" v-model="execute.txMessage" class="w-50"></b-form-textarea>
                      </b-form-group>
                      <b-form-group v-if="execute.txMessage && execute.txMessage.substring(0, 2) == '0x'" label-cols="3" label-size="sm" label="">
                        Tx <b-link :href="explorer + 'tx/' + execute.txMessage" class="card-link" target="_blank">{{ execute.txMessage }}</b-link>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Data">
                        <b-form-textarea size="sm" rows="10" v-model="JSON.stringify(execute, null, 2)" class="w-50"></b-form-textarea>
                      </b-form-group>
                    </b-card-text>
                  </b-tab>

                  <b-tab title="Trades" class="p-1">
                    <div v-if="!nixTradeList || nixTradeList.length == 0">
                      <b-card>
                        <b-card-text>
                          Loading trades
                        </b-card-text>
                      </b-card>
                    </div>
                    <b-card>
                      <font size="-2">
                        <b-table small fixed striped sticky-header="1000px" :fields="tradeFields" :items="nixTradeList" head-variant="light" show-empty>
                          <template #cell(taker)="data">
                            <b-link :href="explorer + 'address/' + data.item.taker" target="_blank">{{ data.item.taker.substring(0, 10) + '...' }}</b-link>
                          </template>
                          <template #cell(orders)="data">
                            <div v-for="(token, tokenIndex) in data.item.orders">
                              <b-link :href="explorer + 'token/' + token[0]" target="_blank">{{ token[0] }}</b-link>:{{ token[1].toString() }}
                            </div>
                          </template>
                          <template #cell(txHash)="data">
                            <b-link :href="explorer + 'tx/' + data.item.txHash" target="_blank">{{ data.item.txHash.substring(0, 10) + '...' }}</b-link>
                          </template>
                          <template #cell(events)="data">
                            <div v-for="(event, eventIndex) in data.item.events">
                              {{ event.description }}
                            </div>
                          </template>
                        </b-table>
                      </font>
                    </b-card>
                  </b-tab>

                  <b-tab title="WETH Approvals" class="p-1">
                    <div v-if="!wethData || Object.keys(wethData).length == 0">
                      <b-card>
                        <b-card-text>
                          Loading WETH Approvals
                        </b-card-text>
                      </b-card>
                    </div>
                    <b-card>
                      <font size="-2">
                        <b-table small fixed striped sticky-header="1000px" :fields="wethFields" :items="Object.values(wethData)" head-variant="light" show-empty>
                          <template #cell(account)="data">
                            <b-link :href="explorer + 'address/' + data.item.account" class="truncate" target="_blank">{{ data.item.account }}</b-link>
                          </template>
                          <template #cell(balance)="data">
                            {{ formatETH(data.item.balance) }}
                          </template>
                          <template #cell(allowance)="data">
                            {{ formatETH(data.item.allowance) }}
                          </template>
                        </b-table>
                      </font>
                    </b-card>
                  </b-tab>

                </b-tabs>
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

      order: {
        token: "0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4",
        orderIndex: null, // Only for disableOrder and updateOrder
        taker: null,
        buyOrSell: 1,
        anyOrAll: 0,
        tokenIds: "2075, 1479, 881, 18",
        price: "0.01",
        expiry: 1672491599,
        tradeMax: "1",
        tradeMaxAdjustment: "0", // Only for updateOrder
        royaltyFactor: "100",
        integrator: null,
        tip: "0.0001",
        txMessage: {
          addOrder: null,
          disableOrder: null,
          updateOrder: null,
          executeOrders: null,
        },
      },

      execute: {
        token: "0xD000F000Aa1F8accbd5815056Ea32A54777b2Fc4",
        orderIndex: null,
        tokenIds: null,
        netAmount: null,
        royaltyFactor: "100",
        integrator: null,
        tip: "0.0001",
        txMessage: null,
      },

      buyOrSellOptions: [
        { value: 0, text: 'Buy' },
        { value: 1, text: 'Sell' },
      ],
      anyOrAllOptions: [
        { value: 0, text: 'Any' },
        { value: 1, text: 'All' },
      ],

      tradeFields: [
        { key: 'tradeIndex', label: 'Trade Index', thStyle: 'width: 10%;', sortable: true },
        { key: 'taker', label: 'Taker', thStyle: 'width: 10%;', sortable: true },
        { key: 'royaltyFactor', label: 'Royalty Factor', thStyle: 'width: 10%;', sortable: true },
        { key: 'blockNumber', label: 'Block Number', thStyle: 'width: 10%;', sortable: true },
        { key: 'orders', label: 'Orders (Token:OrderIndex)', thStyle: 'width: 20%;', sortable: true },
        { key: 'txHash', label: 'Tx', thStyle: 'width: 10%;', sortable: true },
        { key: 'events', label: 'Events', thStyle: 'width: 30%;', sortable: true },
      ],

      nixTokenFields: [
        { key: 'tokenIndex', label: '#', thStyle: 'width: 5%;', sortable: true },
        { key: 'token', label: 'Collection', thStyle: 'width: 10%;', sortable: true },
        { key: 'symbol', label: 'Symbol', thStyle: 'width: 10%;', sortable: true },
        { key: 'name', label: 'Name', thStyle: 'width: 20%;', sortable: true },
        { key: 'ordersLength', label: '# Orders', thStyle: 'width: 10%;', sortable: true },
        { key: 'executed', label: '# Executed', thStyle: 'width: 10%;', sortable: true },
        { key: 'volumeToken', label: 'Volume (Tokens)', thStyle: 'width: 10%;', sortable: true },
        { key: 'volumeWeth', label: 'Volume (WETH)', thStyle: 'width: 10%;', sortable: true },
        { key: 'averageWeth', label: 'Average (WETH)', thStyle: 'width: 15%;', sortable: true },
      ],

      wethFields: [
        { key: 'account', label: '#', thStyle: 'width: 30%;', sortable: true },
        { key: 'balance', label: 'Balance', thStyle: 'width: 40%;', sortable: true },
        { key: 'allowance', label: 'Allowance To Nix', thStyle: 'width: 40%;', sortable: true },
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

    nixTokens() {
      return store.getters['nixData/nixTokens'];
    },
    nixTokenList() {
      const results = [];
      if (store.getters['nixData/nixTokens']) {
        for (const [tokenIndex, token] of Object.entries(store.getters['nixData/nixTokens'])) {
          results.push(token);
        }
      }
      return results;
    },
    wethData() {
      return store.getters['nixData/wethData'];
    },

    tokensData() {
      return store.getters['nixData/tokensData'];
    },
    nixTradeList() {
      return store.getters['nixData/nixTradeList'];
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

    addOrder() {
      console.log("addOrder");
      this.$bvModal.msgBoxConfirm('Add Order?', {
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
            const weth = await nix.weth();
            const taker = this.order.taker == null || this.order.taker.trim().length == 0 ? ADDRESS0 : taker;
            const tokenIds = this.order.tokenIds == null || this.order.tokenIds.trim().length == 0 ? [] : this.order.tokenIds.split(",").map(function(item) { return item.trim(); });
            const price = ethers.utils.parseEther(this.order.price);
            const integrator = this.order.integrator == null || this.order.integrator.trim().length == 0 ? ADDRESS0 : this.order.integrator;
            const tip = this.order.tip == null || this.order.tip.trim().length == 0 ? 0 : ethers.utils.parseEther(this.order.tip);
            try {
              const tx = await nixWithSigner.addOrder(this.order.token, taker, this.order.buyOrSell, this.order.anyOrAll, tokenIds, price, this.order.expiry, this.order.tradeMax, this.order.royaltyFactor, integrator, { value: tip });
              this.order.txMessage.addOrder = tx.hash;
              console.log("tx: " + JSON.stringify(tx));
            } catch (e) {
              this.order.txMessage.addOrder = e.message.toString();
              console.log("error: " + e.toString());
            }
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    disableOrder() {
      console.log("disableOrder");
      this.$bvModal.msgBoxConfirm('Disable Order?', {
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
            const integrator = this.order.integrator == null || this.order.integrator.trim().length == 0 ? ADDRESS0 : this.order.integrator;
            const tip = this.order.tip == null || this.order.tip.trim().length == 0 ? 0 : ethers.utils.parseEther(this.order.tip);
            try {
              const tx = await nixWithSigner.disableOrder(this.order.token, this.order.orderIndex, integrator, { value: tip });
              this.order.txMessage.disableOrder = tx.hash;
              console.log("tx: " + JSON.stringify(tx));
            } catch (e) {
              this.order.txMessage.disableOrder = e.message.toString();
              console.log("error: " + e.toString());
            }
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    updateOrder() {
      console.log("updateOrder");
      this.$bvModal.msgBoxConfirm('Update Order?', {
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
            const weth = await nix.weth();
            const taker = this.order.taker == null || this.order.taker.trim().length == 0 ? ADDRESS0 : taker;
            const tokenIds = this.order.tokenIds == null || this.order.tokenIds.trim().length == 0 ? [] : this.order.tokenIds.split(",").map(function(item) { return item.trim(); });
            const price = ethers.utils.parseEther(this.order.price);
            const integrator = this.order.integrator == null || this.order.integrator.trim().length == 0 ? ADDRESS0 : this.order.integrator;
            const tip = this.order.tip == null || this.order.tip.trim().length == 0 ? 0 : ethers.utils.parseEther(this.order.tip);
            try {
              const tx = await nixWithSigner.updateOrder(this.order.token, this.order.orderIndex, taker, tokenIds, price, this.order.expiry, this.order.tradeMaxAdjustment, this.order.royaltyFactor, integrator, { value: tip });
              this.order.txMessage.updateOrder = tx.hash;
              console.log("tx: " + JSON.stringify(tx));
            } catch (e) {
              this.order.txMessage.updateOrder = e.message.toString();
              console.log("error: " + e.toString());
            }
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    executeOrders() {
      console.log("executeOrders");
      this.$bvModal.msgBoxConfirm('Execute Orders?', {
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
            const weth = await nix.weth();
            const tokenIds = this.execute.tokenIds.split(",").map(function(item) { return item.trim(); });
            const netAmount = ethers.utils.parseEther(this.execute.netAmount);
            const integrator = this.execute.integrator == null || this.execute.integrator.trim().length == 0 ? ADDRESS0 : this.execute.integrator;
            const tip = this.execute.tip == null || this.execute.tip.trim().length == 0 ? 0 : ethers.utils.parseEther(this.execute.tip);
            try {
              const tx = await nixWithSigner.executeOrders([this.execute.token], [this.execute.orderIndex], [tokenIds], netAmount, this.execute.royaltyFactor, integrator, { value: tip });
              this.execute.txMessage = tx.hash;
              console.log("tx: " + JSON.stringify(tx));
            } catch (e) {
              this.execute.txMessage = e.message.toString();
              console.log("error: " + e.toString());
            }
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    async timeoutCallback() {
      logDebug("Exchange", "timeoutCallback() count: " + this.count);

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
    logDebug("Exchange", "beforeDestroy()");
  },
  mounted() {
    logDebug("Exchange", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("Exchange", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const nixModule = {
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
      logDebug("nixModule", "mutations.setCanvas('" + c + "')")
      state.canvas = c;
    },
    deQueue(state) {
      logDebug("nixModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("nixModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("nixModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    setCanvas(context, c) {
      logDebug("connectionModule", "actions.setCanvas(" + JSON.stringify(c) + ")");
      // context.commit('setCanvas', c);
    },
  },
};
