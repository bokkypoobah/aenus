// npm install --save ethers
const { ethers } = require("ethers");

const CRYPTOPUNKSMARKETDEPLOYMENTBLOCK = 3914495;
const CRYPTOPUNKSMARKETADDRESS = "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb";
const CRYPTOPUNKSMARKETABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"punksOfferedForSale","outputs":[{"name":"isForSale","type":"bool"},{"name":"punkIndex","type":"uint256"},{"name":"seller","type":"address"},{"name":"minValue","type":"uint256"},{"name":"onlySellTo","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"enterBidForPunk","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"},{"name":"minPrice","type":"uint256"}],"name":"acceptBidForPunk","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[]"},{"name":"indices","type":"uint256[]"}],"name":"setInitialOwners","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"imageHash","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"nextPunkIndexToAssign","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"punkIndexToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"punkBids","outputs":[{"name":"hasBid","type":"bool"},{"name":"punkIndex","type":"uint256"},{"name":"bidder","type":"address"},{"name":"value","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"allInitialOwnersAssigned","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"allPunksAssigned","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"buyPunk","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"punkIndex","type":"uint256"}],"name":"transferPunk","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"withdrawBidForPunk","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"punkIndex","type":"uint256"}],"name":"setInitialOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"},{"name":"minSalePriceInWei","type":"uint256"},{"name":"toAddress","type":"address"}],"name":"offerPunkForSaleToAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"punksRemainingToAssign","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"},{"name":"minSalePriceInWei","type":"uint256"}],"name":"offerPunkForSale","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"getPunk","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingWithdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"punkNoLongerForSale","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"punkIndex","type":"uint256"}],"name":"Assign","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"punkIndex","type":"uint256"}],"name":"PunkTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"minValue","type":"uint256"},{"indexed":true,"name":"toAddress","type":"address"}],"name":"PunkOffered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"fromAddress","type":"address"}],"name":"PunkBidEntered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"fromAddress","type":"address"}],"name":"PunkBidWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"fromAddress","type":"address"},{"indexed":true,"name":"toAddress","type":"address"}],"name":"PunkBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"}],"name":"PunkNoLongerForSale","type":"event"}];


