function parseTx(tx, txReceipt, block) {
  console.log("tx.to: " + tx.to);
  if (tx.to == '0xc3f733ca98E0daD0386979Eb96fb1722A1A05E69') {
    console.log("MoonCats");
    console.log("tx: " + JSON.stringify(tx, 2, null));
    console.log("txReceipt.logs: " + JSON.stringify(txReceipt.logs, 2, null));

    // Deacclimate 0xde0e9a3e0000000000000000000000000000000000000000000000000000000000006154
    if (tx.data.substring(0, 10) == '0xde0e9a3e') {
      const event = txReceipt.logs.filter((e) => e.topics[0] == '0x4b4049773a7d189d0bf28d9bb55a7af4d94a6c02c074922614bfae9dae388886');
      console.log("Deacclimate: " + JSON.stringify(event));
      const tokenId = event && event.length > 0 && new BigNumber(event[0].data.substring(2), 16).toFixed(0) || null;
      console.log("tokenId: " + tokenId);
    }


  }
  return { hello: "Hello" };
}
