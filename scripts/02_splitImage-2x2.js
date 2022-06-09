// npm install sharp

const sharp = require("sharp");
// Downloaded from https://raw.githubusercontent.com/larvalabs/cryptopunks/master/punks.png
const punkspng = "punks.png";
const OUTPUTDIR = "./";

async function doit() {
  console.log("Output to: " + OUTPUTDIR);
  const image = sharp(punkspng);

  for (let y = 0; y < (100 / 50); y++) {
    for (let x = 0; x < (100 / 50); x++) {
      const punkId = y * (100 / 50) + x;
      console.log("Processing: " + punkId);
      image
        .extract({ left: x * 24 * 50, top: y * 24 * 50, width: 24 * 50, height: 24 * 50 })
        .toFile(OUTPUTDIR + "punk" + punkId.toString().padStart(1, '0') + ".png", function(err) {
        });
    }
  }
}
doit();

console.log(process.cwd());