const CRYPTOPUNKSDATAADDRESS="0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2";
const CRYPTOPUNKSDATAABI=[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"},{"internalType":"bytes","name":"encoding","type":"bytes"},{"internalType":"string","name":"name","type":"string"}],"name":"addAsset","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"key1","type":"uint64"},{"internalType":"uint32","name":"value1","type":"uint32"},{"internalType":"uint64","name":"key2","type":"uint64"},{"internalType":"uint32","name":"value2","type":"uint32"},{"internalType":"uint64","name":"key3","type":"uint64"},{"internalType":"uint32","name":"value3","type":"uint32"},{"internalType":"uint64","name":"key4","type":"uint64"},{"internalType":"uint32","name":"value4","type":"uint32"}],"name":"addComposites","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"},{"internalType":"bytes","name":"_punks","type":"bytes"}],"name":"addPunks","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint16","name":"index","type":"uint16"}],"name":"punkAttributes","outputs":[{"internalType":"string","name":"text","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"index","type":"uint16"}],"name":"punkImage","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"index","type":"uint16"}],"name":"punkImageSvg","outputs":[{"internalType":"string","name":"svg","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sealContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"_palette","type":"bytes"}],"name":"setPalette","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const PUNKTRAITS = {
  "body" : ["alien", "ape", "female", "female-1", "female-2", "female-3", "female-4", "male", "male-1", "male-2", "male-3", "male-4", "zombie"],
  "chinstrap" : ["chinstrap"],
  "clown-nose" : ["clown-nose"],
  "earring" : ["earring"],
  "eyes": ["3d-glasses", "big-shades", "blue-eye-shadow", "classic-shades", "clown-eyes-blue", "clown-eyes-green", "eye-mask", "eye-patch", "green-eye-shadow", "horned-rim-glasses", "nerd-glasses", "purple-eye-shadow", "regular-shades", "small-shades", "vr", "welding-goggles"],
  "feature" : ["buck-teeth", "rosy-cheeks", "spots"],
  "frown" : ["frown"],
  "hair": ["blonde-short", "cap", "clown-hair-green", "crazy-hair", "dark-hair", "frumpy-hair", "half-shaved", "messy-hair", "mohawk", "mohawk-dark", "mohawk-thin", "orange-side", "peak-spike", "pigtails", "purple-hair", "red-mohawk", "shaved-head", "straight-hair", "straight-hair-blonde", "straight-hair-dark", "stringy-hair", "vampire-hair", "wild-blonde", "wild-hair", "wild-white-hair"],
  "hat": ["bandana", "beanie", "blonde-bob", "cap-forward", "cowboy-hat", "do-rag", "fedora", "knitted-cap", "hoodie", "pilot-helmet", "pink-with-hat", "police-cap", "tassle-hat", "tiara", "top-hat"],
  "headband": ["headband"],
  "mole": ["mole"],
  "mouth": ["big-beard", "black-lipstick", "front-beard", "front-beard-dark", "goat", "handlebars", "hot-lipstick", "luxurious-beard", "muttonchops", "normal-beard", "normal-beard-black", "purple-lipstick", "shadow-beard"],
  "mouthext": ["cigarette", "medical-mask", "pipe", "vape"],
  "mustache": ["mustache"],
  "smile": ["smile"],
  "special": ["choker", "gold-chain", "silver-chain"],
};


async function retrieveAttributes() {
  const traitsLookup = {};
  for (const [attribute, traits] of Object.entries(PUNKTRAITS)) {
    for (trait of traits) {
      traitsLookup[trait] = attribute;
    }
  }
  // console.log(JSON.stringify(traitsLookup));
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner()
  const cryptoPunksData = new ethers.Contract(CRYPTOPUNKSDATAADDRESS, CRYPTOPUNKSDATAABI, provider);
  console.log("const PUNKATTRIBUTES = [");
  for (let i = 0; i < 10; i++) {
    const attributeString = await cryptoPunksData.punkAttributes(i);
    const attributes = attributeString.split(/[,]+/).map(function(s) { return s.trim().replace(/ /g, '-').toLowerCase(); });
    console.log("  [ // " + i);
    const data = [];
    for (let attribute of attributes) {
      const trait = traitsLookup[attribute];
      if (trait == null) {
        break;
      }
      console.log("    { trait_type: \'" + trait + "', value: '" + attribute + "' },");
    }
    console.log("  ],");
  }
  console.log("];");
}

async function retrieveEvents() {
  console.log("retrieveEvents");
  const provider = new ethers.providers.JsonRpcProvider();
  const block = await provider.getBlock();
  let fromBlock = CRYPTOPUNKSMARKETDEPLOYMENTBLOCK;
  let maxBlock = parseInt(CRYPTOPUNKSMARKETDEPLOYMENTBLOCK) + 10000;
  // let maxBlock = block.number;
  console.log("retrieveEvents(): fromBlock: " + fromBlock + ", maxBlock: " + maxBlock);
  let count = 0;
  let total = 0;
  let blocks = 5000; // Cater for the assignment of 10k punks at the start
  const results = [];
  do {
    let toBlock = parseInt(fromBlock) + blocks;
    if (toBlock > maxBlock) {
      toBlock = maxBlock;
    }
    const filter = {
      address: CRYPTOPUNKSMARKETADDRESS,
      fromBlock: fromBlock,
      toBlock: toBlock,
      topics: null,
    };
    const events = await provider.getLogs(filter);
    results.push(...events);
    // await db0.events.bulkPut(events).then (function() {
    // }).catch(function(error) {
    //   console.log("error: " + error);
    // });
    total = parseInt(total) + events.length;
    if (count % 20 == 0) {
      console.log("retrieveEvents() - fromBlock: " + fromBlock + ", total: " + total);
    }
    fromBlock = parseInt(fromBlock) + blocks;
    blocks = 25000;
    count++;
  } while (fromBlock < maxBlock);
  console.log("retrieveEvents() - fromBlock: " + fromBlock + ", total: " + total);
  console.log("retrieveEvents() - results: " + JSON.stringify(results.slice(0, 5)));

  const blockNumbers = results.map(function(s) { return s.blockNumber; });
  console.log("retrieveEvents() - blockNumbers: " + JSON.stringify(blockNumbers));

  // let uniqueBlockNumbers = [
  //   ...new Map(blockNumbers.map((item) => [item["blockNumber"], item])).values(),
  // ];
  // console.log("retrieveEvents() - uniqueBlockNumbers: " + JSON.stringify(uniqueBlockNumbers));


  var uniqueBlockNumbers = {};
  for (let event of results.slice(0, 1000)) {
    uniqueBlockNumbers[event.blockNumber] = true;
  }

  // var newBlockNumbers = blockNumbers.filter(function(entry) {
  //     if (uniqueBlockNumbers[entry.blockNumber]) {
  //         return false;
  //     }
  //     uniqueBlockNumbers[entry.blockNumber] = true;
  //     return true;
  // });

  // console.log("retrieveEvents() - uniqueBlockNumbers: " + JSON.stringify(Object.keys(uniqueBlockNumbers)));
  for (let blockNumber of Object.keys(uniqueBlockNumbers)) {
    console.log("retrieveEvents() - blockNumber: " + blockNumber);
    const block = await provider.getBlock(maxBlock, false);
    console.log("retrieveEvents() - blockNumber: " + maxBlock + ", timestamp: " + block.timestamp);
  }
  // console.log("retrieveEvents() - newBlockNumbers: " + JSON.stringify(newBlockNumbers));

  // for (blockNumber of newBlockNumbers) {
  //   console.log("retrieveEvents() - newBlockNumbers: " + blockNumber);
  // }
}

// retrieveAttributes();
retrieveEvents();
