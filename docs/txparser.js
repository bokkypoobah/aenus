

function parseTx(tx, txReceipt, block) {
  // console.log("tx.to: " + tx.to);
  let description = null;
  const mintEvents = [];
  const burnEvents = [];
  const transferEvents = [];

  for (const event of txReceipt.logs) {
    if (event.topics[0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
      const from = '0x' + event.topics[1].substring(26, 66);
      const to = '0x' + event.topics[2].substring(26, 66);
      let tokenId;
      if (event.topics.length > 3) {
        tokenId = new BigNumber(event.topics[3].substring(2), 16).toFixed(0);
      } else {
        tokenId = event.data != null ? new BigNumber(event.data.substring(2), 16).toFixed(0) : null;
      }
      const address = event.address;
      if (from == ADDRESS0) {
        mintEvents.push({ address, from: null, to, tokenId });
      } else if (to == ADDRESS0) {
        burnEvents.push({ address, from, to: null, tokenId });
      } else {
        transferEvents.push({ address, from, to, tokenId });
      }
    }
  }
  // console.log("mintEvents: " + JSON.stringify(mintEvents));
  // console.log("burnEvents: " + JSON.stringify(burnEvents));
  // console.log("transferEvents: " + JSON.stringify(transferEvents));
  const mintTokenIds = mintEvents.map((e) => parseInt(e.tokenId));
  const burnTokenIds = burnEvents.map((e) => parseInt(e.tokenId));
  const transferTokenIds = transferEvents.map((e) => parseInt(e.tokenId));

  // ETHRegistrarController
  if (tx.to == _ENSREGISTRARCONTROLLERADDRESS) {
    const iface = new ethers.utils.Interface(_ENSREGISTRARCONTROLLERABI);
    // console.log("tx.data: " + JSON.stringify(tx.data));
    let decodedData = iface.parseTransaction({ data: tx.data, value: tx.value });
    console.log("decodedData: " + JSON.stringify(decodedData, null, 2));

    if (decodedData.functionFragment.name == "registerWithConfig") {
      const name = decodedData.args[0];
      description = "Registered ENS '" + name + "'";
    } else {
      description = "?Registered ENS: " + (mintTokenIds.length > 0 && mintTokenIds[0] || '?Huh?');
    }

  // OfficialMoonCatWrapper
  } else if (tx.to == '0xc3f733ca98E0daD0386979Eb96fb1722A1A05E69') {
    // unwrap(uint256 _tokenId)
    if (tx.data.substring(0, 10) == '0xde0e9a3e') {
      description = "Unwrapped OfficialMoonCatWrapper: " + (burnTokenIds.length > 0 && burnTokenIds[0] || '?Huh?');
    // batchWrap(uint256[] _rescueOrders)
    } else if (tx.data.substring(0, 10) == '0x440230d4') {
        description = "Wrap OfficialMoonCatWrapper " + JSON.stringify(mintTokenIds);
    // batchReWrap(uint256[] _rescueOrders, uint256[] _oldTokenIds)
    } else if (tx.data.substring(0, 10) == '0x697b91e0') {
      description = "Unwrapped UnofficialMoonCatWrapper " + JSON.stringify(burnTokenIds) + " to Wrap OfficialMoonCatWrapper " + JSON.stringify(mintTokenIds);
    }
  }
  if (description == null) {
    description = "Burnt: " + JSON.stringify(burnTokenIds) + "; Minted: " + JSON.stringify(mintTokenIds) + "; Transferred: " + JSON.stringify(transferTokenIds);
  }
  return { description, mintEvents, burnEvents, transferEvents };
}


const _ENSREGISTRARCONTROLLERADDRESS = "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5";
const _ENSREGISTRARCONTROLLERABI = [{"inputs":[{"internalType":"contract BaseRegistrar","name":"_base","type":"address"},{"internalType":"contract PriceOracle","name":"_prices","type":"address"},{"internalType":"uint256","name":"_minCommitmentAge","type":"uint256"},{"internalType":"uint256","name":"_maxCommitmentAge","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":true,"internalType":"bytes32","name":"label","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"cost","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expires","type":"uint256"}],"name":"NameRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":true,"internalType":"bytes32","name":"label","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"cost","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expires","type":"uint256"}],"name":"NameRenewed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oracle","type":"address"}],"name":"NewPriceOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"MIN_REGISTRATION_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"available","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"commitment","type":"bytes32"}],"name":"commit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"commitments","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"secret","type":"bytes32"}],"name":"makeCommitment","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"secret","type":"bytes32"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"address","name":"addr","type":"address"}],"name":"makeCommitmentWithConfig","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"maxCommitmentAge","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minCommitmentAge","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"bytes32","name":"secret","type":"bytes32"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"bytes32","name":"secret","type":"bytes32"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"address","name":"addr","type":"address"}],"name":"registerWithConfig","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"duration","type":"uint256"}],"name":"renew","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"duration","type":"uint256"}],"name":"rentPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_minCommitmentAge","type":"uint256"},{"internalType":"uint256","name":"_maxCommitmentAge","type":"uint256"}],"name":"setCommitmentAges","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract PriceOracle","name":"_prices","type":"address"}],"name":"setPriceOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"valid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
