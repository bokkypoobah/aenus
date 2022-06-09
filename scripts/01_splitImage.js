// npm install sharp

const sharp = require("sharp");
// Downloaded from https://raw.githubusercontent.com/larvalabs/cryptopunks/master/punks.png
const punkspng = "punks.png";
const OUTPUTDIR = "../docs/images/punks/";
var fs = require('fs');
const util = require('util');

async function doit() {
  console.log("Output to: " + OUTPUTDIR);
  const image = sharp(punkspng);

  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      const punkId = y * 100 + x;
      console.log("Processing: " + punkId);
      image
        .extract({ left: x * 24, top: y * 24, width: 24, height: 24 })
        .toFile(OUTPUTDIR + "punk" + punkId.toString().padStart(4, '0') + ".png", function(err) {
        });
    }
  }
}
doit();

console.log(process.cwd());
