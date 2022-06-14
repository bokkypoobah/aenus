// npm install --save ethers
const { ethers } = require("ethers");

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


async function doIt() {
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
  for (let i = 0; i < 10000; i++) {
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

doIt();
