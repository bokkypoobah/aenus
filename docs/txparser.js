function parseTx(tx, txReceipt, block) {
  console.log("tx.to: " + tx.to);
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
      if (from == ADDRESS0) {
        mintEvents.push({ from: null, to, tokenId });
      } else if (to == ADDRESS0) {
        burnEvents.push({ from, to: null, tokenId });
      } else {
        transferEvents.push({ from, to, tokenId });
      }
    }
  }
  const mintTokenIds = mintEvents.map((e) => parseInt(e.tokenId));
  const burnTokenIds = burnEvents.map((e) => parseInt(e.tokenId));
  const transferTokenIds = transferEvents.map((e) => parseInt(e.tokenId));

  if (tx.to == '0xc3f733ca98E0daD0386979Eb96fb1722A1A05E69') {
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
