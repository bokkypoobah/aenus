// npm install --save ethers
const { ethers } = require("ethers");

const CRYPTOPUNKSDATAADDRESS="0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2";
const CRYPTOPUNKSDATAABI=[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"},{"internalType":"bytes","name":"encoding","type":"bytes"},{"internalType":"string","name":"name","type":"string"}],"name":"addAsset","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"key1","type":"uint64"},{"internalType":"uint32","name":"value1","type":"uint32"},{"internalType":"uint64","name":"key2","type":"uint64"},{"internalType":"uint32","name":"value2","type":"uint32"},{"internalType":"uint64","name":"key3","type":"uint64"},{"internalType":"uint32","name":"value3","type":"uint32"},{"internalType":"uint64","name":"key4","type":"uint64"},{"internalType":"uint32","name":"value4","type":"uint32"}],"name":"addComposites","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"},{"internalType":"bytes","name":"_punks","type":"bytes"}],"name":"addPunks","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint16","name":"index","type":"uint16"}],"name":"punkAttributes","outputs":[{"internalType":"string","name":"text","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"index","type":"uint16"}],"name":"punkImage","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"index","type":"uint16"}],"name":"punkImageSvg","outputs":[{"internalType":"string","name":"svg","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sealContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"_palette","type":"bytes"}],"name":"setPalette","outputs":[],"stateMutability":"nonpayable","type":"function"}];

async function doIt() {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner()
  const cryptoPunksData = new ethers.Contract(CRYPTOPUNKSDATAADDRESS, CRYPTOPUNKSDATAABI, provider);

  console.log("const punkAttributes = [");
  for (let i = 0; i < 10000; i++) {
    const attributeString = await cryptoPunksData.punkAttributes(i);
    // console.log(JSON.stringify(attributeString));
    const attributes = attributeString.split(/[,]+/).map(function(s) { return s.trim().toLowerCase(); });
    const body = attributes[0].replace(/ .*$/, '');
    const remaining = attributes.slice(1);
    const row = [body, ...remaining];
    console.log("  " + JSON.stringify(row) + ",");
  }
  console.log("];");
}

doIt();
