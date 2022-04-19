const Docs = {
  template: `
    <div class="mt-5 pt-3">
      <b-card no-body class="border-0">
        <b-card no-body class="border-0 m-0 mt-2">
          <!-- <b-tabs v-model="section" pills card vertical end nav-class="m-1 p-1" active-tab-class="m-1 mt-2 p-1"> -->

            <!-- Info -->
            <!-- <b-tab title="Info" @click.prevent="updateRouterParamsSectionTopic('info', 'top')"> -->
              <b-card-text>
                <h5 ref="info_top" class="mb-3">Info</h5>

                <a href="https://isotile.com/a/0xbeeef66749b64afe43bbc9475635eb510cfe4922" target="_blank">https://isotile.com/a/0xbeeef66749b64afe43bbc9475635eb510cfe4922</a>
                <br />
                <iframe src="https://isotile.com/a/0xbeeef66749b64afe43bbc9475635eb510cfe4922" style="width: 400px; height: 200px;"></iframe>

                <br />
                <a href="https://opensea.io/accounts/beeef.nftpostcard.eth" target="_blank">https://opensea.io/accounts/beeef.nftpostcard.eth</a>
                <!--
                <br />
                <iframe src="https://opensea.io/accounts/beeef.nftpostcard.eth" style="width: 400px; height: 200px;"></iframe>
                -->

                <br />
                <a href="https://isotile.com/a/0x000001f568875f378bf6d170b790967fe429c81a" target="_blank">https://isotile.com/a/0x000001f568875f378bf6d170b790967fe429c81a</a>
                <br />
                <iframe src="https://isotile.com/a/0x000001f568875f378bf6d170b790967fe429c81a" style="width: 400px; height: 200px;"></iframe>

                <br />
                <a href="https://opensea.io/accounts/bokkypoobah.eth" target="_blank">https://opensea.io/accounts/bokkypoobah.eth</a>
                <!--
                <br />
                <iframe src="https://opensea.io/accounts/bokkypoobah.eth" style="width: 400px; height: 200px;"></iframe>
                -->


                <!-- <b-card no-body class="border-0"> -->
                  <p>We, <b-link href="https://www.larvalabs.com/cryptopunks/details/3636" target="_blank">#3636 <b-avatar variant="light" size="3.0rem" src="https://www.larvalabs.com/public/images/cryptopunks/punk3636.png"></b-avatar></b-link> and
                  <b-link href="https://www.larvalabs.com/cryptopunks/details/4472" target="_blank">#4472 <b-avatar variant="light" size="3.0rem" src="https://www.larvalabs.com/public/images/cryptopunks/punk4472.png"></b-avatar></b-link>, Zombie Xtreme High Yield cultivators have been travelling through space and time collecting digital subjects to build a menagerie.</p>
                  <div class="m-5">
                      <b-carousel
                        id="carousel-1"
                        v-model="slide"
                        :interval="5000"
                        controls
                        indicators
                        background="#ababab"
                        :img-width=slideWidth
                        :img-height=slideHeight
                        style="text-shadow: 2px 2px 3px #333;"
                        class="mx-5 p-0"
                      >
                        <b-carousel-slide caption="Zombie #3636,"
                          text="BASTARD GAN V2 Children And Cats, Bombo, NSW, Australia, Year 2021">
                          <b-img slot="img" class="d-block img-fluid w-100" :width=slideWidth :height=slideHeight
                             src="images/IMG_9534_z3636_Bombo_2048x960.png" alt="image slot"></b-img>
                        </b-carousel-slide>
                        <b-carousel-slide caption="Zombie #3636 & #4472 Family"
                          text="On A Palaeontological Stroll Down The Permian At Gerroa, NSW, Australia">
                          <b-img slot="img" class="d-block img-fluid w-100" :width=slideWidth :height=slideHeight
                               src="images/GerroaPhotoAlbumWithZ3636n4472Family_2048x960.png" alt="image slot"></b-img>
                        </b-carousel-slide>
                        <b-carousel-slide caption="Zombie #3636 & #4472 Family"
                          text="In Year 1637 At Utrecht To Trade Tulip NFT Options">
                          <b-img slot="img" class="d-block img-fluid w-100" :width=slideWidth :height=slideHeight
                               src="images/Cryptogs_3185_ZFam_2048x960.png" alt="image slot"></b-img>
                        </b-carousel-slide>
                        <b-carousel-slide caption="Zombie #3636 & #4472 Family"
                          text="In 1507 At Badaling To Trade Silk NFTs">
                          <b-img slot="img" class="d-block img-fluid w-100" :width=slideWidth :height=slideHeight
                               src="images/GreatWall_ZFam_2048x960.png" alt="image slot"></b-img>
                        </b-carousel-slide>
                        <b-carousel-slide caption="Zombie Xtreme High Yield Farmers"
                          text="With Subjects In 1935 At Milsons Point">
                          <b-img slot="img" class="d-block img-fluid w-100" :width=slideWidth :height=slideHeight
                               src="images/PunkstersHarbourBridgeMilsonsPoint1935_1600x750.png" alt="image slot"></b-img>
                        </b-carousel-slide>
                        <b-carousel-slide caption="Zombie #3636 & #4472"
                          text="Infected By Airborne Z-Alien Virus, Travel To 1,050 BC To Inspect Their Re-analoged Digitalised Cat At Earth-619">
                          <b-img slot="img" class="d-block img-fluid w-100" :width=slideWidth :height=slideHeight
                               src="images/Punks_3636_4472_Sphinx_1024x480.png" alt="image slot"></b-img>
                        </b-carousel-slide>
                        <b-carousel-slide caption="Zombie Xtreme High Yield Cultivators And Subjects"
                          text="Infected By Mutated Z-Alien Virus Strains In 1,050 BC at Earth-619">
                          <b-img slot="img" class="d-block img-fluid w-100" :width=slideWidth :height=slideHeight
                               src="images/Punks_3636_4472_Sphinx_Subjects_More_1024x480.png" alt="image slot"></b-img>
                        </b-carousel-slide>
                        <b-carousel-slide caption="Zombie Xtreme High Yield Cultivators"
                          text="Take Ownership Of Twins At 1888 In The Royal Prince Alfred Hospital, Sydney. Credits - Mitchell Library, State Library of NSW">
                          <b-img slot="img" class="d-block img-fluid w-100" :width=slideWidth :height=slideHeight
                               src="images/CryptoBabyPunk_401_Birth_At_RPA_1880-1893_960x450.png" alt="image slot"></b-img>
                        </b-carousel-slide>
                      </b-carousel>
                    </div>
                  <!-- </b-card> -->

                  <p>We have now deployed an Xtreme High Yield Zombie Baby <b-link :href="explorer + 'address/token.zombiebabies.eth#code'" target="_blank">ERC-1155 Non-Fungible Token</b-link> (NFT), and a <b-link :href="explorer + 'address/adoption.zombiebabies.eth#code'" target="_blank">Zombie Baby Adoption Centre</b-link> on the Ethereum blockchain, for our immortal Zombie Babies to spread throughout SpaceTime.</p>

                  <p><b-link to="/">Adopt</b-link> the next available Zombie Babies (one of #0 to #7) for free (+ transaction fee), or adopt a clowder of Zombie Babies (all of #0 to #7) for 0.05 ETH (+ transaction fee).</p>


                <!--
                See <b-link @click.prevent="section = 3; updateRouterParamsSectionTopic('formulae', 'algorithms')">Formulae - Algorithms</b-link>
                -->
              </b-card-text>
            </b-tab>

            <!-- Links -->
            <!-- <b-tab title="Links" @click.prevent="updateRouterParamsSectionTopic('links', 'top')"> -->

              <b-card-text>
                <h5 ref="links_top" class="mb-3">Links</h5>
                <p>GitHub NFTPostcardApp: <b-link href="https://github.com/bokkypoobah/NFTPostcardApp" target="_blank">https://github.com/bokkypoobah/NFTPostcardApp</b-link></p>
                <p>GitHub ERC-1155 NFT: <b-link href="https://github.com/bokkypoobah/NFT" target="_blank">https://github.com/bokkypoobah/NFT</b-link></p>
                <p>Twitter: <b-link href="https://twitter.com/BokkyPooBah" target="_blank">https://twitter.com/BokkyPooBah</b-link></p>
              </b-card-text>
            <!-- </b-tab> -->

            <!-- How To -->
            <!--
            <b-tab title="How To" @click.prevent="updateRouterParamsSectionTopic('howto', 'top')">
              <b-card-text>
                <h5 ref="howto_top" class="mb-3">How To ...</h5>
                How To ...
              </b-card-text>
            </b-tab>
            -->

            <!-- Formulae -->
            <!--
            <b-tab title="Formulae" @click.prevent="updateRouterParamsSectionTopic('formulae', 'top')">
              <b-card-text>
                <h5 ref="formulae_top" class="mb-3">Formulae</h5>
                <ul>
                  <li><b-link @click.prevent="updateRouterParamsSectionTopic('formulae', 'optionpayoffformulae')">Option Payoff Formulae</b-link>
                    <ul>
                      <li>Vanilla Call Option Payoff</li>
                      <li>Capped Call Option Payoff</li>
                      <li>Vanilla Put Option Payoff</li>
                      <li>Floored Put Option Payoff</li>
                    </ul>
                  </li>
                  <li><b-link @click.prevent="updateRouterParamsSectionTopic('formulae', 'algorithms')">Algorithms</b-link>
                    <ul>
                      <li>Decimal Places</li>
                      <li>Call Payoff And Collateral</li>
                      <li>Put Payoff And Collateral</li>
                    </ul>
                  </li>
                  <li><b-link @click.prevent="updateRouterParamsSectionTopic('formulae', 'solidityimplementation')">Ethereum Solidity Smart Contract Implementation</b-link></li>
                </ul>
                <hr />

                <br />
                <h5 ref="formulae_optionpayoffformulae" class="mb-3">Option Payoff Formulae</h5>
                <p>This first version of the Optino Protocol implements the following option payoff formulae. Refer to <b-link href="https://www.google.com/search?q=capped+call+floored+put+zhang" class="card-link" target="_blank">Zhang, P.G. (1998) Exotic Options: A Guide To Second Generation Options (2nd Edition), pages 578 - 582</b-link> for further information about Capped Calls and Floored Puts.</p>

                <br />
                <h6>Vanilla Call Option Payoff</h6>
                <pre><code class="solidity m-2 p-2">vanillaCallPayoff = max(spot - strike, 0)</code></pre>

                <h6>Capped Call Option Payoff</h6>
                <pre><code class="solidity m-2 p-2">cappedCallPayoff = max(min(spot, cap) - strike, 0)
                 = max(spot - strike, 0) - max(spot - cap, 0)</code></pre>

                <h6>Vanilla Put Option Payoff</h6>
                <pre><code class="solidity m-2 p-2">vanillaPutPayoff = max(strike - spot, 0)</code></pre>

                <h6>Floored Put Option Payoff</h6>
                <pre><code class="solidity m-2 p-2">flooredPutPayoff = max(strike - max(spot, floor), 0)
                 = max(strike - spot, 0) - max(floor - spot, 0)</code></pre>

                <hr />

                <br />
                <h5 ref="formulae_algorithms" class="mb-3">Algorithms</h5>
                <h6>Decimal Places</h6>
                <p>Four types of decimal places are involved in these calculations:</p>
                <ul>
                  <li><code>optinoDecimals</code> - for Optino and Cover tokens, hardcoded to 18</li>
                  <li><code>decimals0</code> for token0 (or baseToken), e.g. 18 decimals for WETH in WETH/USDx</li>
                  <li><code>decimals1</code> for token1 (or quoteToken), e.g. 6 decimals for USDx in WETH/USDx</li>
                  <li><code>rateDecimals</code> for the rate feed. e.g. 18 for MakerDAO's feeds</li>
                </ul>
                <br />

                <h6>Call Payoff And Collateral</h6>
                <p>Requirements:</p>
                <ul>
                  <li><code>strike</code> must be > 0</li>
                  <li><code>bound</code>, or <code>cap</code> must be 0 for vanilla calls or > <code>strike</code> for capped calls</li>
                  <li>Collateral is in the *token0* (or *baseToken*)</li>
                </ul>
                <p>Call Payoff:</p>
                <pre><code class="solidity m-2 p-2">callPayoff = 0
if (spot > 0 && spot > strike) {
...
}</code></pre>
                <p>Put Collateral:</p>
                <pre><code class="solidity m-2 p-2">putCollateral = [(strike - bound) / (10^rateDecimals)] x [tokens / (10^optinoDecimals)] x (10^decimals1)</code></pre>

                <hr />

                <br />
                <h5 ref="formulae_solidityimplementation" class="mb-3">Ethereum Solidity Smart Contract Implementation</h5>
                <p>Info:</p>
                <ul>
                  <li>Using 256 bit unsigned integers</li>
                  <li>Divisions are performed last to reduce loss of precision</li>
                  <li><code>computeCollateral(...)</code> calculates the <code>collateral</code> as the maximum payoff</li>
                  <li><code>computePayoff(...)</code> calculates the <code>payoff</code> depending on the spot price, after expiry</li>
                  <li>Optino and Cover tokens can <code>close(...)</code> off against each other to release calculated <code>collateral</code> in proportion to the tokens closed/netted</li>
                  <li>Optino token holders execute <code>settle()</code> after expiry to receive the calculated <code>payoff</code> in proportion to the token holdings</li>
                  <li>Cover token holders execute <code>settle()</code> after expiry to receive the calculated <code>(collateral - payoff)</code> in proportion to the token holdings</li>
                </ul>
                <p>Solidity Code from factory <b-link :href="explorer + 'address/' + address + '#code'" class="card-link" target="_blank">{{ address }}</b-link> and template <b-link :href="explorer + 'address/' + optinoTokenTemplate + '#code'" class="card-link" target="_blank">{{ optinoTokenTemplate }}</b-link>:</p>
                <pre><code class="solidity m-2 p-2">/// @notice Vanilla, capped call and floored put options formulae for 100% collateralisation
// ----------------------------------------------------------------------------
// vanillaCallPayoff = max(spot - strike, 0)
// cappedCallPayoff  = max(min(spot, cap) - strike, 0)
//                   = max(spot - strike, 0) - max(spot - cap, 0)
// vanillaPutPayoff  = max(strike - spot, 0)
// flooredPutPayoff  = max(strike - max(spot, floor), 0)
//                   = max(strike - spot, 0) - max(floor - spot, 0)
// ----------------------------------------------------------------------------</code></pre>
              </b-card-text>
            </b-tab>
            -->

            <!-- Factory -->
            <!--
            <b-tab title="Factory" @click.prevent="updateRouterParamsSectionTopic('factory', 'top')">
              <b-card-text>
                <h5 ref="factory_top" class="mb-3">Factory</h5>
                Factory
                <pre><code class="solidity m-2 p-2">{
	"79ba5097": "acceptOwnership()",
	"10f9fb1d": "calcPayoffs(address[2],address[2],uint8[6],uint256[5],uint256[])",
	"e7595d25": "calculateSpot(address[2],uint8[6])",
	"ddca3f43": "fee()",
	"06ac8ad8": "feedLength()",
	"34d368a6": "getCalcData(bytes32)",
...
	"9012c4a8": "updateFee(uint256)",
	"9b3278c6": "updateFeed(address,string,string,uint8,uint8)",
	"d84960a1": "updateFeedNote(address,string)",
	"1923be24": "updateMessage(string)"
}</code></pre>
              </b-card-text>
            </b-tab>
            -->

            <!-- Optino And Cover -->
            <!--
            <b-tab title="Optino And Cover" @click.prevent="updateRouterParamsSectionTopic('optinoandcover', 'top')">
              <b-card-text>
                <h5 ref="optinoandcover_top" class="mb-3">Optino And Cover</h5>
                Optino And Cover
                <pre><code class="solidity m-2 p-2">{
	"79ba5097": "acceptOwnership()",
....
	"23b872dd": "transferFrom(address,address,uint256)",
	"f2fde38b": "transferOwnership(address)"
}</code></pre>
              </b-card-text>
            </b-tab>
            -->

            <!--
            <b-tab title="Reference" @click.prevent="updateRouterParamsSectionTopic('reference', 'top')">
              <b-card-text>Reference</b-card-text>
            </b-tab>
            -->
          <!-- </b-tabs> -->
        </b-card>
      </b-card>

      <!--
      <b-card no-body header="Documentation" class="border-0" header-class="p-1">
        <b-card-body class="m-1 p-1">
          <b-row>
            <b-col cols="10">
              <b-collapse id="accordion-docs" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text>docs I start opened because <code>visible</code> is <code>true</code></b-card-text>
                  <b-card-text>{{ text }}</b-card-text>
                </b-card-body>
              </b-collapse>
              <b-collapse id="accordion-risks" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text>risks I start opened because <code>visible</code> is <code>true</code></b-card-text>
                  <b-card-text>{{ text }}</b-card-text>
                </b-card-body>
              </b-collapse>
              <b-collapse id="accordion-reference" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text>reference I start opened because <code>visible</code> is <code>true</code></b-card-text>
                  <b-card-text>{{ text }}</b-card-text>
                </b-card-body>
              </b-collapse>
            </b-col>
            <b-col cols="2">
              <b-list-group class="mt-5">
                <b-list-group-item v-b-toggle.accordion-docs>Docs Home</b-list-group-item>
                <b-list-group-item v-b-toggle.accordion-formulae>Formulae</b-list-group-item>
                <b-list-group-item v-b-toggle.accordion-risks>Risks</b-list-group-item>
                <b-list-group-item v-b-toggle.accordion-reference>Reference</b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
      -->
    </div>
  `,
  data: function () {
    return {
      section: 2,
      slide: 0,
      sliding: null,
      slideWidth: 1024,
      slideHeight: 480,
    }
  },
  computed: {
    explorer() {
      return store.getters['connection/explorer'];
    },
    nftData() {
      return store.getters['tokens/nftData'];
    },
    address() {
      return store.getters['optinoFactory/address'];
    },
    optinoTokenTemplate() {
      return store.getters['optinoFactory/optinoTokenTemplate'];
    },
  },
  watch: {
    '$route' (to, from) {
      logInfo("Docs", "watch.$route(to:" + to.params.section + "/" + to.params.topic + ", from:" + from.params.section + "/" + from.params.topic + ")");
      if ("info" == to.params.section) {
        this.section = 0;
      } else if ("risks" == to.params.section) {
        this.section = 1;
      } else if ("howto" == to.params.section) {
        this.section = 2;
      } else if ("formulae" == to.params.section) {
        this.section = 3;
      } else if ("factory" == to.params.section) {
        this.section = 4;
      } else if ("optinoandcover" == to.params.section) {
        this.section = 5;
      } else if ("all" == to.params.section) {
        this.section = 0;
      }
      // console.log(this.$refs);
      // const toDepth = to.path.split('/').length
      // const fromDepth = from.path.split('/').length
      // this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },
  methods: {
    updateRouterParamsSectionTopic(section, topic) {
      logInfo("Docs", "updateRouterParamsSectionTopic(" + JSON.stringify(section) + ", " + topic + ")");
      this.$router.push({ params: { section: section, topic: topic }}).catch(err => {});
      var t = this;
      setTimeout(function() {
        t.scrollTo(section + "_" + topic);
      }, 1000);
    },
    highlightIt() {
      logInfo("Docs", "highlightIt() Called");
      var t = this;
      setTimeout(function() {
        logInfo("Docs", "highlightIt() hljs init");
        hljs.registerLanguage('solidity', window.hljsDefineSolidity);
        hljs.initHighlightingOnLoad();
      }, 2500);
    },
    scrollTo(refName) {
      logInfo("Docs", "scrollTo(" + refName + ")");
      var element = this.$refs[refName];
      var top = element.offsetTop;
      // window.scrollTo(0, top);
      window.scrollTo({ top: top, left: 0, behaviour: 'smooth' });
    }
  },
  updated() {
    // logInfo("Docs", "updated() Called");
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  },
  mounted() {
    logInfo("Docs", "mounted() $route: " + JSON.stringify(this.$route.params));
    if ("info" == this.$route.params.section) {
      this.section = 0;
    } else if ("links" == this.$route.params.section) {
      this.section = 1;
    } else if ("howto" == this.$route.params.section) {
      this.section = 2;
    } else if ("formulae" == this.$route.params.section) {
      this.section = 3;
    } else if ("factory" == this.$route.params.section) {
      this.section = 4;
    } else if ("optinoandcover" == this.$route.params.section) {
      this.section = 5;
    } else if ("all" == this.$route.params.section) {
      this.section = 3;
    }
    var t = this;
    setTimeout(function() {
      logInfo("Docs", "mounted() scrollTo: " + t.$route.params.section + "_" + t.$route.params.topic);
      t.scrollTo(t.$route.params.section + "_" + t.$route.params.topic);
    }, 1000);

    hljs.registerLanguage('solidity', window.hljsDefineSolidity);
    // document.addEventListener('DOMContentLoaded', (event) => {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
        // console.log("hljs: " + JSON.stringify(block));
      });
    // });
  },
};
